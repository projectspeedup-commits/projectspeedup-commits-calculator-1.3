import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx-js-style';
import { Package, ShoppingCart, Plus, Search, Layers, ClipboardList, Info, FileText, Activity, Upload, Download, Copy, Check, Filter, FolderSearch, ArrowRight, HelpCircle } from 'lucide-react';
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
import { useAdminStore } from '../store/useAdminStore';
import { Button } from './ui/Button';
import { MetricCard } from './ui/MetricCard';
import { Card } from './ui/Card';

export default function AdminPanelProductionTab(props: any) {
  const {
    activeTab,
    formatCurrency,
    planFiles,
    stockFiles,
    tableContainerRef,
    summaryContainerRef,
    supplyTableRef,
    stockTableRef,
    freeStockTableRef,
    handleMouseDown,
    onSummaryMouseDown,
    onSupplyMouseDown,
    onStockMouseDown,
    onFreeStockMouseDown,
    handleMouseLeaveOrUp,
    onSummaryMouseLeaveOrUp,
    handleMouseMove,
    matchedDemand,
    supplyCalculationData,
    filteredMatchedDemand,
    filteredSupplyMatchedDemand,
    filteredTotals,
    filteredSupplyTotals,
    getSupplyNomenclature,
    handleCopyForSheets,
    handleExportStock,
    renderFilesContent,
    setActiveTab,
    setSupplySection,
    productionSection,
    setProductionSection,
    isCopied,
    setIsCopied,
    stockSearchQuery,
    setStockSearchQuery,
    stockStatusFilter,
    setStockStatusFilter,
    supplySearchQuery,
    setSupplySearchQuery,
    supplyStatusFilter,
    setSupplyStatusFilter,
    isDragging,
    isSummaryDragging,
    isSupplyDragging,
    isStockDragging,
    isFreeStockDragging,
    copySuccess,
    setCopySuccess,
    stockTotals,
    freeStock,
    isPurchasingMode
  } = props;
  const store = useAdminStore();

  // Use values from store instead of props where possible
  const calculationResults = activeTab === "production" ? store.calcResultsProd : store.calcResultsSup;
  const processedStock = activeTab === "production" ? store.processedStockProd : store.processedStockSup;
  const processedSupplyPlans = activeTab === "production" ? store.processedSupplyPlansProd : store.processedSupplyPlansSup;
  const isProcessing = store.isProcessing;

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
              <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-6">
                <div className="shrink-0">
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
                      <div className="flex-none min-w-0 w-full 2xl:w-auto 2xl:flex-1 max-w-full">
                        <div
                          ref={summaryContainerRef}
                          className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 w-full p-2 bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-x-auto custom-scrollbar"
                        >
                          <MetricCard
                            label={isProdSupplyView ? "Взято плановых" : "Взято со склада"}
                            value={(isProdSupplyView ? supplyMetricsItem.allocated : stockMetricsItem.allocated).toFixed(3)}
                            icon={Package}
                            variant="emerald"
                          />
                          
                          <MetricCard
                            label={isProdSupplyView ? "Дефицит пл." : "Дефицит"}
                            value={(isProdSupplyView ? supplyMetricsItem.deficit : stockMetricsItem.deficit).toFixed(3)}
                            icon={ShoppingCart}
                            variant="rose"
                          />

                          <MetricCard
                            label={isProdSupplyView ? "Остаток пл." : "Остаток заг."}
                            value={(isProdSupplyView ? supplyMetricsItem.remaining : stockMetricsItem.remaining).toFixed(3)}
                            variant="sky"
                          />

                          <MetricCard
                            label={isProdSupplyView ? "Тех. отходы пл." : "Тех. отходы склад"}
                            value={(isProdSupplyView ? supplyMetricsItem.techWaste3 : stockMetricsItem.techWaste2).toFixed(3)}
                            variant="amber"
                          />

                          <MetricCard
                            label={isProdSupplyView ? "Дел. остатки пл." : "Дел. остатки склад"}
                            value={(isProdSupplyView ? supplyMetricsItem.usefulRem3 : stockMetricsItem.usefulRem2).toFixed(3)}
                            variant="amber"
                          />

                          <MetricCard
                            label={isProdSupplyView ? "Ср. КИМ пл." : "Ср. КИМ склад"}
                            value={Math.max(0, isProdSupplyView ? supplyMetricsItem.averageKim3 : stockMetricsItem.averageKim).toFixed(3)}
                            unit=""
                            variant={(isProdSupplyView ? supplyMetricsItem.averageKim3 : stockMetricsItem.averageKim) < 0.98 ? "amber" : "emerald"}
                            target="≥ 0.980"
                          />
                        </div>
                      </div>
                    );
                  })()}
              </div>

              {/* Sub-navigation for Supply */}
              <div className="flex flex-col gap-3 w-full min-w-0 pb-2">
                <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#1A1C19] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto shadow-sm">
                  {[
                    { id: "files", label: "Файлы", icon: FileText },
                    { id: "stock", label: "Наличие", icon: Package },
                    { id: "supply-plans", label: "Планы поставок", icon: ClipboardList },
                    { id: "free-stock", label: "Свободный остаток", icon: Layers },
                  ].map((btn) => (
                    <Button
                      key={btn.id}
                      variant={productionSection === btn.id ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setProductionSection(btn.id)}
                      className="font-bold text-xs"
                      leftIcon={<btn.icon className="w-4 h-4" />}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>

                {productionSection !== "files" && (
                  <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-[#1A1C19] p-2 rounded-2xl border border-slate-200 dark:border-slate-800 w-full shadow-sm">
                    <Button
                      variant={productionSection === "calc" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setProductionSection("calc")}
                      className="font-bold text-xs"
                      leftIcon={<Search className="w-4 h-4" />}
                    >
                      Портфель заказов
                    </Button>
                    
                    <div className="relative group/calc-stock">
                      <Button
                        variant={productionSection === "calc-stock" ? "primary" : "ghost"}
                        size="sm"
                        onClick={() => setProductionSection("calc-stock")}
                        className="font-bold text-xs whitespace-nowrap"
                        leftIcon={<Layers className="w-4 h-4" />}
                      >
                        Расчет с учетом наличия
                        {planFiles.length > 0 && stockFiles.length > 0 && productionSection !== "calc-stock" && (
                          <span className="ml-2 flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                          </span>
                        )}
                      </Button>
                      
                      {planFiles.length > 0 && stockFiles.length > 0 && productionSection !== "calc-stock" && (
                        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-2 rounded-lg shadow-xl w-60 text-center opacity-0 group-hover/calc-stock:opacity-100 transition-opacity z-50 pointer-events-none">
                          Система сопоставит заказы со складом и покажет Дефицит.
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant={productionSection === "calc-supply" ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setProductionSection("calc-supply")}
                      className="font-bold text-xs"
                      leftIcon={<ShoppingCart className="w-4 h-4" />}
                    >
                      Расчет с учетом поставок
                    </Button>

                    {(productionSection === "calc-stock" || productionSection === "calc-supply") && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          const currentSearchQuery = productionSection === "calc-stock" ? stockSearchQuery : supplySearchQuery;
                          const itemsToProcess = supplyCalculationData.matchedDemand.filter((res: any) => {
                            if (!currentSearchQuery) return true;
                            const q = currentSearchQuery.toLowerCase();
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

                          const worksheetData = [
                            ...itemsToProcess.map((res: any) => ({
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
                              Длина: res.lengthType === "НД" ? "НД" : `МД ${res.length}`,
                              "Кол-во тн в заказе": Number(res.weightTons || 0),
                              "ИТОГО остаток выполнения заказа после расчета / плановое поступление":
                                res.finalShortage > 0 ? Number((res.finalShortage || 0).toFixed(3)) : 0,
                            })),
                            {
                              "ИТОГО остаток выполнения заказа после расчета / плановое поступление": "ИТОГО:",
                              " Итоговое значение": Number(totalFinalShortage.toFixed(3)),
                            },
                          ];

                          const worksheet = XLSX.utils.json_to_sheet(worksheetData);
                          const workbook = XLSX.utils.book_new();
                          XLSX.utils.book_append_sheet(workbook, worksheet, "Портфель заказов");
                          XLSX.writeFile(workbook, getTimestampedFilename("Заявка на обеспечение"));
                        }}
                        disabled={supplyCalculationData.matchedDemand.length === 0}
                        className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-black"
                        leftIcon={<Plus className="w-4 h-4" />}
                      >
                        <span className="hidden sm:inline">Создать заявку на обеспечение</span>
                        <span className="sm:hidden">Создать заявку</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {productionSection ==="files" ? (
                  renderFilesContent()
                ) : productionSection ==="stock" ? (
                  <StockSection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} />
                ) : productionSection ==="calc" ? (
                  <CalcSection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} />
                ) : productionSection ==="calc-stock" ? (
                  <CalcStockSection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} 
                    searchQuery={stockSearchQuery} 
                    setSearchQuery={setStockSearchQuery}
                    statusFilter={stockStatusFilter}
                    setStatusFilter={setStockStatusFilter}
                  />
                ) : productionSection ==="free-stock" ? (
                  <FreeStockSection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} />
                ) : productionSection ==="calc-supply" ? (
                  <CalcSupplySection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} 
                    searchQuery={supplySearchQuery} 
                    setSearchQuery={setSupplySearchQuery}
                    statusFilter={supplyStatusFilter}
                    setStatusFilter={setSupplyStatusFilter}
                    filteredTotals={filteredSupplyTotals}
                    filteredMatchedDemand={filteredSupplyMatchedDemand}
                  />
                ) : productionSection ==="supply-plans" ? (
                  <SupplyPlansSection {...{...props, calculationResults, processedStock, processedSupplyPlans, isProcessing}} />
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}


    </>
  );
}
