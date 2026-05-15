import React from 'react';
import { motion } from 'motion/react';
import { Check, Copy, Download, Layers } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../../lib/utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function FreeStockSection(props: any) {
  const { freeStock, freeStockTableRef, onFreeStockMouseDown, handleMouseLeaveOrUp, handleMouseMove, isFreeStockDragging, isCopied, setIsCopied } = props;
  
  const totalFreeStock = freeStock.reduce(
    (acc: number, row: any) => acc + row.remainingStock,
    0,
  );

  return (
    <motion.div
      key="supply-free-stock"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <Card
        isPadded={false}
        header={
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10  dark: rounded-xl flex items-center justify-center text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                  Свободный остаток заготовки
                </h4>
              </div>
              <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[9px] mr-2 uppercase font-bold opacity-60 tracking-widest">
                  Общий остаток
                </span>
                <div>
                  <span className="text-base tracking-tight leading-none">
                    {totalFreeStock.toFixed(3)}
                  </span>
                  <span className="text-[8px] ml-1 uppercase font-bold">
                    тн
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isCopied ? "success" : "secondary"}
                size="sm"
                onClick={() => {
                  if (freeStock.length === 0) return;
                  const headers = ["Номенклатура", "Профиль", "Сталь", "Размер", "Длина", "Остаток тн."];
                  const rows = freeStock.map((row: any) => [
                    row["Исходная Номенклатура"] || "", row["Профиль"] || "", row["Марка стали"] || "", String(row["Размер"]).replace(".", ","), row["Длина"] || "", String((row.remainingStock||0).toFixed(3)).replace(".", ","),
                  ]);
                  const tsv = [headers, ...rows].map(row => row.join("\t")).join("\n");
                  navigator.clipboard.writeText(tsv);
                  setIsCopied(true);
                  setTimeout(() => setIsCopied(false), 2000);
                }}
                title="Скопировать для Excel"
                className="font-bold h-10 min-w-[40px]"
                leftIcon={isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Копировать</span>
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  if (freeStock.length === 0) return;
                  const excelRows = freeStock.map((row: any) => ({
                    Номенклатура: row["Исходная Номенклатура"],
                    Профиль: row["Профиль"],
                    Сталь: row["Марка стали"],
                    Размер: row["Размер"],
                    Длина: row["Длина"],
                    "Остаток тн.": parseFloat((row.remainingStock||0).toFixed(3)),
                  }));
                  const worksheet = XLSX.utils.json_to_sheet(excelRows);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, "Свободный остаток");
                  XLSX.writeFile(workbook, getTimestampedFilename("Свободный остаток заготовки"));
                }}
                className="font-bold h-10 min-w-[40px]"
                leftIcon={<Download className="w-4 h-4" />}
                title="Скачать в Excel"
              >
                <span className="hidden sm:inline">Скачать</span>
              </Button>
            </div>
          </div>
        }
      >
        <div
          ref={freeStockTableRef}
          onMouseDown={onFreeStockMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`overflow-auto custom-scrollbar max-h-[calc(100vh-350px)] min-h-[400px] relative ${isFreeStockDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
        >
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10"  style={{ width: '12rem', maxWidth: '12rem', minWidth: '12rem' }}>Номенклатура</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Профиль</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Марка</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Размер</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Длина</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Остаток (тн)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {freeStock.map((row: any, i: number) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                    <div
                      className="max-w-[12rem] md:max-w-[300px] truncate font-mono text-[10px] text-slate-500 group-hover:text-slate-900 dark:text-white dark:group-hover:text-white transition-colors"
                      title={row["Исходная Номенклатура"]}
                    >
                      {row["Исходная Номенклатура"]}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                    <Badge variant="outline" className="font-bold border-slate-200">{row["Профиль"]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <span className="font-black text-slate-700 dark:text-slate-200 italic">{row["Марка стали"]}</span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 font-mono font-black  dark: px-3 py-1 rounded border border-slate-200 dark:border-slate-800">
                      {row["Размер"]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <Badge variant={row["Длина"] === "НД" ? "info" : "secondary"}>{row["Длина"]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <div className="flex flex-col items-end">
                      <span className="text-slate-900 dark:text-white font-black text-sm font-mono">
                        {(row.remainingStock||0).toFixed(3)}
                      </span>
                      <span className="text-[8px] text-slate-400 font-black uppercase">тонн</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
