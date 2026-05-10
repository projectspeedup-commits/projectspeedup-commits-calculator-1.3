
import React from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { PriceInput } from '../ui/PriceInput';
import { EconomyItem } from '../../lib/constants';

interface DirectCostsTableProps {
  directItems: EconomyItem[];
  handleEconomyChange: (id: string, field: string, value: string) => void;
}

export const DirectCostsTable: React.FC<DirectCostsTableProps> = ({
  directItems,
  handleEconomyChange,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 px-1">
        <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Прямые затраты
        </h3>
      </div>

      <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Статья
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                  Норма на тн (руб)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {directItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[160px] ml-auto">
                      <PriceInput
                        compact
                        value={item.norm || "0"}
                        onChange={(val) => handleEconomyChange(item.id, "norm", val)}
                        className="text-right"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
          <Info className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">
            Как это работает?
          </h4>
          <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
            Для <b>Прямых затрат</b> укажите норму расхода
            (абсолютную стоимость) на 1 тонну готовой продукции.
            Калькулятор автоматически вычислит влияние этих цифр
            на рентабельность заказов при расчете в основном
            интерфейсе.
          </p>
        </div>
      </div>
    </div>
  );
};
