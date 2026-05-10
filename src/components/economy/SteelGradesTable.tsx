
import React from 'react';
import { Layers, Info } from 'lucide-react';

interface SteelGradesTableProps {
  allGrades: string[];
  remnantPricing: Record<string, { round: string; hex: string }>;
  handlePricingChange: (grade: string, type: "round" | "hex", value: string) => void;
  RemnantPricingTooltip: React.FC;
}

export const SteelGradesTable: React.FC<SteelGradesTableProps> = ({
  allGrades,
  remnantPricing,
  handlePricingChange,
  RemnantPricingTooltip,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 px-1">
        <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
          Параметры марок стали
        </h3>
      </div>

      <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Марка стали
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
                  Политика (Круг) <RemnantPricingTooltip />
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">
                  Политика (Ш-гр) <RemnantPricingTooltip />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {allGrades.map((grade) => {
                const pricing = remnantPricing[grade] || {
                  round: "remnant",
                  hex: "remnant",
                };
                return (
                  <tr
                    key={grade}
                    className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">
                        {grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <select
                          value={pricing.round}
                          onChange={(e) =>
                            handlePricingChange(grade, "round", e.target.value)
                          }
                          className={`
                            text-[11px] font-bold rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer tracking-tight transition-all
                            border border-transparent focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50
                            ${
                              pricing.round === "scrap"
                                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-100 dark:border-red-900/10"
                                : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
                            }
                          `}
                        >
                          <option value="remnant">Деловой остаток</option>
                          <option value="scrap">По цене лома</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <select
                          value={pricing.hex}
                          onChange={(e) =>
                            handlePricingChange(grade, "hex", e.target.value)
                          }
                          className={`
                            text-[11px] font-bold rounded-lg px-3 py-2 outline-none appearance-none cursor-pointer tracking-tight transition-all
                            border border-transparent focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/50
                            ${
                              pricing.hex === "scrap"
                                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-red-100 dark:border-red-900/10"
                                : "text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-800"
                            }
                          `}
                        >
                          <option value="remnant">Деловой остаток</option>
                          <option value="scrap">По цене лома</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
