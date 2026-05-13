import React from 'react';
import { motion } from 'motion/react';
import { Layers, Copy, Check, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function StockSection({
  processedStock,
  handleCopyForSheets,
  isCopied,
  handleExportStock,
  stockTableRef,
  onStockMouseDown,
  handleMouseLeaveOrUp,
  handleMouseMove,
  isStockDragging
}: any) {
  const totalStock = processedStock.reduce(
    (acc: any, curr: any) =>
      acc +
      (typeof curr["Конечный остаток тн."] === "number"
        ? curr["Конечный остаток тн."]
        : parseFloat(curr["Конечный остаток тн." as any]) || 0),
    0,
  );

  return (
    <motion.div
      key="supply-stock"
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-800/50">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight leading-tight">
                  Актуальные остатки заготовки
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">
                    {processedStock.length} позиций
                  </Badge>
                  <Badge variant="success" className="text-[10px] font-black">
                    Итого: {totalStock.toFixed(3)} тн.
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={isCopied ? "success" : "secondary"}
                size="sm"
                onClick={handleCopyForSheets}
                className="font-bold h-10 min-w-[40px]"
                leftIcon={isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                title="Скопировать для Excel"
              >
                <span className="hidden sm:inline">Excel Копировать</span>
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={handleExportStock}
                className="font-bold h-10 min-w-[40px]"
                leftIcon={<Download className="w-4 h-4" />}
                title="Скачать в Excel"
              >
                <span className="hidden sm:inline">Excel Скачать</span>
              </Button>
            </div>
          </div>
        }
      >
        <div
          ref={stockTableRef}
          onMouseDown={onStockMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`overflow-auto custom-scrollbar max-h-[calc(100vh-350px)] min-h-[400px] relative ${isStockDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
        >
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-20">
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Номенклатура (исходная)
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Профиль
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Марка стали
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Размер
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Длина
                </th>
                <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Тоннаж
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {processedStock.map((row: any, i: number) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group"
                >
                  <td className="px-8 py-3">
                    <div
                      className="max-w-[200px] md:max-w-[300px] truncate font-mono text-[10px] text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                      title={row["Исходная Номенклатура"]}
                    >
                      {row["Исходная Номенклатура"]}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant="outline" className="font-bold border-slate-200">
                      {row["Профиль"]}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100 italic">
                      {row["Марка стали"]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-black bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded border border-emerald-100/50 dark:border-emerald-800/20">
                      Ø {row["Размер"]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Badge variant={row["Длина"] === "НД" ? "info" : "secondary"}>
                      {row["Длина"]}
                    </Badge>
                  </td>
                  <td className="px-8 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-slate-900 dark:text-white font-black text-sm">
                        {parseFloat(row["Конечный остаток тн."] || 0).toFixed(3)}
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
