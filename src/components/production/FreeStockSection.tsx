import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../../lib/utils';
import { getGostForGrade } from '../../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download } = LucideIcons;

export function FreeStockSection(props: any) {
  const { freeStock, formatCurrency, freeStockTableRef, onFreeStockMouseDown, handleMouseLeaveOrUp, handleMouseMove, isFreeStockDragging, isCopied, setIsCopied } = props;
  
  return (
    <React.Fragment>
      <motion.div
                    key="supply-free-stock"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-8`}
                  >
                    <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-5 bg-white dark:bg-[#1A1C19]">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 xl:border-r border-slate-200 dark:border-slate-800 xl:pr-4 w-full xl:w-auto">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-tight">
                            Свободный остаток заготовки
                          </h4>
                          <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-1.5 sm:py-2 text-emerald-600 font-black bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)] mt-1 sm:mt-0">
                            <span className="text-[10px] sm:text-xs mr-2 uppercase font-bold text-emerald-600/80 tracking-widest">
                              Общий остаток
                            </span>
                            <div>
                              <span className="text-lg sm:text-xl tracking-tight leading-none">
                                {freeStock
                                  .reduce(
                                    (acc, row) => acc + row.remainingStock,
                                    0,
                                  )
                                  .toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] ml-1 uppercase font-bold text-emerald-600/80">
                                тн
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-2 w-full md:w-auto mt-2 md:mt-0 shrink-0">
                          <button
                            onClick={() => {
                              if (freeStock.length === 0) return;
                              const headers = [
                                "Номенклатура",
                                "Профиль",
                                "Сталь",
                                "Размер",
                                "Длина",
                                "Остаток тн.",
                              ];
                              const rows = freeStock.map((row: any) => [
                                row["Исходная Номенклатура"] || "",
                                row["Профиль"] || "",
                                row["Марка стали"] || "",
                                String(row["Размер"]).replace(".", ","),
                                row["Длина"] || "",
                                String(row.remainingStock.toFixed(3)).replace(
                                  ".",
                                  ",",
                                ),
                              ]);

                              const tsv = [headers, ...rows]
                                .map((row) => row.join("\t"))
                                .join("\n");
                              navigator.clipboard.writeText(tsv);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }}
                            className="flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1C19] text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                              if (freeStock.length === 0) return;
                              const headers = [
                                "Номенклатура",
                                "Профиль",
                                "Сталь",
                                "Размер",
                                "Длина",
                                "Остаток тн.",
                              ];
                              const excelRows = freeStock.map((row: any) => ({
                                Номенклатура: row["Исходная Номенклатура"],
                                Профиль: row["Профиль"],
                                Сталь: row["Марка стали"],
                                Размер: row["Размер"],
                                Длина: row["Длина"],
                                "Остаток тн.": parseFloat(
                                  row.remainingStock.toFixed(3),
                                ),
                              }));

                              const worksheet =
                                XLSX.utils.json_to_sheet(excelRows);

                              const wscols = [
                                { wch: 30 },
                                { wch: 15 },
                                { wch: 15 },
                                { wch: 12 },
                                { wch: 15 },
                                { wch: 15 },
                              ];
                              worksheet["!cols"] = wscols;

                              const range = XLSX.utils.decode_range(
                                worksheet["!ref"] || "A1",
                              );
                              for (let R = range.s.r; R <= range.e.r; ++R) {
                                for (let C = range.s.c; C <= range.e.c; ++C) {
                                  const cell_address = { c: C, r: R };
                                  const cell_ref =
                                    XLSX.utils.encode_cell(cell_address);
                                  if (!worksheet[cell_ref]) continue;

                                  worksheet[cell_ref].s = {
                                    font: { sz: 8 },
                                    alignment: {
                                      horizontal: "center",
                                      vertical: "center",
                                    },
                                  };

                                  if (R === 0) {
                                    worksheet[cell_ref].s.font.bold = true;
                                  }
                                }
                              }

                              const workbook = XLSX.utils.book_new();
                              XLSX.utils.book_append_sheet(
                                workbook,
                                worksheet,
                                "Свободный остаток",
                              );
                              XLSX.writeFile(
                                workbook,
                                getTimestampedFilename("Свободный остаток заготовки на складе г/к"),
                              );
                            }}
                            className="flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
                            title="Скачать в Excel"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div
                        ref={freeStockTableRef}
                        onMouseDown={onFreeStockMouseDown}
                        onMouseLeave={handleMouseLeaveOrUp}
                        onMouseUp={handleMouseLeaveOrUp}
                        onMouseMove={handleMouseMove}
                        className={`overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative ${isFreeStockDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                      >
                        <table className="w-full text-left border-separate border-spacing-0 block md:table">
                          <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800 hidden md:table-header-group">
                            <tr>
                              <th className="px-8 py-5 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Номенклатура
                              </th>
                              <th className="px-6 py-5 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Профиль
                              </th>
                              <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Сталь
                              </th>
                              <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Размер
                              </th>
                              <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Длина
                              </th>
                              <th className="px-8 py-5 text-right bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
                                Остаток тн.
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 block md:table-row-group">
                            {freeStock.map((row, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] p-2 md:p-0 md:bg-transparent"
                              >
                                <td className="px-4 md:px-8 py-3 md:py-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Номенклатура
                                  </span>
                                  <div
                                    className="max-w-[200px] md:max-w-[300px] truncate font-mono text-[10px] text-right md:text-left"
                                    title={row["Исходная Номенклатура"]}
                                  >
                                    {row["Исходная Номенклатура"]}
                                  </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Профиль
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
                                    {row["Профиль"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Сталь
                                  </span>
                                  <span>{row["Марка стали"]}</span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Размер
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                                    {row["Размер"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Длина
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${row["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"} ml-auto md:ml-0 md:mx-auto`}
                                  >
                                    {row["Длина"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-8 py-3 md:py-4 text-right flex justify-between items-center md:table-cell min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Остаток тн.
                                  </span>
                                  <div>
                                    <span className="text-slate-900 dark:text-white font-black text-xs">
                                      {row.remainingStock.toFixed(3)}
                                    </span>
                                    <span className="ml-1 text-[10px] text-slate-400 font-bold">
                                      тн
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
    </React.Fragment>
  );
}
