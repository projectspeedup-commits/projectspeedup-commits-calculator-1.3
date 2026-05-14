import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { getGostForGrade } from '../../lib/constants';
import { getTimestampedFilename } from '../../lib/utils';
import { StatusDropdown } from '../StatusDropdown';


const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

export function SupplyFreeStockSection(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock, validSupplyResults } = props;
  
  return (
    <>
 <motion.div
 key="supply-free-stock"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.2 }}
 className={`flex flex-col gap-8`}
 >
 <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-xl">
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-[#1A1C19]">
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 xl:border-r border-slate-200 dark:border-slate-800 xl:pr-6 w-full xl:w-auto">
 <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-widest">
 Свободный остаток заготовки
 </h4>
 <div className="flex items-baseline justify-between sm:justify-start px-4 sm:px-5 py-2 sm:py-2.5 text-slate-800 dark:text-slate-200 font-black  dark: border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
 <span className="text-[11px] sm:text-xs mr-3 uppercase font-bold text-slate-800 dark:text-slate-200/80 tracking-widest">
 Общий остаток
 </span>
 <div>
 <span className="text-xl sm:text-2xl tracking-tight leading-none">
 {freeStock
 .reduce(
 (acc, row) => acc + row.remainingStock,
 0,
 )
 .toFixed(3)}
 </span>
 <span className="text-[10px] sm:text-[11px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200/80">
 тн
 </span>
 </div>
 </div>
 </div>
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full xl:w-auto">
 <button
 onClick={() => {
 if (freeStock.length === 0) return;
 const headers = ["Номенклатура","Профиль","Сталь","Размер","Длина","Остаток тн.",
 ];
 const rows = freeStock.map((row: any) => [
 row["Исходная Номенклатура"] ||"",
 row["Профиль"] ||"",
 row["Марка стали"] ||"",
 String(row["Размер"]).replace(".",","),
 row["Длина"] ||"",
 String((row["Остаток тн."]||0).toFixed(3)).replace(".",",",
 ),
 ]);

 const tsv = [headers, ...rows]
 .map((row) => row.join("\t"))
 .join("\n");
 navigator.clipboard.writeText(tsv);
 setIsCopied(true);
 setTimeout(() => setIsCopied(false), 2000);
 }}
 className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#1A1C19] text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
 title="Скопировать для Excel"
 >
 {isCopied ? (
 <Check className="w-4 h-4 text-slate-800 dark:text-slate-200" />
 ) : (
 <Copy className="w-4 h-4" />
 )}
 </button>
 <button
 onClick={() => {
 if (freeStock.length === 0) return;
 const headers = ["Номенклатура","Профиль","Сталь","Размер","Длина","Остаток тн.",
 ];
 const excelRows = freeStock.map((row: any) => ({
 Номенклатура: row["Исходная Номенклатура"],
 Профиль: row["Профиль"],
 Сталь: row["Марка стали"],
 Размер: row["Размер"],
 Длина: row["Длина"],"Остаток тн.": parseFloat(
 (row["Остаток тн."]||0).toFixed(3),
 ),
 }));

 const worksheet =
 XLSX.utils.json_to_sheet(excelRows);

 const wscols = [
 { wch: 30 },
 { wch: 15 },
 { wch: 15 },
 { wch: 12 },
 { wch: 15 },
 { wch: 15 },
 ];
 worksheet["!cols"] = wscols;

 const range = XLSX.utils.decode_range(
 worksheet["!ref"] ||"A1",
 );
 for (let R = range.s.r; R <= range.e.r; ++R) {
 for (let C = range.s.c; C <= range.e.c; ++C) {
 const cell_address = { c: C, r: R };
 const cell_ref =
 XLSX.utils.encode_cell(cell_address);
 if (!worksheet[cell_ref]) continue;

 worksheet[cell_ref].s = {
 font: { sz: 8 },
 alignment: {
 horizontal:"center",
 vertical:"center",
 },
 };

 if (R === 0) {
 worksheet[cell_ref].s.font.bold = true;
 }
 }
 }

 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(
 workbook,
 worksheet,"Свободный остаток",
 );
 XLSX.writeFile(
 workbook,
 getTimestampedFilename("Заявка на обеспечение"),
 );
 }}
 className="flex-1 sm:flex-none h-10 px-3 sm:w-10 sm:px-0 shrink-0 flex items-center justify-center rounded-xl  dark: text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 hover: dark:hover:"
 title="Скачать в Excel"
 >
 <Download className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div
 ref={freeStockTableRef}
 onMouseDown={onFreeStockMouseDown}
 onMouseLeave={handleMouseLeaveOrUp}
 onMouseUp={handleMouseLeaveOrUp}
 onMouseMove={handleMouseMove}
 className={`overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative ${isFreeStockDragging ?"select-none cursor-grabbing" :"cursor-grab"}`}
 >
 <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
 <thead>
 <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Номенклатура
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Профиль
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Сталь
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Длина
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Остаток тн.
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 -row-group">
 {freeStock.map((row, i) => (
 <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className="max-w-[12rem] md:max-w-[300px] truncate font-mono text-[10px] text-right md:text-left"
 title={row["Исходная Номенклатура"]}
 >
 {row["Исходная Номенклатура"]}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
 {row["Профиль"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span>{row["Марка стали"]}</span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
 {row["Размер"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${row["Длина"] ==="НД" ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"} ml-auto md:ml-0 md:mx-auto`}
 >
 {row["Длина"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <div>
 <span className="text-slate-900 dark:text-white font-black text-xs">
 {(row["Остаток тн."]||0).toFixed(3)}
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
