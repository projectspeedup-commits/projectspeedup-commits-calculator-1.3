
import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import { PriceInput } from '../ui/PriceInput';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

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
    <Card 
      id="price-table"
      isPadded={false}
      header={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h3 className="text-base font-bold text-[#1A1C19] dark:text-white uppercase tracking-tight">
            Цены закупки заготовки
          </h3>
          <Input
            placeholder="Поиск марки..."
            value={gradeSearch}
            onChange={(e) => setGradeSearch(e.target.value)}
            leftElement={<Search className="w-4 h-4" />}
            className="h-10 text-xs"
            containerClassName="w-full sm:w-64"
          />
        </div>
      }
    >
      <div className="overflow-x-auto w-full max-h-[60vh] custom-scrollbar">
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
          <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
            <tr>
              <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                Марка стали
              </th>
              <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle">
                Цена (₽ / тн)
              </th>
              <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredGrades.map((grade) => {
              const prices = rawPrices[grade] || { md: "0", nd: "0" };
              return (
                <tr
                  key={grade}
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left">
                    <div className="w-full max-w-[140px] ml-auto">
                      <PriceInput
                        compact
                        value={prices.nd !== undefined ? prices.nd : "0"}
                        onChange={(val) => {
                          handlePriceChange(grade, "nd", val);
                          handlePriceChange(grade, "md", val);
                        }}
                        className="text-right font-black"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveGrade(grade)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
