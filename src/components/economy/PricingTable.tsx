
import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { PriceInput } from '../ui/PriceInput';

interface PricingTableProps {
  filteredGrades: string[];
  rawPrices: Record<string, { md: string; nd: string }>;
  handlePriceChange: (grade: string, field: string, value: string) => void;
  handleRemoveGrade: (grade: string) => void;
  gradeSearch: string;
  setGradeSearch: (val: string) => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({
  filteredGrades,
  rawPrices,
  handlePriceChange,
  handleRemoveGrade,
  gradeSearch,
  setGradeSearch,
}) => {
  return (
    <div className="bg-white dark:bg-[#1A1C19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-base font-medium text-[#1A1C19] dark:text-white shrink-0">
          Цены заготовки
        </h3>
        <div className="relative w-full sm:w-64 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
          <input
            type="text"
            placeholder="Поиск по марке..."
            value={gradeSearch}
            onChange={(e) => setGradeSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-all shadow-sm focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50"
          />
        </div>
      </div>

      <div className="overflow-x-auto max-h-[60vh] custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-20 bg-white dark:bg-[#1A1C19] border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Марка стали
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                Цена НД (руб/тн)
              </th>
              <th className="px-6 py-4 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGrades.map((grade) => {
              const prices = rawPrices[grade] || { md: "0", nd: "0" };
              return (
                <tr
                  key={grade}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1A1C19] dark:text-slate-100">
                      {grade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[140px] ml-auto">
                      <PriceInput
                        compact
                        value={prices.nd}
                        onChange={(val) => handlePriceChange(grade, "nd", val)}
                        className="text-right"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemoveGrade(grade)}
                      className="text-slate-300 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Удалить марку"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
