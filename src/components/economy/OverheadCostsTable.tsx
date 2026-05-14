import React from 'react';
import { Building2, Info, Banknote, HelpCircle } from 'lucide-react';
import { PriceInput } from '../ui/PriceInput';
import { EconomyItem } from '../../lib/constants';
import { Card } from '../ui/Card';

interface OverheadCostsTableProps {
  overheadItems: EconomyItem[];
  handleEconomyChange: (id: string, field: string, value: string) => void;
}

export const OverheadCostsTable: React.FC<OverheadCostsTableProps> = ({
  overheadItems,
  handleEconomyChange,
}) => {
  return (
    <div className="flex flex-col gap-8 mt-8">
      <Card
        isPadded={false}
        header={
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Общепроизводственные / Накладные Расходы
            </h3>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Статья расходов
                </th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Тип
                </th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Норма / Кол-во
                </th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                  Цена / Сумма ( ₽ )
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {overheadItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.type === 'variable' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                      }`}>
                      {item.type === 'variable' ? 'ПЕРЕМЕННАЯ' : 'ПОСТОЯННАЯ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    {item.type === 'variable' ? (
                      <div className="w-full max-w-[120px] ml-auto">
                        <PriceInput
                          compact
                          value={item.norm !== undefined ? item.norm : "0"}
                          onChange={(val) => handleEconomyChange(item.id, "norm", val)}
                          className="text-right font-bold"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-[120px] ml-auto">
                       <PriceInput
                          compact
                          value={item.quantity !== undefined ? item.quantity : "1"}
                          onChange={(val) => handleEconomyChange(item.id, "quantity", val)}
                          className="text-right font-bold"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                     {item.type === 'variable' ? (
                       <div className="text-right text-xs font-bold text-slate-400 pt-2">-</div>
                     ) : (
                      <div className="w-full max-w-[140px] ml-auto">
                        <PriceInput
                          compact
                          value={item.price !== undefined ? item.price : "0"}
                          onChange={(val) => handleEconomyChange(item.id, "price", val)}
                          className="text-right font-black"
                        />
                      </div>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col gap-1.5 text-center sm:text-left">
            <h4 className="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-tight">
              Учет накладных расходов
            </h4>
            <p className="text-xs text-indigo-800/70 dark:text-indigo-400/70 leading-relaxed font-medium">
              Для <b>Переменных</b> расходов укажите стоимость на 1 тонну продукции (в колонке Норма).<br/>
              Для <b>Постоянных</b> расходов (Аренда, З/П) укажите суммарную стоимость (Количество и Сумма). Они будут распределяться на общий вес заказа.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
