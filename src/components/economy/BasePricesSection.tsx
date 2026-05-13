
import React from 'react';
import { PriceInput } from '../ui/PriceInput';
import { Card } from '../ui/Card';

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
    <Card 
      header={
        <h3 className="text-base font-bold text-[#1A1C19] dark:text-white uppercase tracking-tight">
          Базовые цены возврата
        </h3>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="flex flex-col gap-1">
          <PriceInput
            label="Цена лома (₽ / тн)"
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
            label="Цена делового остатка (₽ / тн)"
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
    </Card>
  );
};
