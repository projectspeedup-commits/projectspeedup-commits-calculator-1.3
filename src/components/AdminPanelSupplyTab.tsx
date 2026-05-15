import { SupplyStockSection } from './supply/SupplyStockSection';
import { SupplyCalcSection } from './supply/SupplyCalcSection';
import { SupplyCalcStockSection } from './supply/SupplyCalcStockSection';
import { SupplyFreeStockSection } from './supply/SupplyFreeStockSection';
import { SupplyCalcSupplySection } from './supply/SupplyCalcSupplySection';
import { SupplyPlansSection } from './supply/SupplyPlansSection';
import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx-js-style';
import * as LucideIcons from 'lucide-react';
import { getGostForGrade } from '../lib/constants';
import { StatusDropdown } from './StatusDropdown';
import { getTimestampedFilename } from '../lib/utils';
import { BatchManualModal } from './BatchManualModal';
import { StockManualModal } from './StockManualModal';

 import { useAdminStore } from '../store/useAdminStore';

 export default function AdminPanelSupplyTab(props: any) {
  const store = useAdminStore();
  
  const {
    activeTab,
    formatCurrency,
    s,
    applyAllOptimizations,
    newBilletLength,
    newDrawLen,
    newUsefulLen,
    newPcs,
    newActualUL,
    optLen,
    newKim,
    newTotalWeight,
    billetArea,
    wPerM,
    singleBMass,
    newBilletCount,
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
    x,
    price,
    totalCost,
    res,
    stockBeforeTaking,
    matchedDemand,
    allocatedStock,
    matchedStockItems,
    shortageStock,
    combinedTechWaste,
    combinedUsefulRem,
    combinedKim,
    averageKim,
    supplyCalculationData,
    stockItems,
    supplyItems,
    allocatedFromStock,
    shortageAfterStock,
    allocatedFromSupply,
    finalShortage,
    combinedTechWaste2,
    combinedUsefulRem2,
    combinedKim2,
    combinedTechWaste3,
    combinedUsefulRem3,
    combinedKim3,
    filteredMatchedDemand,
    key,
    filteredTotals,
    getSupplyNomenclature,
    p,
    d,
    y,
    data,
    workbook,
    worksheet,
    row,
    orderNo,
    internalNo,
    shippingDate,
    client,
    nomenclature,
    weightTons,
    remainingToProcess,
    type,
    grade,
    diameter,
    length,
    billetDia,
    drawRatio,
    billetLength,
    drawLength,
    usefulLength,
    techEnds,
    optimizedBilletLength,
    optimizedKim,
    totalWeight,
    billetCount,
    c,
    weight,
    lengthType,
    handleCopyForSheets,
    rows,
    handleExportStock,
    wscols,
    files,
    tabs,
    renderFilesContent,
    setActiveTab,
    supplySection,
    setSupplySection,
    setProductionSection,
    isCopied,
    setIsCopied,
    isPurchasingMode,
    freeStock,
    stockTotals,
  } = props;

  const calculationResults = activeTab === "production" ? store.calcResultsProd : store.calcResultsSup;
  const processedStock = activeTab === "production" ? store.processedStockProd : store.processedStockSup;
  const processedSupplyPlans = activeTab === "production" ? store.processedSupplyPlansProd : store.processedSupplyPlansSup;
  const isProcessing = store.isProcessing;

  const {
    validationErrors,
    stockSearchQuery,
    setStockSearchQuery,
    stockStatusFilter,
    setStockStatusFilter,
    supplySearchQuery,
    setSupplySearchQuery,
    supplyStatusFilter,
    setSupplyStatusFilter,
    copySuccess,
    setCopySuccess,
  } = store;

 const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

 const validSupplyResults = React.useMemo(() => {
 return (calculationResults || []).filter((r: any) => (r.remainingToProcess ?? 0) >= 0.300);
 }, [calculationResults]);

 return (
 <>
 {activeTab ==="supply" && (
 <motion.div
 key="supply"
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.2 }}
 className="flex flex-col gap-8"
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
 Снабжение и закупки
 </h2>
 <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
 Расчет потребности в сырье.
 </p>
 </div>
 {false &&
 (() => {
 const isSupplyView =
 supplySection ==="calc-supply" ||
 supplySection ==="supply-plans";
 const activeDashboardTotals = {
 allocated: isSupplyView
 ? supplyCalculationData.totals.allocated || 0
 : stockTotals.allocated || 0,
 deficit: isSupplyView
 ? supplyCalculationData.totals.deficit || 0
 : stockTotals.deficit || 0,
 remaining: isSupplyView
 ? supplyCalculationData.totals.remaining || 0
 : stockTotals.remaining || 0,
 techWaste2: isSupplyView
 ? supplyCalculationData.totals.techWaste2 || 0
 : stockTotals.techWaste2 || 0,
 usefulRem2: isSupplyView
 ? supplyCalculationData.totals.usefulRem2 || 0
 : stockTotals.usefulRem2 || 0,
 averageKim: isSupplyView
 ? supplyCalculationData.totals.averageKim || 0
 : stockTotals.averageKim || 0,
 };
 return (
 <div className="flex-none min-w-0 w-full xl:w-auto xl:flex-1 relative overflow-hidden">
 <div
 ref={summaryContainerRef}
 className="grid grid-cols-2 gap-2 xl:gap-3 w-full p-1.5 sm:p-2 bg-slate-50/80 dark:bg-[#1A1C19]/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[16px] sm:rounded-[20px] transition-all"
 >
 {/* Item 1: Взято со склада (emerald) */}
 <div className="flex flex-col justify-center px-4 py-2.5 sm:py-3 xl:px-1 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700" />
 <span className="text-[10px] sm:text-[11px] xl:text-[8px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-1 relative z-10 flex items-center leading-tight">
 <Package className="w-3 h-3 xl:w-3 xl:h-3 2xl:w-3.5 2xl:h-3.5 mr-1 xl:mr-1 opacity-80 shrink-0" />
 <span className="whitespace-nowrap">Взято из заг.</span>
 </span>
 <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-emerald-950 dark:text-emerald-50 leading-none relative z-10 tracking-tighter">
 {activeDashboardTotals.allocated.toFixed(3)}
 <span className="text-[9px] sm:text-[10px] xl:text-[8px] 2xl:text-[9px] text-emerald-600/60 dark:text-emerald-400/50 font-bold ml-1 uppercase">
 тн
 </span>
 </span>
 </div>

 {/* Item 2: Дефицит */}
 <div className="flex flex-col justify-center px-4 py-2.5 sm:py-3 xl:px-1 bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-800/50 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
 <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700" />
 <span className="text-[10px] sm:text-[11px] xl:text-[7.5px] 2xl:text-[10px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest mb-1 relative z-10 flex items-center leading-tight">
 <ShoppingCart className="w-3 h-3 xl:w-2 xl:h-2 2xl:w-3.5 2xl:h-3.5 mr-1 xl:mr-0.5 opacity-80 shrink-0" />
 <span className="whitespace-nowrap">Дефицит</span>
 </span>
 <span className="text-xl sm:text-2xl xl:text-[13px] 2xl:text-xl font-black text-rose-950 dark:text-rose-50 leading-none relative z-10 tracking-tighter">
 {activeDashboardTotals.deficit.toFixed(3)}
 <span className="text-[9px] sm:text-[10px] xl:text-[7px] 2xl:text-[9px] text-rose-600/60 dark:text-rose-400/50 font-bold ml-1 uppercase">
 тн
 </span>
 </span>
 </div>
 </div>
 </div>
 );
 })()}
 </div>

 {/* Sub-navigation for Supply */}
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full min-w-0 pb-2">
 <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1A1C19] p-1.5 rounded-[18px] sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full xl:w-fit shrink-0 overflow-hidden">
 <button
 onClick={() => setSupplySection("files")}
 className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
 supplySection ==="files"
 ?"bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
 :"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
 }`}
 >
 Файлы
 </button>
 <button
 onClick={() => setSupplySection("calc")}
 className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
 supplySection ==="calc"
 ?"bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
 :"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
 }`}
 >
 Заявка на обеспечение
 </button>
 </div>


 </div>
        <AnimatePresence mode="wait">
 {supplySection ==="files" ? (
 renderFilesContent(true)
 ) : supplySection ==="stock" ? (
                  <SupplyStockSection {...props} validSupplyResults={validSupplyResults} />
                ) : supplySection ==="calc" ? (
                  <SupplyCalcSection {...props} validSupplyResults={validSupplyResults} />
                ) : supplySection ==="calc-stock" ? (
                  <SupplyCalcStockSection {...props} validSupplyResults={validSupplyResults} searchQuery={stockSearchQuery} setSearchQuery={setStockSearchQuery} statusFilter={stockStatusFilter} setStatusFilter={setStockStatusFilter} />
                ) : supplySection ==="free-stock" ? (
                  <SupplyFreeStockSection {...props} validSupplyResults={validSupplyResults} />
                ) : supplySection ==="calc-supply" ? (
                  <SupplyCalcSupplySection {...props} validSupplyResults={validSupplyResults} searchQuery={supplySearchQuery} setSearchQuery={setSupplySearchQuery} statusFilter={supplyStatusFilter} setStatusFilter={setSupplyStatusFilter} />
                ) : supplySection ==="supply-plans" ? (
                  <SupplyPlansSection {...props} validSupplyResults={validSupplyResults} />
                ) : null}
 </AnimatePresence>
 </motion.div>
 )}

 {/* Content tabs */}

 </>
 );
}
