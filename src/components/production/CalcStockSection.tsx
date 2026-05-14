import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { StatusDropdown } from '../StatusDropdown';
import { getTimestampedFilename } from '../../lib/utils';
import { getGostForGrade } from '../../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download } = LucideIcons;

export function CalcStockSection({
  matchedDemand,
  activeTab,
  setSupplySection,
  setProductionSection,
  setActiveTab,
  filteredTotals,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  filteredMatchedDemand,
  handleMouseLeaveOrUp,
  handleMouseMove,
  isSupplyDragging,
  supplyTableRef,
  onSupplyMouseDown,
  isCopied,
  setIsCopied,
}: any) {
  return (
    <motion.div
      key="supply-calc-stock"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-8`}
    >
      {matchedDemand.length === 0 ? (
        <div className="bg-white/50 dark:bg-[#1A1C19]/40 border border-slate-200 dark:border-slate-800 rounded-[40px] p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
          <div className="flex items-center gap-4 sm:gap-8 mb-8 relative">
            <div className="relative">
              <div className="w-20 h-20  dark: rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 z-10 relative">
                <ClipboardList className="w-10 h-10 text-slate-800 dark:text-slate-200" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">
                Заказы
              </span>
            </div>

            <div className="flex items-center w-24 sm:w-32">
              <div
                className="w-full h-[2px] bg-gradient-to-r from-blue-300 via-slate-300 to-emerald-300 dark:from-blue-600 dark:via-slate-600 dark:to-emerald-600 border border-dashed border-transparent [background-clip:padding-box]"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent 50%, rgba(148, 163, 184, 0.5) 50%)",
                  backgroundSize: "16px 2px",
                }}
              ></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-lg transform -translate-y-6">
              <HelpCircle className="w-6 h-6 text-slate-400" />
            </div>

            <div className="relative">
              <div className="w-20 h-20  dark: rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 z-10 relative">
                <Package className="w-10 h-10 text-slate-800 dark:text-slate-200" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">
                Склад
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
            Сравнивать пока нечего
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 leading-relaxed mb-8">
            Чтобы найти дефицит металла, нам нужно вычесть
            складские остатки из вашей потребности. Нужно
            загрузить сразу два файла!
          </p>

          <button
            onClick={() => {
              if (activeTab === "supply") {
                setSupplySection("files");
              } else if (activeTab === "production") {
                setProductionSection("files");
              } else {
                setActiveTab("production");
                setProductionSection("files");
              }
            }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Загрузить файлы для сравнения
          </button>
        </div>
      ) : (
        <>
          <div
            className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none relative z-30`}
          >
            <div
              className={`flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 bg-white dark:bg-[#1A1C19] relative z-40`}
            >
              <div
                className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 2xl:border-r border-slate-200 dark:border-slate-800 2xl:pr-6 w-full 2xl:w-auto`}
              >
                <h4
                  className={`text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-widest leading-tight`}
                >
                  РАСЧЕТ С УЧЕТОМ НАЛИЧИЯ
                </h4>
                <div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">
                  <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black  border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200 opacity-60 tracking-widest">
                      взято со склада
                    </span>
                    <div>
                      <span className="text-base tracking-tight leading-none text-slate-800 dark:text-slate-200">
                        {filteredTotals.allocated.toFixed(3)}
                      </span>
                      <span className="text-[8px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200">
                        тн
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black  border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200 opacity-60 tracking-widest">
                      дефицит
                    </span>
                    <div>
                      <span className="text-base tracking-tight leading-none text-slate-800 dark:text-slate-200">
                        {filteredTotals.deficit.toFixed(3)}
                      </span>
                      <span className="text-[8px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200">
                        тн
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full 2xl:w-auto flex-wrap`}
              >
                <div className="flex items-center gap-2 group">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-focus-within:text-slate-800 dark:text-slate-200 transition-colors shrink-0" />
                    <input
                      type="text"
                      placeholder="Поиск по заказу..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 h-10 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-slate-200 dark:border-slate-800 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="flex items-center h-10 px-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto transition-all focus-within:border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 mr-2 shrink-0" />
                  <StatusDropdown
                    value={statusFilter}
                    onChange={(val: any) => setStatusFilter(val)}
                    className="w-28"
                  />
                </div>
                <div className="flex flex-row items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      if (filteredMatchedDemand.length === 0) return;
                      const headers = [
                        "Номенклатура",
                        "Профиль",
                        "Марка",
                        "Размер",
                        "Длина",
                        "Кол-во тн в заказе",
                        "ИТОГО ост. к выполнению",
                        "Номенклатура заг.",
                        "Марка заг.",
                        "Размер заг.",
                        "Кол-во тн заг.",
                        "Длина",
                        "Взято со склада (тн)",
                        "ИТОГО ост. к завершению",
                        "Тех. отходы склад г/к",
                        "Дел. Остатки склад г/к",
                        "КИМ склад г/к",
                        "ИсходНоменклатура",
                        "Профиль наличия",
                        "НТД",
                        "Марка стали наличия",
                        "Размер наличия",
                        "Длина (склад г/к)",
                        "Остаток на складе г/к. (тн)",
                        "Взято со склада г/к (тн)",
                        "Свободный остаток г/к склад (тн)",
                      ];
                      const rows: string[][] = [];
                      matchedDemand.forEach((res: any) => {
                        const baseRow = [
                          res.nomenclature || "",
                          res.type || "",
                          res.grade || "",
                          String(res.diameter).replace(".", ","),
                          res.lengthType === "НД" ? "НД" : `МД ${res.length}`,
                          String(res.weightTons || 0).replace(".", ","),
                          String(res.remainingToProcess || 0).replace(".", ","),
                          res.supplyNomenclature || "",
                          res.supplyGrade || "",
                          String(res.supplyDiameter || "").replace(".", ","),
                          String(res.totalWeight || 0).replace(".", ","),
                          res.lengthType === "МД" ? `МД ${res.billetLength}` : "НД",
                          String(res.allocatedStock || 0).replace(".", ","),
                          String(res.shortageStock || 0).replace(".", ","),
                        ];
                        const maxRows = Math.max(1, res.matchedStockItems?.length || 0);
                        const rowTemplate = Array(headers.length).fill("");
                        for (let i = 0; i < 14; i++) rowTemplate[i] = baseRow[i];

                        for (let r = 0; r < maxRows; r++) {
                          const outRow = [...rowTemplate];
                          if (r > 0) {
                            for (let c = 0; c < 14; c++) outRow[c] = "";
                          }

                          const st = res.matchedStockItems?.[r];
                          if (st) {
                            outRow[14] = st.calculatedTechWaste > 0 ? String(st.calculatedTechWaste.toFixed(3)).replace(".", ",") : "0";
                            outRow[15] = st.calculatedUsefulRem > 0 ? String(st.calculatedUsefulRem.toFixed(3)).replace(".", ",") : "0";
                            outRow[16] = st.calculatedKim > 0 ? String(st.calculatedKim.toFixed(3)).replace(".", ",") : "0";
                            outRow[17] = st["Исходная Номенклатура"] || "";
                            outRow[18] = st["Профиль"] || "";
                            outRow[19] = st["НТД"] || "";
                            outRow[20] = st["Марка стали"] || "";
                            outRow[21] = String(st["Размер"] || "").replace(".", ",");
                            outRow[22] = st["Длина"] || "";
                            outRow[23] = String(st.stockBeforeTaking || 0).replace(".", ",");
                            outRow[24] = String(st.allocatedAmount || 0).replace(".", ",");
                            outRow[25] = String(st.stockAfterTaking || 0).replace(".", ",");
                          }
                          rows.push(outRow);
                        }
                      });

                      const tsv = [headers, ...rows].map((row) => row.join("\t")).join("\n");

                      let rowsHtml =
                        '<table border="1"><thead><tr>' +
                        headers
                          .map((h) => '<th style="text-align:center;font-weight:bold;">' + h + "</th>")
                          .join("") +
                        "</tr></thead><tbody>";

                      matchedDemand.forEach((res: any) => {
                        const baseRow = [
                          res.internalNo || "",
                          res.shippingDate || "",
                          res.orderNo || "",
                          res.client || "",
                          res.nomenclature || "",
                          res.type || "",
                          res.grade || "",
                          String(res.diameter).replace(".", ","),
                          res.lengthType === "НД" ? "НД" : "МД " + res.length,
                          String(res.weightTons || 0).replace(".", ","),
                          String(res.remainingToProcess || 0).replace(".", ","),
                          String(res.allocatedStock || 0).replace(".", ","),
                          String(res.shortageStock || 0).replace(".", ","),
                          String(res.allocatedStock > 0 && res.combinedTechWaste > 0 ? (res.combinedTechWaste || 0).toFixed(3) : "0").replace(".", ","),
                          String(res.allocatedStock > 0 && res.combinedUsefulRem > 0 ? (res.combinedUsefulRem || 0).toFixed(3) : "0").replace(".", ","),
                          String(res.allocatedStock > 0 && res.combinedKim > 0 ? (res.combinedKim || 0).toFixed(3) : "0").replace(".", ","),
                        ];
                        const numRows = Math.max(1, res.matchedStockItems?.length || 0);
                        if (res.matchedStockItems?.length === 0) {
                          rowsHtml += "<tr>" +
                            baseRow
                              .map((v) => '<td style="text-align:center;vertical-align:middle;">' + v + "</td>")
                              .join("") +
                            '<td style="text-align:center;vertical-align:middle;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                        } else {
                          res.matchedStockItems?.forEach((stock: any, index: number) => {
                            const stockRow = [
                              stock["Исходная Номенклатура"] || "",
                              stock["Профиль"] || "",
                              stock["НТД"] || "",
                              stock["Марка стали"] || "",
                              String(stock["Размер"] || "").replace(".", ","),
                              stock["Длина"] || "",
                              String(stock.stockBeforeTaking || 0).replace(".", ","),
                              String(stock.allocatedAmount || 0).replace(".", ","),
                              String(stock.stockAfterTaking || 0).replace(".", ","),
                            ];
                            rowsHtml += "<tr>";
                            if (index === 0) {
                              baseRow.forEach((v) => {
                                rowsHtml +=
                                  '<td rowspan="' + numRows + '" style="text-align:center;vertical-align:middle;">' + v + "</td>";
                              });
                            }
                            stockRow.forEach((v) => {
                              rowsHtml += '<td style="text-align:center;vertical-align:middle;">' + v + "</td>";
                            });
                            rowsHtml += "</tr>";
                          });
                        }
                      });
                      rowsHtml += "</tbody></table>";

                      try {
                        const blobText = new Blob([tsv], { type: "text/plain" });
                        const blobHtml = new Blob([rowsHtml], { type: "text/html" });
                        const item = new ClipboardItem({
                          "text/html": blobHtml,
                          "text/plain": blobText,
                        });
                        navigator.clipboard.write([item]).catch(() => navigator.clipboard.writeText(tsv));
                      } catch (e) {
                        navigator.clipboard.writeText(tsv);
                      }
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className={`flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl transition-all active:scale-[0.9] shadow-sm border ${
                      isCopied
                        ? " dark: text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800"
                        : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`}
                    title="Скопировать для Excel"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => {
                      if (matchedDemand.length === 0) return;
                      const headers = [
                        "Номенклатура",
                        "Профиль",
                        "Марка",
                        "Размер",
                        "Длина",
                        "Кол-во тн в заказе",
                        "ИТОГО ост. к выполнению",
                        "Номенклатура заг.",
                        "Марка заг.",
                        "Размер заг.",
                        "Кол-во тн заг.",
                        "Длина",
                        "Взято со склада (тн)",
                        "ИТОГО ост. к завершению",
                        "Тех. отходы склад г/к",
                        "Дел. Остатки склад г/к",
                        "КИМ склад г/к",
                        "Исход Номенклатура",
                        "Профиль наличия",
                        "НТД",
                        "Марка стали наличия",
                        "Размер наличия",
                        "Длина (склад г/к)",
                        "Остаток на складе г/к. (тн)",
                        "Взято со склада г/к (тн)",
                        "Свободный остаток г/к склад (тн)",
                      ];
                      const rows: any[][] = [];
                      matchedDemand.forEach((res: any) => {
                        const baseRow = [
                          res.nomenclature || "",
                          res.type || "",
                          res.grade || "",
                          res.diameter,
                          res.lengthType === "НД" ? "НД" : `МД ${res.length}`,
                          Number(res.weightTons || 0),
                          Number(res.remainingToProcess || 0),
                          res.supplyNomenclature || "",
                          res.supplyGrade || "",
                          Number(res.supplyDiameter || 0),
                          Number(res.totalWeight || 0),
                          res.lengthType === "МД" ? `МД ${res.billetLength}` : "НД",
                          Number(res.allocatedStock || 0),
                          Number(res.shortageStock || 0),
                        ];
                        const maxRows = Math.max(1, res.matchedStockItems?.length || 0);
                        const rowTemplate = Array(headers.length).fill("");
                        for (let i = 0; i < 14; i++) rowTemplate[i] = baseRow[i];

                        for (let r = 0; r < maxRows; r++) {
                          const outRow = [...rowTemplate];
                          if (r > 0) {
                            for (let c = 0; c < 14; c++) outRow[c] = "";
                          }

                          const st = res.matchedStockItems?.[r];
                          if (st) {
                            outRow[14] = Number(st.calculatedTechWaste || 0);
                            outRow[15] = Number(st.calculatedUsefulRem || 0);
                            outRow[16] = Number(st.calculatedKim || 0);
                            outRow[17] = st["Исходная Номенклатура"] || "";
                            outRow[18] = st["Профиль"] || "";
                            outRow[19] = st["НТД"] || "";
                            outRow[20] = st["Марка стали"] || "";
                            outRow[21] = st["Размер"] || "";
                            outRow[22] = st["Длина"] || "";
                            outRow[23] = Number(st.stockBeforeTaking || 0);
                            outRow[24] = Number(st.allocatedAmount || 0);
                            outRow[25] = Number(st.stockAfterTaking || 0);
                          }
                          rows.push(outRow);
                        }
                      });

                      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
                      const numberCols = [3, 5, 6, 9, 10, 12, 13, 14, 15, 16, 23, 24, 25];
                      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
                      for (let R = 1; R <= range.e.r; ++R) {
                        for (let c of numberCols) {
                          const cellAddress = { c: c, r: R };
                          const cellRef = XLSX.utils.encode_cell(cellAddress);
                          if (worksheet[cellRef] && typeof worksheet[cellRef].v === "number") {
                            worksheet[cellRef].t = "n";
                            worksheet[cellRef].z = '#,##0.000" тн."';
                          }
                        }
                      }

                      const workbook = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(workbook, worksheet, "Расчет с наличием");
                      XLSX.writeFile(workbook, getTimestampedFilename("Расчет потребности в заготовке"));
                    }}
                    className="flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.9] shadow-sm"
                    title="Скачать в Excel"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredMatchedDemand.length > 0 && (
            <>
              <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
                <div
                  ref={supplyTableRef}
                  onMouseDown={onSupplyMouseDown}
                  onMouseLeave={handleMouseLeaveOrUp}
                  onMouseUp={handleMouseLeaveOrUp}
                  onMouseMove={handleMouseMove}
                  className={`overflow-auto max-h-[calc(100vh-350px)] custom-scrollbar relative ${isSupplyDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                >
                  <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Внутренний №
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Дата Заказа
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          № Заказа
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Заказчик
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Номенклатура
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Профиль
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          М. стали
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Размер
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Длина
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Кол-во тн в зак.
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          ИТОГО ост. к выполнению
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Номенклатура
                          <br />
                          заг.
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Марка
                          <br />
                          заг.
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Размер
                          <br />
                          заг.
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Кол-во тн
                          <br />
                          заг.
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Длина
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Взято со склада (тн)
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          ИТОГО ост. к завершению /<br />
                          после склада г/к
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span>Тех. отходы склад г/к</span>
                            <div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                              <span className="text-slate-800 dark:text-slate-200/70">Σ</span>
                              <span>{filteredTotals.techWaste2.toFixed(3)} тн</span>
                            </div>
                          </div>
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span>Дел. Остатки склад г/к</span>
                            <div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                              <span className="text-slate-800 dark:text-slate-200/70">Σ</span>
                              <span>{filteredTotals.usefulRem2.toFixed(3)} тн</span>
                            </div>
                          </div>
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          КИМ склад г/к
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Исход Номенклатура
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Профиль
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          НТД
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Марка стали
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Размер
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Длина
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Исх. Остаток (тн)
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Взято (тн)
                        </th>
                        <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                          Остаток на складе (тн)
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 text-[11px]`}>
                      {filteredMatchedDemand.map((res: any) => {
                        const renderMainRow = (stockItem: any = null, isSubRow = false) => (
                          <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group" key={Math.random()}>
                            {!isSubRow && (
                              <>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
                                  rowSpan={Math.max(1, res.matchedStockItems.length)}
                                >
                                  {res.internalNo || "—"}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {res.shippingDate}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <div className="font-bold text-slate-600 dark:text-slate-400 cursor-help">
                                    {res.orderNo}
                                  </div>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
                                    <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[10px] py-2 px-3 rounded-xl shadow-xl border border-white/10 whitespace-nowrap min-w-[120px]">
                                      <div className="flex flex-col gap-1.5 text-left">
                                        <div className="flex justify-between items-center gap-3">
                                          <span className="text-slate-400 text-[9px]">Обеспечено:</span>
                                          <span className="font-bold text-slate-800 dark:text-slate-200">{(res.allocatedStock || 0).toFixed(3)} тн</span>
                                        </div>
                                        <div className="flex justify-between items-center gap-3">
                                          <span className="text-slate-400 text-[9px]">Дефицит:</span>
                                          <span className="font-bold text-slate-800 dark:text-slate-200">{(res.shortageStock || 0).toFixed(3)} тн</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <div className="max-w-[150px] truncate" title={res.client}>
                                    {res.client}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <div
                                    className="max-w-[12rem] truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                                    title={res.nomenclature}
                                  >
                                    {res.nomenclature}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {res.type}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {res.grade}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {parseFloat(Number(res.diameter||0).toFixed(2))}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" : "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}>
                                    {res.lengthType === "НД" ? "НД" : `МД ${res.length}`}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {(res.weightTons||0).toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <span className="font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">
                                    {(res.remainingToProcess||0).toFixed(3)}
                                  </span>
                                </td>

                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  <div
                                    className="max-w-[12rem] truncate font-mono text-[10px] text-slate-400 group-hover/nom:text-slate-900 dark:group-hover/nom:text-white transition-colors"
                                    title={res.supplyNomenclature}
                                  >
                                    {res.supplyNomenclature}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {(res.supplyGrade !== res.grade || res.gost) && (
                                    <div className="absolute top-0 right-0 p-1">
                                      <div className="w-1.5 h-1.5 rounded-full  shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse"></div>
                                    </div>
                                  )}
                                  <div className="flex flex-col items-center gap-1">
                                    <span className="font-bold text-slate-700 dark:text-slate-200">
                                      {res.supplyGrade}
                                    </span>
                                    {res.gost ? (
                                      <span className="text-[9px] text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark: px-1.5 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                        ГОСТ {res.gost}
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                        ГОСТ {getGostForGrade(res.supplyGrade)}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {res.supplyDiameter}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {res.totalWeight ? (res.totalWeight || 0).toFixed(3) : "0.000"}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(1, res.matchedStockItems.length)}>
                                  {res.lengthType === "МД" ? `МД ${res.billetLength}` : "НД"}
                                </td>
                              </>
                            )}
                            {stockItem ? (
                              <>


                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {(stockItem.allocatedAmount||0).toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {(res.shortageStock||0).toFixed(3)}
                                </td>

                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {stockItem.calculatedTechWaste > 0 ? (
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">
                                      {(stockItem.calculatedTechWaste||0).toFixed(3)}
                                      <span className="text-[9px] ml-1">тн</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {stockItem.calculatedUsefulRem > 0 ? (
                                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">
                                      {(stockItem.calculatedUsefulRem||0).toFixed(3)}
                                      <span className="text-[9px] ml-1">тн</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {stockItem.calculatedKim > 0 ? (
                                    <span className={`font-mono font-bold ${stockItem.calculatedKim >= 0.95 ? "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200" : "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200"}`}>
                                      {(stockItem.calculatedKim * 100).toFixed(1)}%
                                    </span>
                                  ) : (
                                    <span className="text-slate-300">-</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <div
                                    className="max-w-[150px] truncate font-mono text-[10px] text-slate-500 group-hover/nom2:text-slate-900 dark:group-hover/nom2:text-white transition-colors"
                                    title={stockItem["Исходная Номенклатура"]}
                                  >
                                    {stockItem["Исходная Номенклатура"]}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                    {stockItem["Профиль"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <span className="text-[9px] font-mono text-slate-500">
                                    {stockItem["НТД"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {stockItem["Марка стали"]}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {stockItem["Размер"]}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${stockItem["Длина"] === "НД" ? "text-slate-800 dark:text-slate-200/70 " : "text-slate-800 dark:text-slate-200/70 "}`}>
                                    {stockItem["Длина"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {(stockItem.stockBeforeTaking||0).toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  -{(stockItem.allocatedAmount||0).toFixed(3)}
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  {(stockItem.stockAfterTaking||0).toFixed(3)}
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <span className="text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">0.000</span>
                                </td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                  <span className="font-black text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">
                                    {(res.shortageStock||0).toFixed(3)}
                                  </span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" colSpan={9}>
                                  Нет подходящих позиций на складе
                                </td>
                              </>
                            )}
                          </tr>
                        );

                        if (!res.matchedStockItems || res.matchedStockItems.length === 0) {
                          return renderMainRow(null, false);
                        }

                        return (
                          <React.Fragment key={res.id}>
                            {res.matchedStockItems.map((st: any, idx: number) => renderMainRow(st, idx > 0))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
