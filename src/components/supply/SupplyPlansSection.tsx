import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { getGostForGrade } from '../../lib/constants';
import { getTimestampedFilename } from '../../lib/utils';
import { StatusDropdown } from '../StatusDropdown';


const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

export function SupplyPlansSection(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock, validSupplyResults } = props;
  
  return (
    <>
 <motion.div
 key="supply-plans"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.2 }}
 className={`flex flex-col gap-8`}
 >
 <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-xl">
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-[#1A1C19]">
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full xl:w-auto">
 <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">
 Планы поставок сырья
 </h4>
 <div className="flex items-center gap-2">
 <span className="text-[10px] font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 px-2.5 py-1 rounded-full">
 {processedSupplyPlans.length} позиций
 </span>
 <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 px-2.5 py-1 rounded-full">
 {processedSupplyPlans
 .reduce(
 (sum, row) =>
 sum + (Number(row["Кол-во"]) || 0),
 0,
 )
 .toFixed(3)}{""}
 тн
 </span>
 </div>
 </div>
 </div>

 <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative cursor-auto">
 <table className="w-full text-left border-separate border-spacing-0">
 <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800">
 <tr>
 <th className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Профиль
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Марка
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Размер
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Кол-во
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Длина
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Размещено
 </th>
 <th className="px-4 py-3 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Поставка
 </th>
 <th className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Поставщик
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 -row-group">
 {processedSupplyPlans.map((row, i) => (
 <tr
 key={i}
 className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
 >
 <td className="px-4 py-3">
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
 {row["Профиль"]}
 </span>
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center font-bold text-slate-700 dark:text-slate-200 py-3 md:py-2.5">
 {row["Марка"]}
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center py-3 md:py-2.5">
 <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-mono font-bold bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded">
 {row["Размер"]}
 </span>
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center font-black text-slate-900 dark:text-white py-3 md:py-2.5">
 <span>
 {row["Кол-во"]?.toFixed(3)}{""}
 <span className="text-[10px] text-slate-400 font-bold ml-0.5">
 тн
 </span>
 </span>
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center py-3 md:py-2.5">
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
 {row["Длина"]}
 </span>
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center text-slate-500 dark:text-slate-400 font-mono py-3 md:py-2.5">
 {row["Дата размещения"]}
 </td>
 <td className="px-4 py-3 md:py-2.5 text-center py-3 md:py-2.5">
 <span className="font-bold text-emerald-600 dark:text-emerald-500">
 {row["Ожидаемая дата поставки"]}
 </span>
 </td>
 <td
 className="px-4 py-3 md:py-2.5 truncate max-w-[150px] py-3 md:py-2.5"
 title={row["Поставщик"]}
 >
 <span className="truncate">{row["Поставщик"]}</span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 {processedSupplyPlans.length === 0 && (
 <div className="flex flex-col items-center justify-center py-20 text-center px-4">
 <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
 <ShoppingCart className="w-8 h-8" />
 </div>
 <p className="text-slate-500 dark:text-slate-400 font-medium">
 Нет данных о поставках
 </p>
 <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
 Загрузите реестр поставок в разделе Файлы
 </p>
 </div>
 )}
 </div>
 </div>
 </motion.div>
    </>
  );
}
