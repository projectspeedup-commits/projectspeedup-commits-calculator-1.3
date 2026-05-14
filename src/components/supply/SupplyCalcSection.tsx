import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { getGostForGrade } from '../../lib/constants';
import { getTimestampedFilename } from '../../lib/utils';
import { StatusDropdown } from '../StatusDropdown';


const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

export function SupplyCalcSection(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock, validSupplyResults } = props;
  
  return (
    <>
 <motion.div
 key="supply-calc"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.2 }}
 className="flex flex-col gap-8"
 >
 {calculationResults.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-[#1A1C19]/40 rounded-[40px] border border-slate-100 dark:border-slate-800/50">
 <div className="relative w-24 h-24 mb-6">
 <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-3xl rotate-6 mix-blend-multiply opacity-50"></div>
 <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900 rounded-3xl -rotate-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
 <FolderSearch className="w-10 h-10 text-slate-400 dark:text-slate-500" />
 </div>
 </div>
 <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
 Здесь пока пусто
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 leading-relaxed mb-8">
 Мы не можем представить образец, пока вы не
 откорректируете список заказов. Загрузите файл с
 заказами клиентов, чтобы начать работу.
 </p>

 <button
 onClick={() => {
 if (activeTab ==="supply") {
 setSupplySection("files");
 } else if (activeTab ==="production") {
 setProductionSection("files");
 } else {
 setActiveTab("production");
 setProductionSection("files");
 }
 }}
 className="px-6 py-3  hover: text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
 >
 Перейти к загрузке файлов
 <ArrowRight className="w-4 h-4 ml-1" />
 </button>

 {isProcessing && (
 <div className="mt-8 flex items-center gap-3 h-12 px-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700">
 <div className="w-4 h-4 border-2 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
 Идет расчет...
 </div>
 )}
 </div>
 ) : (
 <div className="flex flex-col gap-6">
 <div
 className={`grid grid-cols-1 ${!isPurchasingMode ?"lg:grid-cols-3" :"lg:grid-cols-2"} gap-6`}
 >
 {!isPurchasingMode && (
 <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/30 p-6 rounded-[24px] flex flex-col justify-center">
 <span className="text-[10px] font-bold text-violet-600 dark:text-violet-500 uppercase tracking-widest">
 Общая стоимость (без НДС)
 </span>
 <div className="text-3xl font-black text-violet-600 dark:text-violet-400 mt-1">
 {Math.round(
 calculationResults.reduce(
 (acc, curr) => acc + (curr.totalCost || 0),
 0,
 ),
 ).toLocaleString()}{""}
 <span className="text-lg font-normal">₽</span>
 </div>

 <div className="mt-4 pt-4 border-t border-violet-100 dark:border-violet-900/30">
 <div className="mb-2">
 <span className="text-[9px] font-bold text-violet-500/60 uppercase tracking-wider">
 ср/цена на закупку г/к проката
 </span>
 </div>
 <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
 {Object.entries<{
 totalCost: number;
 totalWeight: number;
 }>(
 calculationResults.reduce(
 (acc, curr) => {
 const key = curr.grade;
 if (!acc[key])
 acc[key] = {
 totalCost: 0,
 totalWeight: 0,
 };
 acc[key].totalCost +=
 curr.totalCost || 0;
 acc[key].totalWeight +=
 curr.totalWeight;
 return acc;
 },
 {} as Record<
 string,
 {
 totalCost: number;
 totalWeight: number;
 }
 >,
 ),
 )
 .map(([grade, data]) => ({
 grade,
 avgPrice:
 data.totalWeight > 0
 ? data.totalCost / data.totalWeight
 : 0,
 }))
 .sort((a, b) => b.avgPrice - a.avgPrice)
 .map(({ grade, avgPrice }) => (
 <div
 key={grade}
 className="flex justify-between items-center text-[11px]"
 >
 <span className="text-slate-500 dark:text-slate-400 font-medium">
 {grade}
 </span>
 <span className="text-violet-600 dark:text-violet-400 font-bold">
 {Math.round(
 avgPrice,
 ).toLocaleString()}{""}
 ₽/тн
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}
 <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 p-6 rounded-[24px] flex flex-col relative shadow-sm transition-all hover:shadow-md">
 <div className="absolute top-0 right-0 w-32 h-32  dark: rounded-bl-[64px] rounded-tr-[24px] pointer-events-none"></div>
 <div className="z-10 flex items-start justify-between">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <div className="w-2 h-2 rounded-full "></div>
 <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 Итого заготовка
 </h3>
 </div>
 <div className="flex items-baseline gap-1">
 <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none h-[40px] flex items-baseline">
 {calculationResults
 .reduce(
 (acc, curr) => acc + curr.totalWeight,
 0,
 )
 .toFixed(3)}
 </span>
 <span className="text-sm font-bold text-slate-400">
 тн
 </span>
 </div>
 </div>
 <button
 onClick={() => {
 const headers = ["НТД","Профиль","Марка заг.","Размер","Длина","Кол-во тн",
 ];
 if (!isPurchasingMode)
 headers.push("Сумма (руб)");

 const rows = Object.entries<{
 weight: number;
 count: number;
 cost: number;
 }>(
 calculationResults.reduce(
 (acc, curr) => {
 const label =
 curr.lengthType ==="НД"
 ?"НД"
 : `МД ${curr.billetLength}`;
 const key = `${curr.grade} | ${curr.billetDia} | ${label}`;
 if (!acc[key])
 acc[key] = {
 weight: 0,
 count: 0,
 cost: 0,
 };
 acc[key].weight += curr.totalWeight;
 acc[key].count += curr.billetCount || 0;
 acc[key].cost += curr.totalCost || 0;
 return acc;
 },
 {} as Record<
 string,
 {
 weight: number;
 count: number;
 cost: number;
 }
 >,
 ),
 )
 .filter(
 ([_, data]) => data.weight >= 0.0005,
 )
 .sort((a, b) => b[1].weight - a[1].weight)
 .map(([key, data]) => {
 const [grade, size, length] =
 key.split(" |");
 const row: any[] = [
 `ГОСТ 2590-2006/${getGostForGrade(grade)}`,"Круг",
 grade,
 parseFloat(size) || size,
 length,
 parseFloat((res.weightTons||res.totalWeight||0).toFixed(3)),
 ];
 if (!isPurchasingMode)
 row.push(Math.round(data.cost));
 return row;
 });

 // Add Total Row
 const totalWeight = rows.reduce(
 (sum, r) =>
 sum +
 (typeof r[5] ==="number" ? r[5] : 0),
 0,
 );
 const totalRow = ["ИТОГО","","","","",
 parseFloat((res.weightTons||res.totalWeight||0).toFixed(3)),
 ];
 if (!isPurchasingMode) {
 const totalCost = rows.reduce(
 (sum, r) =>
 sum +
 (typeof r[6] ==="number" ? r[6] : 0),
 0,
 );
 totalRow.push(totalCost);
 }

 const worksheet = XLSX.utils.aoa_to_sheet([
 headers,
 ...rows,
 totalRow,
 ]);
 const range = XLSX.utils.decode_range(
 worksheet["!ref"] ||"A1",
 );

 for (let R = range.s.r; R <= range.e.r; ++R) {
 for (
 let C = range.s.c;
 C <= range.e.c;
 ++C
 ) {
 const cell_address = { c: C, r: R };
 const cell_ref =
 XLSX.utils.encode_cell(cell_address);
 if (!worksheet[cell_ref]) continue;

 const isTotalRow = R === range.e.r;

 worksheet[cell_ref].s = {
 font: {
 sz: 9,
 bold: R === 0 || isTotalRow,
 },
 alignment: {
 horizontal:"center",
 vertical:"center",
 },
 border: isTotalRow
 ? {
 top: { style:"medium" },
 }
 : undefined,
 };
 }
 }

 worksheet["!views"] = [
 { state:"frozen", ySplit: 1 },
 ];
 const out_wcut = [
 { wch: 25 },
 { wch: 15 },
 { wch: 15 },
 { wch: 15 },
 { wch: 15 },
 { wch: 15 },
 { wch: 15 },
 ];
 worksheet["!cols"] = out_wcut;

 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(
 workbook,
 worksheet,"Итого заготовка",
 );
 XLSX.writeFile(
 workbook,
 getTimestampedFilename("Заказ поставщику"),
 );
 }}
 className="flex items-center gap-1.5 px-3 py-1.5  dark: hover: dark:hover: text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 shadow-sm"
 title="Скачать сводку по заготовке в Excel"
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="14"
 height="14"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
 <polyline points="7 10 12 15 17 10"></polyline>
 <line x1="12" y1="15" x2="12" y2="3"></line>
 </svg>
 Скачать
 </button>
 </div>

 <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex-1 z-10 flex flex-col min-h-0">
 <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1 transition-all custom-scrollbar flex-1">
 {Object.entries<{
 weight: number;
 count: number;
 cost: number;
 }>(
 calculationResults.reduce(
 (acc, curr) => {
 const label =
 curr.lengthType ==="НД"
 ?"НД"
 : `МД ${curr.billetLength}`;
 const key = `${curr.grade} | ${curr.billetDia} | ${label}`;
 if (!acc[key])
 acc[key] = {
 weight: 0,
 count: 0,
 cost: 0,
 };
 acc[key].weight += curr.totalWeight;
 acc[key].count += curr.billetCount || 0;
 acc[key].cost += curr.totalCost || 0;
 return acc;
 },
 {} as Record<
 string,
 {
 weight: number;
 count: number;
 cost: number;
 }
 >,
 ),
 )
 .sort((a, b) => b[1].weight - a[1].weight)
 .map(([key, data]) => {
 const [grade, size, length] =
 key.split(" |");
 return (
 <div
 key={key}
 className="flex justify-between items-center group bg-slate-50 dark:bg-slate-800/30 hover: dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/50 px-2 py-1.5 rounded-lg transition-colors"
 >
 <div className="flex items-center gap-1.5">
 <span className="text-slate-700 dark:text-slate-300 font-bold text-[10px] min-w-[32px]">
 {grade}
 </span>
 <span className="text-slate-500 dark:text-slate-400 font-semibold text-[9px] min-w-[20px]">
 {size}
 </span>
 <span className="text-[8px] text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark: px-1 py-0.5 rounded font-bold uppercase">
 {length}
 </span>
 </div>
 <div className="flex flex-col items-end leading-none gap-0.5">
 <div className="flex items-baseline gap-1.5">
 <span className="text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-black text-[10px]">
 {(res.weightTons||res.totalWeight||0).toFixed(3)}{""}
 <span className="font-medium text-[8px] text-slate-800 dark:text-slate-200/60 uppercase">
 тн
 </span>
 </span>
 </div>
 {!isPurchasingMode && (
 <span className="text-[7.5px] text-slate-400 font-medium uppercase">
 {Math.round(
 data.cost,
 ).toLocaleString()}{""}
 ₽
 </span>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 p-6 rounded-[24px] flex flex-col relative shadow-sm transition-all hover:shadow-md">
 <div className="absolute top-0 right-0 w-32 h-32  dark: rounded-bl-[64px] rounded-tr-[24px] pointer-events-none"></div>
 <div className="z-10">
 <div className="flex items-center justify-between mb-1">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full "></div>
 <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
 Коэф. Использования (КИМ)
 <div className="group relative z-[100]">
 <Info className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200/70 hover:text-slate-800 dark:text-slate-200 cursor-help transition-colors" />
 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-[10.5px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 shadow-xl normal-case tracking-normal">
 Показывает, какая часть заготовки идет в
 продукцию. Чем ближе к 1.0, тем лучше.
 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
 </div>
 </div>
 </h3>
 </div>
 <div className="text-[9px] font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800  dark: px-1.5 py-0.5 rounded-md">
 Цель ≥ 0.980
 </div>
 </div>
 <div className="flex items-baseline gap-2">
 <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none h-[40px] flex items-baseline">
 {(
 calculationResults.reduce(
 (acc, curr) =>
 acc + curr.remainingToProcess,
 0,
 ) /
 (calculationResults.reduce(
 (acc, curr) => acc + curr.totalWeight,
 0,
 ) || 1)
 ).toFixed(3)}
 </span>
 <span className="text-sm font-bold text-slate-800 dark:text-slate-200/80">
 средний
 </span>
 </div>
 </div>

 <div className="mt-auto pt-6">
 <div className="space-y-3 relative z-10 w-full pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-1">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 Тех. отходы
 </span>
 </div>
 <div className="font-bold text-red-500 dark:text-red-400 tracking-tight">
 {calculationResults
 .reduce(
 (acc, res) =>
 acc +
 (res.drawLength > 0
 ? (res.techEnds / res.drawLength) *
 res.totalWeight
 : 0),
 0,
 )
 .toFixed(3)}{""}
 <span className="text-[10px] font-medium text-slate-400">
 тн
 </span>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-1.5 h-1.5 rounded-full "></div>
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 Деловые остатки
 </span>
 </div>
 <div className="font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 tracking-tight">
 {calculationResults
 .reduce(
 (acc, res) =>
 acc +
 (res.lengthType ==="НД" ||
 res.drawLength <= 0
 ? 0
 : ((res.usefulLength -
 res.pcsPerBillet * res.length) /
 res.drawLength) *
 res.totalWeight),
 0,
 )
 .toFixed(3)}{""}
 <span className="text-[10px] font-medium text-slate-400">
 тн
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="bg-white dark:bg-[#1A1C19] rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
 <div className="p-4 sm:p-6 sm:px-8 border-b border-slate-100 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full xl:w-auto">
 <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-widest shrink-0">
 ЗАЯВКА НА ОБЕСПЕЧЕНИЕ
 </h4>
 <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 border border-slate-200 dark:border-slate-700 flex items-baseline w-full sm:w-auto">
 <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-3 shrink-0">
 Итого к обеспечению
 </span>
 <span className="text-sm font-black text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200">
 {validSupplyResults
 .reduce(
 (sum, res) =>
 sum + (res.remainingToProcess || 0),
 0,
 )
 .toFixed(3)}{""}
 <span className="text-[10px] font-bold text-slate-500 ml-1">
 тн
 </span>
 </span>
 </div>
 </div>
 <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 w-full xl:w-auto">
 <div className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:block">
 {validSupplyResults.length} строк
 </div>

 <button
 onClick={applyAllOptimizations}
 className="flex items-center justify-center gap-2 px-4 py-2  hover: text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 w-full sm:w-auto order-first sm:order-none"
 title="Применить рекомендуемую длину заготовки ко всем строкам для максимизации КИМ"
 >
 <TrendingUp className="w-4 h-4 shadow-sm" />
 <span className="whitespace-nowrap sm:hidden">КИМ</span>
 <span className="whitespace-nowrap hidden sm:inline">
 Применить все улучшения КИМ
 </span>
 </button>

 <button
 onClick={() => {
 const headers = ["Внутренняя нумерация","Дата отгрузки","№ Заказа","Клиент","Номенклатура","Профиль","Марка","Размер","Длина","Кол-во тн в заказе","ИТОГО остаток к выполнению","Номенклатура (заг)","Марка заг.","Размер (заг)","Кол-во тн заг.","Длина","Тех. отходы","Делов. остаток","КИМ / Совет"
 ];
 if (!isPurchasingMode)
 headers.push("Цена (руб)","Сумма (руб)");

 const tsvRows = validSupplyResults.map(
 (res) => {
 const row = [
 res.internalNo ||"",
 res.shippingDate ||"",
 res.orderNo ||"",
 res.client ||"",
 res.nomenclature ||"",
 res.type ||"",
 res.grade ||"",
 String(res.diameter).replace(".",","),
 res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.length}`,
 String(res.weightTons).replace(".",",",
 ),
 String(
 (res.weightTons||res.totalWeight||0).toFixed(3),
 ).replace(".",","),
 `Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`,
 res.grade ||"",
 String(parseFloat((res.diameter||0).toFixed(2))).replace(".",","),
 String((res.weightTons||res.totalWeight||0).toFixed(3)).replace(".",","),
 res.lengthType ==="НД" ?"НД" : `МД ${res.billetLength}`,
 String((res.drawLength > 0 ? (res.techEnds / res.drawLength) * res.totalWeight : 0).toFixed(3)).replace(".",","),
 String((res.lengthType ==="НД" || res.drawLength <= 0 ? 0 : ((res.usefulLength - res.pcsPerBillet * res.length) / res.drawLength) * res.totalWeight).toFixed(3)).replace(".",","),
 String((res.totalWeight > 0 ? res.remainingToProcess / res.totalWeight : 0).toFixed(3)).replace(".",",")
 ];
 if (!isPurchasingMode) {
 row.push(
 String(res.price).replace(".",","),
 String(
 (res.length||0).toFixed(0),
 ).replace(".",","),
 );
 }
 return row;
 },
 );

 // Add Totals for Sheets
 const totalWeightSh =
 validSupplyResults.reduce(
 (sum, r) => sum + r.remainingToProcess,
 0,
 );
 const totalTechSh = validSupplyResults.reduce(
 (sum, r) => sum + (r.drawLength > 0 ? (r.techEnds / r.drawLength) * r.totalWeight : 0), 0
 );
 const totalDelovSh = validSupplyResults.reduce(
 (sum, r) => sum + (r.lengthType ==="НД" || r.drawLength <= 0 ? 0 : ((r.usefulLength - r.pcsPerBillet * r.length) / r.drawLength) * r.totalWeight), 0
 );
 const totalZagSh = validSupplyResults.reduce((sum, r) => sum + r.totalWeight, 0);

 const totalRowSh = Array(headers.length).fill("",
 );
 totalRowSh[0] ="ИТОГО";
 totalRowSh[10] = String(
 (res.weightTons||res.totalWeight||0).toFixed(3),
 ).replace(".",",");
 totalRowSh[14] = String(
 (res.weightTons||res.totalWeight||0).toFixed(3)
 ).replace(".",",");
 totalRowSh[16] = String(
 (res.weightTons||res.totalWeight||0).toFixed(3)
 ).replace(".",",");
 totalRowSh[17] = String(
 (res.weightTons||res.totalWeight||0).toFixed(3)
 ).replace(".",",");
 totalRowSh[18] = String(
 (totalZagSh > 0 ? totalWeightSh / totalZagSh : 0).toFixed(3)
 ).replace(".",",");

 const tsv = [headers, ...tsvRows, totalRowSh]
 .map((row) => row.join("\t"))
 .join("\n");
 navigator.clipboard.writeText(tsv);
 setCopySuccess(true);
 setTimeout(() => setCopySuccess(false), 2000);
 }}
 className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm w-[calc(50%-0.25rem)] sm:w-auto ${
 copySuccess
 ?" text-slate-800 dark:text-slate-200 dark: dark:text-slate-800 dark:text-slate-200"
 :"bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
 }`}
 title="Скопировать для вставки (Ctrl+V) в Google Таблицы"
 >
 {copySuccess ? (
 <>
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="14"
 height="14"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="3"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <polyline points="20 6 9 17 4 12"></polyline>
 </svg>
 Скопировано!
 </>
 ) : (
 <>
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="14"
 height="14"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <rect
 x="9"
 y="9"
 width="13"
 height="13"
 rx="2"
 ry="2"
 ></rect>
 <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
 </svg>
 <span className="whitespace-nowrap">Sheets</span>
 </>
 )}
 </button>

 <button
 onClick={() => {
 if (validSupplyResults.length === 0) return;

 const headers = ["Внутренняя нумерация","Дата отгрузки","№ Заказа","Клиент","Номенклатура","Профиль","Марка","Размер","Длина","Кол-во тн в заказе","ИТОГО остаток к выполнению","Номенклатура (заг)","Марка заг.","Размер (заг)","Кол-во тн заг.","Длина","Тех. Отходы","Делов. Остаток","КИМ / Совет"
 ];
 if (!isPurchasingMode)
 headers.push("Цена (руб)","Сумма (руб)");

 const rows = validSupplyResults.map((res) => {
 const row: any[] = [
 res.internalNo ||"",
 res.shippingDate ||"",
 res.orderNo ||"",
 res.client ||"",
 res.nomenclature ||"",
 res.type ||"",
 res.grade ||"",
 parseFloat(res.diameter) || res.diameter,
 res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.length}`,
 parseFloat(res.weightTons) ||
 res.weightTons,
 parseFloat(
 (res.weightTons||res.totalWeight||0).toFixed(3),
 ),
 `Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`,
 res.grade ||"",
 parseFloat((res.diameter||0).toFixed(2)),
 parseFloat((res.weightTons||res.totalWeight||0).toFixed(3)),
 res.lengthType ==="НД" ?"НД" : `МД ${res.billetLength}`,
 parseFloat((res.drawLength > 0 ? (res.techEnds / res.drawLength) * res.totalWeight : 0).toFixed(3)),
 parseFloat((res.lengthType ==="НД" || res.drawLength <= 0 ? 0 : ((res.usefulLength - res.pcsPerBillet * res.length) / res.drawLength) * res.totalWeight).toFixed(3)),
 parseFloat((res.totalWeight > 0 ? res.remainingToProcess / res.totalWeight : 0).toFixed(3))
 ];
 if (!isPurchasingMode) {
 row.push(
 parseFloat(res.price) || res.price,
 Math.round(res.totalCost),
 );
 }
 return row;
 });

 // Add Totals for Table Export
 const totalInOrderEX = rows.reduce(
 (sum, r) =>
 sum +
 (typeof r[9] ==="number" ? r[9] : 0),
 0,
 );
 const totalRemainingEX = rows.reduce(
 (sum, r) =>
 sum +
 (typeof r[10] ==="number" ? r[10] : 0),
 0,
 );
 const totalZagEX = rows.reduce((sum, r) => sum + (typeof r[14] ==="number" ? r[14] : 0), 0);
 const totalTechEX = rows.reduce((sum, r) => sum + (typeof r[16] ==="number" ? r[16] : 0), 0);
 const totalDelovEX = rows.reduce((sum, r) => sum + (typeof r[17] ==="number" ? r[17] : 0), 0);

 const totalRowEX = Array(headers.length).fill("",
 );
 totalRowEX[0] ="ИТОГО";
 totalRowEX[9] = parseFloat(
 (res.weightTons||res.totalWeight||0).toFixed(3),
 );
 totalRowEX[10] = parseFloat(
 (res.weightTons||res.totalWeight||0).toFixed(3),
 );
 totalRowEX[14] = parseFloat((res.weightTons||res.totalWeight||0).toFixed(3));
 totalRowEX[16] = parseFloat((res.weightTons||res.totalWeight||0).toFixed(3));
 totalRowEX[17] = parseFloat((res.weightTons||res.totalWeight||0).toFixed(3));
 totalRowEX[18] = parseFloat((totalZagEX > 0 ? totalRemainingEX / totalZagEX : 0).toFixed(3));

 if (!isPurchasingMode) {
 totalRowEX[20] = rows.reduce(
 (sum, r) =>
 sum +
 (typeof r[20] ==="number" ? r[20] : 0),
 0,
 );
 }

 const worksheet = XLSX.utils.aoa_to_sheet([
 headers,
 ...rows,
 totalRowEX,
 ]);

 // Apply styling
 const range = XLSX.utils.decode_range(
 worksheet["!ref"] ||"A1",
 );
 const centerCols = [
 0, 1, 6, 8, 12, 15
 ];
 const numberCols = isPurchasingMode ? [7, 9, 10, 13, 14, 16, 17, 18] : [7, 9, 10, 13, 14, 16, 17, 18, 19, 20];

 for (let R = range.s.r; R <= range.e.r; ++R) {
 for (
 let C = range.s.c;
 C <= range.e.c;
 ++C
 ) {
 const cell_address = { c: C, r: R };
 const cell_ref =
 XLSX.utils.encode_cell(cell_address);
 if (!worksheet[cell_ref]) continue;

 const isCentered = centerCols.includes(C);
 const isNumber = numberCols.includes(C);
 const isTotalRow = R === range.e.r;

 if (
 R > 0 &&
 isNumber &&
 typeof worksheet[cell_ref].v ==="number"
 ) {
 worksheet[cell_ref].t ="n";
 if (C === 19 || C === 20) {
 worksheet[cell_ref].z ="#,##0 ₽";
 } else {
 worksheet[cell_ref].z ="#,##0.000";
 }
 }

 worksheet[cell_ref].s = {
 font: {
 sz: 9,
 bold: R === 0 || isTotalRow,
 },
 alignment: {
 horizontal: isCentered
 ?"center"
 :"left",
 vertical:"center",
 wrapText: C === 4 || C === 11,
 },
 border: isTotalRow
 ? {
 top: { style:"medium" },
 }
 : undefined,
 };
 }
 }

 // Freeze the first row
 worksheet["!views"] = [
 { state:"frozen", ySplit: 1 },
 ];

 const out_wcut = [
 { wch: 20 }, // 0
 { wch: 15 }, // 1
 { wch: 25 }, // 2
 { wch: 40 }, // 3
 { wch: 15 }, // 4
 { wch: 10 }, // 5
 { wch: 10 }, // 6
 { wch: 15 }, // 7
 { wch: 10 }, // 8
 { wch: 15 }, // 9
 { wch: 15 }, // 10
 { wch: 30 }, // 11
 { wch: 12 }, // 12
 { wch: 15 }, // 13
 { wch: 15 }, // 14
 { wch: 10 }, // 15
 { wch: 15 }, // 16
 { wch: 15 }, // 17
 { wch: 15 }, // 18
 { wch: 15 }, // 19
 { wch: 15 }, // 20
 ];
 worksheet["!cols"] = out_wcut;

 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(
 workbook,
 worksheet,"Заказы",
 );
 XLSX.writeFile(
 workbook,
 getTimestampedFilename("Расчет потребности в заготовке"),
 );
 }}
 className="flex items-center justify-center gap-2 px-4 py-2  hover: text-white rounded-xl text-xs font-bold transition-colors shadow-sm w-[calc(50%-0.25rem)] sm:w-auto"
 >
 <svg
 xmlns="http://www.w3.org/2000/svg"
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 >
 <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
 <polyline points="7 10 12 15 17 10"></polyline>
 <line x1="12" y1="15" x2="12" y2="3"></line>
 </svg>
 <span className="whitespace-nowrap">Excel</span>
 </button>
 </div>
 </div>

 <div
 ref={tableContainerRef}
 onMouseDown={handleMouseDown}
 onMouseLeave={handleMouseLeaveOrUp}
 onMouseUp={handleMouseLeaveOrUp}
 onMouseMove={handleMouseMove}
 className={`overflow-auto max-h-[calc(100vh-350px)] custom-scrollbar relative ${isDragging ?"select-none cursor-grabbing" :"cursor-grab"}`}
 >
 <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
 <thead>
 <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Внутренняя нумерация
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Дата отгрузки
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 № Заказа
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Клиент
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Номенклатура
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Профиль
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Марка
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Длина
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Кол-во тн в заказе
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Итого к обеспечению
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Номенклатура
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Марка
 <br />
 заг.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Кол-во тн
 <br />
 заг.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Длина
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Тех.
 <br />
 Отходы
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Делов.
 <br />
 Остаток
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 <div className="flex items-center justify-center gap-1.5">
 КИМ / Совет
 <div className="group relative z-[100]">
 <Info className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200/70 hover:text-slate-800 dark:text-slate-200 cursor-help transition-colors" />
 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-[10.5px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 shadow-xl normal-case tracking-normal whitespace-normal">
 Показывает, какая часть заготовки идет
 в продукцию. Чем ближе к 1.0, тем
 лучше.
 <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
 </div>
 </div>
 </div>
 </th>
 {!isPurchasingMode && (
 <>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Цена за 1т
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Сумма
 </th>
 </>
 )}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] -row-group">
 {validSupplyResults.map((res, i) => (
 <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
 {res.internalNo}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
 {res.shippingDate}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
 {res.orderNo}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
 {res.client}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className="max-w-[150px] md:mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-center"
 title={res.nomenclature}
 >
 {res.nomenclature}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
 {res.type}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
 {res.grade}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
 {parseFloat((res.diameter||0).toFixed(2))}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType ==="НД" ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"} ml-auto md:ml-0 md:mx-auto`}
 >
 {res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.length}`}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-black text-slate-900 dark:text-white whitespace-nowrap">
 {(res.weightTons||res.totalWeight||0).toFixed(3)}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-bold text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 whitespace-nowrap">
 {(res.weightTons||res.totalWeight||0).toFixed(3)}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className="max-w-[150px] md:mx-auto truncate font-medium text-[10px] text-slate-500 text-center"
 title={`Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`}
 >
 Круг {getGostForGrade(res.grade)}/ГОСТ
 2590-2006
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
 {res.grade}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
 {parseFloat((res.diameter||0).toFixed(2))}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center font-black text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 whitespace-nowrap">
 {(res.weightTons||res.totalWeight||0).toFixed(3)}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType ==="НД" ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"} ml-auto md:ml-0 md:mx-auto`}
 >
 {res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.billetLength}`}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center whitespace-nowrap">
 <span
 className={`font-bold text-red-500/80 block`}
 >
 {res.drawLength > 0
 ? (
 (res.techEnds /
 res.drawLength) *
 res.totalWeight
 ).toFixed(3)
 : 0}{""}
 тн
 </span>
 <span
 className={`text-[9px] text-slate-400 block`}
 >
 {res.drawLength > 0
 ? (
 (((res.techEnds /
 res.drawLength) *
 res.totalWeight) /
 res.totalWeight) *
 100
 ).toFixed(1)
 : 0}
 %
 </span>
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div className="text-center whitespace-nowrap">
 <span
 className={`font-bold text-slate-800 dark:text-slate-200/80 block`}
 >
 {(res.lengthType ==="НД" ||
 res.drawLength <= 0
 ? 0
 : ((res.usefulLength -
 res.pcsPerBillet * res.length) /
 res.drawLength) *
 res.totalWeight
 ).toFixed(3)}{""}
 тн
 </span>
 <span
 className={`text-[9px] text-slate-400 block`}
 >
 {(res.lengthType ==="НД" ||
 res.drawLength <= 0
 ? 0
 : ((((res.usefulLength -
 res.pcsPerBillet * res.length) /
 res.drawLength) *
 res.totalWeight) /
 res.totalWeight) *
 100
 ).toFixed(1)}
 %
 </span>
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className={`flex flex-col items-end md:items-center gap-1`}
 >
 <span
 className={`font-black text-[10px] ${res.remainingToProcess / res.totalWeight < 0.92 ?"text-red-500" :"text-slate-800 dark:text-slate-200"}`}
 >
 {(
 res.remainingToProcess /
 res.totalWeight
 ).toFixed(3)}
 </span>
 {res.optimizedBilletLength &&
 res.optimizedBilletLength !==
 res.billetLength &&
 res.optimizedKim &&
 res.optimizedKim >
 res.remainingToProcess /
 res.totalWeight +
 0.005 && (
 <button
 onClick={() => {
 // Implement applying optimization logic
 setCalculationResults((prev) =>
 prev.map((item) => {
 if (
 item.id === res.id &&
 res.optimizedBilletLength
 ) {
 const newBilletLength =
 res.optimizedBilletLength;
 const newDrawLen =
 newBilletLength *
 item.drawRatio;
 const newUsefulLen =
 newDrawLen /
 (item.type ==="Шестигранник"
 ? 1.03 * 1.003
 : 1.027 * 1.003);
 let newPcs = 0;
 let newActualUL = 0;
 if (
 item.lengthType ==="НД"
 ) {
 for (
 let i = 1;
 i <= 20;
 i++
 ) {
 const optLen =
 Math.floor(
 newUsefulLen / i,
 ) - 5;
 if (
 optLen >= 3000 &&
 optLen <= 6000
 ) {
 newPcs = i;
 newActualUL =
 newPcs * optLen;
 break;
 }
 }
 if (newPcs === 0)
 newActualUL =
 newUsefulLen;
 } else {
 newPcs = Math.floor(
 newUsefulLen /
 item.length,
 );
 newActualUL =
 newPcs * item.length;
 }
 const newKim =
 newDrawLen > 0
 ? newActualUL /
 newDrawLen
 : 0;
 const newTotalWeight =
 newKim > 0
 ? item.remainingToProcess /
 newKim
 : item.remainingToProcess;
 const billetArea =
 (Math.PI *
 Math.pow(
 item.billetDia,
 2,
 )) /
 4;
 const wPerM =
 billetArea *
 0.00000785 *
 1000;
 const singleBMass =
 (newBilletLength /
 1000) *
 wPerM;
 const newBilletCount =
 singleBMass > 0
 ? Math.ceil(
 (newTotalWeight *
 1000) /
 singleBMass,
 )
 : 0;

 return {
 ...item,
 billetLength:
 newBilletLength,
 drawLength: newDrawLen,
 usefulLength:
 newUsefulLen,
 pcsPerBillet: newPcs,
 wastePercent:
 (1 - newKim) * 100,
 totalWeight:
 newTotalWeight,
 billetCount:
 newBilletCount,
 quantity:
 newBilletCount,
 totalCost:
 newTotalWeight *
 item.price,
 };
 }
 return item;
 }),
 );
 }}
 className={`px-2 py-0.5  hover: text-white text-[9px] font-bold rounded-full shadow-sm shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1`}
 title={`Улучшить КИМ до ${(res.weightTons||res.totalWeight||0).toFixed(3)} используя L заг. ${res.optimizedBilletLength}`}
 >
 <TrendingUp
 className={`w-2.5 h-2.5`}
 />
 {res.optimizedBilletLength}
 </button>
 )}
 </div>
 </td>
 {!isPurchasingMode && (
 <>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className={`text-center font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap`}
 >
 {res.price
 ? formatCurrency(res.price)
 :"—"}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
 <div
 className={`text-center font-bold text-slate-900 dark:text-white whitespace-nowrap`}
 >
 {res.totalCost
 ? formatCurrency(res.totalCost)
 :"—"}
 </div>
 </td>
 </>
 )}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}
 </motion.div>
    </>
  );
}
