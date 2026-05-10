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
  const { activeTab, formatCurrency, planFiles, stockFiles, calculationResults, processedStock, processedSupplyPlans, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, matchedDemand, supplyCalculationData, filteredMatchedDemand, filteredTotals, getSupplyNomenclature, handleCopyForSheets, handleExportStock, renderFilesContent, setActiveTab, setSupplySection, productionSection, setProductionSection, isCopied, setIsCopied, stockSearchQuery, setStockSearchQuery, stockStatusFilter, setStockStatusFilter, supplySearchQuery, setSupplySearchQuery, supplyStatusFilter, setSupplyStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, freeStock , isPurchasingMode } = props;
  const { Activity, Plus, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

  return (
    <>
      {activeTab ==="production" && (
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
                {productionSection !=="files" &&
                  productionSection !=="free-stock" &&
                  productionSection !=="calc" &&
                  productionSection !=="stock" &&
                  productionSection !=="supply-plans" &&
                  (() => {
                    const isProdSupplyView =
                      productionSection === "calc-supply" ||
                      productionSection === "supply-plans";
                      
                    // We define metrics for Stock (Stage 2)
                    const stockMetricsItem = {
                      allocated: stockTotals.allocated || 0,
                      deficit: stockTotals.deficit || 0,
                      remaining: stockTotals.remaining || 0,
                      techWaste2: stockTotals.techWaste2 || 0,
                      usefulRem2: stockTotals.usefulRem2 || 0,
                      averageKim: stockTotals.averageKim || 0,
                    };
                    
                    // We define metrics for Supply (Stage 3)
                    const supplyMetricsItem = {
                      allocated: supplyCalculationData.totals.allocatedSupply || 0,
                      deficit: supplyCalculationData.totals.deficit || 0,
                      remaining: supplyCalculationData.totals.remaining || 0,
                      techWaste2: supplyCalculationData.totals.techWaste2 || 0, // from stage 2 calculation in supply run
                      usefulRem2: supplyCalculationData.totals.usefulRem2 || 0,
                      averageKim2: supplyCalculationData.totals.averageKim2 || 0,
                      techWaste3: supplyCalculationData.totals.techWaste3 || 0,
                      usefulRem3: supplyCalculationData.totals.usefulRem3 || 0,
                      averageKim3: supplyCalculationData.totals.averageKim3 || 0,
                    };

                    return (
                      <div className="flex-none min-w-0 w-full xl:w-auto xl:flex-1 relative overflow-hidden">
                        <div
                          ref={summaryContainerRef}
                          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 xl:gap-3 w-full p-1.5 sm:p-2 bg-slate-50/80 dark:bg-[#1A1C19]/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[16px] sm:rounded-[20px] transition-all"
                        >
                          {/* Item 1: Взято (Stock or Supply) */}
                          {!isProdSupplyView ? (
                            <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                              <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                                <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 opacity-80 shrink-0" />
                                <span className="truncate whitespace-nowrap">взято со склада</span>
                              </span>
                              <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                  {stockMetricsItem.allocated.toFixed(3)}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-emerald-600/80 dark:text-emerald-500 font-bold uppercase">тн</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                              <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                                <Package className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 opacity-80 shrink-0" />
                                <span className="truncate whitespace-nowrap">взято плановых:</span>
                              </span>
                              <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                  {supplyMetricsItem.allocated.toFixed(3)}
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-emerald-600/80 dark:text-emerald-500 font-bold uppercase">тн</span>
                              </div>
                            </div>
                          )}

                          {/* Item 2: Дефицит */}
                          <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                            <span className="text-[9px] sm:text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 opacity-80 shrink-0" />
                              <span className="truncate whitespace-nowrap">
                                {isProdSupplyView ? "дефицит пл.:" : "дефицит"}
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400">
                                {(isProdSupplyView ? supplyMetricsItem.deficit : stockMetricsItem.deficit).toFixed(3)}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-rose-600/80 dark:text-rose-500 font-bold uppercase">тн</span>
                            </div>
                          </div>

                          {/* Item 3: Остаток */}
                          <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-sky-50 to-sky-100/30 dark:from-sky-950/40 dark:to-sky-900/10 border border-sky-200/50 dark:border-sky-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                            <span className="text-[9px] sm:text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              {isProdSupplyView ? "остаток плановых:" : "остаток заг."}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
                                {(isProdSupplyView ? supplyMetricsItem.remaining : stockMetricsItem.remaining).toFixed(3)}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-sky-600/80 dark:text-sky-500 font-bold uppercase">тн</span>
                            </div>
                          </div>

                          {/* Item 4: Тех. отходы */}
                          <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                            <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              {isProdSupplyView ? "тех. отходы пл." : "тех. отходы склад"}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
                                {(isProdSupplyView ? supplyMetricsItem.techWaste3 : stockMetricsItem.techWaste2).toFixed(3)}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">тн</span>
                            </div>
                          </div>

                          {/* Item 5: Дел. остатки */}
                          <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                            <span className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              {isProdSupplyView ? "дел. остатки пл." : "дел. остатки склад"}
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">
                                {(isProdSupplyView ? supplyMetricsItem.usefulRem3 : stockMetricsItem.usefulRem2).toFixed(3)}
                              </span>
                              <span className="text-[9px] sm:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">тн</span>
                            </div>
                          </div>

                          {/* Item 6: СР. КИМ */}
                          <div className="flex flex-col min-w-[110px] justify-center px-3 py-2 sm:py-2.5 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-tight truncate">
                                {isProdSupplyView ? "ср. ким пл." : "ср. ким склад"}
                              </span>
                              <span className="text-[8px] bg-white/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 font-bold uppercase shadow-sm">
                                ср.
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span
                                className={`text-lg sm:text-xl font-black transition-colors ${
                                  (isProdSupplyView ? supplyMetricsItem.averageKim3 : stockMetricsItem.averageKim) < 0.98 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                                }`}
                              >
                                {Math.max(
                                  0,
                                  isProdSupplyView ? supplyMetricsItem.averageKim3 : stockMetricsItem.averageKim
                                ).toFixed(3)}
                              </span>
                              <span className="text-[7px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase flex flex-col leading-[1.1] ml-1">
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
              <div className="flex flex-col gap-2 w-full min-w-0 pb-2">
                {/* Row 1 */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1A1C19] p-1.5 rounded-[18px] sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto overflow-hidden">
                  <button
                    onClick={() => setProductionSection("files")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
                      productionSection === "files"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Файлы
                  </button>
                  <button
                    onClick={() => setProductionSection("stock")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
                      productionSection === "stock"
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Наличие
                  </button>
                  <button
                    onClick={() => setProductionSection("supply-plans")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] border border-transparent ${
                      productionSection === "supply-plans"
                        ? "bg-sky-100 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 shadow-sm"
                        : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10"
                    }`}
                  >
                    Планы поставок
                  </button>
                  <button
                    onClick={() => setProductionSection("free-stock")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] border border-transparent ${
                      productionSection === "free-stock"
                        ? "bg-sky-100 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 shadow-sm"
                        : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10"
                    }`}
                  >
                    Свободный остаток заготовки
                  </button>
                </div>

                {/* Row 2 */}
                {productionSection !== "files" && (
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1A1C19] p-1.5 rounded-[18px] sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full overflow-hidden sm:overflow-visible">
                    <button
                      onClick={() => setProductionSection("calc")}
                      className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] ${
                        productionSection === "calc"
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      Портфель заказов
                    </button>
                    <div className="relative group/calc-stock">
                      <button
                        onClick={() => setProductionSection("calc-stock")}
                        className={`relative whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] border border-transparent ${
                          productionSection === "calc-stock"
                            ? "bg-sky-100 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 shadow-sm"
                            : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10"
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
                      onClick={() => setProductionSection("calc-supply")}
                      className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-[0.98] border border-transparent ${
                        productionSection === "calc-supply"
                          ? "bg-sky-100 dark:bg-sky-400/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 shadow-sm"
                          : "text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/10"
                      }`}
                    >
                      Расчет с учетом поставок
                    </button>

                    {(productionSection === "calc-stock" ||
                      productionSection === "calc-supply") && (
                        <button
                          onClick={() => {
                            const currentSearchQuery = productionSection === "calc-stock" ? stockSearchQuery : supplySearchQuery;
                            const itemsToProcess =
                              supplyCalculationData.matchedDemand.filter(
                                (res: any) => {
                                  if (!currentSearchQuery) return true;
                                  const q = currentSearchQuery.toLowerCase();
                                  return (
                                    (res.orderNo || "").toLowerCase().includes(q) ||
                                    (res.client || "").toLowerCase().includes(q) ||
                                    (res.nomenclature || "")
                                      .toLowerCase()
                                      .includes(q) ||
                                    String(res.diameter || "").includes(q)
                                  );
                                }
                              );

                            if (itemsToProcess.length === 0) return;

                            const totalFinalShortage = itemsToProcess.reduce(
                              (sum: number, res: any) => {
                                const shortage =
                                  res.finalShortage > 0 ? res.finalShortage : 0;
                                return sum + shortage;
                              },
                              0
                            );

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
                                  Клиент: res.client || "",
                                  Номенклатура: res.nomenclature || "",
                                  Профиль: res.type || "",
                                  Марка: res.grade || "",
                                  "Размер мм.": Number(res.diameter) || 0,
                                  Длина:
                                    res.lengthType === "НД"
                                      ? "НД"
                                      : `МД ${res.length}`,
                                  "Кол-во тн в заказе": Number(res.weightTons || 0),
                                  "ИТОГО остаток выполнения заказа после расчета / плановое поступление":
                                    res.finalShortage > 0
                                      ? Number(res.finalShortage.toFixed(3))
                                      : 0,
                                };
                              }),
                              {
                                "Внутренний №": "",
                                "Дата Заказа": "",
                                "№ Заказа": "",
                                Клиент: "",
                                Номенклатура: "",
                                Профиль: "",
                                Марка: "",
                                "Размер мм.": "",
                                Длина: "",
                                "Кол-во тн в заказе": "",
                                "ИТОГО остаток выполнения заказа после расчета / плановое поступление":
                                  "ИТОГО:",
                                " Итоговое значение": Number(
                                  totalFinalShortage.toFixed(3)
                                ),
                              },
                            ];

                            const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                            const workbook = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(
                              workbook,
                              worksheet,
                              "Портфель заказов"
                            );
                            XLSX.writeFile(
                              workbook,
                              getTimestampedFilename("Заявка на обеспечение")
                            );
                          }}
                          disabled={supplyCalculationData.matchedDemand.length === 0}
                          className="flex items-center gap-2 px-4 sm:px-6 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] active:scale-[0.97] shrink-0 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Создать заявку на обеспечение
                          </span>
                          <span className="sm:hidden">Создать заявку</span>
                        </button>
                    )}
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {productionSection ==="files" ? (
                  renderFilesContent()
                ) : productionSection ==="stock" ? (
                  <StockSection {...props} />
                ) : productionSection ==="calc" ? (
                  <CalcSection {...props} />
                ) : productionSection ==="calc-stock" ? (
                  <CalcStockSection {...props} 
                    searchQuery={stockSearchQuery} 
                    setSearchQuery={setStockSearchQuery}
                    statusFilter={stockStatusFilter}
                    setStatusFilter={setStockStatusFilter}
                  />
                ) : productionSection ==="free-stock" ? (
                  <FreeStockSection {...props} />
                ) : productionSection ==="calc-supply" ? (
                  <CalcSupplySection {...props} 
                    searchQuery={supplySearchQuery} 
                    setSearchQuery={setSupplySearchQuery}
                    statusFilter={supplyStatusFilter}
                    setStatusFilter={setSupplyStatusFilter}
                  />
                ) : productionSection ==="supply-plans" ? (
                  <SupplyPlansSection {...props} />
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}


    </>
  );
}
