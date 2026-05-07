
import {
  DEFAULT_STEEL_GRADES,
  formatInputValue,
  handleNumericInput,
  EconomyItem,
} from '../lib/constants';


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Download, ChevronDown, ChevronRight, Info, Layers, FileArchive, ArrowRightFromLine, Box, ArrowRight, Settings, Calculator, Database, Zap, Clock, Shield, Plus, X, Trash2, ArrowRightCircle, Check, Loader2, ArrowLeftRight, MinusCircle, PlusCircle, AlertCircle, RefreshCw, Archive, CheckCircle2, Factory, BarChart2, TrendingUp, RefreshCcw, DownloadCloud, Trash, CheckCircle } from 'lucide-react';

export default function AdminPanelEconomyTab(props: any) {
  const { handleEconomyChange, allGrades, handleRemoveGrade, setScrap, setRemnant,  activeTab, handleSave, isSaving, saved, economyItems, saveError, rawPrices, handlePriceChange, adminSection, setAdminSection, scrap, remnant, customGrades, remnantPricing, newGrade, setNewGrade, handleAddGrade, deletedGrades, handlePricingChange, formatDate } = props;
  
  const directItems = economyItems.filter((i: any) => i.category === "direct");
  const overheadItems = economyItems.filter((i: any) => i.category === "overhead");

  const RemnantPricingTooltip = () => (
    <div className="group relative inline-block ml-1 align-middle">
      <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help" />
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[#1A1C19] dark:bg-slate-700 text-white text-[10px] rounded-xl shadow-2xl w-60 z-[100] transition-all normal-case font-normal text-left border border-slate-700">
        <div className="font-bold mb-1 border-b border-white/10 pb-1 text-[11px]">
          Типы остатков
        </div>
        <div className="flex flex-col gap-1.5">
          <div><span className="text-emerald-400 font-medium">+ МД:</span> Мерная длина (полная стоимость)</div>
          <div><span className="text-yellow-400 font-medium">+ НД:</span> Немерная длина (скидка {Math.round((1 - Number(remnantPricing.nd.md)) * 100)}%)</div>
          <div><span className="text-red-400 font-medium">- Короткий:</span> Как деловой отход</div>
        </div>
      </div>
    </div>
  );

return (<>
{activeTab === "economy" && (
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
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center justify-center gap-2 px-6 h-12 rounded-2xl text-sm font-bold transition-all shadow-sm ${
                      saved
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800"
                    } ${isSaving ? "opacity-70" : ""}`}
                  >
                    {isSaving
                      ? "Сохранение..."
                      : saved
                        ? "✓ Сохранено"
                        : "Сохранить всё"}
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
                    {/* Direct Variable Costs */}
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2 px-1">
                        <TrendingUp className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                          Прямые затраты
                        </h3>
                      </div>
                      <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                          <table className="w-full text-left min-w-[300px]">
                            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#1A1C19] text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800">
                              <tr>
                                <th className="px-4 sm:px-6 py-4">Статья</th>
                                <th className="px-4 sm:px-6 py-4 text-right">
                                  Норма на тн (руб)
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {directItems.map((item) => (
                                <tr
                                  key={item.id}
                                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                >
                                  <td className="px-4 sm:px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {item.name}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4">
                                    <div className="relative w-full max-w-[140px] sm:max-w-[192px] ml-auto">
                                      <input
                                        type="text"
                                        inputMode="decimal"
                                        value={item.norm}
                                        onChange={(e) =>
                                          handleEconomyChange(
                                            item.id,
                                            "norm",
                                            e.target.value,
                                          )
                                        }
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-0 rounded-xl pl-3 pr-8 sm:pl-4 sm:pr-10 h-11 text-right text-sm font-bold focus:ring-2 focus:ring-slate-400 dark:text-white"
                                      />
                                      <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-xs pointer-events-none">
                                        ₽
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 motion-safe:animate-pulse">
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
                  </motion.div>
                ) : adminSection === "prices" ? (
                  <motion.div
                    key="prices"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex flex-col md:grid md:grid-cols-12 gap-6 w-full">
                      {/* Main settings column */}
                      <div className="col-span-12 flex flex-col gap-6">
                        {/* Empty Economy Warning Badge */}
                        {allGrades.every(
                          (g) =>
                            !rawPrices[g]?.md || Number(rawPrices[g].md) === 0,
                        ) && (
                          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800/30 rounded-[28px] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
                            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                              <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-3xl rotate-6 shadow-sm border border-slate-200 dark:border-slate-700"></div>
                              <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900/40 rounded-3xl -rotate-6"></div>
                              <div className="font-black text-3xl text-amber-500/80 dark:text-amber-500/50 z-10 font-sans leading-none tracking-tighter">
                                ₽
                              </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-500 mb-2">
                                Экономика не настроена!
                              </h3>
                              <p className="text-sm text-amber-800 dark:text-amber-400/80 leading-relaxed max-w-xl">
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
                              className="px-6 py-3 bg-white dark:bg-amber-500/10 hover:bg-amber-50 dark:hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 font-bold rounded-xl whitespace-nowrap transition-all shadow-sm active:mt-[1px]"
                            >
                              Настроить ценообразование
                            </button>
                          </div>
                        )}

                        {/* Pricing table */}
                        <div
                          id="price-table"
                          className="bg-white dark:bg-[#1A1C19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors"
                        >
                          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-base font-medium text-[#1A1C19] dark:text-white">
                              Цены заготовки
                            </h3>
                          </div>
                          <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar p-0 m-0">
                            <div className="inline-block min-w-full align-middle">
                              <table className="w-full text-left whitespace-nowrap">
                                <thead className="sticky top-0 z-20 text-[#43483F] dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1A1C19] shadow-sm">
                                  <tr>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">
                                      Марка стали
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-right">
                                      Цена МД (руб/тн)
                                    </th>
                                    <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-right">
                                      Цена НД (руб/тн)
                                    </th>
                                    <th className="px-4 py-3 w-12"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                  {allGrades.map((grade) => {
                                    const prices = rawPrices[grade] || {
                                      md: "",
                                      nd: "",
                                    };

                                    return (
                                      <tr
                                        key={grade}
                                        className="bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                      >
                                        <td className="px-6 py-4 font-medium text-[#1A1C19] dark:text-slate-100 text-sm">
                                          {grade}
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="relative w-[110px] sm:w-[130px] ml-auto">
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              placeholder="0"
                                              value={formatInputValue(
                                                prices.md,
                                              )}
                                              onChange={(e) =>
                                                handlePriceChange(
                                                  grade,
                                                  "md",
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-800 dark:focus:border-slate-400 focus:outline-none text-right text-sm font-bold h-9 pl-1 pr-1 dark:text-white placeholder:text-slate-400"
                                            />
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <div className="relative w-[110px] sm:w-[130px] ml-auto">
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              placeholder="0"
                                              value={formatInputValue(
                                                prices.nd,
                                              )}
                                              onChange={(e) =>
                                                handlePriceChange(
                                                  grade,
                                                  "nd",
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-slate-800 dark:focus:border-slate-400 focus:outline-none text-right text-sm font-bold h-9 pl-1 pr-1 dark:text-white placeholder:text-slate-400"
                                            />
                                          </div>
                                        </td>
                                        <td className="px-4 py-4 text-center align-middle">
                                          <button
                                            onClick={() =>
                                              handleRemoveGrade(grade)
                                            }
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
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
                        </div>

                        {/* Base prices */}
                        <div className="bg-white dark:bg-[#1A1C19] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
                          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-base font-medium text-[#1A1C19] dark:text-white">
                              Базовые цены
                            </h3>
                          </div>
                          <div className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Цена лома (руб/тн)
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0"
                                  value={formatInputValue(scrap)}
                                  onChange={(e) =>
                                    handleNumericInput(e, setScrap)
                                  }
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 h-12 text-lg font-bold focus:ring-2 focus:ring-slate-400 dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                  ₽
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2">
                                Учитывается как возвратная стоимость технических
                                отходов
                              </p>
                            </div>

                            <div className="flex-1">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Цена делового остатка (руб/тн)
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  placeholder="0"
                                  value={formatInputValue(remnant)}
                                  onChange={(e) =>
                                    handleNumericInput(e, setRemnant)
                                  }
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-4 h-12 text-lg font-bold focus:ring-2 focus:ring-slate-400 dark:text-white"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                                  ₽
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 mt-2">
                                Учитывается для годных обрезков
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="grades"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="flex flex-col gap-4 mt-4">
                      <div className="flex items-center gap-2 px-1">
                        <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                          Параметры марок стали
                        </h3>
                      </div>
                      <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto overflow-y-auto max-h-[60vh] custom-scrollbar">
                          <table className="w-full text-left min-w-[400px]">
                            <thead className="sticky top-0 z-20 bg-slate-50 dark:bg-[#1A1C19] text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800">
                              <tr>
                                <th className="px-4 sm:px-6 py-4">
                                  Марка стали
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center">
                                  Политика (Круг) <RemnantPricingTooltip />
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-center">
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
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                                  >
                                    <td className="px-4 sm:px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                                      {grade}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                      <select
                                        value={pricing.round}
                                        onChange={(e) =>
                                          handlePricingChange(
                                            grade,
                                            "round",
                                            e.target.value,
                                          )
                                        }
                                        className={`bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-2 sm:px-4 py-2.5 outline-none appearance-none cursor-pointer w-[120px] sm:w-[160px] mx-auto block border-0 focus:ring-2 focus:ring-slate-400 ${
                                          pricing.round === "scrap"
                                            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                            : "text-slate-900 dark:text-white"
                                        }`}
                                      >
                                        <option value="remnant">
                                          Деловой остаток
                                        </option>
                                        <option value="scrap">
                                          По цене лома
                                        </option>
                                      </select>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4">
                                      <select
                                        value={pricing.hex}
                                        onChange={(e) =>
                                          handlePricingChange(
                                            grade,
                                            "hex",
                                            e.target.value,
                                          )
                                        }
                                        className={`bg-slate-50 dark:bg-slate-800 text-xs font-bold rounded-xl px-2 sm:px-4 py-2.5 outline-none appearance-none cursor-pointer w-[120px] sm:w-[160px] mx-auto block border-0 focus:ring-2 focus:ring-slate-400 ${
                                          pricing.hex === "scrap"
                                            ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                            : "text-slate-900 dark:text-white"
                                        }`}
                                      >
                                        <option value="remnant">
                                          Деловой остаток
                                        </option>
                                        <option value="scrap">
                                          По цене лома
                                        </option>
                                      </select>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}


</>);
}