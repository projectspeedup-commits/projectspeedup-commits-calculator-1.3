
import {
  EconomyItem,
} from '../lib/constants';


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Loader2, Check, Search } from 'lucide-react';
import { DirectCostsTable } from './economy/DirectCostsTable';
import { PricingTable } from './economy/PricingTable';
import { BasePricesSection } from './economy/BasePricesSection';
import { SteelGradesTable } from './economy/SteelGradesTable';

export default function AdminPanelEconomyTab(props: any) {
  const { handleEconomyChange, allGrades, handleRemoveGrade, setScrap, setRemnant,  activeTab, handleSave, isSaving, saved, economyItems, saveError, rawPrices, handlePriceChange, adminSection, setAdminSection, scrap, remnant, customGrades, remnantPricing, newGrade, setNewGrade, handleAddGrade, deletedGrades, handlePricingChange, formatDate } = props;
  
  const [gradeSearch, setGradeSearch] = useState("");
  const filteredGrades = allGrades.filter((g: string) => g.toLowerCase().includes(gradeSearch.toLowerCase()));
  const directItems = economyItems.filter((i: any) => i.category === "direct");

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

return (<>
            <motion.div
              key="economy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
                    Экономика производства
                  </h2>
                  <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
                    Управление ценами заготовок, марками стали и прямыми
                    затратами.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {saveError && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs font-bold text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-800"
                    >
                      {saveError}
                    </motion.div>
                  )}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-6 h-12 rounded-2xl text-sm font-bold transition-all shadow-sm ${
                      saved
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800"
                    } ${isSaving ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Сохранение...</span>
                      </>
                    ) : saved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Сохранено</span>
                      </>
                    ) : (
                      "Сохранить всё"
                    )}
                  </button>
                </div>
              </div>

              {/* Sub-navigation */}
              <div className="flex items-center gap-1 bg-white dark:bg-[#1A1C19] p-1 rounded-2xl border border-slate-200 dark:border-slate-800 w-fit">
                <button
                  onClick={() => setAdminSection("direct")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    adminSection === "direct"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Прямые затраты
                </button>
                <button
                  onClick={() => setAdminSection("prices")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    adminSection === "prices"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Цены
                </button>
                <button
                  onClick={() => setAdminSection("grades")}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    adminSection === "grades"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  Марки
                </button>
              </div>

              <AnimatePresence mode="wait">
                {adminSection === "direct" ? (
                  <motion.div
                    key="direct"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-8"
                  >
                    <DirectCostsTable 
                      directItems={directItems} 
                      handleEconomyChange={handleEconomyChange} 
                    />
                  </motion.div>
                ) : adminSection === "prices" ? (
                  <motion.div
                    key="prices"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col gap-8">
                      {/* Empty Economy Warning Badge */}
                      {allGrades.every(
                        (g) =>
                          !rawPrices[g]?.md || Number(rawPrices[g].md) === 0,
                      ) && (
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200/50 dark:border-amber-800/30 rounded-[28px] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 dark:bg-amber-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl rotate-6 shadow-sm border border-slate-200 dark:border-slate-700"></div>
                            <div className="absolute inset-0 bg-amber-100 dark:bg-amber-500/20 rounded-3xl -rotate-6"></div>
                            <div className="font-black text-3xl text-amber-600 dark:text-amber-500 z-10 font-sans tracking-tighter">
                              ₽
                            </div>
                          </div>
                          <div className="flex-1 text-center sm:text-left z-10">
                            <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 mb-2">
                              Экономика не настроена!
                            </h3>
                            <p className="text-sm text-amber-800/70 dark:text-amber-400/60 leading-relaxed max-w-xl">
                              Укажите маржинальную стоимость закупки, исходя
                              из желаемой цены продажи, иначе калькулятор не
                              сможет рассчитать рентабельность ваших сделок.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              document
                                .getElementById("price-table")
                                ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="px-6 py-3 bg-white dark:bg-amber-500/10 hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 font-bold rounded-xl whitespace-nowrap transition-all shadow-sm active:translate-y-[1px] z-10"
                          >
                            Настроить
                          </button>
                        </div>
                      )}

                      <PricingTable 
                        filteredGrades={filteredGrades}
                        rawPrices={rawPrices}
                        handlePriceChange={handlePriceChange}
                        handleRemoveGrade={handleRemoveGrade}
                        gradeSearch={gradeSearch}
                        setGradeSearch={setGradeSearch}
                      />

                      <BasePricesSection 
                        scrap={scrap}
                        setScrap={setScrap}
                        remnant={remnant}
                        setRemnant={setRemnant}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grades"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SteelGradesTable 
                      allGrades={allGrades}
                      remnantPricing={remnantPricing}
                      handlePricingChange={handlePricingChange}
                      RemnantPricingTooltip={RemnantPricingTooltip}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>


</>);
}