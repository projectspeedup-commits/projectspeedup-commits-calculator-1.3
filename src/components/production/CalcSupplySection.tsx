import React, { Fragment, useMemo } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { StatusDropdown } from '../StatusDropdown';
import { getTimestampedFilename } from '../../lib/utils';
import { getGostForGrade } from '../../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download, Activity } = LucideIcons;

export function CalcSupplySection(props: any) {
  const { 
    supplyCalculationData, activeTab, setSupplySection, setProductionSection, setActiveTab,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredTotals,
    isCopied, setIsCopied, supplyTableRef, onSupplyMouseDown, handleMouseLeaveOrUp,
    handleMouseMove, isSupplyDragging, formatCurrency, getSupplyNomenclature,
    filteredMatchedDemand
  } = props;
  
  const validMatchedDemand = filteredMatchedDemand || [];
  
  const validAllocatedFromSupply = filteredTotals?.allocated || 0;
  const validDeficit = filteredTotals?.deficit || 0;

  return (
    <React.Fragment>
      <motion.div
                    key="supply-calc-supply"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-8`}
                  >
                    {validMatchedDemand.length === 0 ? (
                      <div
                        className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 md:p-12 flex flex-col items-center justify-center min-h-[400px]`}
                      >
                        <div
                          className={`w-20 h-20  dark: rounded-[30px] flex items-center justify-center text-slate-800 dark:text-slate-200 mb-6`}
                        >
                          <Activity className={`w-10 h-10`} />
                        </div>
                        <h3
                          className={`text-xl font-bold text-slate-900 dark:text-white`}
                        >
                          Нет данных
                        </h3>
                        <p
                          className={`text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm px-6 leading-relaxed`}
                        >
                          Сначала выполните расчет потребности, загрузите
                          остатки и планы поставок.
                        </p>
                      </div>
                    ) : (<>
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
                              Расчет с учетом поставок
                            </h4>
                            <div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-slate-800 dark:text-slate-200 font-black  dark: border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200/80 tracking-widest">
                                  Обеспечено плановыми поставками
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {filteredTotals.allocated.toFixed(3)}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200/70">
                                    тн
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-slate-800 dark:text-slate-200 font-black  dark: border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200/80 tracking-widest">
                                  Дефицит
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {filteredTotals.deficit.toFixed(3)}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200/70">
                                    тн
                                  </span>
                                </div>
                              </div>
                            </div>
                              </div>
                          <div
                            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full 2xl:w-auto flex-wrap`}
                          >
                            <div className="flex-1 relative group">
                              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-focus-within:text-slate-800 dark:text-slate-200 transition-colors shrink-0" />
                              <input
                                type="text"
                                placeholder="Поиск по заказу..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-3 h-10 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-slate-200 dark:border-slate-800 transition-all placeholder:text-slate-400"
                              />
                            </div>
                            <div className="flex items-center h-10 px-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 w-full md:w-auto transition-all focus-within:border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-blue-500/20">
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
                                if (
                                  validMatchedDemand.length ===
                                  0
                                )
                                  return;
                                const headers = [
                                  "Внутренний №",
                                  "Дата Заказа",
                                  "№ Заказа",
                                  "Клиент",
                                  "Номенклатура",
                                  "Профиль",
                                  "Марка",
                                  "Размер",
                                  "Длина",
                                  "Кол-во тн в заказе",
                                  "ИТОГО остаток к выполнению",
                                  "Взято со склада (тн)",
                                  "Тех. отходы склад г/к",
                                  "Дел. Остатки склад г/к",
                                  "КИМ склад г/к",
                                  "ИТОГО ост. к завершению / после склада г/к",
                                  "Номенклатура склад г/к",
                                  "Профиль наличия",
                                  "НТД",
                                  "Марка наличия",
                                  "Размер наличия",
                                  "Длина (склад г/к)",
                                  "Остаток на складе г/к. (тн)",
                                  "Взято со склада г/к (тн)",
                                  "Свободный остаток г/к склад (тн)",
                                  "Тех. отходы / плановое поступление",
                                  "Дел. Остатки / плановое поступление",
                                  "КИМ / плановое поступление",
                                  "ИТОГО остаток выполнения заказа после расчета / плановое поступление",
                                  "Номенклатура / плановое поступление",
                                  "Профиль / плановое поступление",
                                  "Марка / плановое поступление",
                                  "Размер / плановое поступление",
                                  "Кол-во тн. / плановое поступление",
                                  "Длина / плановое поступление",
                                  "Дата размещения",
                                  "Поставщик",
                                  "Ожидаемая дата поставки",
                                  "Входящий остаток / плановое поступление",
                                  "Взято / плановое поступление",
                                  "Свободный остаток / плановое поступление",
                                ];
                                const rows: string[][] = [];
                                validMatchedDemand.forEach(
                                  (res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      String(res.diameter).replace(".", ","),
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      String((res.weight || res.totalWeight) || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(
                                        res.remainingToProcess || 0,
                                      ).replace(".", ","),

                                      String(
                                        res.allocatedFromStock || 0,
                                      ).replace(".", ","),
                                      res.allocatedFromStock > 0 &&
                                      res.combinedTechWaste2 > 0
                                        ? String(
                                            res.combinedTechWaste2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromStock > 0 &&
                                      res.combinedUsefulRem2 > 0
                                        ? String(
                                            res.combinedUsefulRem2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromStock > 0 &&
                                      res.combinedKim2 > 0
                                        ? String(
                                            res.combinedKim2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      String(
                                        res.shortageAfterStock || 0,
                                      ).replace(".", ","),
                                    ];
                                    const maxRows = Math.max(
                                      1,
                                      res.stockItems?.length || 0,
                                      res.supplyItems?.length || 0,
                                    );

                                    const rowTemplate = Array(
                                      headers.length,
                                    ).fill("");
                                    for (let i = 0; i < 16; i++)
                                      rowTemplate[i] = baseRow[i];

                                    const supplyBaseCols = [
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedTechWaste3 > 0
                                        ? String(
                                            res.combinedTechWaste3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedUsefulRem3 > 0
                                        ? String(
                                            res.combinedUsefulRem3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedKim3 > 0
                                        ? String(
                                            res.combinedKim3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      String(res.finalShortage || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                    ];

                                    for (let i = 25; i < 29; i++)
                                      rowTemplate[i] = supplyBaseCols[i - 25];

                                    for (let r = 0; r < maxRows; r++) {
                                      const outRow = [...rowTemplate];
                                      if (r > 0) {
                                        for (let c = 0; c < 16; c++)
                                          outRow[c] = "";
                                        for (let c = 25; c < 29; c++)
                                          outRow[c] = "";
                                      }

                                      const st = res.stockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = String(
                                          st["Размер"] || "",
                                        ).replace(".", ",");
                                        outRow[21] = st["Длина"] || "";
                                        outRow[22] = String(
                                          st.stockBeforeTaking || 0,
                                        ).replace(".", ",");
                                        outRow[23] = String(
                                          st.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[24] = String(
                                          st.stockAfterTaking || 0,
                                        ).replace(".", ",");
                                      } else {
                                        for (let c = 16; c <= 24; c++)
                                          outRow[c] = "";
                                      }

                                      const sp = res.supplyItems?.[r];
                                      if (sp) {
                                        outRow[29] = getSupplyNomenclature(sp);
                                        outRow[30] = sp["Профиль"] || "";
                                        outRow[31] = sp["Марка стали"] || "";
                                        outRow[32] = String(
                                          sp["Размер"] || "",
                                        ).replace(".", ",");
                                        outRow[33] = String(
                                          sp.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[34] = sp["Длина"] || "";
                                        outRow[35] =
                                          sp["Дата размещения"] || "";
                                        outRow[36] =
                                          sp["Поставщик"] ||
                                          sp["ПОСТАВЩИК"] ||
                                          "";
                                        outRow[37] =
                                          sp["Ожидаемая дата поставки"] ||
                                          sp["ПОСТАВКА"] ||
                                          "";
                                        outRow[38] = String(
                                          sp.stockBeforeTaking || 0,
                                        ).replace(".", ",");
                                        outRow[39] = String(
                                          sp.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[40] = String(
                                          sp.stockAfterTaking || 0,
                                        ).replace(".", ",");
                                      } else {
                                        for (let c = 29; c <= 40; c++)
                                          outRow[c] = "";
                                      }

                                      rows.push(outRow);
                                    }
                                  },
                                );
                                const tsv = [headers, ...rows]
                                  .map((row) => row.join("\t"))
                                  .join("\n");
                                navigator.clipboard.writeText(tsv);
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
                              {isCopied ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  validMatchedDemand.length ===
                                  0
                                )
                                  return;
                                const headers = [
                                  "Внутренний №",
                                  "Дата Заказа",
                                  "№ Заказа",
                                  "Клиент",
                                  "Номенклатура",
                                  "Профиль",
                                  "Марка",
                                  "Размер",
                                  "Длина",
                                  "Кол-во тн в заказе",
                                  "ИТОГО остаток к выполнению",
                                  "Взято со склада (тн)",
                                  "Тех. отходы склад г/к",
                                  "Дел. Остатки склад г/к",
                                  "КИМ склад г/к",
                                  "ИТОГО ост. к завершению / после склада г/к",
                                  "Номенклатура склад г/к",
                                  "Профиль наличия",
                                  "НТД",
                                  "Марка наличия",
                                  "Размер наличия",
                                  "Длина (склад г/к)",
                                  "Остаток на складе г/к. (тн)",
                                  "Взято со склада г/к (тн)",
                                  "Свободный остаток г/к склад (тн)",
                                  "Тех. отходы / плановое поступление",
                                  "Дел. Остатки / плановое поступление",
                                  "КИМ / плановое поступление",
                                  "ИТОГО остаток выполнения заказа после расчета / плановое поступление",
                                  "Номенклатура / плановое поступление",
                                  "Профиль / плановое поступление",
                                  "Марка / плановое поступление",
                                  "Размер / плановое поступление",
                                  "Кол-во тн. / плановое поступление",
                                  "Длина / плановое поступление",
                                  "Дата размещения",
                                  "Поставщик",
                                  "Ожидаемая дата поставки",
                                  "Входящий остаток / плановое поступление",
                                  "Взято / плановое поступление",
                                  "Свободный остаток / плановое поступление",
                                ];
                                const rows: any[][] = [];
                                validMatchedDemand.forEach(
                                  (res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      res.diameter,
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      Number((res.weight || res.totalWeight) || 0),
                                      Number(res.remainingToProcess || 0),

                                      Number(res.allocatedFromStock || 0),
                                      res.allocatedFromStock > 0 &&
                                      res.combinedTechWaste2 > 0
                                        ? Number(
                                            res.combinedTechWaste2.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromStock > 0 &&
                                      res.combinedUsefulRem2 > 0
                                        ? Number(
                                            res.combinedUsefulRem2.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromStock > 0 &&
                                      res.combinedKim2 > 0 ? Number(res.combinedKim2.toFixed(3))
                                        : 0,
                                      Number(res.shortageAfterStock || 0),
                                    ];
                                    const maxRows = Math.max(
                                      1,
                                      res.stockItems?.length || 0,
                                      res.supplyItems?.length || 0,
                                    );

                                    const rowTemplate = Array(
                                      headers.length,
                                    ).fill("");
                                    for (let i = 0; i < 16; i++)
                                      rowTemplate[i] = baseRow[i];

                                    const supplyBaseCols = [
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedTechWaste3 > 0
                                        ? Number(
                                            res.combinedTechWaste3.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedUsefulRem3 > 0
                                        ? Number(
                                            res.combinedUsefulRem3.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedKim3 > 0 ? Number(res.combinedKim3.toFixed(3))
                                        : 0,
                                      Number(res.finalShortage || 0),
                                    ];

                                    for (let i = 25; i < 29; i++)
                                      rowTemplate[i] = supplyBaseCols[i - 25];

                                    for (let r = 0; r < maxRows; r++) {
                                      const outRow = [...rowTemplate];
                                      if (r > 0) {
                                        for (let c = 0; c < 16; c++)
                                          outRow[c] = "";
                                        for (let c = 25; c < 29; c++)
                                          outRow[c] = "";
                                      }

                                      const st = res.stockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = st["Размер"] || "";
                                        outRow[21] = st["Длина"] || "";
                                        outRow[22] = Number(
                                          st.stockBeforeTaking || 0,
                                        );
                                        outRow[23] = Number(
                                          st.allocatedAmount || 0,
                                        );
                                        outRow[24] = Number(
                                          st.stockAfterTaking || 0,
                                        );
                                      } else {
                                        for (let c = 16; c <= 24; c++)
                                          outRow[c] = "";
                                      }

                                      const sp = res.supplyItems?.[r];
                                      if (sp) {
                                        outRow[29] = getSupplyNomenclature(sp);
                                        outRow[30] = sp["Профиль"] || "";
                                        outRow[31] = sp["Марка стали"] || "";
                                        outRow[32] = sp["Размер"] || "";
                                        outRow[33] = Number(
                                          sp.allocatedAmount || 0,
                                        );
                                        outRow[34] = sp["Длина"] || "";
                                        outRow[35] =
                                          sp["Дата размещения"] || "";
                                        outRow[36] =
                                          sp["Поставщик"] ||
                                          sp["ПОСТАВЩИК"] ||
                                          "";
                                        outRow[37] =
                                          sp["Ожидаемая дата поставки"] ||
                                          sp["ПОСТАВКА"] ||
                                          "";
                                        outRow[38] = Number(
                                          sp.stockBeforeTaking || 0,
                                        );
                                        outRow[39] = Number(
                                          sp.allocatedAmount || 0,
                                        );
                                        outRow[40] = Number(
                                          sp.stockAfterTaking || 0,
                                        );
                                      } else {
                                        for (let c = 29; c <= 40; c++)
                                          outRow[c] = "";
                                      }

                                      rows.push(outRow);
                                    }
                                  },
                                );

                                const worksheet = XLSX.utils.aoa_to_sheet([
                                  headers,
                                  ...rows,
                                ]);
                                const numberCols = [
                                  9, 10, 11, 12, 13, 15, 22, 23, 24, 25, 26, 28,
                                  33, 38, 39, 40,
                                ];
                                const range = XLSX.utils.decode_range(
                                  worksheet["!ref"] || "A1:A1",
                                );
                                for (let R = 1; R <= range.e.r; ++R) {
                                  for (let c of numberCols) {
                                    const cellAddress = { c: c, r: R };
                                    const cellRef =
                                      XLSX.utils.encode_cell(cellAddress);
                                    if (
                                      worksheet[cellRef] &&
                                      typeof worksheet[cellRef].v === "number"
                                    ) {
                                      worksheet[cellRef].t = "n";
                                      worksheet[cellRef].z = '#,##0.000" тн."';
                                    }
                                  }
                                }

                                const workbook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(
                                  workbook,
                                  worksheet,
                                  "Расчет_поставки",
                                );
                                XLSX.writeFile(
                                  workbook,
                                  getTimestampedFilename("Расчет потребности в заготовке"),
                                );
                              }}
                              className="flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-[0.9] shadow-sm"
                              title="Скачать в Excel"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            </div>
                          </div>
                        </div>
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
                                  Клиент
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Номенклатура
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Профиль
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Марка
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Размер
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Длина
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Кол-во тн в заказе
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  ИТОГО остаток к выполнению
                                </th>

                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Взято со склада (тн)
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Тех. отходы склад г/к
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Дел. Остатки склад г/к
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  КИМ склад г/к
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  ИТОГО ост. к завершению /<br />
                                  после склада г/к
                                </th>

                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Номенклатура склад г/к
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Профиль наличия
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  НТД
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Марка наличия
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Размер наличия
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Длина (склад г/к)
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Остаток на складе г/к. (тн)
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Взято со склада г/к (тн)
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Свободный остаток г/к склад (тн)
                                </th>

                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Тех. отходы /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Дел. Остатки /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  КИМ /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  ИТОГО остаток выполнения заказа после расчета
                                  /<br />
                                  плановое поступление
                                </th>

                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Номенклатура /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Профиль /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Марка /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Размер /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Кол-во тн. /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Длина /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Дата размещения
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Поставщик
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Ожидаемая дата поставки
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Входящий остаток /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Взято /<br />
                                  плановое поступление
                                </th>
                                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
                                  Свободный остаток /<br />
                                  плановое поступление
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                              {validMatchedDemand
                                .map((res: any, idx) => {
                                  const maxRows = Math.max(
                                    1,
                                    res.stockItems?.length || 0,
                                    res.supplyItems?.length || 0,
                                  );
                                  const renderRows = [];

                                  for (let i = 0; i < maxRows; i++) {
                                    const stockItem = res.stockItems?.[i];
                                    const supplyItem = res.supplyItems?.[i];
                                    const isSubRow = i > 0;

                                    renderRows.push(
                                      <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group" key={Math.random()}>
                                        {!isSubRow && (
                                          <>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.internalNo || ""}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.shippingDate}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.orderNo}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.client}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              <div
                                                className="max-w-[150px] mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                                                title={res.nomenclature}
                                              >
                                                {res.nomenclature}
                                              </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {res.type}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.grade}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
                                                {parseFloat(
                                                  Number(res.diameter).toFixed(
                                                    2,
                                                  ),
                                                )}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              <span
                                                className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" : "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}
                                              >
                                                {res.lengthType === "НД"
                                                  ? "НД"
                                                  : `МД ${res.length}`}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {(res.weight || res.totalWeight)
                                                ? Number(
                                                    (res.weight || res.totalWeight),
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.remainingToProcess
                                                ? Number(
                                                    res.remainingToProcess,
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>

                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0
                                                ? (res.allocatedFromStock || 0).toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedTechWaste2 > 0 ? res.combinedTechWaste2.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedUsefulRem2 > 0 ? res.combinedUsefulRem2.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedKim2 > 0 ? res.combinedKim2.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
                                              rowSpan={maxRows}
                                            >
                                              {res.shortageAfterStock > 0
                                                ? (res.shortageAfterStock || 0).toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Stock Item details (per row) */}
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                                          {stockItem ? (
                                            <div
                                              className="max-w-[150px] truncate font-medium text-[10px]"
                                              title={
                                                stockItem[
                                                  "Исходная Номенклатура"
                                                ]
                                              }
                                            >
                                              {
                                                stockItem[
                                                  "Исходная Номенклатура"
                                                ]
                                              }
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem && stockItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {stockItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                                          {stockItem
                                            ? stockItem["НТД"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem
                                            ? stockItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem && stockItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
                                              {stockItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem && stockItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${stockItem["Длина"] === "НД" ? "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" : "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}
                                            >
                                              {stockItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem
                                            ? Number(
                                                stockItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem
                                            ? Number(
                                                stockItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {stockItem
                                            ? Number(
                                                stockItem.stockAfterTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>

                                        {/* Supply general metrics (rowSpan) */}
                                        {!isSubRow && (
                                          <>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedTechWaste3 > 0 ? res.combinedTechWaste3.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedUsefulRem3 > 0 ? res.combinedUsefulRem3.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={maxRows}>
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedKim3 > 0 ? res.combinedKim3.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
                                              rowSpan={maxRows}
                                            >
                                              {res.finalShortage > 0
                                                ? (res.finalShortage || 0).toFixed(3)
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Supply Item details (per row) */}
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                                          {supplyItem ? (
                                            <div
                                              className="max-w-[150px] truncate font-medium text-[10px]"
                                              title={getSupplyNomenclature(
                                                supplyItem,
                                              )}
                                            >
                                              {getSupplyNomenclature(
                                                supplyItem,
                                              )}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem &&
                                          supplyItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {supplyItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? supplyItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem &&
                                          supplyItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
                                              {supplyItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem && supplyItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${supplyItem["Длина"] === "НД" ? "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" : "text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}
                                            >
                                              {supplyItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? supplyItem["Дата размещения"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? supplyItem["Поставщик"] ||
                                              supplyItem["ПОСТАВЩИК"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? supplyItem[
                                                "Ожидаемая дата поставки"
                                              ] ||
                                              supplyItem["ПОСТАВКА"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? Number(
                                                supplyItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                                          {supplyItem
                                            ? Number(
                                                supplyItem.stockAfterTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                      </tr>,
                                    );
                                  }
                                  return (
                                    <Fragment key={res.id || idx}>
                                      {renderRows}
                                    </Fragment>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
</div>
                    </>)}
                  </motion.div>
    </React.Fragment>
  );
}
