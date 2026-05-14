
import React from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { PriceInput } from '../ui/PriceInput';
import { EconomyItem } from '../../lib/constants';
import { Card } from '../ui/Card';

interface DirectCostsTableProps {
  directItems: EconomyItem[];
  handleEconomyChange: (id: string, field: string, value: string) => void;
}

export const DirectCostsTable: React.FC<DirectCostsTableProps> = ({
  directItems,
  handleEconomyChange,
}) => {
  return (
    <div className="flex flex-col gap-8">
      <Card
        isPadded={false}
        header={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Статьи прямых затрат
            </h3>
          </div>
        }
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Статья расходов
                </th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Норма на тн ( ₽ )
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {directItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    <div className="w-full max-w-[160px] ml-auto">
                      <PriceInput
                        compact
                        value={item.norm !== undefined ? item.norm : "0"}
                        onChange={(val) => handleEconomyChange(item.id, "norm", val)}
                        className="text-right font-black"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-blue-50/30 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <Info className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h4 className="text-sm font-black text-blue-900 dark:text-blue-300 uppercase tracking-tight">
              Методология расчёта
            </h4>
            <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed font-medium">
              Для <b>Прямых затрат</b> укажите норму расхода
              (абсолютную стоимость) на 1 тонну готовой продукции.
              Калькулятор автоматически вычислит влияние этих цифр
              на рентабельность заказов при расчете в основном
              интерфейсе.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
