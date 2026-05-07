import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx-js-style';
import * as LucideIcons from 'lucide-react';
import { getGostForGrade } from '../lib/constants';
import { BatchManualModal } from './BatchManualModal';
import { StockManualModal } from './StockManualModal';

export default function AdminPanelSupplyTab(props: any) {
  const { activeTab, formatCurrency, s, calculationResults, setCalculationResults, processedStock, processedSupplyPlans, applyAllOptimizations, newBilletLength, newDrawLen, newUsefulLen, newPcs, newActualUL, optLen, newKim, newTotalWeight, billetArea, wPerM, singleBMass, newBilletCount, tableContainerRef, summaryContainerRef, supplyTableRef, stockTableRef, freeStockTableRef, handleMouseDown, onSummaryMouseDown, onSupplyMouseDown, onStockMouseDown, onFreeStockMouseDown, handleMouseLeaveOrUp, onSummaryMouseLeaveOrUp, handleMouseMove, x, price, totalCost, res, stockBeforeTaking, matchedDemand, allocatedStock, matchedStockItems, shortageStock, combinedTechWaste, combinedUsefulRem, combinedKim, averageKim, supplyCalculationData, stockItems, supplyItems, allocatedFromStock, shortageAfterStock, allocatedFromSupply, finalShortage, combinedTechWaste2, combinedUsefulRem2, combinedKim2, combinedTechWaste3, combinedUsefulRem3, combinedKim3, filteredMatchedDemand, key, filteredTotals, getSupplyNomenclature, p, d, y, data, workbook, worksheet, row, orderNo, internalNo, shippingDate, client, nomenclature, weightTons, remainingToProcess, type, grade, diameter, length, billetDia, drawRatio, billetLength, drawLength, usefulLength, techEnds, optimizedBilletLength, optimizedKim, totalWeight, billetCount, c, weight, lengthType, handleCopyForSheets, rows, handleExportStock, wscols, files, tabs, renderFilesContent, setActiveTab, supplySection, setSupplySection, setProductionSection, isCopied, setIsCopied, searchQuery, setSearchQuery, statusFilter, setStatusFilter, isProcessing, isDragging, isSummaryDragging, isSupplyDragging, isStockDragging, isFreeStockDragging, copySuccess, setCopySuccess, stockTotals, isPurchasingMode, freeStock } = props;
  const { Activity, Info, TrendingUp, Layers, Package, Upload, Download, Copy, Check, ShoppingCart, Search, Filter, FolderSearch, ArrowRight, ClipboardList, HelpCircle } = LucideIcons;

  return (
    <>
      {activeTab === "supply" && (
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
                      supplySection === "calc-supply" ||
                      supplySection === "supply-plans";
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
                      <div className="flex-none min-w-0 xl:max-w-2xl w-full md:w-auto relative overflow-hidden">
                        <div
                          ref={summaryContainerRef}
                          onMouseDown={onSummaryMouseDown}
                          onMouseUp={onSummaryMouseLeaveOrUp}
                          onMouseLeave={onSummaryMouseLeaveOrUp}
                          onMouseMove={handleMouseMove}
                          className={`flex items-stretch xl:items-center gap-2 sm:gap-3 xl:gap-2 xl:ml-2 w-full p-1.5 sm:p-2 bg-slate-50/80 dark:bg-[#1A1C19]/40 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/60 rounded-[18px] sm:rounded-2xl overflow-x-auto xl:overflow-x-visible xl:justify-around hide-scrollbar snap-x snap-mandatory xl:snap-none transition-all ${
                            isSummaryDragging
                              ? "cursor-grabbing select-none scroll-auto"
                              : "cursor-grab xl:cursor-default scroll-smooth"
                          }`}
                        >
                          {/* Item 1: Взято со склада (emerald) */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max xl:flex-none justify-center px-4 py-2.5 sm:py-3 xl:px-1 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/10 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <span className="text-[10px] sm:text-[11px] xl:text-[7.5px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-1 relative z-10 flex items-center leading-tight">
                              <Package className="w-3 h-3 xl:w-2 xl:h-2 2xl:w-3.5 2xl:h-3.5 mr-1 xl:mr-0.5 opacity-80 shrink-0" />
                              <span className="truncate">Взято из заг.</span>
                            </span>
                            <span className="text-xl sm:text-2xl xl:text-[13px] 2xl:text-xl font-black text-emerald-950 dark:text-emerald-50 leading-none relative z-10 tracking-tighter">
                              {activeDashboardTotals.allocated.toFixed(3)}
                              <span className="text-[9px] sm:text-[10px] xl:text-[7px] 2xl:text-[9px] text-emerald-600/60 dark:text-emerald-400/50 font-bold ml-1 uppercase">
                                тн
                              </span>
                            </span>
                          </div>

                          {/* Item 2: Дефицит */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max xl:flex-none justify-center px-4 py-2.5 sm:py-3 xl:px-1 bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-800/50 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700" />
                            <span className="text-[10px] sm:text-[11px] xl:text-[7.5px] 2xl:text-[10px] text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest mb-1 relative z-10 flex items-center leading-tight">
                              <ShoppingCart className="w-3 h-3 xl:w-2 xl:h-2 2xl:w-3.5 2xl:h-3.5 mr-1 xl:mr-0.5 opacity-80 shrink-0" />
                              <span className="truncate">Дефицит</span>
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
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-[#1A1C19] p-1.5 rounded-[18px] sm:rounded-2xl border border-slate-200 dark:border-slate-800 w-full xl:w-fit shrink-0 overflow-x-auto hide-scrollbar">
                  <button
                    onClick={() => setSupplySection("files")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      supplySection === "files"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Файлы
                  </button>
                  <button
                    onClick={() => setSupplySection("calc")}
                    className={`whitespace-nowrap px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      supplySection === "calc"
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    Заявка на обеспечение
                  </button>
                </div>

                {supplySection === "calc" && calculationResults.length > 0 && (
                  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-1.5 sm:gap-2 w-full xl:w-auto mt-2 xl:mt-0 shrink-0 mb-2 xl:mb-0">
                    <button
                      onClick={() => {
                        const headers = [
                          "НТД",
                          "Профиль",
                          "Марка заг.",
                          "Размер мм. (Заг.)",
                          "Длина мм.",
                          "Кол-во тн заг.",
                        ];
                        if (!isPurchasingMode) headers.push("Сумма (руб)");

                        const rows = Object.entries<{
                          weight: number;
                          count: number;
                          cost: number;
                        }>(
                          calculationResults.reduce(
                            (acc, curr) => {
                              const label =
                                curr.lengthType === "НД"
                                  ? "НД"
                                  : `МД ${curr.billetLength}`;
                              const key = `${curr.grade} | ${curr.billetDia} | ${label}`;
                              if (!acc[key])
                                acc[key] = { weight: 0, count: 0, cost: 0 };
                              acc[key].weight += curr.totalWeight;
                              acc[key].count += curr.billetCount || 0;
                              acc[key].cost += curr.totalCost || 0;
                              return acc;
                            },
                            {} as Record<
                              string,
                              { weight: number; count: number; cost: number }
                            >,
                          ),
                        )
                          .filter(([_, data]) => data.weight >= 0.0005)
                          .sort((a, b) => b[1].weight - a[1].weight)
                          .map(([key, data]) => {
                            const [grade, size, length] = key.split(" | ");
                            const row = [
                              `ГОСТ 2590-2006/${getGostForGrade(grade)}`,
                              "Круг",
                              grade,
                              String(size).replace(".", ","),
                              length,
                              String(data.weight.toFixed(3)).replace(".", ","),
                            ];
                            if (!isPurchasingMode)
                              row.push(
                                String(Math.round(data.cost)).replace(".", ","),
                              );
                            return row;
                          });

                        const tsv = [headers, ...rows]
                          .map((row) => row.join("\t"))
                          .join("\n");
                        navigator.clipboard.writeText(tsv);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
                      title="Скопировать заявку для вставки (Ctrl+V) в Google Таблицы"
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const headers = [
                          "НТД",
                          "Профиль",
                          "Марка заг.",
                          "Размер мм. (Заг.)",
                          "Длина мм.",
                          "Кол-во тн заг.",
                        ];
                        if (!isPurchasingMode) headers.push("Сумма (руб)");

                        const rows = Object.entries<{
                          weight: number;
                          count: number;
                          cost: number;
                        }>(
                          calculationResults.reduce(
                            (acc, curr) => {
                              const label =
                                curr.lengthType === "НД"
                                  ? "НД"
                                  : `МД ${curr.billetLength}`;
                              const key = `${curr.grade} | ${curr.billetDia} | ${label}`;
                              if (!acc[key])
                                acc[key] = { weight: 0, count: 0, cost: 0 };
                              acc[key].weight += curr.totalWeight;
                              acc[key].count += curr.billetCount || 0;
                              acc[key].cost += curr.totalCost || 0;
                              return acc;
                            },
                            {} as Record<
                              string,
                              { weight: number; count: number; cost: number }
                            >,
                          ),
                        )
                          .filter(([_, data]) => data.weight >= 0.0005)
                          .sort((a, b) => b[1].weight - a[1].weight)
                          .map(([key, data]) => {
                            const [grade, size, length] = key.split(" | ");
                            const row = [
                              `ГОСТ 2590-2006/${getGostForGrade(grade)}`,
                              "Круг",
                              grade,
                              String(size).replace(".", ","),
                              length,
                              String(data.weight.toFixed(3)).replace(".", ","),
                            ];
                            if (!isPurchasingMode)
                              row.push(
                                String(Math.round(data.cost)).replace(".", ","),
                              );
                            return row;
                          });

                        const worksheet = XLSX.utils.aoa_to_sheet([
                          headers,
                          ...rows,
                        ]);
                        const range = XLSX.utils.decode_range(
                          worksheet["!ref"] || "A1",
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
                                horizontal: "center",
                                vertical: "center",
                              },
                            };

                            if (R === 0) {
                              worksheet[cell_ref].s.font.bold = true;
                            }
                          }
                        }

                        worksheet["!views"] = [{ state: "frozen", ySplit: 1 }];
                        const out_wcut = [
                          { wch: 25 },
                          { wch: 15 },
                          { wch: 20 },
                          { wch: 20 },
                          { wch: 15 },
                          { wch: 20 },
                          { wch: 15 },
                        ];
                        worksheet["!cols"] = out_wcut;

                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(
                          workbook,
                          worksheet,
                          "Заявка",
                        );
                        XLSX.writeFile(workbook, "Заявка_на_сырье.xlsx");
                      }}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
                      title="Скачать в Excel"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {supplySection === "files" ? (
                  renderFilesContent(true)
                ) : supplySection === "stock" ? (
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
                              Итого:{" "}
                              {processedStock
                                .reduce(
                                  (acc, curr) =>
                                    acc +
                                    (typeof curr["Конечный остаток тн."] ===
                                    "number"
                                      ? curr["Конечный остаток тн."]
                                      : parseFloat(
                                          curr["Конечный остаток тн." as any],
                                        ) || 0),
                                  0,
                                )
                                .toFixed(3)}{" "}
                              тн.
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                            <span className="text-amber-600 dark:text-amber-400 font-black">
                              Тех. отходы:{" "}
                              {processedStock
                                .reduce(
                                  (acc, curr) =>
                                    acc +
                                    (typeof curr["Тех. отходы"] === "number"
                                      ? curr["Тех. отходы"]
                                      : parseFloat(curr["Тех. отходы"] as any) || 0),
                                  0,
                                )
                                .toFixed(3)}{" "}
                              тн.
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                            <span className="text-blue-600 dark:text-blue-400 font-black">
                              Деловые остатки:{" "}
                              {processedStock
                                .reduce(
                                  (acc, curr) =>
                                    acc +
                                    (typeof curr["Деловые остатки"] === "number"
                                      ? curr["Деловые остатки"]
                                      : parseFloat(curr["Деловые остатки"] as any) || 0),
                                  0,
                                )
                                .toFixed(3)}{" "}
                              тн.
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={handleCopyForSheets}
                          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
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
                        className={`overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative ${isStockDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                      >
                        <table className="w-full text-left border-separate border-spacing-0 block md:table">
                          <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800 hidden md:table-header-group">
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
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 block md:table-row-group">
                            {processedStock.map((row, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] p-2 md:p-0 md:bg-transparent"
                              >
                                <td className="px-4 md:px-8 py-3 md:py-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Номенклатура
                                  </span>
                                  <div
                                    className="max-w-[200px] md:max-w-[300px] truncate font-mono text-[10px] text-right md:text-left"
                                    title={row["Исходная Номенклатура"]}
                                  >
                                    {row["Исходная Номенклатура"]}
                                  </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Профиль
                                  </span>
                                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {row["Профиль"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Сталь
                                  </span>
                                  <span>{row["Марка стали"]}</span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Размер
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded">
                                    {row["Размер"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Длина
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-3 py-1.5 rounded-md text-[10px] font-bold ${row["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                  >
                                    {row["Длина"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-8 py-3 md:py-4 text-right flex justify-between items-center md:table-cell min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Тн.
                                  </span>
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
                ) : supplySection === "calc" ? (
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
                            if (activeTab === "supply") {
                              setSupplySection("files");
                            } else if (activeTab === "production") {
                              setProductionSection("files");
                            } else {
                              setActiveTab("production");
                              setProductionSection("files");
                            }
                          }}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-[0_4px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2"
                        >
                          Перейти к загрузке файлов
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>

                        {isProcessing && (
                          <div className="mt-8 flex items-center gap-3 h-12 px-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm shadow-sm border border-slate-200 dark:border-slate-700">
                            <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
                            Идет расчет...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        <div
                          className={`grid grid-cols-1 ${!isPurchasingMode ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}
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
                                ).toLocaleString()}{" "}
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
                                          ).toLocaleString()}{" "}
                                          ₽/тн
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 p-6 rounded-[24px] flex flex-col relative shadow-sm transition-all hover:shadow-md">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 dark:bg-sky-500/10 rounded-bl-[64px] rounded-tr-[24px] pointer-events-none"></div>
                            <div className="z-10 flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-2 h-2 rounded-full bg-sky-500"></div>
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
                                  const headers = [
                                    "НТД",
                                    "Профиль",
                                    "Марка заг.",
                                    "Размер мм.",
                                    "Длина",
                                    "Кол-во тн",
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
                                          curr.lengthType === "НД"
                                            ? "НД"
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
                                        key.split(" | ");
                                      const row: any[] = [
                                        `ГОСТ 2590-2006/${getGostForGrade(grade)}`,
                                        "Круг",
                                        grade,
                                        parseFloat(size) || size,
                                        length,
                                        parseFloat(data.weight.toFixed(3)),
                                      ];
                                      if (!isPurchasingMode)
                                        row.push(Math.round(data.cost));
                                      return row;
                                    });

                                  // Add Total Row
                                  const totalWeight = rows.reduce(
                                    (sum, r) =>
                                      sum +
                                      (typeof r[5] === "number" ? r[5] : 0),
                                    0,
                                  );
                                  const totalRow = [
                                    "ИТОГО",
                                    "",
                                    "",
                                    "",
                                    "",
                                    parseFloat(totalWeight.toFixed(3)),
                                  ];
                                  if (!isPurchasingMode) {
                                    const totalCost = rows.reduce(
                                      (sum, r) =>
                                        sum +
                                        (typeof r[6] === "number" ? r[6] : 0),
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
                                    worksheet["!ref"] || "A1",
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
                                          horizontal: "center",
                                          vertical: "center",
                                        },
                                        border: isTotalRow
                                          ? {
                                              top: { style: "medium" },
                                            }
                                          : undefined,
                                      };
                                    }
                                  }

                                  worksheet["!views"] = [
                                    { state: "frozen", ySplit: 1 },
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
                                    worksheet,
                                    "Итого заготовка",
                                  );
                                  XLSX.writeFile(
                                    workbook,
                                    "Сводка_заготовка.xlsx",
                                  );
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 dark:bg-sky-500/10 hover:bg-sky-100 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 rounded-lg text-xs font-bold transition-colors border border-sky-200 dark:border-sky-500/20 shadow-sm"
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
                                        curr.lengthType === "НД"
                                          ? "НД"
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
                                      key.split(" | ");
                                    return (
                                      <div
                                        key={key}
                                        className="flex justify-between items-center group bg-slate-50 dark:bg-slate-800/30 hover:bg-sky-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800/50 px-2 py-1.5 rounded-lg transition-colors"
                                      >
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-slate-700 dark:text-slate-300 font-bold text-[10px] min-w-[32px]">
                                            {grade}
                                          </span>
                                          <span className="text-slate-500 dark:text-slate-400 font-semibold text-[9px] min-w-[20px]">
                                            {size}
                                          </span>
                                          <span className="text-[8px] text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/30 px-1 py-0.5 rounded font-bold uppercase">
                                            {length}
                                          </span>
                                        </div>
                                        <div className="flex flex-col items-end leading-none gap-0.5">
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="text-sky-700 dark:text-sky-400 font-black text-[10px]">
                                              {data.weight.toFixed(3)}{" "}
                                              <span className="font-medium text-[8px] text-sky-600/60 uppercase">
                                                тн
                                              </span>
                                            </span>
                                          </div>
                                          {!isPurchasingMode && (
                                            <span className="text-[7.5px] text-slate-400 font-medium uppercase">
                                              {Math.round(
                                                data.cost,
                                              ).toLocaleString()}{" "}
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 dark:bg-amber-500/10 rounded-bl-[64px] rounded-tr-[24px] pointer-events-none"></div>
                            <div className="z-10">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                  <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    Коэф. Использования (КИМ)
                                    <div className="group relative z-[100]">
                                      <Info className="w-3.5 h-3.5 text-amber-500/70 hover:text-amber-500 cursor-help transition-colors" />
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-[10.5px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 shadow-xl normal-case tracking-normal">
                                        Показывает, какая часть заготовки идет в
                                        продукцию. Чем ближе к 1.0, тем лучше.
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                                      </div>
                                    </div>
                                  </h3>
                                </div>
                                <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
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
                                <span className="text-sm font-bold text-amber-500/80">
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
                                      .toFixed(3)}{" "}
                                    <span className="text-[10px] font-medium text-slate-400">
                                      тн
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-sky-500/80"></div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                      Деловые остатки
                                    </span>
                                  </div>
                                  <div className="font-bold text-sky-500 dark:text-sky-400 tracking-tight">
                                    {calculationResults
                                      .reduce(
                                        (acc, res) =>
                                          acc +
                                          (res.lengthType === "НД" ||
                                          res.drawLength <= 0
                                            ? 0
                                            : ((res.usefulLength -
                                                res.pcsPerBillet * res.length) /
                                                res.drawLength) *
                                              res.totalWeight),
                                        0,
                                      )
                                      .toFixed(3)}{" "}
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
                                <span className="text-sm font-black text-sky-600 dark:text-sky-400">
                                  {calculationResults
                                    .reduce(
                                      (sum, res) =>
                                        sum + (res.remainingToProcess || 0),
                                      0,
                                    )
                                    .toFixed(3)}{" "}
                                  <span className="text-[10px] font-bold text-slate-500 ml-1">
                                    тн
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-stretch sm:items-center gap-2 sm:gap-4 w-full xl:w-auto">
                              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 hidden sm:block">
                                {calculationResults.length} строк
                              </div>

                              <button
                                onClick={applyAllOptimizations}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 w-full sm:w-auto order-first sm:order-none"
                                title="Применить рекомендуемую длину заготовки ко всем строкам для максимизации КИМ"
                              >
                                <TrendingUp className="w-4 h-4 shadow-sm" />
                                <span className="truncate">
                                  Применить все улучшения КИМ
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  const headers = [
                                    "Внутренняя нумерация",
                                    "Дата отгрузки",
                                    "№ Заказа",
                                    "Клиент",
                                    "Номенклатура",
                                    "Профиль",
                                    "Марка",
                                    "Размер мм.",
                                    "Длина",
                                    "Кол-во тн в заказе",
                                    "ИТОГО остаток к выполнению",
                                    "Номенклатура (заг)",
                                    "Марка заг.",
                                    "Размер мм. (заг)",
                                    "Кол-во тн заг.",
                                    "Длина мм.",
                                    "Тех. отходы",
                                    "Делов. остаток",
                                    "КИМ / Совет"
                                  ];
                                  if (!isPurchasingMode)
                                    headers.push("Цена (руб)", "Сумма (руб)");

                                  const tsvRows = calculationResults.map(
                                    (res) => {
                                      const row = [
                                        res.internalNo || "",
                                        res.shippingDate || "",
                                        res.orderNo || "",
                                        res.client || "",
                                        res.nomenclature || "",
                                        res.type || "",
                                        res.grade || "",
                                        String(res.diameter).replace(".", ","),
                                        res.lengthType === "НД"
                                          ? "НД"
                                          : `МД ${res.length}`,
                                        String(res.weightTons).replace(
                                          ".",
                                          ",",
                                        ),
                                        String(
                                          res.remainingToProcess.toFixed(3),
                                        ).replace(".", ","),
                                        `Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`,
                                        res.grade || "",
                                        String(parseFloat(res.billetDia.toFixed(2))).replace(".", ","),
                                        String(res.totalWeight.toFixed(3)).replace(".", ","),
                                        res.lengthType === "НД" ? "НД" : `МД ${res.billetLength}`,
                                        String((res.drawLength > 0 ? (res.techEnds / res.drawLength) * res.totalWeight : 0).toFixed(3)).replace(".", ","),
                                        String((res.lengthType === "НД" || res.drawLength <= 0 ? 0 : ((res.usefulLength - res.pcsPerBillet * res.length) / res.drawLength) * res.totalWeight).toFixed(3)).replace(".", ","),
                                        String((res.totalWeight > 0 ? res.remainingToProcess / res.totalWeight : 0).toFixed(3)).replace(".", ",")
                                      ];
                                      if (!isPurchasingMode) {
                                        row.push(
                                          String(res.price).replace(".", ","),
                                          String(
                                            res.totalCost.toFixed(0),
                                          ).replace(".", ","),
                                        );
                                      }
                                      return row;
                                    },
                                  );

                                  // Add Totals for Sheets
                                  const totalWeightSh =
                                    calculationResults.reduce(
                                      (sum, r) => sum + r.remainingToProcess,
                                      0,
                                    );
                                  const totalTechSh = calculationResults.reduce(
                                    (sum, r) => sum + (r.drawLength > 0 ? (r.techEnds / r.drawLength) * r.totalWeight : 0), 0
                                  );
                                  const totalDelovSh = calculationResults.reduce(
                                    (sum, r) => sum + (r.lengthType === "НД" || r.drawLength <= 0 ? 0 : ((r.usefulLength - r.pcsPerBillet * r.length) / r.drawLength) * r.totalWeight), 0
                                  );
                                  const totalZagSh = calculationResults.reduce((sum, r) => sum + r.totalWeight, 0);

                                  const totalRowSh = Array(headers.length).fill(
                                    "",
                                  );
                                  totalRowSh[0] = "ИТОГО";
                                  totalRowSh[10] = String(
                                    totalWeightSh.toFixed(3),
                                  ).replace(".", ",");
                                  totalRowSh[14] = String(
                                    totalZagSh.toFixed(3)
                                  ).replace(".", ",");
                                  totalRowSh[16] = String(
                                    totalTechSh.toFixed(3)
                                  ).replace(".", ",");
                                  totalRowSh[17] = String(
                                    totalDelovSh.toFixed(3)
                                  ).replace(".", ",");
                                  totalRowSh[18] = String(
                                    (totalZagSh > 0 ? totalWeightSh / totalZagSh : 0).toFixed(3)
                                  ).replace(".", ",");

                                  const tsv = [headers, ...tsvRows, totalRowSh]
                                    .map((row) => row.join("\t"))
                                    .join("\n");
                                  navigator.clipboard.writeText(tsv);
                                  setCopySuccess(true);
                                  setTimeout(() => setCopySuccess(false), 2000);
                                }}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm w-[calc(50%-0.25rem)] sm:w-auto ${
                                  copySuccess
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
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
                                    <span className="truncate">Sheets</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => {
                                  if (calculationResults.length === 0) return;

                                  const headers = [
                                    "Внутренняя нумерация",
                                    "Дата отгрузки",
                                    "№ Заказа",
                                    "Клиент",
                                    "Номенклатура",
                                    "Профиль",
                                    "Марка",
                                    "Размер мм.",
                                    "Длина",
                                    "Кол-во тн в заказе",
                                    "ИТОГО остаток к выполнению",
                                    "Номенклатура (заг)",
                                    "Марка заг.",
                                    "Размер мм. (заг)",
                                    "Кол-во тн заг.",
                                    "Длина мм.",
                                    "Тех. Отходы",
                                    "Делов. Остаток",
                                    "КИМ / Совет"
                                  ];
                                  if (!isPurchasingMode)
                                    headers.push("Цена (руб)", "Сумма (руб)");

                                  const rows = calculationResults.map((res) => {
                                    const row: any[] = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      parseFloat(res.diameter) || res.diameter,
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      parseFloat(res.weightTons) ||
                                        res.weightTons,
                                      parseFloat(
                                        res.remainingToProcess.toFixed(3),
                                      ),
                                      `Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`,
                                      res.grade || "",
                                      parseFloat(res.billetDia.toFixed(2)),
                                      parseFloat(res.totalWeight.toFixed(3)),
                                      res.lengthType === "НД" ? "НД" : `МД ${res.billetLength}`,
                                      parseFloat((res.drawLength > 0 ? (res.techEnds / res.drawLength) * res.totalWeight : 0).toFixed(3)),
                                      parseFloat((res.lengthType === "НД" || res.drawLength <= 0 ? 0 : ((res.usefulLength - res.pcsPerBillet * res.length) / res.drawLength) * res.totalWeight).toFixed(3)),
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
                                      (typeof r[9] === "number" ? r[9] : 0),
                                    0,
                                  );
                                  const totalRemainingEX = rows.reduce(
                                    (sum, r) =>
                                      sum +
                                      (typeof r[10] === "number" ? r[10] : 0),
                                    0,
                                  );
                                  const totalZagEX = rows.reduce((sum, r) => sum + (typeof r[14] === "number" ? r[14] : 0), 0);
                                  const totalTechEX = rows.reduce((sum, r) => sum + (typeof r[16] === "number" ? r[16] : 0), 0);
                                  const totalDelovEX = rows.reduce((sum, r) => sum + (typeof r[17] === "number" ? r[17] : 0), 0);

                                  const totalRowEX = Array(headers.length).fill(
                                    "",
                                  );
                                  totalRowEX[0] = "ИТОГО";
                                  totalRowEX[9] = parseFloat(
                                    totalInOrderEX.toFixed(3),
                                  );
                                  totalRowEX[10] = parseFloat(
                                    totalRemainingEX.toFixed(3),
                                  );
                                  totalRowEX[14] = parseFloat(totalZagEX.toFixed(3));
                                  totalRowEX[16] = parseFloat(totalTechEX.toFixed(3));
                                  totalRowEX[17] = parseFloat(totalDelovEX.toFixed(3));
                                  totalRowEX[18] = parseFloat((totalZagEX > 0 ? totalRemainingEX / totalZagEX : 0).toFixed(3));

                                  if (!isPurchasingMode) {
                                    totalRowEX[20] = rows.reduce(
                                      (sum, r) =>
                                        sum +
                                        (typeof r[20] === "number" ? r[20] : 0),
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
                                    worksheet["!ref"] || "A1",
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
                                        typeof worksheet[cell_ref].v ===
                                          "number"
                                      ) {
                                        worksheet[cell_ref].t = "n";
                                        if (C === 19 || C === 20) {
                                          worksheet[cell_ref].z = "#,##0 ₽";
                                        } else {
                                          worksheet[cell_ref].z = "#,##0.000";
                                        }
                                      }

                                      worksheet[cell_ref].s = {
                                        font: {
                                          sz: 9,
                                          bold: R === 0 || isTotalRow,
                                        },
                                        alignment: {
                                          horizontal: isCentered
                                            ? "center"
                                            : "left",
                                          vertical: "center",
                                          wrapText: C === 4 || C === 11,
                                        },
                                        border: isTotalRow
                                          ? {
                                              top: { style: "medium" },
                                            }
                                          : undefined,
                                      };
                                    }
                                  }

                                  // Freeze the first row
                                  worksheet["!views"] = [
                                    { state: "frozen", ySplit: 1 },
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
                                    worksheet,
                                    "Заказы",
                                  );
                                  XLSX.writeFile(
                                    workbook,
                                    "Заказы_в_сырье.xlsx",
                                  );
                                }}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors shadow-sm w-[calc(50%-0.25rem)] sm:w-auto"
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
                                <span className="truncate">Excel</span>
                              </button>
                            </div>
                          </div>

                          <div
                            ref={tableContainerRef}
                            onMouseDown={handleMouseDown}
                            onMouseLeave={handleMouseLeaveOrUp}
                            onMouseUp={handleMouseLeaveOrUp}
                            onMouseMove={handleMouseMove}
                            className={`overflow-auto max-h-[60vh] custom-scrollbar relative ${isDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                          >
                            <table className="w-full border-separate border-spacing-0 pointer-events-auto block md:table">
                              <thead className="sticky top-0 z-20 hidden md:table-header-group">
                                <tr className="bg-slate-50/95 dark:bg-[#1A1C19]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(241,245,249,1)] dark:shadow-[0_1px_0_rgba(30,41,59,1)]">
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest w-20">
                                    Внутренняя нумерация
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">
                                    Дата отгрузки
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    № Заказа
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Клиент
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Номенклатура
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Профиль
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Марка
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Размер мм.
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Длина
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Кол-во тн в заказе
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-600 uppercase tracking-widest whitespace-nowrap">
                                    Итого к обеспечению
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Номенклатура
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Марка
                                    <br />
                                    заг.
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Размер мм.
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-emerald-600">
                                    Кол-во тн
                                    <br />
                                    заг.
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                    Длина мм.
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">
                                    Тех.
                                    <br />
                                    Отходы
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">
                                    Делов.
                                    <br />
                                    Остаток
                                  </th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      КИМ / Совет
                                      <div className="group relative z-[100]">
                                        <Info className="w-3.5 h-3.5 text-amber-500/70 hover:text-amber-500 cursor-help transition-colors" />
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
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Цена за 1т
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Сумма
                                      </th>
                                    </>
                                  )}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] block md:table-row-group">
                                {calculationResults.map((res) => (
                                  <tr
                                    key={res.id}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none p-2 md:p-0 rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] md:bg-transparent"
                                  >
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Внутр. нум.
                                      </span>
                                      <div className="text-right md:text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {res.internalNo}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Дата отгр.
                                      </span>
                                      <div className="text-right md:text-center text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {res.shippingDate}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        № Заказа
                                      </span>
                                      <div className="text-right md:text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {res.orderNo}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Клиент
                                      </span>
                                      <div className="text-right md:text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                                        {res.client}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px] md:max-w-[200px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px] shrink-0 mr-2">
                                        Номенклатура
                                      </span>
                                      <div
                                        className="max-w-[150px] md:mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors text-right md:text-center"
                                        title={res.nomenclature}
                                      >
                                        {res.nomenclature}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Профиль
                                      </span>
                                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
                                        {res.type}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Марка
                                      </span>
                                      <div className="text-right md:text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                        {res.grade}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Размер мм.
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                                        {parseFloat(res.diameter.toFixed(2))}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Длина
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"} ml-auto md:ml-0 md:mx-auto`}
                                      >
                                        {res.lengthType === "НД"
                                          ? "НД"
                                          : `МД ${res.length}`}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Кол-во тн
                                      </span>
                                      <div className="text-right md:text-center font-black text-slate-900 dark:text-white whitespace-nowrap">
                                        {res.weightTons.toFixed(3)}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-sky-100 dark:border-sky-900/50 md:border-0 min-h-[44px] bg-sky-50/50 dark:bg-sky-900/10">
                                      <span className="md:hidden font-bold text-sky-600 dark:text-sky-400 uppercase text-[10px]">
                                        ИТОГО ост.
                                      </span>
                                      <div className="text-right md:text-center font-bold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                                        {res.remainingToProcess.toFixed(3)}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Номенклатура заг.
                                      </span>
                                      <div
                                        className="max-w-[150px] md:mx-auto truncate font-medium text-[10px] text-slate-500 text-right md:text-center"
                                        title={`Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`}
                                      >
                                        Круг {getGostForGrade(res.grade)}/ГОСТ
                                        2590-2006
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Марка заг.
                                      </span>
                                      <div className="text-right md:text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                        {res.grade}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Размер мм.
                                      </span>
                                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                                        {parseFloat(res.billetDia.toFixed(2))}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">
                                        Кол-во тн заг.
                                      </span>
                                      <div className="text-right md:text-center font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                        {res.totalWeight.toFixed(3)}
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                        Длина мм.
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"} ml-auto md:ml-0 md:mx-auto`}
                                      >
                                        {res.lengthType === "НД"
                                          ? "НД"
                                          : `МД ${res.billetLength}`}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500/80 uppercase text-[10px]">
                                        Тех. Отходы
                                      </span>
                                      <div className="text-right md:text-center whitespace-nowrap">
                                        <span
                                          className={`font-bold text-red-500/80 block`}
                                        >
                                          {res.drawLength > 0
                                            ? (
                                                (res.techEnds /
                                                  res.drawLength) *
                                                res.totalWeight
                                              ).toFixed(3)
                                            : 0}{" "}
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
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500/80 uppercase text-[10px]">
                                        Делов. Остаток
                                      </span>
                                      <div className="text-right md:text-center whitespace-nowrap">
                                        <span
                                          className={`font-bold text-sky-500/80 block`}
                                        >
                                          {(res.lengthType === "НД" ||
                                          res.drawLength <= 0
                                            ? 0
                                            : ((res.usefulLength -
                                                res.pcsPerBillet * res.length) /
                                                res.drawLength) *
                                              res.totalWeight
                                          ).toFixed(3)}{" "}
                                          тн
                                        </span>
                                        <span
                                          className={`text-[9px] text-slate-400 block`}
                                        >
                                          {(res.lengthType === "НД" ||
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
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500 uppercase text-[10px]">
                                        КИМ / Совет
                                      </span>
                                      <div
                                        className={`flex flex-col items-end md:items-center gap-1`}
                                      >
                                        <span
                                          className={`font-black text-[10px] ${res.remainingToProcess / res.totalWeight < 0.92 ? "text-red-500" : "text-amber-600"}`}
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
                                                        (item.type ===
                                                        "Шестигранник"
                                                          ? 1.03 * 1.003
                                                          : 1.027 * 1.003);
                                                      let newPcs = 0;
                                                      let newActualUL = 0;
                                                      if (
                                                        item.lengthType === "НД"
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
                                              className={`px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold rounded-full shadow-sm shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1`}
                                              title={`Улучшить КИМ до ${res.optimizedKim.toFixed(3)} используя L заг. ${res.optimizedBilletLength}`}
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
                                        <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                          <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                            Цена за 1т
                                          </span>
                                          <div
                                            className={`text-right md:text-center font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap`}
                                          >
                                            {res.price
                                              ? formatCurrency(res.price)
                                              : "—"}
                                          </div>
                                        </td>
                                        <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                          <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                            Сумма
                                          </span>
                                          <div
                                            className={`text-right md:text-center font-bold text-slate-900 dark:text-white whitespace-nowrap`}
                                          >
                                            {res.totalCost
                                              ? formatCurrency(res.totalCost)
                                              : "—"}
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
                ) : supplySection === "calc-stock" ? (
                  <motion.div
                    key="supply-calc-stock"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-8`}
                  >
                    {matchedDemand.length === 0 ? (
                      <div className="bg-white/50 dark:bg-[#1A1C19]/40 border border-slate-200 dark:border-slate-800 rounded-[40px] p-12 flex flex-col items-center justify-center min-h-[500px]">
                        <div className="flex items-center gap-4 sm:gap-8 mb-8 relative">
                          <div className="relative">
                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800/30 z-10 relative">
                              <ClipboardList className="w-10 h-10 text-blue-500" />
                            </div>
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-slate-500">
                              Заявка на обеспечение
                            </span>
                          </div>

                          <div className="flex items-center w-24 sm:w-32">
                            <div
                              className="w-full h-[2px] bg-gradient-to-r from-blue-300 via-slate-300 to-emerald-300 dark:from-blue-600 dark:via-slate-600 dark:to-emerald-600 border border-dashed border-transparent [background-clip:padding-box]"
                              style={{
                                backgroundImage:
                                  "linear-gradient(90deg, transparent 50%, rgba(148, 163, 184, 0.5) 50%)",
                                backgroundSize: "16px 2px",
                              }}
                            ></div>
                          </div>

                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 rounded-full border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-lg transform -translate-y-6">
                            <HelpCircle className="w-6 h-6 text-slate-400" />
                          </div>

                          <div className="relative">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800/30 z-10 relative">
                              <Package className="w-10 h-10 text-emerald-500" />
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
                            if (activeTab === "supply") {
                              setSupplySection("files");
                            } else if (activeTab === "production") {
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
                                <div className="flex items-center px-4 py-1.5 text-sky-600 font-black bg-sky-500/10 border border-sky-500/20 rounded-xl shadow-sm">
                                  <span className="text-[9px] mr-2 uppercase font-bold text-sky-500 opacity-60 tracking-widest">
                                    взято со склада
                                  </span>
                                  <div>
                                    <span className="text-base font-black tracking-tight leading-none text-sky-500">
                                      {filteredTotals.allocated.toFixed(3)}
                                    </span>
                                    <span className="text-[8px] ml-1 uppercase font-bold text-sky-500">
                                      тн
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center px-4 py-1.5 text-rose-600 font-black bg-rose-500/10 border border-rose-500/20 rounded-xl shadow-sm">
                                  <span className="text-[9px] mr-2 uppercase font-bold text-rose-500 opacity-60 tracking-widest">
                                    дефицит
                                  </span>
                                  <div>
                                    <span className="text-base font-black tracking-tight leading-none text-rose-500">
                                      {filteredTotals.deficit.toFixed(3)}
                                    </span>
                                    <span className="text-[8px] ml-1 uppercase font-bold text-rose-500">
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
                                <select
                                  value={statusFilter}
                                  onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                  }
                                  className="bg-transparent border-none outline-none text-xs text-slate-700 dark:text-slate-200"
                                >
                                  <option value="ALL">Все статусы</option>
                                  <option value="OK">Обеспечено</option>
                                  <option value="DEFICIT">Дефицит</option>
                                </select>
                              </div>
                              <button
                                onClick={() => {
                                  if (filteredMatchedDemand.length === 0)
                                    return;
                                  const headers = [
                                    "Внутренняя нумерация",
                                    "Дата отгрузки",
                                    "№ Заказа",
                                    "Клиент",
                                    "Номенклатура",
                                    "Профиль",
                                    "Марка",
                                    "Размер мм.",
                                    "Длина",
                                    "Кол-во тн в заказе",
                                    "ИТОГО остаток к выполнению",
                                    "Взято со склада (тн)",
                                    "ИТОГО остатка к завершению",
                                    "Тех. отходы склад г/к",
                                    "Дел. Остатки склад г/к",
                                    "КИМ склад г/к",
                                    "Исходная Номенклатура",
                                    "Профиль наличия",
                                    "НТД",
                                    "Марка стали наличия",
                                    "Размер наличия",
                                    "Длина (склад г/к)",
                                    "Остаток на складе г/к. (тн)",
                                    "Взято со склада г/к (тн)",
                                    "Свободный остаток г/к склад (тн)",
                                  ];
                                  const rows: string[][] = [];
                                  matchedDemand.forEach((res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      String(res.diameter).replace(".", ","),
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      String(res.weightTons || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(
                                        res.remainingToProcess || 0,
                                      ).replace(".", ","),
                                      String(res.allocatedStock || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(res.shortageStock || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      res.allocatedStock > 0 &&
                                      res.combinedTechWaste > 0
                                        ? String(
                                            res.combinedTechWaste.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedStock > 0 &&
                                      res.combinedUsefulRem > 0
                                        ? String(
                                            res.combinedUsefulRem.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedStock > 0 &&
                                      res.combinedKim > 0
                                        ? String(
                                            res.combinedKim.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
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
                                          outRow[c] = "";
                                      }

                                      const st = res.matchedStockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = String(
                                          st["Размер"] || "",
                                        ).replace(".", ",");
                                        outRow[21] = st["Длина"] || "";
                                        outRow[22] = String(
                                          st.stockBeforeTaking || 0,
                                        ).replace(".", ",");
                                        outRow[23] = String(
                                          st.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[24] = String(
                                          st.stockAfterTaking || 0,
                                        ).replace(".", ",");
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
                                          h +
                                          "</th>",
                                      )
                                      .join("") +
                                    "</tr></thead><tbody>";

                                  matchedDemand.forEach((res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      String(res.diameter).replace(".", ","),
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : "МД " + res.length,
                                      String(res.weightTons || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(
                                        res.remainingToProcess || 0,
                                      ).replace(".", ","),
                                      String(res.allocatedStock || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(res.shortageStock || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(
                                        res.allocatedStock > 0 &&
                                          res.combinedTechWaste > 0
                                          ? res.combinedTechWaste.toFixed(3)
                                          : "0",
                                      ).replace(".", ","),
                                      String(
                                        res.allocatedStock > 0 &&
                                          res.combinedUsefulRem > 0
                                          ? res.combinedUsefulRem.toFixed(3)
                                          : "0",
                                      ).replace(".", ","),
                                      String(
                                        res.allocatedStock > 0 &&
                                          res.combinedKim > 0
                                          ? res.combinedKim.toFixed(3)
                                          : "0",
                                      ).replace(".", ","),
                                    ];
                                    const numRows = Math.max(
                                      1,
                                      res.matchedStockItems?.length || 0,
                                    );
                                    if (res.matchedStockItems?.length === 0) {
                                      rowsHtml +=
                                        "<tr>" +
                                        baseRow
                                          .map(
                                            (v) =>
                                              '<td style="text-align:center;vertical-align:middle;">' +
                                              v +
                                              "</td>",
                                          )
                                          .join("") +
                                        "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                                    } else {
                                      res.matchedStockItems?.forEach(
                                        (stock: any, index: number) => {
                                          const stockRow = [
                                            stock["Исходная Номенклатура"] ||
                                              "",
                                            stock["Профиль"] || "",
                                            stock["НТД"] || "",
                                            stock["Марка стали"] || "",
                                            String(
                                              stock["Размер"] || "",
                                            ).replace(".", ","),
                                            stock["Длина"] || "",
                                            String(
                                              stock.stockBeforeTaking || 0,
                                            ).replace(".", ","),
                                            String(
                                              stock.allocatedAmount || 0,
                                            ).replace(".", ","),
                                            String(
                                              stock.stockAfterTaking || 0,
                                            ).replace(".", ","),
                                          ];
                                          rowsHtml += "<tr>";
                                          if (index === 0) {
                                            baseRow.forEach((v) => {
                                              rowsHtml +=
                                                '<td rowspan="' +
                                                numRows +
                                                '" style="text-align:center;vertical-align:middle;">' +
                                                v +
                                                "</td>";
                                            });
                                          }
                                          stockRow.forEach((v) => {
                                            rowsHtml +=
                                              '<td style="text-align:center;vertical-align:middle;">' +
                                              v +
                                              "</td>";
                                          });
                                          rowsHtml += "</tr>";
                                        },
                                      );
                                    }
                                  });
                                  rowsHtml += "</tbody></table>";

                                  try {
                                    const blobText = new Blob([tsv], {
                                      type: "text/plain",
                                    });
                                    const blobHtml = new Blob([rowsHtml], {
                                      type: "text/html",
                                    });
                                    const item = new ClipboardItem({
                                      "text/html": blobHtml,
                                      "text/plain": blobText,
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
                                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#121411] sm:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                                title="Скопировать для Excel"
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  if (matchedDemand.length === 0) return;
                                  const headers = [
                                    "Внутренняя нумерация",
                                    "Дата отгрузки",
                                    "№ Заказа",
                                    "Клиент",
                                    "Номенклатура",
                                    "Профиль",
                                    "Марка",
                                    "Размер мм.",
                                    "Длина",
                                    "Кол-во тн в заказе",
                                    "ИТОГО остаток к выполнению",
                                    "Взято со склада (тн)",
                                    "ИТОГО остатка к завершению",
                                    "Тех. отходы склад г/к",
                                    "Дел. Остатки склад г/к",
                                    "КИМ склад г/к",
                                    "Исходная Номенклатура",
                                    "Профиль наличия",
                                    "НТД",
                                    "Марка стали наличия",
                                    "Размер наличия",
                                    "Длина (склад г/к)",
                                    "Остаток на складе г/к. (тн)",
                                    "Взято со склада г/к (тн)",
                                    "Свободный остаток г/к склад (тн)",
                                  ];
                                  const rows: any[][] = [];
                                  matchedDemand.forEach((res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      res.diameter,
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      Number(res.weightTons || 0),
                                      Number(res.remainingToProcess || 0),
                                      Number(res.allocatedStock || 0),
                                      Number(res.shortageStock || 0),
                                      res.allocatedStock > 0 &&
                                      res.combinedTechWaste > 0
                                        ? Number(
                                            res.combinedTechWaste.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedStock > 0 &&
                                      res.combinedUsefulRem > 0
                                        ? Number(
                                            res.combinedUsefulRem.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedStock > 0 &&
                                      res.combinedKim > 0
                                        ? Number(res.combinedKim.toFixed(3))
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
                                          outRow[c] = "";
                                      }

                                      const st = res.matchedStockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = st["Размер"] || "";
                                        outRow[21] = st["Длина"] || "";
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
                                    worksheet["!ref"] || "A1:A1",
                                  );
                                  for (let R = 1; R <= range.e.r; ++R) {
                                    for (let c of numberCols) {
                                      const cellAddress = { c: c, r: R };
                                      const cellRef =
                                        XLSX.utils.encode_cell(cellAddress);
                                      if (
                                        worksheet[cellRef] &&
                                        typeof worksheet[cellRef].v === "number"
                                      ) {
                                        worksheet[cellRef].t = "n";
                                        worksheet[cellRef].z =
                                          '#,##0.000" тн."';
                                      }
                                    }
                                  }

                                  const workbook = XLSX.utils.book_new();
                                  XLSX.utils.book_append_sheet(
                                    workbook,
                                    worksheet,
                                    "Расчет с наличием",
                                  );
                                  XLSX.writeFile(
                                    workbook,
                                    "Расчет_с_учетом_наличия.xlsx",
                                  );
                                }}
                                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
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
                                className={`max-h-[60vh] overflow-x-auto overflow-y-auto custom-scrollbar relative ${isSupplyDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                              >
                                <table className="w-full text-left border-separate border-spacing-0">
                                  <thead className="bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm shadow-slate-200 dark:shadow-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-800 [&_th]:bg-slate-50 dark:[&_th]:bg-[#1A1C19]">
                                    <tr>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Вх. №
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Дата отгр.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        № Заказа
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Заказчик
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                        Номенклатура
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Профиль
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        М. стали
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Размер
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Длина
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Кол-во тн в зак.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-600 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                        ИТОГО ост. к выполнению
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Номенклатура
                                        <br />
                                        заг.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Марка
                                        <br />
                                        заг.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Размер
                                        <br />
                                        заг.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest whitespace-nowrap">
                                        Кол-во тн
                                        <br />
                                        заг.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                        Длина мм.
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500/80 uppercase tracking-widest whitespace-nowrap">
                                        Тех.
                                        <br />
                                        Отходы
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500/80 uppercase tracking-widest whitespace-nowrap">
                                        Делов.
                                        <br />
                                        Остаток
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                        КИМ /<br />
                                        Совет
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                        Взято со склада (тн)
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                        ИТОГО ост. к завершению /<br />
                                        после склада г/к
                                      </th>
                                      <th className="px-5 py-2 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap align-middle">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                          <span>Тех. отходы склад г/к</span>
                                          <div className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                                            <span className="text-amber-500/70">
                                              Σ
                                            </span>
                                            <span>
                                              {filteredTotals.techWaste2.toFixed(
                                                3,
                                              )}{" "}
                                              тн
                                            </span>
                                          </div>
                                        </div>
                                      </th>
                                      <th className="px-5 py-2 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap align-middle">
                                        <div className="flex flex-col items-center justify-center gap-1">
                                          <span>Дел. Остатки склад г/к</span>
                                          <div className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                                            <span className="text-amber-500/70">
                                              Σ
                                            </span>
                                            <span>
                                              {filteredTotals.usefulRem2.toFixed(
                                                3,
                                              )}{" "}
                                              тн
                                            </span>
                                          </div>
                                        </div>
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                        КИМ склад г/к
                                      </th>
                                      <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Исход Номенклатура
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Профиль
                                      </th>
                                      <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        НТД
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Марка стали
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Размер
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        Длина
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                        Исх. Остаток (тн)
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                        Взято (тн)
                                      </th>
                                      <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">
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
                                        <tr
                                          key={`${res.id}${stockItem ? `-${stockItem._id}` : ""}`}
                                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                                        >
                                          {/* Demand section (duplicated on sub-rows but dimmed) */}
                                          {!isSubRow && (
                                            <>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center ${res.matchedStockItems.length > 1 ? "font-black text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20" : "text-slate-600 dark:text-slate-400"}`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.internalNo || "—"}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center text-slate-600 dark:text-slate-400`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.shippingDate}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-600 dark:text-slate-400 group relative`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
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
                                                        <span className="font-bold text-emerald-400">
                                                          {res.allocatedStock.toFixed(
                                                            3,
                                                          )}{" "}
                                                          тн
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between items-center gap-3">
                                                        <span className="text-slate-400 text-[9px]">
                                                          Дефицит:
                                                        </span>
                                                        <span className="font-bold text-rose-400">
                                                          {res.shortageStock.toFixed(
                                                            3,
                                                          )}{" "}
                                                          тн
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                                                </div>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap group relative`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
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
                                                        <span className="font-bold text-emerald-400">
                                                          {res.allocatedStock.toFixed(
                                                            3,
                                                          )}{" "}
                                                          тн
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between items-center gap-3">
                                                        <span className="text-slate-400 text-[9px]">
                                                          Дефицит:
                                                        </span>
                                                        <span className="font-bold text-rose-400">
                                                          {res.shortageStock.toFixed(
                                                            3,
                                                          )}{" "}
                                                          тн
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                                                </div>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle text-center max-w-[200px]`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <div
                                                  className="max-w-[150px] mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                                                  title={res.nomenclature}
                                                >
                                                  {res.nomenclature}
                                                </div>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                  {res.type}
                                                </span>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-200`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.grade}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                  {parseFloat(
                                                    res.diameter.toFixed(2),
                                                  )}
                                                </span>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span
                                                  className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                                >
                                                  {res.lengthType === "НД"
                                                    ? "НД"
                                                    : `МД ${res.length}`}
                                                </span>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-900 dark:text-white`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.weightTons.toFixed(3)}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-sky-600 dark:text-sky-400`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.remainingToProcess.toFixed(
                                                  3,
                                                )}
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <div
                                                  className="max-w-[150px] mx-auto truncate font-medium text-[10px] text-slate-500"
                                                  title={`Круг ${getGostForGrade(res.grade)}/ГОСТ 2590-2006`}
                                                >
                                                  Круг{" "}
                                                  {getGostForGrade(res.grade)}
                                                  /ГОСТ 2590-2006
                                                </div>
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-200"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.grade}
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                  {parseFloat(
                                                    res.billetDia.toFixed(2),
                                                  )}
                                                </span>
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-emerald-600 dark:text-emerald-400"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.totalWeight.toFixed(3)}
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span
                                                  className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                                >
                                                  {res.lengthType === "НД"
                                                    ? "НД"
                                                    : `МД ${res.billetLength}`}
                                                </span>
                                              </td>
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span
                                                  className={`font-bold text-red-500/80 block`}
                                                >
                                                  {res.drawLength > 0
                                                    ? (
                                                        (res.techEnds /
                                                          res.drawLength) *
                                                        res.totalWeight
                                                      ).toFixed(3)
                                                    : 0}{" "}
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
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span
                                                  className={`font-bold text-sky-500/80 block`}
                                                >
                                                  {(res.lengthType === "НД" ||
                                                  res.drawLength <= 0
                                                    ? 0
                                                    : ((res.usefulLength -
                                                        res.pcsPerBillet *
                                                          res.length) /
                                                        res.drawLength) *
                                                      res.totalWeight
                                                  ).toFixed(3)}{" "}
                                                  тн
                                                </span>
                                                <span
                                                  className={`text-[9px] text-slate-400 block`}
                                                >
                                                  {(res.lengthType === "НД" ||
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
                                              <td
                                                className="px-5 py-3 align-middle whitespace-nowrap text-center"
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                <span
                                                  className={`font-black tracking-tight ${res.remainingToProcess / res.totalWeight < 0.92 ? "text-red-500" : "text-amber-600"}`}
                                                >
                                                  {(
                                                    res.remainingToProcess /
                                                    res.totalWeight
                                                  ).toFixed(3)}
                                                </span>
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black ${res.allocatedStock > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.allocatedStock > 0
                                                  ? res.allocatedStock.toFixed(
                                                      3,
                                                    )
                                                  : "—"}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black ${res.shortageStock > 0.0005 ? "text-rose-600 dark:text-rose-500" : "text-slate-400"}`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.shortageStock > 0.0005
                                                  ? res.shortageStock.toFixed(3)
                                                  : "—"}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.allocatedStock > 0 &&
                                                res.combinedTechWaste > 0
                                                  ? res.combinedTechWaste.toFixed(
                                                      3,
                                                    )
                                                  : "—"}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.allocatedStock > 0 &&
                                                res.combinedUsefulRem > 0
                                                  ? res.combinedUsefulRem.toFixed(
                                                      3,
                                                    )
                                                  : "—"}
                                              </td>
                                              <td
                                                className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                                rowSpan={Math.max(
                                                  1,
                                                  res.matchedStockItems.length,
                                                )}
                                              >
                                                {res.allocatedStock > 0 &&
                                                res.combinedKim > 0
                                                  ? res.combinedKim.toFixed(3)
                                                  : "—"}
                                              </td>
                                            </>
                                          )}

                                          {stockItem ? (
                                            <>
                                              <td className="px-5 py-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors max-w-[200px] text-left">
                                                <div
                                                  className="max-w-[150px] truncate font-mono text-[10px]"
                                                  title={
                                                    stockItem[
                                                      "Исходная Номенклатура"
                                                    ]
                                                  }
                                                >
                                                  {
                                                    stockItem[
                                                      "Исходная Номенклатура"
                                                    ]
                                                  }
                                                </div>
                                              </td>
                                              <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                  {stockItem["Профиль"]}
                                                </span>
                                              </td>
                                              <td className="px-5 py-4 text-left text-[10px] text-slate-500 max-w-[150px] truncate">
                                                {stockItem["НТД"]}
                                              </td>
                                              <td className="px-5 py-4 text-center">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">
                                                  {stockItem["Марка стали"]}
                                                </span>
                                              </td>
                                              <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                  {stockItem["Размер"]}
                                                </span>
                                              </td>
                                              <td className="px-5 py-4 text-center">
                                                <span
                                                  className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                                                    stockItem["Длина"]
                                                      .toString()
                                                      .includes("МД")
                                                      ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                                                      : "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10"
                                                  }`}
                                                >
                                                  {stockItem["Длина"]}
                                                </span>
                                              </td>
                                              <td className="px-5 py-3 text-center font-bold text-slate-400">
                                                {stockItem.stockBeforeTaking.toFixed(
                                                  3,
                                                )}
                                              </td>
                                              <td className="px-5 py-3 text-center font-black text-emerald-600">
                                                {stockItem.allocatedAmount.toFixed(
                                                  3,
                                                )}
                                              </td>
                                              <td className="px-5 py-3 text-center font-bold text-sky-600">
                                                {stockItem.stockAfterTaking.toFixed(
                                                  3,
                                                )}
                                              </td>
                                            </>
                                          ) : (
                                            <>
                                              <td
                                                className="px-5 py-3 text-slate-400 italic text-left"
                                                colSpan={9}
                                              >
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
                ) : supplySection === "free-stock" ? (
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
                          <div className="flex items-baseline justify-between sm:justify-start px-4 sm:px-5 py-2 sm:py-2.5 text-emerald-600 font-black bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl sm:rounded-2xl w-full sm:w-auto shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                            <span className="text-[11px] sm:text-xs mr-3 uppercase font-bold text-emerald-600/80 tracking-widest">
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
                              <span className="text-[10px] sm:text-[11px] ml-1 uppercase font-bold text-emerald-600/80">
                                тн
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full xl:w-auto">
                          <button
                            onClick={() => {
                              if (freeStock.length === 0) return;
                              const headers = [
                                "Номенклатура",
                                "Профиль",
                                "Сталь",
                                "Размер",
                                "Длина",
                                "Остаток тн.",
                              ];
                              const rows = freeStock.map((row: any) => [
                                row["Исходная Номенклатура"] || "",
                                row["Профиль"] || "",
                                row["Марка стали"] || "",
                                String(row["Размер"]).replace(".", ","),
                                row["Длина"] || "",
                                String(row.remainingStock.toFixed(3)).replace(
                                  ".",
                                  ",",
                                ),
                              ]);

                              const tsv = [headers, ...rows]
                                .map((row) => row.join("\t"))
                                .join("\n");
                              navigator.clipboard.writeText(tsv);
                              setIsCopied(true);
                              setTimeout(() => setIsCopied(false), 2000);
                            }}
                            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#121411] sm:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                            title="Скопировать для Excel"
                          >
                            {isCopied ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (freeStock.length === 0) return;
                              const headers = [
                                "Номенклатура",
                                "Профиль",
                                "Сталь",
                                "Размер",
                                "Длина",
                                "Остаток тн.",
                              ];
                              const excelRows = freeStock.map((row: any) => ({
                                Номенклатура: row["Исходная Номенклатура"],
                                Профиль: row["Профиль"],
                                Сталь: row["Марка стали"],
                                Размер: row["Размер"],
                                Длина: row["Длина"],
                                "Остаток тн.": parseFloat(
                                  row.remainingStock.toFixed(3),
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
                                worksheet["!ref"] || "A1",
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
                                      horizontal: "center",
                                      vertical: "center",
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
                                worksheet,
                                "Свободный остаток",
                              );
                              XLSX.writeFile(
                                workbook,
                                "Свободный_остаток_заготовки.xlsx",
                              );
                            }}
                            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
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
                        className={`overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative ${isFreeStockDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                      >
                        <table className="w-full text-left border-separate border-spacing-0 block md:table">
                          <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800 hidden md:table-header-group">
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
                                Остаток тн.
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 block md:table-row-group">
                            {freeStock.map((row, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] p-2 md:p-0 md:bg-transparent"
                              >
                                <td className="px-4 md:px-8 py-3 md:py-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Номенклатура
                                  </span>
                                  <div
                                    className="max-w-[200px] md:max-w-[300px] truncate font-mono text-[10px] text-right md:text-left"
                                    title={row["Исходная Номенклатура"]}
                                  >
                                    {row["Исходная Номенклатура"]}
                                  </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Профиль
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ml-auto md:ml-0 md:mx-auto">
                                    {row["Профиль"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Сталь
                                  </span>
                                  <span>{row["Марка стали"]}</span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Размер
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                                    {row["Размер"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-6 py-3 md:py-4 text-right md:text-center flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Длина
                                  </span>
                                  <span
                                    className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${row["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"} ml-auto md:ml-0 md:mx-auto`}
                                  >
                                    {row["Длина"]}
                                  </span>
                                </td>
                                <td className="px-4 md:px-8 py-3 md:py-4 text-right flex justify-between items-center md:table-cell min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">
                                    Остаток тн.
                                  </span>
                                  <div>
                                    <span className="text-slate-900 dark:text-white font-black text-xs">
                                      {row.remainingStock.toFixed(3)}
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
                ) : supplySection === "calc-supply" ? (
                  <motion.div
                    key="supply-calc-supply"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`flex flex-col gap-8`}
                  >
                    {supplyCalculationData.matchedDemand.length === 0 ? (
                      <div
                        className={`bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center min-h-[400px]`}
                      >
                        <div
                          className={`w-20 h-20 bg-sky-50 dark:bg-sky-900/20 rounded-[30px] flex items-center justify-center text-sky-500 mb-6`}
                        >
                          <Activity className={`w-10 h-10`} />
                        </div>
                        <h3
                          className={`text-xl font-bold text-slate-900 dark:text-white`}
                        >
                          Нет данных
                        </h3>
                        <p
                          className={`text-sm text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm px-6 leading-relaxed`}
                        >
                          Сначала выполните расчет потребности, загрузите
                          остатки и планы поставок.
                        </p>
                      </div>
                    ) : (
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
                              className={`text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-widest`}
                            >
                              Расчет с учетом поставок
                            </h4>
                            <div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-sky-600 font-black bg-sky-50/80 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-sky-600/80 tracking-widest">
                                  Обеспечено плановыми поставками
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {supplyCalculationData.totals.allocated.toFixed(
                                      3,
                                    )}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-sky-600/70">
                                    тн
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-baseline justify-between sm:justify-start px-3 sm:px-4 py-2 text-rose-600 font-black bg-rose-50/80 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30 rounded-xl sm:rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                                <span className="text-[10px] sm:text-[11px] mr-2 uppercase font-bold text-rose-600/80 tracking-widest">
                                  Дефицит
                                </span>
                                <div>
                                  <span className="text-lg sm:text-xl tracking-tight leading-none">
                                    {supplyCalculationData.totals.deficit.toFixed(
                                      3,
                                    )}
                                  </span>
                                  <span className="text-[9px] sm:text-[10px] ml-1 uppercase font-bold text-rose-600/70">
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                              />
                            </div>
                            <button
                              onClick={() => {
                                if (
                                  supplyCalculationData.matchedDemand.length ===
                                  0
                                )
                                  return;
                                const headers = [
                                  "Внутренняя нумерация",
                                  "Дата отгрузки",
                                  "№ Заказа",
                                  "Клиент",
                                  "Номенклатура",
                                  "Профиль",
                                  "Марка",
                                  "Размер мм.",
                                  "Длина",
                                  "Кол-во тн в заказе",
                                  "ИТОГО остаток к выполнению",
                                  "Взято со склада (тн)",
                                  "Тех. отходы склад г/к",
                                  "Дел. Остатки склад г/к",
                                  "КИМ склад г/к",
                                  "ИТОГО ост. к завершению / после склада г/к",
                                  "Номенклатура склад г/к",
                                  "Профиль наличия",
                                  "НТД",
                                  "Марка наличия",
                                  "Размер наличия",
                                  "Длина (склад г/к)",
                                  "Остаток на складе г/к. (тн)",
                                  "Взято со склада г/к (тн)",
                                  "Свободный остаток г/к склад (тн)",
                                  "Тех. отходы / плановое поступление",
                                  "Дел. Остатки / плановое поступление",
                                  "КИМ / плановое поступление",
                                  "ИТОГО остаток выполнения заказа после расчета / плановое поступление",
                                  "Номенклатура / плановое поступление",
                                  "Профиль / плановое поступление",
                                  "Марка / плановое поступление",
                                  "Размер / плановое поступление",
                                  "Кол-во тн. / плановое поступление",
                                  "Длина / плановое поступление",
                                  "Дата размещения",
                                  "Поставщик",
                                  "Ожидаемая дата поставки",
                                  "Входящий остаток / плановое поступление",
                                  "Взято / плановое поступление",
                                  "Свободный остаток / плановое поступление",
                                ];
                                const rows: string[][] = [];
                                supplyCalculationData.matchedDemand.forEach(
                                  (res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      String(res.diameter).replace(".", ","),
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      String(res.weightTons || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                      String(
                                        res.remainingToProcess || 0,
                                      ).replace(".", ","),

                                      String(
                                        res.allocatedFromStock || 0,
                                      ).replace(".", ","),
                                      res.allocatedFromStock > 0 &&
                                      res.combinedTechWaste2 > 0
                                        ? String(
                                            res.combinedTechWaste2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromStock > 0 &&
                                      res.combinedUsefulRem2 > 0
                                        ? String(
                                            res.combinedUsefulRem2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromStock > 0 &&
                                      res.combinedKim2 > 0
                                        ? String(
                                            res.combinedKim2.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      String(
                                        res.shortageAfterStock || 0,
                                      ).replace(".", ","),
                                    ];
                                    const maxRows = Math.max(
                                      1,
                                      res.stockItems?.length || 0,
                                      res.supplyItems?.length || 0,
                                    );

                                    const rowTemplate = Array(
                                      headers.length,
                                    ).fill("");
                                    for (let i = 0; i < 16; i++)
                                      rowTemplate[i] = baseRow[i];

                                    const supplyBaseCols = [
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedTechWaste3 > 0
                                        ? String(
                                            res.combinedTechWaste3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedUsefulRem3 > 0
                                        ? String(
                                            res.combinedUsefulRem3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedKim3 > 0
                                        ? String(
                                            res.combinedKim3.toFixed(3),
                                          ).replace(".", ",")
                                        : "0",
                                      String(res.finalShortage || 0).replace(
                                        ".",
                                        ",",
                                      ),
                                    ];

                                    for (let i = 25; i < 29; i++)
                                      rowTemplate[i] = supplyBaseCols[i - 25];

                                    for (let r = 0; r < maxRows; r++) {
                                      const outRow = [...rowTemplate];
                                      if (r > 0) {
                                        for (let c = 0; c < 16; c++)
                                          outRow[c] = "";
                                        for (let c = 25; c < 29; c++)
                                          outRow[c] = "";
                                      }

                                      const st = res.stockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = String(
                                          st["Размер"] || "",
                                        ).replace(".", ",");
                                        outRow[21] = st["Длина"] || "";
                                        outRow[22] = String(
                                          st.stockBeforeTaking || 0,
                                        ).replace(".", ",");
                                        outRow[23] = String(
                                          st.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[24] = String(
                                          st.stockAfterTaking || 0,
                                        ).replace(".", ",");
                                      } else {
                                        for (let c = 16; c <= 24; c++)
                                          outRow[c] = "";
                                      }

                                      const sp = res.supplyItems?.[r];
                                      if (sp) {
                                        outRow[29] = getSupplyNomenclature(sp);
                                        outRow[30] = sp["Профиль"] || "";
                                        outRow[31] = sp["Марка стали"] || "";
                                        outRow[32] = String(
                                          sp["Размер"] || "",
                                        ).replace(".", ",");
                                        outRow[33] = String(
                                          sp.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[34] = sp["Длина"] || "";
                                        outRow[35] =
                                          sp["Дата размещения"] || "";
                                        outRow[36] =
                                          sp["Поставщик"] ||
                                          sp["ПОСТАВЩИК"] ||
                                          "";
                                        outRow[37] =
                                          sp["Ожидаемая дата поставки"] ||
                                          sp["ПОСТАВКА"] ||
                                          "";
                                        outRow[38] = String(
                                          sp.stockBeforeTaking || 0,
                                        ).replace(".", ",");
                                        outRow[39] = String(
                                          sp.allocatedAmount || 0,
                                        ).replace(".", ",");
                                        outRow[40] = String(
                                          sp.stockAfterTaking || 0,
                                        ).replace(".", ",");
                                      } else {
                                        for (let c = 29; c <= 40; c++)
                                          outRow[c] = "";
                                      }

                                      rows.push(outRow);
                                    }
                                  },
                                );
                                const tsv = [headers, ...rows]
                                  .map((row) => row.join("\t"))
                                  .join("\n");
                                navigator.clipboard.writeText(tsv);
                                setIsCopied(true);
                                setTimeout(() => setIsCopied(false), 2000);
                              }}
                              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#121411] sm:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                              title="Скопировать для Excel"
                            >
                              {isCopied ? (
                                <Check className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  supplyCalculationData.matchedDemand.length ===
                                  0
                                )
                                  return;
                                const headers = [
                                  "Внутренняя нумерация",
                                  "Дата отгрузки",
                                  "№ Заказа",
                                  "Клиент",
                                  "Номенклатура",
                                  "Профиль",
                                  "Марка",
                                  "Размер мм.",
                                  "Длина",
                                  "Кол-во тн в заказе",
                                  "ИТОГО остаток к выполнению",
                                  "Взято со склада (тн)",
                                  "Тех. отходы склад г/к",
                                  "Дел. Остатки склад г/к",
                                  "КИМ склад г/к",
                                  "ИТОГО ост. к завершению / после склада г/к",
                                  "Номенклатура склад г/к",
                                  "Профиль наличия",
                                  "НТД",
                                  "Марка наличия",
                                  "Размер наличия",
                                  "Длина (склад г/к)",
                                  "Остаток на складе г/к. (тн)",
                                  "Взято со склада г/к (тн)",
                                  "Свободный остаток г/к склад (тн)",
                                  "Тех. отходы / плановое поступление",
                                  "Дел. Остатки / плановое поступление",
                                  "КИМ / плановое поступление",
                                  "ИТОГО остаток выполнения заказа после расчета / плановое поступление",
                                  "Номенклатура / плановое поступление",
                                  "Профиль / плановое поступление",
                                  "Марка / плановое поступление",
                                  "Размер / плановое поступление",
                                  "Кол-во тн. / плановое поступление",
                                  "Длина / плановое поступление",
                                  "Дата размещения",
                                  "Поставщик",
                                  "Ожидаемая дата поставки",
                                  "Входящий остаток / плановое поступление",
                                  "Взято / плановое поступление",
                                  "Свободный остаток / плановое поступление",
                                ];
                                const rows: any[][] = [];
                                supplyCalculationData.matchedDemand.forEach(
                                  (res: any) => {
                                    const baseRow = [
                                      res.internalNo || "",
                                      res.shippingDate || "",
                                      res.orderNo || "",
                                      res.client || "",
                                      res.nomenclature || "",
                                      res.type || "",
                                      res.grade || "",
                                      res.diameter,
                                      res.lengthType === "НД"
                                        ? "НД"
                                        : `МД ${res.length}`,
                                      Number(res.weightTons || 0),
                                      Number(res.remainingToProcess || 0),

                                      Number(res.allocatedFromStock || 0),
                                      res.allocatedFromStock > 0 &&
                                      res.combinedTechWaste2 > 0
                                        ? Number(
                                            res.combinedTechWaste2.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromStock > 0 &&
                                      res.combinedUsefulRem2 > 0
                                        ? Number(
                                            res.combinedUsefulRem2.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromStock > 0 &&
                                      res.combinedKim2 > 0
                                        ? Number(res.combinedKim2.toFixed(3))
                                        : 0,
                                      Number(res.shortageAfterStock || 0),
                                    ];
                                    const maxRows = Math.max(
                                      1,
                                      res.stockItems?.length || 0,
                                      res.supplyItems?.length || 0,
                                    );

                                    const rowTemplate = Array(
                                      headers.length,
                                    ).fill("");
                                    for (let i = 0; i < 16; i++)
                                      rowTemplate[i] = baseRow[i];

                                    const supplyBaseCols = [
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedTechWaste3 > 0
                                        ? Number(
                                            res.combinedTechWaste3.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedUsefulRem3 > 0
                                        ? Number(
                                            res.combinedUsefulRem3.toFixed(3),
                                          )
                                        : 0,
                                      res.allocatedFromSupply > 0 &&
                                      res.combinedKim3 > 0
                                        ? Number(res.combinedKim3.toFixed(3))
                                        : 0,
                                      Number(res.finalShortage || 0),
                                    ];

                                    for (let i = 25; i < 29; i++)
                                      rowTemplate[i] = supplyBaseCols[i - 25];

                                    for (let r = 0; r < maxRows; r++) {
                                      const outRow = [...rowTemplate];
                                      if (r > 0) {
                                        for (let c = 0; c < 16; c++)
                                          outRow[c] = "";
                                        for (let c = 25; c < 29; c++)
                                          outRow[c] = "";
                                      }

                                      const st = res.stockItems?.[r];
                                      if (st) {
                                        outRow[16] =
                                          st["Исходная Номенклатура"] || "";
                                        outRow[17] = st["Профиль"] || "";
                                        outRow[18] = st["НТД"] || "";
                                        outRow[19] = st["Марка стали"] || "";
                                        outRow[20] = st["Размер"] || "";
                                        outRow[21] = st["Длина"] || "";
                                        outRow[22] = Number(
                                          st.stockBeforeTaking || 0,
                                        );
                                        outRow[23] = Number(
                                          st.allocatedAmount || 0,
                                        );
                                        outRow[24] = Number(
                                          st.stockAfterTaking || 0,
                                        );
                                      } else {
                                        for (let c = 16; c <= 24; c++)
                                          outRow[c] = "";
                                      }

                                      const sp = res.supplyItems?.[r];
                                      if (sp) {
                                        outRow[29] = getSupplyNomenclature(sp);
                                        outRow[30] = sp["Профиль"] || "";
                                        outRow[31] = sp["Марка стали"] || "";
                                        outRow[32] = sp["Размер"] || "";
                                        outRow[33] = Number(
                                          sp.allocatedAmount || 0,
                                        );
                                        outRow[34] = sp["Длина"] || "";
                                        outRow[35] =
                                          sp["Дата размещения"] || "";
                                        outRow[36] =
                                          sp["Поставщик"] ||
                                          sp["ПОСТАВЩИК"] ||
                                          "";
                                        outRow[37] =
                                          sp["Ожидаемая дата поставки"] ||
                                          sp["ПОСТАВКА"] ||
                                          "";
                                        outRow[38] = Number(
                                          sp.stockBeforeTaking || 0,
                                        );
                                        outRow[39] = Number(
                                          sp.allocatedAmount || 0,
                                        );
                                        outRow[40] = Number(
                                          sp.stockAfterTaking || 0,
                                        );
                                      } else {
                                        for (let c = 29; c <= 40; c++)
                                          outRow[c] = "";
                                      }

                                      rows.push(outRow);
                                    }
                                  },
                                );

                                const worksheet = XLSX.utils.aoa_to_sheet([
                                  headers,
                                  ...rows,
                                ]);
                                const numberCols = [
                                  9, 10, 11, 12, 13, 15, 22, 23, 24, 25, 26, 28,
                                  33, 38, 39, 40,
                                ];
                                const range = XLSX.utils.decode_range(
                                  worksheet["!ref"] || "A1:A1",
                                );
                                for (let R = 1; R <= range.e.r; ++R) {
                                  for (let c of numberCols) {
                                    const cellAddress = { c: c, r: R };
                                    const cellRef =
                                      XLSX.utils.encode_cell(cellAddress);
                                    if (
                                      worksheet[cellRef] &&
                                      typeof worksheet[cellRef].v === "number"
                                    ) {
                                      worksheet[cellRef].t = "n";
                                      worksheet[cellRef].z = '#,##0.000" тн."';
                                    }
                                  }
                                }

                                const workbook = XLSX.utils.book_new();
                                XLSX.utils.book_append_sheet(
                                  workbook,
                                  worksheet,
                                  "Расчет_поставки",
                                );
                                XLSX.writeFile(
                                  workbook,
                                  "Расчет_с_учетом_поставок.xlsx",
                                );
                              }}
                              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"
                              title="Скачать в Excel"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div
                          ref={supplyTableRef}
                          onMouseDown={onSupplyMouseDown}
                          onMouseLeave={handleMouseLeaveOrUp}
                          onMouseUp={handleMouseLeaveOrUp}
                          onMouseMove={handleMouseMove}
                          className={`overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar ${isSupplyDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
                        >
                          <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm shadow-slate-200 dark:shadow-slate-800 outline outline-1 outline-slate-200 dark:outline-slate-800 [&_th]:bg-[#F8FAFC] dark:[&_th]:bg-[#1A1C19]">
                              <tr>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Внутренняя нумерация
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Дата отгрузки
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  № Заказа
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Клиент
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  Номенклатура
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Профиль
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Марка
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Размер мм.
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Длина
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Кол-во тн в заказе
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-600 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО остаток к выполнению
                                </th>

                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято со склада (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Тех. отходы склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Дел. Остатки склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  КИМ склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО ост. к завершению /<br />
                                  после склада г/к
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Номенклатура склад г/к
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Профиль наличия
                                </th>
                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  НТД
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Марка наличия
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Размер наличия
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Длина (склад г/к)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Остаток на складе г/к. (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято со склада г/к (тн)
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  Свободный остаток г/к склад (тн)
                                </th>

                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Тех. отходы /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  Дел. Остатки /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                  КИМ /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap border-r border-slate-200 dark:border-slate-700">
                                  ИТОГО остаток выполнения заказа после расчета
                                  /<br />
                                  плановое поступление
                                </th>

                                <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Номенклатура /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Профиль /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Марка /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Размер /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                  Кол-во тн. /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Длина /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Дата размещения
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Поставщик
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                  Ожидаемая дата поставки
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap border-l border-slate-100 dark:border-slate-800">
                                  Входящий остаток /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">
                                  Взято /<br />
                                  плановое поступление
                                </th>
                                <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">
                                  Свободный остаток /<br />
                                  плановое поступление
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                              {supplyCalculationData.matchedDemand
                                .filter((res) => {
                                  if (!searchQuery) return true;
                                  const q = searchQuery.toLowerCase();
                                  return (
                                    (res.orderNo || "")
                                      .toLowerCase()
                                      .includes(q) ||
                                    (res.client || "")
                                      .toLowerCase()
                                      .includes(q) ||
                                    (res.nomenclature || "")
                                      .toLowerCase()
                                      .includes(q)
                                  );
                                })
                                .map((res: any, idx) => {
                                  const maxRows = Math.max(
                                    1,
                                    res.stockItems?.length || 0,
                                    res.supplyItems?.length || 0,
                                  );
                                  const renderRows = [];

                                  for (let i = 0; i < maxRows; i++) {
                                    const stockItem = res.stockItems?.[i];
                                    const supplyItem = res.supplyItems?.[i];
                                    const isSubRow = i > 0;

                                    renderRows.push(
                                      <tr
                                        key={`${res._dId}-${i}`}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                                      >
                                        {!isSubRow && (
                                          <>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.internalNo || ""}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.shippingDate}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-600 dark:text-slate-400`}
                                              rowSpan={maxRows}
                                            >
                                              {res.orderNo}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle text-center font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap`}
                                              rowSpan={maxRows}
                                            >
                                              {res.client}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle text-center max-w-[200px] border-r border-slate-100 dark:border-slate-800`}
                                              rowSpan={maxRows}
                                            >
                                              <div
                                                className="max-w-[150px] mx-auto truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"
                                                title={res.nomenclature}
                                              >
                                                {res.nomenclature}
                                              </div>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {res.type}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-700 dark:text-slate-200`}
                                              rowSpan={maxRows}
                                            >
                                              {res.grade}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                {parseFloat(
                                                  Number(res.diameter).toFixed(
                                                    2,
                                                  ),
                                                )}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center`}
                                              rowSpan={maxRows}
                                            >
                                              <span
                                                className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${res.lengthType === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                              >
                                                {res.lengthType === "НД"
                                                  ? "НД"
                                                  : `МД ${res.length}`}
                                              </span>
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-900 dark:text-white`}
                                              rowSpan={maxRows}
                                            >
                                              {res.weightTons
                                                ? Number(
                                                    res.weightTons,
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-sky-600 dark:text-sky-400 border-r border-slate-100 dark:border-slate-800`}
                                              rowSpan={maxRows}
                                            >
                                              {res.remainingToProcess
                                                ? Number(
                                                    res.remainingToProcess,
                                                  ).toFixed(3)
                                                : "0.000"}
                                            </td>

                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black ${res.allocatedFromStock > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0
                                                ? res.allocatedFromStock.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedTechWaste2 > 0
                                                ? res.combinedTechWaste2.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedUsefulRem2 > 0
                                                ? res.combinedUsefulRem2.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromStock > 0 &&
                                              res.combinedKim2 > 0
                                                ? res.combinedKim2.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black border-r border-slate-100 dark:border-slate-800 ${res.shortageAfterStock > 0.0005 ? "text-rose-600 dark:text-rose-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.shortageAfterStock > 0
                                                ? res.shortageAfterStock.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Stock Item details (per row) */}
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500">
                                          {stockItem ? (
                                            <div
                                              className="max-w-[150px] truncate font-medium text-[10px]"
                                              title={
                                                stockItem[
                                                  "Исходная Номенклатура"
                                                ]
                                              }
                                            >
                                              {
                                                stockItem[
                                                  "Исходная Номенклатура"
                                                ]
                                              }
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500">
                                          {stockItem && stockItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {stockItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500 font-mono text-[9px]">
                                          {stockItem
                                            ? stockItem["НТД"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-500">
                                          {stockItem
                                            ? stockItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {stockItem && stockItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                              {stockItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {stockItem && stockItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${stockItem["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                            >
                                              {stockItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400">
                                          {stockItem
                                            ? Number(
                                                stockItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-emerald-600 dark:text-emerald-500">
                                          {stockItem
                                            ? Number(
                                                stockItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-sky-500 border-r border-slate-100 dark:border-slate-800">
                                          {stockItem
                                            ? Number(
                                                stockItem.stockAfterTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>

                                        {/* Supply general metrics (rowSpan) */}
                                        {!isSubRow && (
                                          <>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedTechWaste3 > 0
                                                ? res.combinedTechWaste3.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedUsefulRem3 > 0
                                                ? res.combinedUsefulRem3.toFixed(
                                                    3,
                                                  )
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-amber-600`}
                                              rowSpan={maxRows}
                                            >
                                              {res.allocatedFromSupply > 0 &&
                                              res.combinedKim3 > 0
                                                ? res.combinedKim3.toFixed(3)
                                                : "0.000"}
                                            </td>
                                            <td
                                              className={`px-5 py-3 align-middle whitespace-nowrap text-center font-black border-r border-slate-100 dark:border-slate-800 ${res.finalShortage > 0.0005 ? "text-rose-600 dark:text-rose-500" : "text-slate-400"}`}
                                              rowSpan={maxRows}
                                            >
                                              {res.finalShortage > 0
                                                ? res.finalShortage.toFixed(3)
                                                : "0.000"}
                                            </td>
                                          </>
                                        )}

                                        {/* Supply Item details (per row) */}
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-left text-slate-500">
                                          {supplyItem ? (
                                            <div
                                              className="max-w-[150px] truncate font-medium text-[10px]"
                                              title={getSupplyNomenclature(
                                                supplyItem,
                                              )}
                                            >
                                              {getSupplyNomenclature(
                                                supplyItem,
                                              )}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500">
                                          {supplyItem &&
                                          supplyItem["Профиль"] ? (
                                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800">
                                              {supplyItem["Профиль"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-bold text-slate-500">
                                          {supplyItem
                                            ? supplyItem["Марка стали"] || ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {supplyItem &&
                                          supplyItem["Размер"] ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                              {supplyItem["Размер"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center">
                                          {supplyItem && supplyItem["Длина"] ? (
                                            <span
                                              className={`inline-flex items-center px-2 py-1 rounded-md text-[9px] font-bold ${supplyItem["Длина"] === "НД" ? "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10" : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"}`}
                                            >
                                              {supplyItem["Длина"]}
                                            </span>
                                          ) : (
                                            ""
                                          )}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-mono text-[9px]">
                                          {supplyItem
                                            ? supplyItem["Дата размещения"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-medium text-[9px] truncate max-w-[120px]">
                                          {supplyItem
                                            ? supplyItem["Поставщик"] ||
                                              supplyItem["ПОСТАВЩИК"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center text-slate-500 font-mono text-[9px] font-bold">
                                          {supplyItem
                                            ? supplyItem[
                                                "Ожидаемая дата поставки"
                                              ] ||
                                              supplyItem["ПОСТАВКА"] ||
                                              ""
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-slate-400 border-l border-slate-100 dark:border-slate-800">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.stockBeforeTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-emerald-600 dark:text-emerald-500">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.allocatedAmount,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                        <td className="px-5 py-3 align-middle whitespace-nowrap text-center font-black text-sky-500">
                                          {supplyItem
                                            ? Number(
                                                supplyItem.stockAfterTaking,
                                              ).toFixed(3)
                                            : ""}
                                        </td>
                                      </tr>,
                                    );
                                  }
                                  return (
                                    <Fragment key={res.id || idx}>
                                      {renderRows}
                                    </Fragment>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : supplySection === "supply-plans" ? (
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
                                .toFixed(3)}{" "}
                              тн
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-300px)] min-h-[400px] relative cursor-auto">
                        <table className="w-full text-left border-separate border-spacing-0 block md:table">
                          <thead className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 bg-[#F8FAFC] dark:bg-[#1A1C19] sticky top-0 z-20 shadow-sm outline outline-1 outline-slate-200 dark:outline-slate-800 hidden md:table-header-group">
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
                          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-[11px] font-medium text-slate-600 dark:text-slate-300 block md:table-row-group">
                            {processedSupplyPlans.map((row, i) => (
                              <tr
                                key={i}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none rounded-xl md:rounded-none bg-white dark:bg-[#1A1C19] p-2 md:p-0 md:bg-transparent"
                              >
                                <td className="px-4 py-3 md:py-2.5 flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Профиль</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    {row["Профиль"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center font-bold text-slate-700 dark:text-slate-200 flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Марка</span>
                                  {row["Марка"]}
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Размер</span>
                                  <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-mono font-bold bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded">
                                    {row["Размер"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center font-black text-slate-900 dark:text-white flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Кол-во</span>
                                  <span>
                                    {row["Кол-во"]?.toFixed(3)}{" "}
                                    <span className="text-[10px] text-slate-400 font-bold ml-0.5">
                                      тн
                                    </span>
                                  </span>
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Длина</span>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                                    {row["Длина"]}
                                  </span>
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center text-slate-500 dark:text-slate-400 font-mono flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Размещено</span>
                                  {row["Дата размещения"]}
                                </td>
                                <td className="px-4 py-3 md:py-2.5 text-right md:text-center flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Поставка</span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-500">
                                    {row["Ожидаемая дата поставки"]}
                                  </span>
                                </td>
                                <td
                                  className="px-4 py-3 md:py-2.5 truncate max-w-[150px] flex justify-between items-center md:table-cell py-3 md:py-2.5 border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]"
                                  title={row["Поставщик"]}
                                >
                                  <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Поставщик</span>
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
                ) : null}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Content tabs */}

    </>
  );
}
