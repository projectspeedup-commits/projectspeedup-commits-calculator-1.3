import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { getGostForGrade } from '../../lib/constants';
import { getTimestampedFilename } from '../../lib/utils';
import { StatusDropdown } from '../StatusDropdown';


const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

export function SupplyStockSection(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock, validSupplyResults } = props;
  
  return (
    <>
 <motion.div
 key="supply-stock"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.2 }}
 className="flex flex-col gap-8"
 >
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1A1C19] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
 <Layers className="w-6 h-6" />
 </div>
 <div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white">
 Актуальные остатки
 </h3>
 <div className="flex items-center gap-3 mt-1 text-sm font-medium">
 <span className="text-slate-500">
 Обнаружено {processedStock.length} позиций
 </span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
 <span className="text-emerald-600 dark:text-emerald-400 font-black">
 Итого:{""}
 {processedStock
 .reduce(
 (acc, curr) =>
 acc +
 (typeof curr["Конечный остаток тн."] ==="number"
 ? curr["Конечный остаток тн."]
 : parseFloat(
 curr["Конечный остаток тн." as any],
 ) || 0),
 0,
 )
 .toFixed(3)}{""}
 тн.
 </span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
 <span className="text-amber-600 dark:text-amber-400 font-black">
 Тех. отходы:{""}
 {processedStock
 .reduce(
 (acc, curr) =>
 acc +
 (typeof curr["Тех. отходы"] ==="number"
 ? curr["Тех. отходы"]
 : parseFloat(curr["Тех. отходы"] as any) || 0),
 0,
 )
 .toFixed(3)}{""}
 тн.
 </span>
 <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
 <span className="text-blue-600 dark:text-blue-400 font-black">
 Деловые остатки:{""}
 {processedStock
 .reduce(
 (acc, curr) =>
 acc +
 (typeof curr["Деловые остатки"] ==="number"
 ? curr["Деловые остатки"]
 : parseFloat(curr["Деловые остатки"] as any) || 0),
 0,
 )
 .toFixed(3)}{""}
 тн.
 </span>
 </div>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
 <button
 onClick={handleCopyForSheets}
 className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
 title="Скопировать для Excel"
 >
 {isCopied ? (
 <Check className="w-4 h-4 text-emerald-500" />
 ) : (
 <Copy className="w-4 h-4" />
 )}
 </button>
 <button
 onClick={handleExportStock}
 className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
 title="Скачать в Excel"
 >
 <Download className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="bg-white dark:bg-[#1A1C19] rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
 <div
 ref={stockTableRef}
 onMouseDown={onStockMouseDown}
 onMouseLeave={handleMouseLeaveOrUp}
 onMouseUp={handleMouseLeaveOrUp}
 onMouseMove={handleMouseMove}
 className={`overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative ${isStockDragging ?"select-none cursor-grabbing" :"cursor-grab"}`}
 >
 <table className="w-full text-left border-separate border-spacing-0">
 <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800">
 <tr>
 <th className="px-8 py-5 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Номенклатура
 </th>
 <th className="px-6 py-5 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Профиль
 </th>
 <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Сталь
 </th>
 <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Размер
 </th>
 <th className="px-6 py-5 text-center bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Длина
 </th>
 <th className="px-8 py-5 text-right bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 uppercase tracking-widest text-[10px]">
 Тн.
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 -row-group">
 {processedStock.map((row, i) => (
 <tr
 key={i}
 className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
 >
 <td className="px-8 py-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
 <div
 className="max-w-[200px] md:max-w-[300px] truncate font-mono text-[10px] text-right md:text-left"
 title={row["Исходная Номенклатура"]}
 >
 {row["Исходная Номенклатура"]}
 </div>
 </td>
 <td className="px-6 py-3">
 <span className="inline-flex items-center px-3 py-1.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
 {row["Профиль"]}
 </span>
 </td>
 <td className="px-6 py-3 text-center font-bold text-slate-700 dark:text-slate-200">
 <span>{row["Марка стали"]}</span>
 </td>
 <td className="px-6 py-3 text-center">
 <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded">
 {row["Размер"]}
 </span>
 </td>
 <td className="px-6 py-3 text-center">
 <span
 className={`inline-flex items-center px-3 py-1.5 rounded-md text-[10px] font-bold ${row["Длина"] ==="НД" ?"text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" :"text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
 >
 {row["Длина"]}
 </span>
 </td>
 <td className="px-8 py-3 text-center">
 <div>
 <span className="text-slate-900 dark:text-white font-black text-xs">
 {row["Конечный остаток тн."]}
 </span>
 <span className="ml-1 text-[10px] text-slate-400 font-bold">
 тн
 </span>
 </div>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </motion.div>
    </>
  );
}
