import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx-js-style';
import * as LucideIcons from 'lucide-react';
import { getGostForGrade } from '../lib/constants';
import { getTimestampedFilename } from '../lib/utils';
import { BatchManualModal } from './BatchManualModal';
import { StockManualModal } from './StockManualModal';
import { StockSection } from './production/StockSection';
import { CalcSection } from './production/CalcSection';
import { CalcStockSection } from './production/CalcStockSection';
import { FreeStockSection } from './production/FreeStockSection';
import { CalcSupplySection } from './production/CalcSupplySection';
import { SupplyPlansSection } from './production/SupplyPlansSection';

export default function AdminPanelProductionTab(props: any) {
  const { activeTab, formatCurrency, planFiles, stockFiles, calculationResults, processedStock, processedSupplyPlans, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, matchedDemand, supplyCalculationData, filteredMatchedDemand, filteredTotals, getSupplyNomenclature, handleCopyForSheets, handleExportStock, renderFilesContent, setActiveTab, setSupplySection, productionSection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, freeStock , isPurchasingMode } = props;
  const { Activity, Plus, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

  return (
    <>
      {activeTab === "production" && (
            <motion.div
              key="production"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
                    Производство
                  </h2>
                  <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
                    Управление заказами на производство, план-графиками и расчет
                    потребности.
                  </p>
                </div>
                {productionSection !== "files" &&
                  productionSection !== "free-stock" &&
                  productionSection !== "calc" &&
                  productionSection !== "stock" &&
                  productionSection !== "supply-plans" &&
                  (() => {
                    const isProdSupplyView =
                      productionSection === "calc-supply" ||
                      productionSection === "supply-plans";
                    const activeDashboardTotals = {
                      allocated: isProdSupplyView
                        ? supplyCalculationData.totals.allocated || 0
                        : stockTotals.allocated || 0,
                      deficit: isProdSupplyView
                        ? supplyCalculationData.totals.deficit || 0
                        : stockTotals.deficit || 0,
                      remaining: isProdSupplyView
                        ? supplyCalculationData.totals.remaining || 0
                        : stockTotals.remaining || 0,
                      techWaste2: isProdSupplyView
                        ? supplyCalculationData.totals.techWaste2 || 0
                        : stockTotals.techWaste2 || 0,
                      usefulRem2: isProdSupplyView
                        ? supplyCalculationData.totals.usefulRem2 || 0
                        : stockTotals.usefulRem2 || 0,
                      averageKim: isProdSupplyView
                        ? supplyCalculationData.totals.averageKim || 0
                        : stockTotals.averageKim || 0,
                    };
                    return (
                      <div className="flex-none min-w-0 xl:max-w-4xl w-full md:w-auto relative overflow-hidden">
                        <div
                          ref={summaryContainerRef}
                          onMouseDown={onSummaryMouseDown}
                          onMouseUp={onSummaryMouseLeaveOrUp}
                          onMouseLeave={onSummaryMouseLeaveOrUp}
                          onMouseMove={handleMouseMove}
                          className={`flex items-stretch xl:items-center gap-2 sm:gap-3 xl:gap-4 w-full p-2 bg-slate-50/80 dark:bg-[#1A1C19]/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[20px] overflow-x-auto xl:overflow-x-visible xl:justify-around hide-scrollbar snap-x snap-mandatory xl:snap-none transition-all ${
                            isSummaryDragging
                              ? "cursor-grabbing select-none scroll-auto"
                              : "cursor-grab xl:cursor-default scroll-smooth"
                          }`}
                        >
                          {/* Item 1: Взято из заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                взято из заг.
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                {activeDashboardTotals.allocated.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600/80 dark:text-emerald-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 2: Дефицит */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                дефицит
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-rose-600 dark:text-rose-400">
                                {activeDashboardTotals.deficit.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-rose-600/80 dark:text-rose-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 3: Остаток заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-sky-50 to-sky-100/30 dark:from-sky-950/40 dark:to-sky-900/10 border border-sky-200/50 dark:border-sky-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              остаток заг.
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.remaining.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-sky-600/80 dark:text-sky-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 4: Тех. отходы 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              тех. отходы 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.techWaste2.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 5: Дел. остатки 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              дел. остатки 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.usefulRem2.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 6: СР. КИМ 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-tight truncate">
                                ср. ким 2
                              </span>
                              <span className="text-[9px] sm:text-[10px] xl:text-[8px] bg-white/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 font-bold uppercase shadow-sm">
                                ср.
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black transition-colors ${activeDashboardTotals.averageKim < 0.98 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                              >
                                {Math.max(
                                  0,
                                  activeDashboardTotals.averageKim || 0,
                                ).toFixed(3)}
                              </span>
                              <span className="text-[7px] sm:text-[8px] xl:text-[6px] 2xl:text-[7px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase flex flex-col leading-[1.1] ml-1">
                                <span>цель</span>
                                <span className="text-emerald-500/70 dark:text-emerald-500/50">
                                  ≥ 0.980
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </div>

              {/* Sub-navigation for Supply */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full min-w-0 pb-2">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1A1C19] p-1.5 rounded-[18px] sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full xl:w-fit shrink-0 overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setProductionSection("files")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      productionSection === "files"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Файлы
                  </button>
                  <button
                    onClick={() => setProductionSection("calc")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      productionSection === "calc"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Портфель заказов
                  </button>
                  <button
                    onClick={() => setProductionSection("stock")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      productionSection === "stock"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Наличие
                  </button>
                  <div className="relative group/calc-stock">
                    <button
                      onClick={() => setProductionSection("calc-stock")}
                      className={`relative whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-transparent ${
                        productionSection === "calc-stock"
                          ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50"
                          : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10"
                      }`}
                    >
                      Расчет с учетом наличия
                      {planFiles.length > 0 &&
                        stockFiles.length > 0 &&
                        productionSection !== "calc-stock" && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white dark:border-[#1A1C19]"></span>
                          </span>
                        )}
                    </button>
                    {/* Tooltip */}
                    {planFiles.length > 0 &&
                      stockFiles.length > 0 &&
                      productionSection !== "calc-stock" && (
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium px-3 py-2 rounded-lg shadow-xl w-64 text-center opacity-0 group-hover/calc-stock:opacity-100 transition-opacity z-50 pointer-events-none">
                          Кликните сюда: система сопоставит ваши заказы со
                          складом и покажет итоговый Дефицит (объем к закупке).
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                      )}
                  </div>
                  <button
                    onClick={() => setProductionSection("free-stock")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-transparent ${
                      productionSection === "free-stock"
                        ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50"
                        : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10"
                    }`}
                  >
                    Свободный остаток заготовки
                  </button>
                  <button
                    onClick={() => setProductionSection("supply-plans")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-transparent ${
                      productionSection === "supply-plans"
                        ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50"
                        : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10"
                    }`}
                  >
                    Планы поставок
                  </button>
                  <button
                    onClick={() => setProductionSection("calc-supply")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border border-transparent ${
                      productionSection === "calc-supply"
                        ? "bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50"
                        : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/10"
                    }`}
                  >
                    Расчет с учетом поставок
                  </button>
                </div>
                {activeTab === "production" &&
                  (productionSection === "calc-stock" ||
                    productionSection === "calc-supply") && (
                    <button
                      onClick={() => {
                        const itemsToProcess =
                          supplyCalculationData.matchedDemand.filter((res: any) => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            return (
                              (res.orderNo || "").toLowerCase().includes(q) ||
                              (res.client || "").toLowerCase().includes(q) ||
                              (res.nomenclature || "").toLowerCase().includes(q) ||
                              String(res.diameter || "").includes(q)
                            );
                          });

                        if (itemsToProcess.length === 0) return;

                        const totalFinalShortage = itemsToProcess.reduce((sum: number, res: any) => {
                            const shortage = res.finalShortage > 0 ? res.finalShortage : 0;
                            return sum + shortage;
                        }, 0);
                        const totalWeightTons = itemsToProcess.reduce((sum: number, res: any) => sum + (Number(res.weightTons) || 0), 0);

                        const worksheetData = [
                          ...itemsToProcess.map((res: any) => {
                             return {
                                "Внутренний №": res.internalNo || "",
                                "Дата Заказа": res.shippingDate 
                                    ? new Date(
                                        parseInt(res.shippingDate.split(".")[2]), 
                                        parseInt(res.shippingDate.split(".")[1]) - 1, 
                                        parseInt(res.shippingDate.split(".")[0])
                                      ) 
                                    : "",
                                "№ Заказа": res.orderNo || "",
                                "Клиент": res.client || "",
                                "Номенклатура": res.nomenclature || "",
                                "Профиль": res.type || "",
                                "Марка": res.grade || "",
                                "Размер мм.": Number(res.diameter) || 0,
                                "Длина": res.lengthType === "НД" ? "НД" : `МД ${res.length}`,
                                "Кол-во тн в заказе": Number(res.weightTons || 0),
                                "ИТОГО остаток выполнения заказа после расчета / плановое поступление": res.finalShortage > 0 ? Number(res.finalShortage.toFixed(3)) : 0,
                              };
                          }),
                          {
                            "Внутренний №": "",
                            "Дата Заказа": "",
                            "№ Заказа": "",
                            "Клиент": "",
                            "Номенклатура": "",
                            "Профиль": "",
                            "Марка": "",
                            "Размер мм.": "",
                            "Длина": "",
                            "Кол-во тн в заказе": "",
                            "ИТОГО остаток выполнения заказа после расчета / плановое поступление": "ИТОГО:",
                            " Итоговое значение": Number(totalFinalShortage.toFixed(3)),
                          }
                        ];

                        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(
                            workbook,
                            worksheet,
                            "Портфель заказов"
                        );
                        XLSX.writeFile(workbook, getTimestampedFilename("Заявка на обеспечение"));
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)] active:scale-[0.98] shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      Создать заявку на обеспечение
                    </button>
                  )}
              </div>

              <AnimatePresence mode="wait">
                {productionSection === "files" ? (
                  renderFilesContent()
                ) : productionSection === "stock" ? (
                  <StockSection {...props} />
                ) : productionSection === "calc" ? (
                  <CalcSection {...props} />
                ) : productionSection === "calc-stock" ? (
                  <CalcStockSection {...props} />
                ) : productionSection === "free-stock" ? (
                  <FreeStockSection {...props} />
                ) : productionSection === "calc-supply" ? (
                  <CalcSupplySection {...props} />
                ) : productionSection === "supply-plans" ? (
                  <SupplyPlansSection {...props} />
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}


    </>
  );
}
