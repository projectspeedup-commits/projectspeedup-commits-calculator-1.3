import * as XLSX from "xlsx-js-style";
import { HEX_DATA, ROUND_DATA, getGostForGrade } from "../lib/constants";
import { CalculationResult } from "../types";
import { useAdminStore } from "../store/useAdminStore";

export const useExcelProcessors = () => {
  const store = useAdminStore();
  const {
    rawPrices,
    setIsProcessing,
    setParsingProgress,
    setUploadWarnings,
    setCalcResultsProd,
    setCalcResultsSup,
    setIsProcessingSupplyPlans,
    setProcessedSupplyPlansProd,
    setProcessedSupplyPlansSup,
    setIsProcessingStock,
    setProcessedStockProd,
    setProcessedStockSup,
  } = store;

  const formatDate = (input: any) => {
    if (!input) return "";
    if (typeof input === "number") {
      const date = new Date(Math.round((input - 25569) * 86400 * 1000));
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    }
    return String(input).trim();
  };

  const handleProcessPlans = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;

    setIsProcessing(true);
    setUploadWarnings([]);

    // Give browser time to render loading state
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const allExtractedData: Omit<
        CalculationResult,
        | "billetDia"
        | "billetLength"
        | "drawRatio"
        | "drawLength"
        | "usefulLength"
        | "techEnds"
        | "wastePercent"
        | "totalWeight"
        | "billetCount"
        | "pcsPerBillet"
        | "targetLength"
        | "quantity"
        | "price"
        | "totalCost"
      >[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let colMap = {
            client: 1, // B
            nomenclature: 2, // C
            orderNo: 3, // D
            type: 5, // F
            grade: 6, // G
            size: 7, // H
            weight: 8, // I
            remaining: -1,
            shippingDate: -1,
            internalNo: -1,
            lengthIdx: -1,
          };

          // Dynamically find header row and map columns
          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const row = jsonData[i] || [];
            const rowStr = row.join(" ").toLowerCase();

            if (
              rowStr.includes("заказ") ||
              rowStr.includes("клиент") ||
              rowStr.includes("профиль") ||
              rowStr.includes("марка") ||
              rowStr.includes("размер") ||
              rowStr.includes("кол-во") ||
              rowStr.includes("вес") ||
              rowStr.includes("номенклатура")
            ) {
              startRow = i + 1;

              row.forEach((cell: any, colIdx: number) => {
                const cellStr = String(cell).toLowerCase().trim();

                // Specific mappings requested by user
                if (
                  cellStr === "внутренний номер" ||
                  cellStr === "внутренняя нумерация" ||
                  cellStr === "внутренний №" ||
                  cellStr.includes("внутр. №")
                )
                  colMap.internalNo = colIdx;
                if (
                  cellStr === "дата отгрузки" ||
                  cellStr === "дата заказа" ||
                  cellStr === "дата"
                )
                  colMap.shippingDate = colIdx;
                if (cellStr === "клиент") colMap.client = colIdx;
                if (cellStr === "номенклатура") colMap.nomenclature = colIdx;
                if (cellStr === "№ заказа") colMap.orderNo = colIdx;
                if (
                  cellStr === "кол-во" ||
                  cellStr === "кол-во тн" ||
                  cellStr === "кол-во тн в заказе" ||
                  cellStr === "кол-во ="
                )
                  colMap.weight = colIdx;
                if (
                  cellStr === "итого остаток к выполнению" ||
                  cellStr ===
                    "итого остаток выполнения заказа после расчета / плановое поступление" ||
                  cellStr.includes("итого остаток к выполнению") ||
                  cellStr.includes("итого остаток выполнению") ||
                  cellStr.includes("итог остаток к выполнению") ||
                  cellStr.includes("итого ост. к выполнению") ||
                  cellStr.includes("остаток к выполнению") ||
                  cellStr.includes("остаток") ||
                  cellStr.includes("после расчета / плановое поступление")
                )
                  colMap.remaining = colIdx;

                // Fallbacks and other fields
                if (
                  colMap.internalNo === -1 &&
                  cellStr.includes("внутр") &&
                  (cellStr.includes("номер") || cellStr.includes("№"))
                )
                  colMap.internalNo = colIdx;
                if (
                  colMap.client === -1 &&
                  (cellStr.includes("клиент") ||
                    cellStr.includes("покупатель") ||
                    cellStr.includes("партнер"))
                )
                  colMap.client = colIdx;
                if (
                  colMap.nomenclature === -1 &&
                  (cellStr.includes("номенклатура") ||
                    cellStr.includes("наименование") ||
                    cellStr.includes("товар"))
                )
                  colMap.nomenclature = colIdx;
                if (colMap.orderNo === -1 && cellStr.includes("заказ"))
                  colMap.orderNo = colIdx;
                if (cellStr.includes("профиль") || cellStr.includes("тип"))
                  colMap.type = colIdx;
                if (
                  cellStr.includes("марка") ||
                  cellStr.includes("сталь") ||
                  cellStr.includes("материал")
                )
                  colMap.grade = colIdx;
                if (cellStr.includes("размер") || cellStr.includes("диаметр"))
                  colMap.size = colIdx;
                if (
                  colMap.weight === -1 &&
                  (cellStr.includes("кол-во") ||
                    cellStr.includes("количество") ||
                    cellStr.includes("вес") ||
                    cellStr.includes("масса") ||
                    cellStr.includes("кг") ||
                    cellStr.includes("тн"))
                )
                  colMap.weight = colIdx;
                if (
                  colMap.shippingDate === -1 &&
                  (cellStr.includes("отгруз") || cellStr.includes("дата"))
                )
                  colMap.shippingDate = colIdx;
                if (cellStr.includes("длина")) colMap.lengthIdx = colIdx;
              });
              break;
            }
          }

          // Smart Mapping Validation
          const missingColumns = [];
          if (colMap.client === -1) missingColumns.push("Клиент");
          if (colMap.nomenclature === -1) missingColumns.push("Номенклатура");
          if (colMap.orderNo === -1) missingColumns.push("№ Заказа");
          if (colMap.weight === -1) missingColumns.push("Кол-во (вес)");
          if (colMap.remaining === -1)
            missingColumns.push("Остаток к выполнению");

          if (missingColumns.length > 0) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}": не найдены колонки: ${missingColumns.join(", ")}`,
            ]);
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл планов: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];

            // Stop parsing if we reach the "Total" (ИТОГО) row
            const rowStrForTotal = row.join(" ").toLowerCase();
            if (rowStrForTotal.includes("итого")) {
              break;
            }

            if (
              row.length === 0 ||
              row.every((c: any) => !c || String(c).trim() === "")
            )
              continue;

            const orderNo = String(row[colMap.orderNo] || "").trim();
            const internalNo =
              colMap.internalNo !== -1
                ? String(row[colMap.internalNo] || "").trim()
                : "";
            const shippingDate = formatDate(
              colMap.shippingDate !== -1 ? row[colMap.shippingDate] : "",
            );

            const client = String(row[colMap.client] || "").trim();
            let nomenclature = String(row[colMap.nomenclature] || "");
            nomenclature = nomenclature
              .replace(/Прокат калиброванный/i, "")
              .trim();

            const rawWeight = row[colMap.weight];
            let weightTons =
              typeof rawWeight === "number"
                ? rawWeight
                : parseFloat(
                    String(rawWeight || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(weightTons) || weightTons < 0) {
              weightTons = 0;
              setUploadWarnings((prev) => [
                ...prev,
                `Строка ${i}: Некорректный вес (${rawWeight})`,
              ]);
            }

            const rawRemaining =
              colMap.remaining !== -1 ? row[colMap.remaining] : null;
            let remainingToProcess =
              rawRemaining !== null
                ? typeof rawRemaining === "number"
                  ? rawRemaining
                  : parseFloat(
                      String(rawRemaining || "0")
                        .replace(/\s/g, "")
                        .replace(",", "."),
                    )
                : weightTons;
            if (isNaN(remainingToProcess) || remainingToProcess < 0) {
              remainingToProcess = weightTons;
              if (rawRemaining !== null) {
                setUploadWarnings((prev) => [
                  ...prev,
                  `Строка ${i}: Некорректный остаток к выполнению (${rawRemaining})`,
                ]);
              }
            }

            let typeStr = String(
              row[colMap.type] || nomenclature,
            ).toLowerCase();
            let type =
              typeStr.includes("шестигранник") || typeStr.includes("шестиг")
                ? "Шестигранник"
                : "Круг";
            let gradeStr = String(row[colMap.grade] || "").trim();
            let grade = gradeStr || "ст.35";

            // Fix for incorrect grade extraction
            if (
              grade.toUpperCase().includes("1050") ||
              grade.toUpperCase().includes("1414") ||
              grade.toUpperCase().includes("4543") ||
              grade.toUpperCase().includes("ГОСТ") ||
              gradeStr === ""
            ) {
              const gMatch = nomenclature.match(
                /(?:^|[^а-яА-ЯёЁa-zA-Z])(?:ст\.?|сталь)\s*([0-9a-zA-Zа-яА-Я-]+)/i,
              );
              if (gMatch) {
                grade = "ст." + gMatch[1].toUpperCase();
              } else {
                const alloyMatch = nomenclature.match(
                  /\b(\d{2}[ХхНнМмТтВвГгДд]+[0-9a-zA-Zа-яА-Я-]*)\b/,
                );
                if (alloyMatch) {
                  grade = "ст." + alloyMatch[1].toUpperCase();
                } else {
                  if (grade.includes("1050")) grade = "ст.35";
                  else if (grade.includes("1414")) grade = "ст.А12";
                  else if (grade.includes("4543")) grade = "ст.40Х";
                  else grade = "ст.35";
                }
              }
            } else if (grade.toUpperCase().startsWith("СТ.")) {
              grade = "ст." + grade.substring(3).toUpperCase();
            } else if (grade.toUpperCase().startsWith("СТ")) {
              grade = "ст." + grade.substring(2).toUpperCase();
            } else if (
              grade.toUpperCase() !== "А12" &&
              !grade.toLowerCase().startsWith("ст")
            ) {
              grade = "ст." + grade.toUpperCase();
            } else if (grade.toUpperCase() === "А12") {
              grade = "ст.А12";
            }

            grade = grade.replace(/[хХxX]\s*\d{3,}$/i, "");

            const rawSize = row[colMap.size];
            let diameter =
              typeof rawSize === "number"
                ? rawSize
                : parseFloat(
                    String(rawSize || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(diameter) || diameter <= 0) {
              const sizeMatch = nomenclature.match(
                /(?:круг|шестигранник)\s*(?:калибровоченный|калибровочный|калиброванный|калибр\.?)?\s*(\d+(?:[.,]\d+)?)/i,
              );
              if (sizeMatch) {
                diameter = parseFloat(sizeMatch[1].replace(",", "."));
              } else {
                setUploadWarnings((prev) => [
                  ...prev,
                  `Строка ${i}: Не удалось определить диаметр (${rawSize})`,
                ]);
              }
            }
            if (isNaN(diameter) || diameter < 0) diameter = 0;

            const nomCleanForLen = nomenclature
              .toUpperCase()
              .replace(/\s/g, "");
            const isNomND =
              nomCleanForLen.includes("НД") ||
              nomCleanForLen.includes("Н.Д.") ||
              nomCleanForLen.includes("Н/Д");

            let length = 6000;
            let lengthType: "НД" | "МД" = "МД";

            if (isNomND) {
              lengthType = "НД";
              length = 6000;
            } else if (colMap.lengthIdx !== -1 && row[colMap.lengthIdx]) {
              const rawLength = String(row[colMap.lengthIdx])
                .trim()
                .toUpperCase();
              if (
                rawLength.includes("НД") ||
                rawLength.includes("Н/Д") ||
                rawLength.includes("Н.Д.")
              ) {
                lengthType = "НД";
              } else {
                const lengthMatch = rawLength.match(/\d+/);
                if (lengthMatch) {
                  const parsedLen = parseInt(lengthMatch[0], 10);
                  if (!isNaN(parsedLen) && parsedLen > 0) {
                    length = parsedLen;
                    lengthType = "МД";
                  }
                }
              }
            } else {
              const lengthMatch = nomenclature.match(/х\s*(\d+)/i);
              if (lengthMatch) {
                length = parseInt(lengthMatch[1]);
                if (isNaN(length) || length <= 0) length = 6000;
              }
            }

            allExtractedData.push({
              id: Math.random().toString(36).substring(7),
              client,
              nomenclature,
              type,
              grade,
              diameter,
              length,
              lengthType,
              weightTons,
              orderNo,
              shippingDate,
              internalNo,
              remainingToProcess,
            });
          }
        }
      }

      if (allExtractedData.length === 0) {
        alert("Не удалось распознать данные.");
        setIsProcessing(false);
        return;
      }

      const processed: CalculationResult[] = allExtractedData.map((item) => {
        const dataTable = item.type === "Шестигранник" ? HEX_DATA : ROUND_DATA;
        const match = dataTable.find(
          (d) => Math.abs(d.target - item.diameter) < 0.001,
        );

        let billetDia = item.diameter ? item.diameter + 2 : 0;
        let drawRatio = match
          ? match.coef
          : item.diameter > 0
            ? Math.pow(billetDia, 2) / Math.pow(item.diameter, 2)
            : 1;

        if (match) {
          billetDia = match.raw;
        } else if (item.diameter > 0) {
          billetDia = item.diameter + 2;
          drawRatio = Math.pow(billetDia, 2) / Math.pow(item.diameter, 2);
        } else {
          billetDia = 0;
          drawRatio = 1;
        }

        let billetLength = 0;
        const totalTechCoef =
          item.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003;

        if (item.lengthType === "НД") {
          billetLength = 6000;
        } else {
          billetLength = 6000;
        }

        const drawLength = billetLength * drawRatio;
        const usefulLength = drawLength / totalTechCoef;
        const techEnds = drawLength - usefulLength;

        let piecesCount = 0;
        let actualUsefulLength = 0;

        if (item.lengthType === "НД") {
          for (let i = 1; i <= 20; i++) {
            const optLen = Math.floor(usefulLength / i) - 5;
            if (optLen >= 3000 && optLen <= 6000) {
              piecesCount = i;
              actualUsefulLength = piecesCount * optLen;
              break;
            }
          }
          if (piecesCount === 0) actualUsefulLength = usefulLength;
        } else {
          piecesCount = Math.floor(usefulLength / item.length);
          actualUsefulLength = piecesCount * item.length;
        }

        // --- Optimization Step for KIM improvement ---
        let optimizedBilletLength = billetLength;
        let optimizedKim = drawLength > 0 ? actualUsefulLength / drawLength : 0;

        if (item.lengthType === "МД" && item.length > 0) {
          const MIN_B = 4000;
          const MAX_B = Math.floor(8400 / drawRatio);
          const STEP = 100;

          for (let l = MIN_B; l <= MAX_B; l += STEP) {
            const dL = l * drawRatio;
            const uL = dL / totalTechCoef;
            const pCount = Math.floor(uL / item.length);
            if (pCount <= 0) continue;
            const aUL = pCount * item.length;
            const k = dL > 0 ? aUL / dL : 0;

            if (k > optimizedKim + 0.005) {
              // Suggest only if improvement > 0.5%
              optimizedKim = k;
              optimizedBilletLength = l;
            }
          }
        } else if (item.lengthType === "НД") {
          const MIN_B = 4000;
          const MAX_B = 6000;
          const STEP = 100;

          for (let l = MIN_B; l <= MAX_B; l += STEP) {
            const dL = l * drawRatio;
            const uL = dL / totalTechCoef;
            let pCount = 0;
            let aUL = 0;
            for (let i = 1; i <= 20; i++) {
              const optLen = Math.floor(uL / i) - 5;
              if (optLen >= 3000 && optLen <= 6000) {
                pCount = i;
                aUL = pCount * optLen;
                break;
              }
            }
            if (pCount === 0) continue;
            const k = dL > 0 ? aUL / dL : 0;

            if (k > optimizedKim + 0.005) {
              // Suggest only if improvement > 0.5%
              optimizedKim = k;
              optimizedBilletLength = l;
            }
          }
        }
        // ----------------------------------------------

        const billetArea = (Math.PI * Math.pow(billetDia, 2)) / 4;
        const weightPerMBillet = billetArea * 0.00000785 * 1000;

        const kim = drawLength > 0 ? actualUsefulLength / drawLength : 0;
        const totalWeight =
          kim > 0 ? item.remainingToProcess / kim : item.remainingToProcess;

        const singleBilletMass = (billetLength / 1000) * weightPerMBillet;
        const billetCount =
          singleBilletMass > 0
            ? Math.ceil((totalWeight * 1000) / singleBilletMass)
            : 0;

        const gradePrices = rawPrices[item.grade] || { md: "0", nd: "0" };
        const basePrice = parseFloat(gradePrices.nd || "0");
        const price = item.lengthType === "МД" ? basePrice * 1.06 : basePrice;
        const totalCost = totalWeight * price;
        const initialLeftovers =
          item.lengthType === "НД"
            ? 0
            : usefulLength - (piecesCount || 0) * item.length;
        const initialScrapTons =
          drawLength > 0 ? (initialLeftovers / drawLength) * totalWeight : 0;
          
        let gostStr = "ГОСТ 2590-2006";
        const pType = String(item.type).toLowerCase();
        let profilePrefix = "Круг";
        if (pType.includes("шестигранник")) { gostStr = "ГОСТ 2879-2006"; profilePrefix = "Шестигранник"; }
        else if (pType.includes("квадрат")) { gostStr = "ГОСТ 2591-2006"; profilePrefix = "Квадрат"; }
        
        const supplyNomenclature = `${profilePrefix} ${getGostForGrade(item.grade)}/${gostStr}`;
        const supplyGrade = item.grade;
        const supplyDiameter = parseFloat(billetDia.toFixed(2));

        return {
          ...item,
          billetDia,
          billetLength,
          drawRatio,
          drawLength,
          usefulLength,
          techEnds,
          wastePercent: (1 - kim) * 100,
          totalWeight,
          billetCount,
          pcsPerBillet: piecesCount || 0,
          targetLength: item.length,
          quantity: billetCount,
          price,
          totalCost,
          optimizedBilletLength,
          optimizedKim,
          initialScrapTons,
          supplyNomenclature,
          supplyGrade,
          supplyDiameter
        } as CalculationResult;
      });

      if (type === "production") setCalcResultsProd(processed);
      else setCalcResultsSup(processed);
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      setIsProcessing(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  const handleProcessSupplyPlans = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;
    setIsProcessingSupplyPlans(true);

    // Give browser time to render loading state
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const extractedPlans: any[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let cols: Record<string, number> = {};

          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const rowStr = jsonData[i].join(" ").toLowerCase();
            if (
              rowStr.includes("профиль") ||
              rowStr.includes("марка") ||
              rowStr.includes("размер") ||
              rowStr.includes("поставщик")
            ) {
              startRow = i + 1;
              jsonData[i].forEach((cell: any, idx: number) => {
                const c = String(cell).toLowerCase().trim();
                if (c.includes("профиль")) cols.profile = idx;
                if (c.includes("марка")) cols.grade = idx;
                if (c.includes("размер")) cols.size = idx;
                if (
                  c.includes("кол-во") ||
                  c.includes("количество") ||
                  c.includes("колличество") ||
                  c.includes("вес")
                )
                  cols.qty = idx;
                if (c.includes("длина")) cols.length = idx;
                if (c.includes("дата разм")) cols.datePlaced = idx;
                if (c.includes("ожид") && c.includes("дата"))
                  cols.dateExpected = idx;
                if (c.includes("поставщик")) cols.supplier = idx;
              });
              break;
            }
          }

          if (
            cols.profile === undefined ||
            cols.grade === undefined ||
            cols.size === undefined ||
            cols.qty === undefined ||
            cols.length === undefined ||
            cols.datePlaced === undefined ||
            cols.dateExpected === undefined ||
            cols.supplier === undefined
          ) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}" (Поставки): не найдены или не распознаны все обязательные колонки (Профиль, Марка, Размер, Кол-во, Длина, Дата размещения, Ожидаемая дата поставки, Поставщик)!`,
            ]);
            continue;
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл поставок: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];

            // Stop parsing if we reach the "Total" (ИТОГО) row
            const rowStrForTotal = row.join(" ").toLowerCase();
            if (rowStrForTotal.includes("итого")) {
              break;
            }

            if (!row[cols.profile] && !row[cols.grade]) continue;

            const rawQty = row[cols.qty];
            let qty =
              typeof rawQty === "number"
                ? rawQty
                : parseFloat(
                    String(rawQty || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(qty) || qty <= 0) {
              setUploadWarnings((prev) => [
                ...prev,
                `Строка ${i}: Некорректное количество (${rawQty})`,
              ]);
              continue;
            }

            const excelDateToJS = (serial: number | string | undefined) => {
              if (!serial) return "";
              if (typeof serial === "number") {
                const date = new Date((serial - 25569) * 86400 * 1000);
                return date.toLocaleDateString("ru-RU");
              }
              return String(serial).trim();
            };

            extractedPlans.push({
              Профиль: String(row[cols.profile] || "").trim(),
              Марка: String(row[cols.grade] || "").trim(),
              Размер: String(row[cols.size] || "").trim(),
              "Кол-во": qty,
              Длина: String(row[cols.length] || "").trim(),
              "Дата размещения": excelDateToJS(row[cols.datePlaced]),
              "Ожидаемая дата поставки": excelDateToJS(row[cols.dateExpected]),
              Поставщик: String(row[cols.supplier] || "").trim(),
            });
          }
        }
      }

      if (type === "production") setProcessedSupplyPlansProd(extractedPlans);
      else setProcessedSupplyPlansSup(extractedPlans);
    } catch (err) {
      console.error("Error processing supply plans files:", err);
    } finally {
      setIsProcessingSupplyPlans(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  const handleProcessStock = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;
    setIsProcessingStock(true);

    // Give browser time to render loading state
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const extractedStock: any[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let nomCol = -1;
          let weightCol = -1;

          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const rowStr = jsonData[i].join(" ").toLowerCase();
            if (rowStr.includes("номенклатура") || rowStr.includes("остаток")) {
              startRow = i + 1;
              jsonData[i].forEach((cell: any, idx: number) => {
                const c = String(cell).toLowerCase().trim();
                if (c.includes("номенклатура") || c.includes("наименование"))
                  nomCol = idx;
                if (
                  c.includes("конечный остаток") ||
                  c.includes("остаток") ||
                  c.includes("кол-во")
                )
                  weightCol = idx;
              });
              break;
            }
          }

          if (nomCol === -1 || weightCol === -1) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}" (Склад): не найдены ${nomCol === -1 ? "Номенклатура " : ""}${weightCol === -1 ? "Конечный остаток" : ""}`,
            ]);
            continue;
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл склада: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];

            // Stop parsing if we reach the "Total" (ИТОГО) row
            const rowStrForTotal = row.join(" ").toLowerCase();
            if (rowStrForTotal.includes("итого")) {
              break;
            }

            if (!row[nomCol]) continue;

            const rawNom = String(row[nomCol]).trim();
            const rawWeight = row[weightCol];
            let weight =
              typeof rawWeight === "number"
                ? rawWeight
                : parseFloat(
                    String(rawWeight || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(weight) || weight <= 0.0001) {
              if (rawWeight !== undefined && rawWeight !== "") {
                setUploadWarnings((prev) => [
                  ...prev,
                  `Строка ${i}: Некорректный остаток (${rawWeight})`,
                ]);
              }
              continue;
            }

            let profile = "круг";
            if (rawNom.toLowerCase().includes("шестиг"))
              profile = "шестигранник";

            let grade = "ст.35";
            const gMatch = rawNom.match(
              /(?:^|[^а-яА-ЯёЁa-zA-Z])(?:ст\.?|сталь)\s*([0-9a-zA-Zа-яА-Я-]+)/i,
            );
            if (gMatch) {
              grade = "ст." + gMatch[1].toUpperCase();
            } else {
              const alloyMatch = rawNom.match(
                /\b(\d{2}[ХхНнМмТтВвГгДд]+[0-9a-zA-Zа-яА-Я-]*)\b/,
              );
              if (alloyMatch) grade = "ст." + alloyMatch[1].toUpperCase();
            }
            grade = grade.replace(/[хХxX]\s*\d{3,}$/i, "");

            let diameter = "";
            const sizeMatch = rawNom.match(
              /(?:круг|шестигранник)\s*(?:калибровоченный|калибровочный|калиброванный|калибр\.?)?\s*(\d+(?:[.,]\d+)?)/i,
            );
            if (sizeMatch) {
              diameter = sizeMatch[1];
            } else {
              const sizeFallback = rawNom.match(
                /\s+(\d+(?:[.,]\d+)?)\s*(?:мм)?\s*/i,
              );
              if (
                sizeFallback &&
                !sizeFallback[1].includes("1050") &&
                !sizeFallback[1].includes("7417") &&
                !sizeFallback[1].includes("2590")
              ) {
                diameter = sizeFallback[1];
              }
            }

            const nomUpper = rawNom.toUpperCase();
            const nomClean = nomUpper.replace(/\s/g, "");

            let lengthType = "НД";

            // Парсинг М/Д, МД, Н/Д
            const mdMatch = nomClean.match(/(?:М\/Д|МД)(\d+)?/);
            const ndSlashMatch = nomClean.match(/Н\/Д(\d+)?/);
            const ndMatch = nomClean.includes("НД");

            if (mdMatch) {
              const val =
                mdMatch[1] === "6000" || !mdMatch[1] ? "6000" : mdMatch[1];
              lengthType = "МД " + val;
            }

            extractedStock.push({
              "Исходная Номенклатура": rawNom,
              Профиль: profile,
              НТД: getGostForGrade(grade) + " / ГОСТ 2590-2006",
              "Марка стали": grade,
              Размер: diameter,
              Длина: lengthType,
              "Конечный остаток тн.": weight,
            });
          }
        }
      }

      if (extractedStock.length === 0) {
        alert("Не удалось извлечь остатки из загруженных файлов.");
        return;
      }

      if (type === "production") setProcessedStockProd(extractedStock);
      else setProcessedStockSup(extractedStock);
    } catch (err) {
      console.error("Error processing stock files:", err);
    } finally {
      setIsProcessingStock(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  return { handleProcessPlans, handleProcessSupplyPlans, handleProcessStock };
};
