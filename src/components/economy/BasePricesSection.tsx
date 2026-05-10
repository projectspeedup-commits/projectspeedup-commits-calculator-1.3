
import React from 'react';
import { PriceInput } from '../ui/PriceInput';

interface BasePricesSectionProps {
  scrap: string;
  setScrap: (val: string) => void;
  remnant: string;
  setRemnant: (val: string) => void;
}

export const BasePricesSection: React.FC<BasePricesSectionProps> = ({
  scrap,
  setScrap,
  remnant,
  setRemnant,
}) => {
  return (
    <div className="bg-white dark:bg-[#1A1C19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="text-base font-medium text-[#1A1C19] dark:text-white">
          Базовые цены
        </h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="flex flex-col gap-1">
          <PriceInput
            label="Цена лома (руб/тн)"
            value={scrap}
            onChange={setScrap}
            placeholder="0"
          />
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1 leading-relaxed">
            Учитывается как возвратная стоимость технических
            отходов при расчете калькуляции.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <PriceInput
            label="Цена делового остатка (руб/тн)"
            value={remnant}
            onChange={setRemnant}
            placeholder="0"
          />
          <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1 leading-relaxed">
            Учитывается для годных обрезков, которые могут быть
            использованы в будущем.
          </p>
        </div>
      </div>
    </div>
  );
};
