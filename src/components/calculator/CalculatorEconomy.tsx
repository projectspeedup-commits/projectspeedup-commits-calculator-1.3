import { AlertCircle, Briefcase, Calculator, Circle, HelpCircle, Minus, PieChart, Plus, TrendingUp } from "lucide-react";
import { formatCurrency, formatInputValue, handleNumericInput } from "../../lib/constants";

export function CalculatorEconomy({
  sellPrice,
  setSellPrice,
  orderWeight,
  validationErrors,
  commercialStats,
  currentAdminRawPrice,
  advancedRemnantStats,
  isEconomyExpanded,
  setIsEconomyExpanded,
  totalPiecesInOrder
}: any) {
  return (
    <>
                {/* COMMERCIAL COMMERCE SECTION */}
                <section className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-6 print-shadow-none relative overflow-hidden z-10 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                  <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 relative z-10">
                    <div className="p-2 bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-sm">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-medium tracking-tight text-[#1A1C19] dark:text-white">
                      Коммерческий расчет
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-[#222421] border border-slate-200 dark:border-slate-700 p-4 rounded-[16px] relative z-10 shadow-sm transition-colors">
                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 truncate">
                        Продажа за 1 т (без НДС)
                      </label>
                      <div className="relative">
  <input
    type="text"
    inputMode="decimal"
    placeholder="55 000"
    value={formatInputValue(sellPrice)}
    onChange={(e) => handleNumericInput(e, setSellPrice)}
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.sellPrice ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg pl-3 pr-10 h-10 text-sm font-medium transition-all focus:border-slate-800 dark:focus:border-white focus:bg-slate-200 dark:focus:bg-slate-700 focus:outline-none dark:text-white placeholder:text-slate-400`}
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-xs">
    руб
  </span>
  {validationErrors.sellPrice && (
    <div className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.sellPrice}
    </div>
  )}
</div>
                    </div>

                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 truncate">
                        Сумма заказа (без НДС)
                      </label>
                      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-10 flex items-center justify-between transition-colors">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate pl-1">
                          {sellPrice && orderWeight
                            ? formatCurrency(commercialStats?.sellTotal)
                            : "0,00"}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium ml-1 text-xs">
                          руб
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 truncate">
                        Сумма (с НДС 22%)
                      </label>
                      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-10 flex items-center justify-between transition-colors">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate pl-1">
                          {sellPrice && orderWeight
                            ? formatCurrency(commercialStats?.sellTotalVat)
                            : "0,00"}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium ml-1 text-xs">
                          руб
                        </span>
                      </div>
                    </div>
                  </div>

                  {commercialStats && (
                    <div className="bg-slate-50 dark:bg-[#222421] border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-[16px] space-y-6 mt-4 relative z-10 shadow-sm transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 pl-1">
                        {/* Per Ton Calculation */}
                        <div className="space-y-4">
                          <h4 className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                            <span>На 1 тонну продукции (без НДС)</span>
                            <TrendingUp className="w-3.5 h-3.5 opacity-60" />
                          </h4>
                          <div className="space-y-3.5 text-[13px]">
                            <div className="flex justify-between items-start gap-4 font-medium group">
                              <span className="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors shrink-0">
                                Продажная цена:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-right leading-tight">
                                {formatCurrency(sellPrice)} руб.
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4 text-[#BA1A1A] dark:text-red-400/90 font-medium group">
                              <span className="group-hover:text-[#BA1A1A] transition-colors shrink-0 leading-tight">
                                - Стоимость заготовки:
                              </span>
                              <span className="font-bold text-right leading-tight">
                                {currentAdminRawPrice
                                  ? `${formatCurrency(currentAdminRawPrice)} руб.`
                                  : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4 text-[#BA1A1A] dark:text-red-400/90 font-medium group">
                              <span className="group-hover:text-[#BA1A1A] transition-colors shrink-0 leading-tight">
                                - Прямые затраты:
                              </span>
                              <span className="font-bold text-right leading-tight">
                                {formatCurrency(
                                  commercialStats.totalProcessingCostsPerTon,
                                )}{" "}
                                руб.
                              </span>
                            </div>

                            {commercialStats.economyData.filter(
                              (i) =>
                                i.category === "direct" && i.costPerTon > 0,
                            ).length > 0 && (
                              <div className="space-y-1.5 pl-2 border-l border-slate-200 dark:border-slate-800 ml-1.5 mb-1">
                                {commercialStats.economyData
                                  .filter(
                                    (i) =>
                                      i.category === "direct" &&
                                      i.costPerTon > 0,
                                  )
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between text-[11px] text-[#BA1A1A]/70 dark:text-red-400/70 font-medium tracking-tight"
                                    >
                                      <span className="truncate pr-4 leading-none">
                                        └ {item.name}:
                                      </span>
                                      <span className="shrink-0 leading-none">
                                        {formatCurrency(item.costPerTon)} ₽
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}

                            <div className="flex justify-between items-start gap-4 text-[#BA1A1A] dark:text-red-400/90 font-medium group">
                              <span className="group-hover:text-[#BA1A1A] transition-colors shrink-0 leading-tight">
                                - Затраты на отходы:
                              </span>
                              <span className="font-bold text-right leading-tight">
                                {formatCurrency(commercialStats.lossesPerTon)}{" "}
                                руб.
                              </span>
                            </div>

                            {commercialStats.scrapRevenuePerTon > 0 &&
                              advancedRemnantStats && (
                                <div className="mt-4 bg-[#E6F4EA]/50 dark:bg-green-950/20 px-3.5 py-3 rounded-[14px] border border-[#CEEAD6] dark:border-green-900/30 flex flex-col gap-2 transition-colors">
                                  <div className="flex justify-between items-start gap-4 text-[#0D652D] dark:text-green-400 font-bold text-[12px]">
                                    <span>+ Возврат лома / остатков:</span>
                                    <span className="text-right">
                                      {formatCurrency(
                                        commercialStats.scrapRevenuePerTon,
                                      )}{" "}
                                      руб.
                                    </span>
                                  </div>
                                  <div className="space-y-1 pl-1">
                                    <div className="flex justify-between text-[11px] text-[#0D652D]/80 dark:text-green-400/80 font-medium">
                                      <span>
                                        Лом (
                                        {(
                                          advancedRemnantStats.techTonsPerTon *
                                          1000
                                        ).toFixed(1)}{" "}
                                        кг):
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          advancedRemnantStats.techScrapRevenuePerTon,
                                        )}{" "}
                                        руб.
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-[#0D652D]/80 dark:text-green-400/80 font-medium">
                                      <span>
                                        Деловой остаток (
                                        {(
                                          advancedRemnantStats.remTonsPerTon *
                                          1000
                                        ).toFixed(1)}{" "}
                                        кг):
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          advancedRemnantStats.remnantRevenuePerTon,
                                        )}{" "}
                                        руб.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="pt-5 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                              <div className="flex items-center gap-1.5 group/margin cursor-help">
                                <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">
                                  Валовая прибыль (Маржа):
                                </span>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover/margin:text-sky-500 transition-colors" />

                                {/* Tooltip */}
                                <div className="absolute z-50 bottom-full left-0 mb-2 invisible opacity-0 group-hover/margin:visible group-hover/margin:opacity-100 transition-all bg-slate-800 text-white text-xs p-3 rounded-xl shadow-xl w-64 translate-y-2 group-hover/margin:translate-y-0 pointer-events-none">
                                  <strong>Внимание на цвет!</strong>
                                  <br />
                                  <span className="text-emerald-400">
                                    Зеленый
                                  </span>{" "}
                                  — отличная маржа.
                                  <br />
                                  <span className="text-amber-400">
                                    Желтый
                                  </span>{" "}
                                  — повышенный риск.
                                  <br />
                                  <span className="text-rose-400">
                                    Красный
                                  </span>{" "}
                                  — сделка убыточна (меньше норматива).
                                  <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-slate-800 rotate-45"></div>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 group/profit">
                                <span
                                  className={`font-bold tracking-tight text-2xl leading-none whitespace-nowrap group-hover/profit:animate-[color-cycle_3s_ease-in-out_infinite] ${commercialStats.isPositive ? "text-[#0D652D] dark:text-green-400" : "text-[#BA1A1A] dark:text-red-400"}`}
                                >
                                  {commercialStats.isPositive ? "+" : ""}
                                  {formatCurrency(
                                    commercialStats.profitPerTon,
                                  )}{" "}
                                  <span className="text-sm font-medium">
                                    руб.
                                  </span>
                                </span>
                                <span
                                  className={`text-[10px] font-black px-2 py-0.5 rounded-md border shadow-sm group-hover/profit:animate-[color-cycle-bg_3s_ease-in-out_infinite] ${commercialStats.isPositive ? "bg-[#E6F4EA] dark:bg-green-900/40 border-[#CEEAD6] dark:border-green-900/50 text-[#0D652D] dark:text-green-400" : "bg-[#FFDAD6] dark:bg-red-900/40 border-[#FFB4AB] dark:border-red-900/50 text-[#BA1A1A] dark:text-red-400"}`}
                                >
                                  {commercialStats.isPositive ? "+" : ""}
                                  {commercialStats.marginPercent.toFixed(1)}%
                                </span>
                                <style>{`
                            @keyframes color-cycle {
                              0% { color: #f87171; } /* red-400 */
                              50% { color: #fbbf24; } /* amber-400 */
                              100% { color: #4ade80; } /* green-400 */
                            }
                            @keyframes color-cycle-bg {
                              0% { background-color: rgba(153, 27, 27, 0.4); border-color: rgba(153, 27, 27, 0.5); color: #f87171; }
                              50% { background-color: rgba(146, 64, 14, 0.4); border-color: rgba(146, 64, 14, 0.5); color: #fbbf24; }
                              100% { background-color: rgba(20, 83, 45, 0.4); border-color: rgba(20, 83, 45, 0.5); color: #4ade80; }
                            }
                          `}</style>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Total Order Calculation */}
                        <div className="space-y-4">
                          <h4 className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                            <span>
                              На весь заказ ({totalPiecesInOrder} шт.)
                            </span>
                            <BarChart3 className="w-3.5 h-3.5 opacity-60" />
                          </h4>
                          <div className="space-y-3.5 text-[13px]">
                            <div className="flex justify-between items-start gap-4 font-medium">
                              <span className="text-slate-500 dark:text-slate-400 shrink-0">
                                Сумма продажи:
                              </span>
                              <span className="font-bold text-slate-900 dark:text-white text-right leading-tight">
                                {formatCurrency(commercialStats.sellTotal)} руб.
                              </span>
                            </div>
                            <div className="flex justify-between items-start gap-4 text-[#BA1A1A] dark:text-red-400/90 font-medium">
                              <span className="shrink-0">- Все затраты:</span>
                              <span className="font-bold text-right leading-tight">
                                {formatCurrency(
                                  commercialStats.totalCostsPerTon *
                                    Number(orderWeight),
                                )}{" "}
                                руб.
                              </span>
                            </div>
                            {commercialStats.scrapRevenueTotal > 0 &&
                              advancedRemnantStats && (
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-start gap-4 text-[#0D652D] dark:text-green-400 font-bold">
                                    <span className="shrink-0">
                                      + Общий возврат:
                                    </span>
                                    <span className="text-right leading-tight">
                                      {formatCurrency(
                                        commercialStats.scrapRevenueTotal,
                                      )}{" "}
                                      руб.
                                    </span>
                                  </div>
                                  <div className="space-y-1.5 pl-1.5">
                                    <div className="flex justify-between text-[11px] text-[#0D652D]/80 dark:text-green-400/80 font-semibold">
                                      <span>
                                        Лом (
                                        {advancedRemnantStats.orderTechTons.toFixed(
                                          3,
                                        )}{" "}
                                        т):
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          advancedRemnantStats.orderTechRevenue,
                                        )}{" "}
                                        руб.
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-[#0D652D]/80 dark:text-green-400/80 font-semibold">
                                      <span>
                                        Деловой остаток (
                                        {advancedRemnantStats.orderRemTons.toFixed(
                                          3,
                                        )}{" "}
                                        т):
                                      </span>
                                      <span>
                                        {formatCurrency(
                                          advancedRemnantStats.orderRemRevenue,
                                        )}{" "}
                                        руб.
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                            <div className="mt-4 p-4 bg-slate-100/80 dark:bg-slate-800/60 rounded-[18px] border border-slate-200/50 dark:border-slate-700/50 space-y-3 transition-colors">
                              <div className="flex justify-between items-start gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                <span className="shrink-0 uppercase tracking-widest leading-none">
                                  Налог (НДС 22%):
                                </span>
                                <span className="text-right leading-none">
                                  {formatCurrency(
                                    commercialStats.sellTotalVat -
                                      commercialStats.sellTotal,
                                  )}{" "}
                                  руб.
                                </span>
                              </div>
                              <div className="border-t border-slate-200 dark:border-slate-700/80 pt-3 flex justify-between items-center gap-3">
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                  Итого с НДС
                                </span>
                                <span className="text-xl font-bold text-slate-900 dark:text-white leading-none whitespace-nowrap">
                                  {formatCurrency(commercialStats.sellTotalVat)}{" "}
                                  <span className="text-xs font-bold opacity-60 ml-0.5">
                                    ₽
                                  </span>
                                </span>
                              </div>
                            </div>

                            <div className="pt-3 flex flex-col gap-2">
                              <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">
                                Чистая прибыль (всего):
                              </span>
                              <span
                                className={`font-bold tracking-tight text-2xl leading-none whitespace-nowrap ${commercialStats.isPositive ? "text-[#0D652D] dark:text-green-400" : "text-[#BA1A1A] dark:text-red-400"}`}
                              >
                                {commercialStats.isPositive ? "+" : ""}
                                {formatCurrency(
                                  commercialStats.profitTotal,
                                )}{" "}
                                <span className="text-sm font-medium">
                                  руб.
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* DETAILED PRODUCTION ECONOMY SECTION */}
                  {commercialStats && (
                    <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all focus-within:ring-2 focus-within:ring-slate-400">
                      <button
                        onClick={() => setIsEconomyExpanded(!isEconomyExpanded)}
                        className="w-full px-5 py-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                            <Calculator className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div className="text-left">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                              Экономика производства
                            </h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">
                              Детализация затрат на тоннну:{" "}
                              <span className="text-slate-900 dark:text-slate-200 font-bold">
                                {formatCurrency(
                                  commercialStats.totalProcessingCostsPerTon,
                                )}{" "}
                                руб.
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#4A6572] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg hidden sm:block">
                            {isEconomyExpanded ? "СВЕРНУТЬ" : "РАСКРЫТЬ ДЕТАЛИ"}
                          </span>
                          {isEconomyExpanded ? (
                            <Minus className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Plus className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      <div
                        id="economy-breakdown"
                        className={`${isEconomyExpanded ? "block" : "hidden"} border-t border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-[#222421]/50`}
                      >
                        {/* Direct Costs */}
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Circle className="w-1.5 h-1.5 fill-blue-500 text-blue-500" />
                              Состав прямых затрат
                            </h4>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              {formatCurrency(
                                commercialStats.directEconomyCostsPerTon,
                              )}{" "}
                              руб./т
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {commercialStats.economyData
                              .filter(
                                (i) =>
                                  i.category === "direct" && i.costPerTon > 0,
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="bg-white dark:bg-[#1A1C19] p-3 rounded-[18px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 truncate pr-2">
                                      {item.name}
                                    </span>
                                    <TrendingUp className="w-3 h-3 text-slate-300 shrink-0" />
                                  </div>
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        Норма на тн:
                                      </span>
                                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(item.costPerTon)} ₽
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-1.5">
                                      <span className="text-[10px] text-slate-500 font-medium">
                                        Сумма на весь заказ:
                                      </span>
                                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                        {formatCurrency(
                                          item.costPerTon * Number(orderWeight),
                                        )}{" "}
                                        ₽
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Overhead Costs */}
                        {commercialStats.economyData.filter(
                          (i) => i.category === "overhead" && i.costPerTon > 0,
                        ).length > 0 && (
                          <div className="p-5 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Circle className="w-1.5 h-1.5 fill-amber-500 text-amber-500" />
                                Общие/Накладные расходы
                              </h4>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {formatCurrency(
                                  commercialStats.overheadEconomyCostsPerTon,
                                )}{" "}
                                руб./т
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {commercialStats.economyData
                                .filter(
                                  (i) =>
                                    i.category === "overhead" &&
                                    i.costPerTon > 0,
                                )
                                .map((item) => (
                                  <div
                                    key={item.id}
                                    className="bg-white dark:bg-[#1A1C19] p-3 rounded-[18px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 truncate pr-2">
                                        {item.name}
                                      </span>
                                      <PieChart className="w-3 h-3 text-slate-300 shrink-0" />
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-500 font-medium">
                                          Норма на тн:
                                        </span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                                          {formatCurrency(item.costPerTon)} ₽
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 pt-1.5">
                                        <span className="text-[10px] text-slate-500 font-medium">
                                          Сумма на заказ:
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                          {formatCurrency(
                                            item.costPerTon *
                                              Number(orderWeight),
                                          )}{" "}
                                          ₽
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {commercialStats && (
                    <div className="grid grid-cols-1 gap-3 pt-4 relative z-10 font-sans tracking-tight">
                      {commercialStats.netLossesPerTon > 0 && (
                        <div className="bg-[#FFF8E1] dark:bg-amber-900/10 border border-[#FFECB3] dark:border-amber-900/30 p-4 rounded-xl flex gap-3 shadow-sm transition-colors">
                          <Info className="w-5 h-5 text-[#E65100] dark:text-amber-500 shrink-0" />
                          <div>
                            <h5 className="font-semibold text-[#E65100] dark:text-amber-500 text-sm mb-1">
                              Рекомендация по цене
                            </h5>
                            <p className="text-[#E65100]/80 dark:text-amber-500/80 text-[11px] font-medium mb-2">
                              Чистые потери от отходов:{" "}
                              <span className="font-bold">
                                {formatCurrency(
                                  commercialStats.netLossesPerTon,
                                )}{" "}
                                руб./т
                              </span>
                              .
                            </p>
                            <div className="inline-flex items-center bg-white/60 dark:bg-white/10 px-3 py-1.5 rounded-lg text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-white/10 shadow-sm">
                              Рекомендуемая цена:{" "}
                              {formatCurrency(
                                Number(sellPrice) +
                                  Number(commercialStats.netLossesPerTon),
                              )}{" "}
                              руб./т (БЕЗ НДС)
                            </div>
                          </div>
                        </div>
                      )}
                      {commercialStats.profitPerTon > 0 &&
                        commercialStats.profitPerTon < 10000 && (
                          <div className="border border-[#FFECB3] dark:border-amber-900/30 p-4 rounded-xl flex gap-3 shadow-sm bg-white dark:bg-[#1A1C19] transition-colors">
                            <AlertTriangle className="w-5 h-5 text-[#E65100] dark:text-amber-500 shrink-0" />
                            <div>
                              <h5 className="font-semibold text-[#E65100] dark:text-amber-500 text-sm mb-1">
                                Осторожно
                              </h5>
                              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                                Маржинальность на тонну меньше 10 000 руб. (
                                {formatCurrency(commercialStats.profitPerTon)}{" "}
                                руб./т).
                              </p>
                            </div>
                          </div>
                        )}
                      {commercialStats.profitPerTon <= 0 &&
                        currentAdminRawPrice &&
                        sellPrice && (
                          <div className="bg-[#FFDAD6] dark:bg-red-900/20 border border-[#FFB4AB] dark:border-red-900/40 p-4 rounded-xl flex gap-3 shadow-sm transition-colors">
                            <AlertTriangle className="w-5 h-5 text-[#BA1A1A] dark:text-red-400 shrink-0" />
                            <div>
                              <h5 className="font-semibold text-[#BA1A1A] dark:text-red-400 text-sm mb-1">
                                Сделка убыточна
                              </h5>
                              <p className="text-[#BA1A1A]/80 dark:text-red-400/80 text-xs font-medium">
                                Пересмотрите цену продажи или согласуйте новую
                                длину.
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </section>
    </>
  );
}
