import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../../lib/utils';

const { FolderSearch, ArrowRight } = LucideIcons;

export function CalcSection({
  calculationResults,
  activeTab,
  setSupplySection,
  setProductionSection,
  setActiveTab,
  isProcessing,
  copySuccess,
  setCopySuccess,
  tableContainerRef,
  handleMouseDown,
  handleMouseLeaveOrUp,
  handleMouseMove,
  isDragging
}: any) {
  return (
    <motion.div
      key="supply-calc"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-8"
    >
      {calculationResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-[#1A1C19]/40 rounded-[40px] border border-slate-100 dark:border-slate-800/50">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-3xl rotate-6 mix-blend-multiply opacity-50"></div>
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-3xl -rotate-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
              <FolderSearch className="w-10 h-10 text-slate-400 dark:text-slate-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Здесь пока пусто
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 leading-relaxed mb-8">
            Мы не можем представить образец, пока вы не
            откорректируете список заказов. Загрузите файл с
            заказами клиентов, чтобы начать работу.
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
          >
            Перейти к загрузке файлов
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {isProcessing && (
            <div className="mt-8 flex items-center gap-3 h-12 px-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
              Идет расчет...
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1A1C19] rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 sm:px-8 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full xl:w-auto">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest shrink-0">
                  Портфель заказов
                </h4>
                <div className="bg-sky-50 dark:bg-sky-500/5 rounded-2xl px-6 py-3 border border-sky-100 dark:border-sky-500/20 flex items-center w-full sm:w-auto min-h-[56px] shadow-sm">
                  <span className="text-[10px] text-sky-600/70 dark:text-sky-400/70 uppercase font-black tracking-widest mr-4 shrink-0">
                    Остаток выполнения
                  </span>
                  <span className="text-2xl font-black text-sky-600 dark:text-sky-400 no-underline flex items-baseline gap-1">
                    {calculationResults
                      .reduce(
                        (sum: any, res: any) =>
                          sum + (res.remainingToProcess || 0),
                        0,
                      )
                      .toFixed(3)}
                    <span className="text-xs font-bold text-sky-600/50 dark:text-sky-400/50 uppercase ml-0.5">
                      тн
                    </span>
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 w-full xl:w-auto">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:block">
                  {calculationResults.length} строк
                </div>

                <button
                  onClick={() => {
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
                      "Остаток выполнения",
                    ];

                    const rows = calculationResults.map((res: any) => {
                      const row = [
                        res.internalNo || "",
                        res.shippingDate || "",
                        res.orderNo || "",
                        res.client || "",
                        res.nomenclature || "",
                        res.type || "",
                        res.grade || "",
                        Number(res.diameter) || 0,
                        res.lengthType === "НД"
                          ? "НД"
                          : `МД ${res.length}`,
                        Number(res.weightTons || 0),
                        Number(res.remainingToProcess.toFixed(3)),
                      ];
                      return row;
                    });

                    const tsv = [headers, ...rows]
                      .map((row) => row.join("\t"))
                      .join("\n");
                    navigator.clipboard.writeText(tsv);
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm w-[calc(50%-0.25rem)] sm:w-auto ${
                    copySuccess
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                  }`}
                  title="Скопировать для вставки (Ctrl+V) в Google Таблицы"
                >
                  {copySuccess ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                      <span className="whitespace-nowrap">Sheets</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (calculationResults.length === 0) return;

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
                      "Остаток выполнения",
                    ];

                    const rows = calculationResults.map((res: any) => {
                      const row = [
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
                        String(res.weightTons).replace(".", ","),
                        String(
                          res.remainingToProcess.toFixed(3),
                        ).replace(".", ","),
                      ];
                      return row;
                    });

                    const worksheet = XLSX.utils.aoa_to_sheet([
                      headers,
                      ...rows,
                    ]);

                    const range = XLSX.utils.decode_range(
                      worksheet["!ref"] || "A1",
                    );
                    const centerCols = [
                      6, 7, 9, 10, 12, 13, 14, 15,
                    ];

                    for (let R = range.s.r; R <= range.e.r; ++R) {
                      for (
                        let C = range.s.c;
                        C <= range.e.c;
                        ++C
                      ) {
                        const cell_address = { c: C, r: R };
                        const cell_ref =
                          XLSX.utils.encode_cell(cell_address);
                        if (!worksheet[cell_ref]) continue;

                        const isCentered = centerCols.includes(C);

                        worksheet[cell_ref].s = {
                          font: { sz: 8 },
                          alignment: {
                            horizontal: isCentered
                              ? "center"
                              : "left",
                            vertical: "center",
                            wrapText: C === 4 || C === 11, // Wrap text for Nomenclature columns
                          },
                        };

                        if (R === 0) {
                          worksheet[cell_ref].s.font.bold = true;
                          worksheet[
                            cell_ref
                          ].s.alignment.horizontal = "center";
                        }
                      }
                    }

                    worksheet["!views"] = [
                      { state: "frozen", ySplit: 1 },
                    ];

                    const out_wcut = [
                      { wch: 25 },
                      { wch: 40 },
                      { wch: 15 },
                      { wch: 10 },
                      { wch: 10 },
                      { wch: 15 },
                      { wch: 10 },
                      { wch: 15 },
                      { wch: 15 },
                      { wch: 30 },
                      { wch: 10 },
                      { wch: 15 },
                      { wch: 15 },
                      { wch: 15 },
                    ];
                    worksheet["!cols"] = out_wcut;

                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(
                      workbook,
                      worksheet,
                      "Заказы",
                    );
                    XLSX.writeFile(
                      workbook,
                      getTimestampedFilename("Заказы"),
                    );
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm w-[calc(50%-0.25rem)] sm:w-auto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span className="whitespace-nowrap">Excel</span>
                </button>
              </div>
            </div>

            <div
              ref={tableContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveOrUp}
              onMouseUp={handleMouseLeaveOrUp}
              onMouseMove={handleMouseMove}
              className={`overflow-auto max-h-[60vh] custom-scrollbar relative ${isDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
            >
              <table className="w-full border-separate border-spacing-0 pointer-events-auto block md:table">
                <thead className="sticky top-0 z-20 hidden md:table-header-group">
                  <tr className="bg-slate-50/95 dark:bg-[#1A1C19]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(241,245,249,1)] dark:shadow-[0_1px_0_rgba(30,41,59,1)]">
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
                    <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
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
                    <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-600 uppercase tracking-widest whitespace-nowrap">
                      Остаток выполнения
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] block md:table-row-group">
                  {calculationResults.map((res: any) => (
                    <tr
                      key={res.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none p-2 md:p-0 rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] md:bg-transparent"
                    >
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Внутренний №
                        </span>
                        <div className="text-right md:text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {res.internalNo}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Дата Заказа
                        </span>
                        <div className="text-right md:text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {res.shippingDate}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          № Заказа
                        </span>
                        <div className="text-right md:text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {res.orderNo}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Клиент
                        </span>
                        <div className="text-right md:text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                          {res.client}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px] md:max-w-[200px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px] shrink-0 mr-2">
                          Номенклатура
                        </span>
                        <div
                          className="max-w-[150px] md:mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-right md:text-center"
                          title={res.nomenclature}
                        >
                          {res.nomenclature}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Профиль
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
                          {res.type}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Марка
                        </span>
                        <div className="text-right md:text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                          {res.grade}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Размер мм.
                        </span>
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                          {parseFloat(res.diameter.toFixed(2))}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Длина
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"} ml-auto md:ml-0 md:mx-auto`}
                        >
                          {res.lengthType === "НД"
                            ? "НД"
                            : `МД ${res.length}`}
                        </span>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                        <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                          Кол-во тн
                        </span>
                        <div className="text-right md:text-center font-black text-slate-900 dark:text-white whitespace-nowrap">
                          {res.weightTons.toFixed(3)}
                        </div>
                      </td>
                      <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-sky-100 dark:border-sky-900/50 md:border-0 min-h-[44px] bg-sky-50/50 dark:bg-sky-900/10">
                        <span className="md:hidden font-bold text-sky-600 dark:text-sky-400 uppercase text-[10px]">
                          ИТОГО ост.
                        </span>
                        <div className="text-right md:text-center font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                          {res.remainingToProcess.toFixed(3)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
