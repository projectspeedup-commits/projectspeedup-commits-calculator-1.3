import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Calendar, Truck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function SupplyPlansSection(props: any) {
  const { processedSupplyPlans } = props;
  
  const totalAmount = processedSupplyPlans.reduce(
    (sum: number, row: any) => sum + (Number(row["Кол-во"]) || 0),
    0,
  );

  return (
    <motion.div
      key="supply-plans"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <Card
        isPadded={false}
        header={
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight shrink-0">
                Планы поставок сырья
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {processedSupplyPlans.length} позиций
                </Badge>
                <Badge variant="success" className="text-[12px] font-black py-1 px-4">
                  Итого: {totalAmount.toFixed(3)} тн.
                </Badge>
              </div>
            </div>
          </div>
        }
      >
        <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-350px)] min-h-[400px] relative cursor-auto">
          {processedSupplyPlans.length > 0 ? (
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Профиль</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Марка</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Размер</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Кол-во (тн)</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Длина</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Размещено</th>
                  <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Поставка</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Поставщик</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {processedSupplyPlans.map((row: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group text-[11px]"
                  >
                    <td className="px-5 py-3">
                      <Badge variant="outline" className="font-bold border-slate-200">
                        {row["Профиль"]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-center font-black text-slate-700 dark:text-slate-200 italic">
                      {row["Марка"]}
                    </td>
                    <td className="px-5 py-3 text-center font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded border border-sky-100/50">
                      Ø {row["Размер"]}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-black text-slate-900 dark:text-white leading-none">
                          {row["Кол-во"]?.toFixed(3)}
                        </span>
                        <span className="text-[8px] text-slate-400 font-black uppercase mt-0.5">тонн</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Badge variant="secondary" className="font-black">
                        {row["Длина"]}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500 dark:text-slate-400 font-mono">
                      {row["Дата размещения"]}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded border border-emerald-100/50">
                        <Calendar className="w-3 h-3" />
                        {row["Ожидаемая дата поставки"]}
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-[150px]">
                      <div className="flex items-center gap-2 truncate" title={row["Поставщик"]}>
                        <Truck className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate font-bold text-slate-600 dark:text-slate-400">{row["Поставщик"]}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4 bg-slate-50/30 dark:bg-black/10">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-3xl rotate-6 mix-blend-multiply opacity-50"></div>
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl -rotate-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-md">
                  <ShoppingCart className="w-8 h-8 text-slate-300" />
                </div>
              </div>
              <h5 className="text-slate-900 dark:text-white font-black uppercase tracking-tight mb-1">
                Данные не загружены
              </h5>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-[200px]">
                Пожалуйста, загрузите реестр планов поставок в разделе «Файлы»
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
