import React, { Fragment } from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx-js-style';
import { getGostForGrade } from '../../lib/constants';
import { getTimestampedFilename } from '../../lib/utils';
import { StatusDropdown } from '../StatusDropdown';


const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

export function SupplyCalcStockSection(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock, validSupplyResults } = props;
  
  return (
    <>
 <motion.div
 key="supply-calc-stock"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 transition={{ duration: 0.2 }}
 className={`flex flex-col gap-8`}
 >
 {matchedDemand.length === 0 ? (
 <div className="bg-white/50 dark:bg-[#1A1C19]/40 border border-slate-200 dark:border-slate-800 rounded-[40px] p-6 md:p-12 flex flex-col items-center justify-center min-h-[500px]">
 <div className="flex items-center gap-4 sm:gap-8 mb-8 relative">
 <div className="relative">
 <div className="w-20 h-20  dark: rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 z-10 relative">
 <ClipboardList className="w-10 h-10 text-slate-800 dark:text-slate-200" />
 </div>
 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">
 Заявка на обеспечение
 </span>
 </div>

 <div className="flex items-center w-24 sm:w-32">
 <div
 className="w-full h-[2px] bg-gradient-to-r from-blue-300 via-slate-300 to-emerald-300 dark:from-blue-600 dark:via-slate-600 dark:to-emerald-600 border border-dashed border-transparent [background-clip:padding-box]"
 style={{
 backgroundImage:"linear-gradient(90deg, transparent 50%, rgba(148, 163, 184, 0.5) 50%)",
 backgroundSize:"16px 2px",
 }}
 ></div>
 </div>

 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-lg transform -translate-y-6">
 <HelpCircle className="w-6 h-6 text-slate-400" />
 </div>

 <div className="relative">
 <div className="w-20 h-20  dark: rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 z-10 relative">
 <Package className="w-10 h-10 text-slate-800 dark:text-slate-200" />
 </div>
 <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">
 Склад
 </span>
 </div>
 </div>

 <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
 Сравнивать пока нечего
 </h3>
 <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 leading-relaxed mb-8">
 Чтобы найти дефицит металла, нам нужно вычесть
 складские остатки из вашей потребности. Нужно
 загрузить сразу два файла!
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
 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
 >
 <Upload className="w-4 h-4" />
 Загрузить файлы для сравнения
 </button>
 </div>
 ) : (
 <>
 <div
 className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[20px] sm:rounded-[32px] overflow-hidden flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none`}
 >
 <div
 className={`flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-[#1A1C19]`}
 >
 <div
 className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 2xl:border-r border-slate-200 dark:border-slate-800 2xl:pr-6 w-full 2xl:w-auto`}
 >
 <h4
 className={`text-sm sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest`}
 >
 РАСЧЕТ С УЧЕТОМ НАЛИЧИЯ
 </h4>
 <div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">
 <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black  border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
 <span className="text-[9px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200 opacity-60 tracking-widest">
 взято со склада
 </span>
 <div>
 <span className="text-base font-black tracking-tight leading-none text-slate-800 dark:text-slate-200">
 { (stockTotals?.allocated || 0).toFixed(3) }
 </span>
 <span className="text-[8px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200">
 тн
 </span>
 </div>
 </div>
 <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black  border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
 <span className="text-[9px] mr-2 uppercase font-bold text-slate-800 dark:text-slate-200 opacity-60 tracking-widest">
 дефицит
 </span>
 <div>
 <span className="text-base font-black tracking-tight leading-none text-slate-800 dark:text-slate-200">
 { (stockTotals?.deficit || 0).toFixed(3) }
 </span>
 <span className="text-[8px] ml-1 uppercase font-bold text-slate-800 dark:text-slate-200">
 тн
 </span>
 </div>
 </div>
 </div>
 </div>
 <div
 className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full 2xl:w-auto flex-wrap`}
 >
 <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 sm:w-64 border border-slate-200 dark:border-slate-700">
 <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
 <input
 type="text"
 placeholder="Поиск по заказу, клиенту..."
 value={searchQuery}
 onChange={(e) =>
 setSearchQuery(e.target.value)
 }
 className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
 />
 </div>
 <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-700">
 <Filter className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
 <StatusDropdown
 value={statusFilter}
 onChange={(val) => setStatusFilter(val)}
 className="w-32"
 />
 </div>
 <button
 onClick={() => {
 if (filteredMatchedDemand.length === 0)
 return;
 const headers = ["Внутренняя нумерация","Дата отгрузки","№ Заказа","Клиент","Номенклатура","Профиль","Марка","Размер","Длина","Кол-во тн в заказе","ИТОГО остаток к выполнению","Взято со склада (тн)","ИТОГО остатка к завершению","Тех. отходы склад г/к","Дел. Остатки склад г/к","КИМ склад г/к","Исходная Номенклатура","Профиль наличия","НТД","Марка стали наличия","Размер наличия","Длина (склад г/к)","Остаток на складе г/к. (тн)","Взято со склада г/к (тн)","Свободный остаток г/к склад (тн)",
 ];
 const rows: string[][] = [];
 matchedDemand.forEach((res: any) => {
 const baseRow = [
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
 String(res.weightTons || 0).replace(".",",",
 ),
 String(
 res.remainingToProcess || 0,
 ).replace(".",","),
 String(res.allocatedStock || 0).replace(".",",",
 ),
 String(res.shortageStock || 0).replace(".",",",
 ),
 res.allocatedStock > 0 &&
 res.combinedTechWaste > 0
 ? String(
 (res.combinedTechWaste || 0).toFixed(3),
 ).replace(".",",")
 :"0",
 res.allocatedStock > 0 &&
 res.combinedUsefulRem > 0
 ? String(
 (res.combinedUsefulRem || 0).toFixed(3),
 ).replace(".",",")
 :"0",
 res.allocatedStock > 0 &&
 res.combinedKim > 0
 ? String(
 (res.combinedKim || 0).toFixed(3),
 ).replace(".",",")
 :"0",
 ];
 const maxRows = Math.max(
 1,
 res.matchedStockItems?.length || 0,
 );
 const rowTemplate = Array(
 headers.length,
 ).fill("");
 for (let i = 0; i < 16; i++)
 rowTemplate[i] = baseRow[i];

 for (let r = 0; r < maxRows; r++) {
 const outRow = [...rowTemplate];
 if (r > 0) {
 for (let c = 0; c < 16; c++)
 outRow[c] ="";
 }

 const st = res.matchedStockItems?.[r];
 if (st) {
 outRow[16] =
 st["Исходная Номенклатура"] ||"";
 outRow[17] = st["Профиль"] ||"";
 outRow[18] = st["НТД"] ||"";
 outRow[19] = st["Марка стали"] ||"";
 outRow[20] = String(
 st["Размер"] ||"",
 ).replace(".",",");
 outRow[21] = st["Длина"] ||"";
 outRow[22] = String(
 st.stockBeforeTaking || 0,
 ).replace(".",",");
 outRow[23] = String(
 st.allocatedAmount || 0,
 ).replace(".",",");
 outRow[24] = String(
 st.stockAfterTaking || 0,
 ).replace(".",",");
 }
 rows.push(outRow);
 }
 });

 const tsv = [headers, ...rows]
 .map((row) => row.join("\t"))
 .join("\n");

 let rowsHtml =
 '<table border="1"><thead><tr>' +
 headers
 .map(
 (h) =>
 '<th style="text-align:center;font-weight:bold;">' +
 h +"</th>",
 )
 .join("") +"</tr></thead><tbody>";

 matchedDemand.forEach((res: any) => {
 const baseRow = [
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
 :"МД" + res.length,
 String(res.weightTons || 0).replace(".",",",
 ),
 String(
 res.remainingToProcess || 0,
 ).replace(".",","),
 String(res.allocatedStock || 0).replace(".",",",
 ),
 String(res.shortageStock || 0).replace(".",",",
 ),
 String(
 res.allocatedStock > 0 &&
 res.combinedTechWaste > 0
 ? (res.combinedTechWaste || 0).toFixed(3)
 :"0",
 ).replace(".",","),
 String(
 res.allocatedStock > 0 &&
 res.combinedUsefulRem > 0
 ? (res.combinedUsefulRem || 0).toFixed(3)
 :"0",
 ).replace(".",","),
 String(
 res.allocatedStock > 0 &&
 res.combinedKim > 0
 ? (res.combinedKim || 0).toFixed(3)
 :"0",
 ).replace(".",","),
 ];
 const numRows = Math.max(
 1,
 res.matchedStockItems?.length || 0,
 );
 if (res.matchedStockItems?.length === 0) {
 rowsHtml += "<tr>" +
 baseRow
 .map(
 (v) =>
 '<td style="text-align:center;vertical-align:middle;">' +
 v +"</td>",
 )
 .join("") +'<td style="text-align:center;vertical-align:middle;"></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
 } else {
 res.matchedStockItems?.forEach(
 (stock: any, index: number) => {
 const stockRow = [
 stock["Исходная Номенклатура"] ||"",
 stock["Профиль"] ||"",
 stock["НТД"] ||"",
 stock["Марка стали"] ||"",
 String(
 stock["Размер"] ||"",
 ).replace(".",","),
 stock["Длина"] ||"",
 String(
 stock.stockBeforeTaking || 0,
 ).replace(".",","),
 String(
 stock.allocatedAmount || 0,
 ).replace(".",","),
 String(
 stock.stockAfterTaking || 0,
 ).replace(".",","),
 ];
 rowsHtml += "<tr>";
 if (index === 0) {
 baseRow.forEach((v) => {
 rowsHtml +=
 '<td rowspan="' +
 numRows +
 '" style="text-align:center;vertical-align:middle;">' +
 v +"</td>";
 });
 }
 stockRow.forEach((v) => {
 rowsHtml +=
 '<td style="text-align:center;vertical-align:middle;">' +
 v +"</td>";
 });
 rowsHtml +="</tr>";
 },
 );
 }
 });
 rowsHtml +="</tbody></table>";

 try {
 const blobText = new Blob([tsv], {
 type:"text/plain",
 });
 const blobHtml = new Blob([rowsHtml], {
 type:"text/html",
 });
 const item = new ClipboardItem({"text/html": blobHtml,"text/plain": blobText,
 });
 navigator.clipboard
 .write([item])
 .catch(() =>
 navigator.clipboard.writeText(tsv),
 );
 } catch (e) {
 navigator.clipboard.writeText(tsv);
 }
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
 if (matchedDemand.length === 0) return;
 const headers = ["Внутренняя нумерация","Дата отгрузки","№ Заказа","Клиент","Номенклатура","Профиль","Марка","Размер","Длина","Кол-во тн в заказе","ИТОГО остаток к выполнению","Взято со склада (тн)","ИТОГО остатка к завершению","Тех. отходы склад г/к","Дел. Остатки склад г/к","КИМ склад г/к","Исходная Номенклатура","Профиль наличия","НТД","Марка стали наличия","Размер наличия","Длина (склад г/к)","Остаток на складе г/к. (тн)","Взято со склада г/к (тн)","Свободный остаток г/к склад (тн)",
 ];
 const rows: any[][] = [];
 matchedDemand.forEach((res: any) => {
 const baseRow = [
 res.internalNo ||"",
 res.shippingDate ||"",
 res.orderNo ||"",
 res.client ||"",
 res.nomenclature ||"",
 res.type ||"",
 res.grade ||"",
 res.diameter,
 res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.length}`,
 Number(res.weightTons || 0),
 Number(res.remainingToProcess || 0),
 Number(res.allocatedStock || 0),
 Number(res.shortageStock || 0),
 res.allocatedStock > 0 &&
 res.combinedTechWaste > 0
 ? Number(
 (res.combinedTechWaste || 0).toFixed(3),
 )
 : 0,
 res.allocatedStock > 0 &&
 res.combinedUsefulRem > 0
 ? Number(
 (res.combinedUsefulRem || 0).toFixed(3),
 )
 : 0,
 res.allocatedStock > 0 &&
 res.combinedKim > 0
 ? Number((res.combinedKim || 0).toFixed(3))
 : 0,
 ];
 const maxRows = Math.max(
 1,
 res.matchedStockItems?.length || 0,
 );
 const rowTemplate = Array(
 headers.length,
 ).fill("");
 for (let i = 0; i < 16; i++)
 rowTemplate[i] = baseRow[i];

 for (let r = 0; r < maxRows; r++) {
 const outRow = [...rowTemplate];
 if (r > 0) {
 for (let c = 0; c < 16; c++)
 outRow[c] ="";
 }

 const st = res.matchedStockItems?.[r];
 if (st) {
 outRow[16] =
 st["Исходная Номенклатура"] ||"";
 outRow[17] = st["Профиль"] ||"";
 outRow[18] = st["НТД"] ||"";
 outRow[19] = st["Марка стали"] ||"";
 outRow[20] = st["Размер"] ||"";
 outRow[21] = st["Длина"] ||"";
 outRow[22] = Number(
 st.stockBeforeTaking || 0,
 );
 outRow[23] = Number(
 st.allocatedAmount || 0,
 );
 outRow[24] = Number(
 st.stockAfterTaking || 0,
 );
 }
 rows.push(outRow);
 }
 });

 const worksheet = XLSX.utils.aoa_to_sheet([
 headers,
 ...rows,
 ]);
 const numberCols = [
 9, 10, 11, 12, 13, 14, 15, 22, 23, 24,
 ];
 const range = XLSX.utils.decode_range(
 worksheet["!ref"] ||"A1:A1",
 );
 for (let R = 1; R <= range.e.r; ++R) {
 for (let c of numberCols) {
 const cellAddress = { c: c, r: R };
 const cellRef =
 XLSX.utils.encode_cell(cellAddress);
 if (
 worksheet[cellRef] &&
 typeof worksheet[cellRef].v ==="number"
 ) {
 worksheet[cellRef].t ="n";
 worksheet[cellRef].z =
 '#,##0.000" тн."';
 }
 }
 }

 const workbook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(
 workbook,
 worksheet,"Расчет с наличием",
 );
 XLSX.writeFile(
 workbook,
 getTimestampedFilename("Заявка на обеспечение"),
 );
 }}
 className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl  dark: text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-800 dark:border-slate-200 dark:border-slate-800 hover: dark:hover:"
 title="Скачать в Excel"
 >
 <Download className="w-4 h-4" />
 </button>
 </div>
 </div>
 </div>

 {filteredMatchedDemand.length > 0 && (
 <>
 <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
 <div
 ref={supplyTableRef}
 onMouseDown={onSupplyMouseDown}
 onMouseLeave={handleMouseLeaveOrUp}
 onMouseUp={handleMouseLeaveOrUp}
 onMouseMove={handleMouseMove}
 className={`max-h-[calc(100vh-350px)] overflow-auto custom-scrollbar relative ${isSupplyDragging ?"select-none cursor-grabbing" :"cursor-grab"}`}
 >
 <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
 <thead>
 <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Вх. №
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Дата отгр.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 № Заказа
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Заказчик
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Номенклатура
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Профиль
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 М. стали
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Длина
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Кол-во тн в зак.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 ИТОГО ост. к выполнению
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Номенклатура
 <br />
 заг.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Марка
 <br />
 заг.
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 <br />
 заг.
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
 КИМ /<br />
 Совет
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Взято со склада (тн)
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 ИТОГО ост. к завершению /<br />
 после склада г/к
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 <div className="flex flex-col items-center justify-center gap-1">
 <span>Тех. отходы склад г/к</span>
 <div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
 <span className="text-slate-800 dark:text-slate-200/70">
 Σ
 </span>
 <span>
 { (res.weight || res.totalWeight || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 </div>
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 <div className="flex flex-col items-center justify-center gap-1">
 <span>Дел. Остатки склад г/к</span>
 <div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
 <span className="text-slate-800 dark:text-slate-200/70">
 Σ
 </span>
 <span>
 { (res.remainingToProcess || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 </div>
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 КИМ склад г/к
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Исход Номенклатура
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Профиль
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 НТД
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Марка стали
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Размер
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Длина
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Исх. Остаток (тн)
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Взято (тн)
 </th>
 <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >
 Остаток на складе (тн)
 </th>
 </tr>
 </thead>
 <tbody
 className={`divide-y divide-slate-100 dark:divide-slate-800 text-[11px]`}
 >
 {filteredMatchedDemand.map((res) => {
 const renderMainRow = (
 stockItem: any = null,
 isSubRow = false,
 ) => (
 <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group" key={Math.random()}>
 {/* Demand section (duplicated on sub-rows but dimmed) */}
 {!isSubRow && (
 <>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
 rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}
 >
 {res.internalNo ||"—"}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.shippingDate}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <div className="font-bold text-slate-600 dark:text-slate-400 cursor-help">
 {res.orderNo}
 </div>
 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
 <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[10px] py-2 px-3 rounded-xl shadow-xl border border-white/10 whitespace-nowrap min-w-[120px]">
 <div className="flex flex-col gap-1.5 text-left">
 <div className="flex justify-between items-center gap-3">
 <span className="text-slate-400 text-[9px]">
 Обеспечено:
 </span>
 <span className="font-bold text-slate-800 dark:text-slate-200">
 { (res.allocatedStock || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 <div className="flex justify-between items-center gap-3">
 <span className="text-slate-400 text-[9px]">
 Дефицит:
 </span>
 <span className="font-bold text-slate-800 dark:text-slate-200">
 { (res.shortageStock || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 </div>
 </div>
 <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <div className="font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap cursor-help">
 {res.client}
 </div>
 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50">
 <div className="bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[10px] py-2 px-3 rounded-xl shadow-xl border border-white/10 whitespace-nowrap min-w-[120px]">
 <div className="flex flex-col gap-1.5 text-left">
 <div className="flex justify-between items-center gap-3">
 <span className="text-slate-400 text-[9px]">
 Обеспечено:
 </span>
 <span className="font-bold text-slate-800 dark:text-slate-200">
 { (res.allocatedStock || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 <div className="flex justify-between items-center gap-3">
 <span className="text-slate-400 text-[9px]">
 Дефицит:
 </span>
 <span className="font-bold text-slate-800 dark:text-slate-200">
 { (res.shortageStock || 0).toFixed(3) }{""}
 тн
 </span>
 </div>
 </div>
 </div>
 <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <div
 className="max-w-[150px] mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
 title={res.nomenclature}
 >
 {res.nomenclature}
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
 {res.type}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.grade}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
 {parseFloat(
 (res.diameter||0).toFixed(2),
 )}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType ==="НД" ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}
 >
 {res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.length}`}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 { (res.weight || res.totalWeight || 0).toFixed(3) }
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 { Number(stockItem.stockBeforeTaking || 0).toFixed(3) }
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <div
 className="max-w-[150px] mx-auto truncate font-medium text-[10px] text-slate-500"
 title={`Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`}
 >
 Круг{""}
 {getGostForGrade(res.grade)}
 /ГОСТ 2590-2006
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.grade}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
 {parseFloat(
 (res.diameter||0).toFixed(2),
 )}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 { Number(stockItem.allocatedAmount || 0).toFixed(3) }
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType ==="НД" ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:" :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"}`}
 >
 {res.lengthType ==="НД"
 ?"НД"
 : `МД ${res.billetLength}`}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
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
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span
 className={`font-bold text-slate-800 dark:text-slate-200/80 block`}
 >
 {(res.lengthType ==="НД" ||
 res.drawLength <= 0
 ? 0
 : ((res.usefulLength -
 res.pcsPerBillet *
 res.length) /
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
 res.pcsPerBillet *
 res.length) /
 res.drawLength) *
 res.totalWeight) /
 res.totalWeight) *
 100
 ).toFixed(1)}
 %
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 <span
 className={`font-black tracking-tight ${res.remainingToProcess / res.totalWeight < 0.92 ?"text-red-500" :"text-slate-800 dark:text-slate-200"}`}
 >
 {(
 res.remainingToProcess /
 res.totalWeight
 ).toFixed(3)}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
 rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}
 >
 {res.allocatedStock > 0
 ? (res.allocatedStock || 0).toFixed(
 3,
 )
 :"—"}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center"
 rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}
 >
 {res.shortageStock > 0.0005
 ? (res.shortageStock || 0).toFixed(3)
 :"—"}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.allocatedStock > 0 &&
 res.combinedTechWaste > 0
 ? (res.combinedTechWaste || 0).toFixed(
 3,
 )
 :"—"}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.allocatedStock > 0 &&
 res.combinedUsefulRem > 0
 ? (res.combinedUsefulRem || 0).toFixed(
 3,
 )
 :"—"}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" rowSpan={Math.max(
 1,
 res.matchedStockItems.length,
 )}>
 {res.allocatedStock > 0 &&
 res.combinedKim > 0
 ? (res.combinedKim || 0).toFixed(3)
 :"—"}
 </td>
 </>
 )}

 {stockItem ? (
 <>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <div
 className="max-w-[150px] truncate font-mono text-[10px]"
 title={
 stockItem["Исходная Номенклатура"
 ]
 }
 >
 {
 stockItem["Исходная Номенклатура"
 ]
 }
 </div>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
 {stockItem["Профиль"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 {stockItem["НТД"]}
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span className="font-bold text-slate-700 dark:text-slate-200">
 {stockItem["Марка стали"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span className="inline-flex items-center gap-1 text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200 font-mono font-bold  dark: px-2 py-0.5 rounded">
 {stockItem["Размер"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 <span
 className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
 stockItem["Длина"]
 .toString()
 .includes("МД")
 ?"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"
 :"text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark:"
 }`}
 >
 {stockItem["Длина"]}
 </span>
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 { Number(stockItem.stockAfterTaking || 0).toFixed(3) }
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 { Number(stockItem.allocatedAmount || 0).toFixed(3) }
 </td>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
 { Number(stockItem.stockAfterTaking || 0).toFixed(3) }
 </td>
 </>
 ) : (
 <>
 <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" colSpan={9}>
 —
 </td>
 </>
 )}
 </tr>
 );

 if (res.matchedStockItems.length === 0) {
 return renderMainRow();
 }

 return (
 <Fragment key={res.id}>
 {res.matchedStockItems.map(
 (stock: any, index: number) =>
 renderMainRow(stock, index > 0),
 )}
 </Fragment>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </>
 )}
 </>
 )}
 </motion.div>
    </>
  );
}
