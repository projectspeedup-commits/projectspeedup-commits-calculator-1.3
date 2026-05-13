
import {
  EconomyItem,
  DEFAULT_STEEL_GRADES,
} from '../lib/constants';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Check, Search, Plus } from 'lucide-react';
import { DirectCostsTable } from './economy/DirectCostsTable';
import { PricingTable } from './economy/PricingTable';
import { BasePricesSection } from './economy/BasePricesSection';
import { SteelGradesTable } from './economy/SteelGradesTable';
import { useAdminStore } from '../store/useAdminStore';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Badge } from './ui/Badge';

export default function AdminPanelEconomyTab({
  activeTab,
  handleSave,
  saved,
  saveError,
  adminSection,
  setAdminSection,
  formatDate,
  validationErrors
}: any) {
  const store = useAdminStore();
  
  const allGrades = useMemo(() => [
    ...DEFAULT_STEEL_GRADES,
    ...store.customGrades
  ], [store.customGrades]);

  const [gradeSearch, setGradeSearch] = useState("");
  const filteredGrades = allGrades.filter((g: string) => g.toLowerCase().includes(gradeSearch.toLowerCase()));
  const directItems = store.economyItems.filter((i: any) => i.category === "direct");
  
  const [newGrade, setNewGrade] = useState("");

  const RemnantPricingTooltip = () => (
    <div className="group relative inline-block ml-1 align-middle">
      <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help" />
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[#1A1C19] dark:bg-slate-700 text-white text-[10px] rounded-xl shadow-2xl w-60 z-[100] transition-all normal-case font-normal text-left border border-slate-700">
        <div className="font-bold mb-1 border-b border-white/10 pb-1 text-[11px]">
          Типы остатков
        </div>
        <div className="flex flex-col gap-1.5">
          <div><span className="text-emerald-400 font-medium">+ МД:</span> Мерная длина (полная стоимость)</div>
          <div><span className="text-yellow-400 font-medium">+ НД:</span> Немерная длина (по цене НД)</div>
          <div><span className="text-red-400 font-medium">- Короткий:</span> Как деловой отход</div>
        </div>
      </div>
    </div>
  );

  const isEconomyNotSet = useMemo(() => 
    allGrades.every(g => !store.rawPrices[g]?.md || Number(store.rawPrices[g].md) === 0),
    [allGrades, store.rawPrices]
  );

  return (
    <motion.div
      key="economy"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
            Система расчетов 1.3
          </h2>
          <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
            Управление ценами заготовок, марками стали и прямыми затратами.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {saveError && (
            <Badge variant="error" className="px-4 py-2 lowercase h-12 rounded-xl flex items-center">
              {saveError}
            </Badge>
          )}
          <Button
            onClick={handleSave}
            isLoading={store.isSaving}
            variant={saved ? "primary" : "primary"}
            className={saved ? "bg-emerald-500 hover:bg-emerald-600" : ""}
            size="lg"
            leftIcon={saved ? <Check className="w-4 h-4" /> : null}
          >
            {saved ? "Сохранено" : store.isSaving ? "Сохранение..." : "Сохранить всё"}
          </Button>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#1A1C19] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit shadow-sm">
        {(['direct', 'prices', 'grades'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setAdminSection(section)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
              adminSection === section
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 shadow-none border-transparent"
            }`}
          >
            {section === 'direct' ? 'Прямые затраты' : section === 'prices' ? 'Цены' : 'Марки'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {adminSection === "direct" && (
          <motion.div
            key="direct"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <DirectCostsTable directItems={directItems} handleEconomyChange={store.updateEconomyItem} />
          </motion.div>
        )}

        {adminSection === "prices" && (
          <motion.div
            key="prices"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-8"
          >
            {isEconomyNotSet && (
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full -mr-16 -mt-16 blur-2xl font-black text-[120px] pointer-events-none opacity-10">₽</div>
                <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                  <div className="w-16 h-16 shrink-0 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center">
                    <span className="font-black text-2xl text-amber-600 dark:text-amber-500">₽</span>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-400 mb-1">
                      Экономика не настроена!
                    </h3>
                    <p className="text-sm text-amber-800/70 dark:text-amber-400/60 leading-relaxed max-w-xl">
                      Укажите маржинальную стоимость закупки, иначе калькулятор не сможет рассчитать рентабельность ваших сделок.
                    </p>
                  </div>
                  <Button variant="outline" size="md" onClick={() => document.getElementById("price-table")?.scrollIntoView({ behavior: "smooth" })}>
                    Настроить
                  </Button>
                </div>
              </Card>
            )}

            <Card className="flex flex-col sm:flex-row items-end gap-3">
              <Input
                label="Новая марка стали"
                placeholder="Например: 09Г2С"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value.toUpperCase())}
                containerClassName="flex-1"
              />
              <Button
                onClick={() => {
                  store.addCustomGrade(newGrade);
                  setNewGrade("");
                }}
                disabled={!newGrade.trim()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="mb-0.5"
              >
                Добавить
              </Button>
            </Card>

            <PricingTable 
              filteredGrades={filteredGrades}
              rawPrices={store.rawPrices}
              handlePriceChange={store.updatePrice}
              handleRemoveGrade={store.removeGrade}
              gradeSearch={gradeSearch}
              setGradeSearch={setGradeSearch}
            />

            <BasePricesSection 
              scrap={store.scrap}
              setScrap={store.setScrap}
              remnant={store.remnant}
              setRemnant={store.setRemnant}
            />
          </motion.div>
        )}

        {adminSection === "grades" && (
          <motion.div
            key="grades"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            <SteelGradesTable 
              allGrades={allGrades}
              remnantPricing={store.remnantPricing}
              handlePricingChange={store.updateRemnantPricing}
              RemnantPricingTooltip={RemnantPricingTooltip}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
