import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../../lib/utils';
import { getGostForGrade } from '../../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download, Activity } = LucideIcons;

export function CalcSupplySection(props: any) {
  const { 
    supplyCalculationData, activeTab, setSupplySection, setProductionSection, setActiveTab,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredTotals,
    isCopied, setIsCopied, supplyTableRef, onSupplyMouseDown, handleMouseLeaveOrUp,
    handleMouseMove, isSupplyDragging, formatCurrency, getSupplyNomenclature
  } = props;
  
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
                    {supplyCalculationData.matchedDemand.length === 0 ? (
                      <div
                        className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center min-h-[400px]`}
                      >
                        <div
                          className={`w-20 h-20 bg-sky-50 dark:bg-sky-900/20 rounded-[30px] flex items-center justify-center text-sky-500 mb-6`}
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
                    ) : (
                      <div
                        className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none`}
                      >
                        <div
                          className={`flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-[#1A1C19]`}
                        >
                          <div
                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 2xl:border-r border-slate-200 dark:border-slate-800 2xl:pr-6 w-full 2xl:w-auto`}
                          >
                            <h4
                              className={`text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-widest`}
                            >
                              Расчет с учетом поставок
                            </h4>
                            <div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-sky-600 font-black bg-sky-50/80 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-sky-600/80 tracking-widest">
                                  Обеспечено плановыми поставками
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {supplyCalculationData.totals.allocated.toFixed(
                                      3,
                                    )}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-sky-600/70">
                                    тн
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-rose-600 font-black bg-rose-50/80 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-rose-600/80 tracking-widest">
                                  Дефицит
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {supplyCalculationData.totals.deficit.toFixed(
                                      3,
                                    )}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-rose-600/70">
                                    тн
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full 2xl:w-auto flex-wrap`}
                          >
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 sm:w-64 border border-slate-200 dark:border-slate-700">
                              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                              <input
                                type="text"
                                placeholder="Поиск по заказу, клиенту..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                              />
                            </div>
                            <button
                              onClick={() => {
                                if (
                                  supplyCalculationData.matchedDemand.length ===
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
                                  "Размер мм.",
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
                                supplyCalculationData.matchedDemand.forEach(
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
                                      String(res.weightTons || 0).replace(
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
                              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#121411] sm:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                              title="Скопировать для Excel"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  supplyCalculationData.matchedDemand.length ===
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
                                  "Размер мм.",
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
                                supplyCalculationData.matchedDemand.forEach(
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
                                      Number(res.weightTons || 0),
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
                                      res.combinedKim2 > 0
                                        ? Number(res.combinedKim2.toFixed(3))
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
                                      res.combinedKim3 > 0
                                        ? Number(res.combinedKim3.toFixed(3))
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
                              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
                              title="Скачать в Excel"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div
                          ref={supplyTableRef}
                          onMouseDown={onSupplyMouseDown}
                          onMouseLeave={handleMouseLeaveOrUp}
                          onMouseUp={handleMouseLeaveOrUp}
                          onMouseMove={handleMouseMove}
                          className={`overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar ${isSupplyDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                        >
                          <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm shadow-slate-200 dark:shadow-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-800 [&_th]:bg-[#F8FAFC] dark:[&_th]:bg-[#1A1C19]">
                              <tr>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Внутренний №
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Дата Заказа
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  № Заказа
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Клиент
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  Номенклатура
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Профиль
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Марка
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Размер мм.
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Длина
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Кол-во тн в заказе
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-600 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО остаток к выполнению
                                </th>

                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято со склада (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Тех. отходы склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Дел. Остатки склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  КИМ склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО ост. к завершению /<br />
                                  после склада г/к
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Номенклатура склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Профиль наличия
                                </th>
                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  НТД
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Марка наличия
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Размер наличия
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Длина (склад г/к)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Остаток на складе г/к. (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято со склада г/к (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  Свободный остаток г/к склад (тн)
                                </th>

                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Тех. отходы /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Дел. Остатки /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  КИМ /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО остаток выполнения заказа после расчета
                                  /<br />
                                  плановое поступление
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Номенклатура /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Профиль /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Марка /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Размер /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Кол-во тн. /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Длина /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Дата размещения
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Поставщик
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Ожидаемая дата поставки
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-l border-slate-100 dark:border-slate-800">
                                  Входящий остаток /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">
                                  Свободный остаток /<br />
                                  плановое поступление
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                              {supplyCalculationData.matchedDemand
                                .filter((res) => {
                                  if (!searchQuery) return true;
                                  const q = searchQuery.toLowerCase();
                                  return (
                                    (res.orderNo || "")
                                      .toLowerCase()
                                      .includes(q) ||
                                    (res.client || "")
                                      .toLowerCase()
                                      .includes(q) ||
                                    (res.nomenclature || "")
                                      .toLowerCase()
                                      .includes(q)
                                  );
                                })
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
                                      <tr
                                        key={`${res._dId}-${i}`}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                                      >
                                        {!isSubRow && (
                                          <>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.internalNo || ""}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.shippingDate}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.orderNo}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap`}
                                              rowSpan={maxRows}
                                            >
                                              {res.client}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle text-center max-w-[200px] border-r border-slate-100 dark:border-slate-800`}
                                              rowSpan={maxRows}
                                            >
                                              <div
                                                className="max-w-[150px] mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                                                title={res.nomenclature}
                                              >
                                                {res.nomenclature}
                                              </div>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {res.type}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-200`}
                                              rowSpan={maxRows}
                                            >
                                              {res.grade}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                {parseFloat(
                                                  Number(res.diameter).toFixed(
                                                    2,
                                                  ),
                                                )}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span
                                                className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                              >
                                                {res.lengthType === "НД"
                                                  ? "НД"
                                                  : `МД ${res.length}`}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-900 dark:text-white`}
                                              rowSpan={maxRows}
                                            >
                                              {res.weightTons
                                                ? Number(
                                                    res.weightTons,
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-sky-600 dark:text-sky-400 border-r border-slate-100 dark:border-slate-800`}
                                              rowSpan={maxRows}
                                            >
                                              {res.remainingToProcess
                                                ? Number(
                                                    res.remainingToProcess,
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>

                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black ${res.allocatedFromStock > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0
                                                ? res.allocatedFromStock.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedTechWaste2 > 0
                                                ? res.combinedTechWaste2.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedUsefulRem2 > 0
                                                ? res.combinedUsefulRem2.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedKim2 > 0
                                                ? res.combinedKim2.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black border-r border-slate-100 dark:border-slate-800 ${res.shortageAfterStock > 0.0005 ? "text-rose-600 dark:text-rose-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.shortageAfterStock > 0
                                                ? res.shortageAfterStock.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Stock Item details (per row) */}
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500">
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
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500">
                                          {stockItem && stockItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {stockItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500 font-mono text-[9px]">
                                          {stockItem
                                            ? stockItem["НТД"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-500">
                                          {stockItem
                                            ? stockItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {stockItem && stockItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                              {stockItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {stockItem && stockItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${stockItem["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                            >
                                              {stockItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400">
                                          {stockItem
                                            ? Number(
                                                stockItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-emerald-600 dark:text-emerald-500">
                                          {stockItem
                                            ? Number(
                                                stockItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-sky-500 border-r border-slate-100 dark:border-slate-800">
                                          {stockItem
                                            ? Number(
                                                stockItem.stockAfterTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>

                                        {/* Supply general metrics (rowSpan) */}
                                        {!isSubRow && (
                                          <>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedTechWaste3 > 0
                                                ? res.combinedTechWaste3.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedUsefulRem3 > 0
                                                ? res.combinedUsefulRem3.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedKim3 > 0
                                                ? res.combinedKim3.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black border-r border-slate-100 dark:border-slate-800 ${res.finalShortage > 0.0005 ? "text-rose-600 dark:text-rose-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.finalShortage > 0
                                                ? res.finalShortage.toFixed(3)
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Supply Item details (per row) */}
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500">
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
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500">
                                          {supplyItem &&
                                          supplyItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {supplyItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-500">
                                          {supplyItem
                                            ? supplyItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {supplyItem &&
                                          supplyItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                              {supplyItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {supplyItem && supplyItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${supplyItem["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                            >
                                              {supplyItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-mono text-[9px]">
                                          {supplyItem
                                            ? supplyItem["Дата размещения"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-medium text-[9px] truncate max-w-[120px]">
                                          {supplyItem
                                            ? supplyItem["Поставщик"] ||
                                              supplyItem["ПОСТАВЩИК"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-mono text-[9px] font-bold">
                                          {supplyItem
                                            ? supplyItem[
                                                "Ожидаемая дата поставки"
                                              ] ||
                                              supplyItem["ПОСТАВКА"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400 border-l border-slate-100 dark:border-slate-800">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-emerald-600 dark:text-emerald-500">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-sky-500">
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
                    )}
                  </motion.div>
    </React.Fragment>
  );
}
