import { Ruler, Sparkles, Wand2, AlertCircle, ArrowRight, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { formatCurrency, formatInputValue, handleNumericInput } from "../../lib/constants";

export function CalculatorCutAndRemnants({
  optimalBilletLengths,
  orderedLength,
  setLengthInput,
  lengthInput,
  validationErrors,
  suggestedValues,
  cutLength,
  setCutLength,
  handleCutLengthChange,
  cutThickness,
  setCutThickness,
  handleCutThicknessChange,
  remnantLength,
  setRemnantLength,
  remnantType,
  setRemnantType,
  isRemnantModeAuto,
  setIsRemnantModeAuto,
  handleBilletLengthInput,
  selectedTarget,
  frontCoef,
  backCoef,
  techEndsMm,
  lengthAfterTechEnds,
  piecesPerBar,
  remnantWeight,
  remnantValue,
  effectiveRemnantPrice,
  currentRemnantPricingRule,
  orderedBarWeight,
  piecesPerTon,
  totalPiecesInOrder,
  advancedRemnantStats,
  currentAdminRawPrice,
  displayedRawLength,
  displayedTargetLength,
  orderWeight,
  setOrderedLength,
  optimalLengths
}: any) {
  return (
    <>
                <section className="bg-white dark:bg-[#1A1C19] rounded-2xl p-4 sm:p-5 space-y-4 sm:space-y-6 print-shadow-none relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#4A6572]/10 border border-[#4A6572]/20 text-[#4A6572] dark:text-slate-300 rounded-xl print-hide">
                        <Ruler className="w-4 h-4" />
                      </div>
                      <h2 className="text-lg font-medium tracking-tight text-[#1A1C19] dark:text-white">
                        Раскрой и остатки
                      </h2>
                    </div>

                    {optimalBilletLengths.length > 0 && (
                      <div
                        className={`bg-indigo-600/10 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 px-3 py-2 rounded-2xl flex items-center gap-4 transition-all ${orderedLength !== "НД" && orderedLength !== "6000" && orderedLength !== "" ? "ring-2 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                            <Ruler className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase leading-none">
                              Реком. заготовка
                            </span>
                            <span className="text-[8px] font-bold text-indigo-600/60 dark:text-indigo-400/60 uppercase mt-0.5">
                              шаг 100мм
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {optimalBilletLengths.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() =>
                                setLengthInput({
                                  value: opt.billetLength.toString(),
                                  source: "raw",
                                })
                              }
                              className="flex flex-col items-center bg-white dark:bg-[#1A1C19] border border-indigo-100 dark:border-indigo-500/30 px-2.5 py-1 rounded-xl shadow-sm hover:border-indigo-400 dark:hover:border-indigo-400 hover:scale-105 active:scale-95 transition-all focus:outline-none group"
                              title="Выбрать эту длину"
                            >
                              <span className="text-[11px] font-black text-indigo-700 dark:text-indigo-300 leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {opt.billetLength} мм.
                              </span>
                              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-0.5">
                                на {opt.n} шт.
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Layout lengths */}
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 sm:gap-4 items-center bg-white dark:bg-[#222421] border border-slate-200 dark:border-slate-700 p-4 rounded-[16px] relative z-10 shadow-sm">
                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                        Длина заготовки
                      </label>
                      <div className="relative">
  <input
    type="text"
    inputMode="numeric"
    value={displayedRawLength}
    onChange={(e) =>
      handleNumericInput(e, (val) =>
        setLengthInput({ value: val, source: "raw" }),
      )
    }
    disabled={!selectedTarget}
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.rawLength ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg pl-3 pr-10 h-10 text-sm font-medium transition-all disabled:opacity-50 placeholder:text-slate-400 focus:border-slate-800 dark:focus:border-white focus:bg-slate-200 dark:focus:bg-slate-700 focus:outline-none dark:text-white`}
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">
    мм
  </span>
  {validationErrors.rawLength && (
    <div className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.rawLength}
    </div>
  )}
</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-slate-400 hidden md:block shrink-0 mx-2" />

                    <div className="space-y-1.5 w-full">
                      <label className="block text-[10px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider ml-1">
                        Вытяжка (после волочения)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={displayedTargetLength}
                          className="w-full bg-[#E8DEF8] dark:bg-[#4A6572]/10 border-b border-[#6750A4] dark:border-[#4A6572] text-slate-900 dark:text-white rounded-t-lg pl-3 pr-10 h-10 text-sm font-semibold transition-all cursor-default focus:outline-none opacity-90"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6750A4] font-medium text-xs">
                          мм
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tech cuts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 2xl:grid-cols-4 gap-3 items-end bg-white dark:bg-[#222421] border border-slate-200 dark:border-slate-700 p-4 rounded-[16px] relative z-10 shadow-sm">
                    <div className="space-y-1 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">
                        Обрезь перед
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatInputValue(frontCoef)}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-9 text-sm font-medium cursor-default focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">
                        Обрезь зад
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={formatInputValue(backCoef)}
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-9 text-sm font-medium cursor-default focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase ml-1 tracking-wider">
                        Тех. концы
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={techEndsMm}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-8 h-9 text-sm font-medium cursor-default focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-medium text-xs">
                          мм
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1 w-full col-span-2 sm:col-span-1 2xl:col-span-1">
                      <label className="block text-[10px] font-semibold text-[#0D652D] dark:text-green-400 uppercase ml-1 tracking-wider">
                        Полезная длина
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={lengthAfterTechEnds}
                          className="w-full bg-[#E6F4EA] dark:bg-green-900/10 border border-[#CEEAD6] dark:border-green-900/30 text-[#0D652D] dark:text-green-400 rounded-lg pl-3 pr-8 h-9 text-sm font-semibold cursor-default focus:outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D652D]/60 dark:text-green-400/60 font-medium text-xs">
                          мм
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ordered lengths */}
                  <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 shadow-sm transition-colors">
                    <div>
                      <label className="block text-base font-medium text-slate-900 dark:text-white tracking-tight">
                        Длина заказа
                      </label>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Размер прутка в отгрузке
                      </p>
                    </div>
                    <div className="relative w-full sm:w-1/3 shrink-0">
  <input
    type="text"
    inputMode="numeric"
    value={orderedLength}
    onChange={(e) =>
      handleNumericInput(e, setOrderedLength)
    }
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.orderedLength ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} text-slate-900 dark:text-white rounded-t-lg px-4 h-12 text-lg font-medium transition-all focus:border-slate-800 dark:focus:border-white focus:bg-slate-200 dark:focus:bg-slate-700 focus:outline-none`}
  />
  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-xs">
    мм
  </span>
  {validationErrors.orderedLength && (
    <div className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.orderedLength}
    </div>
  )}
</div>
                  </div>

                  {optimalLengths.length > 0 &&
                    Number(lengthAfterTechEnds) > 0 && (
                      <div className="bg-[#E8DEF8] dark:bg-[#4A6572]/10 border border-[#CAC4D0] dark:border-[#4A6572]/30 rounded-[16px] p-4 sm:p-5 print-hide relative z-10 shadow-sm transition-colors">
                        <div className="flex flex-col lg:flex-row items-start gap-6">
                          <div className="flex-1 space-y-4 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CAC4D0]/50 dark:border-slate-800 pb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#6750A4]/10 dark:bg-white/10 rounded-xl hidden sm:flex items-center justify-center">
                                  <Info className="w-5 h-5 text-[#1D192B] dark:text-slate-300" />
                                </div>
                                <div>
                                  <h3 className="text-sm font-bold text-[#1D192B] dark:text-slate-200 uppercase tracking-tight">
                                    Безотходный раскрой
                                  </h3>
                                  <p className="text-[10px] text-[#49454F] dark:text-slate-400 font-medium">
                                    Оптимальная длина = (Чистая длина / Кол-во
                                    частей) − 5 мм
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-3">
                              {optimalLengths.map((opt, i) => (
                                <div key={i} className="relative group/chip">
                                  <button
                                    onClick={() =>
                                      setOrderedLength(opt.length.toString())
                                    }
                                    className="w-full bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 text-left p-3 rounded-xl transition-all duration-300 group flex items-center justify-between shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-[3px] focus:outline-none relative overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none"></div>
                                    <style>{`
                                @keyframes shimmer {
                                  100% { transform: translateX(100%); }
                                }
                              `}</style>
                                    <div className="relative z-10">
                                      <div className="font-bold text-emerald-800 dark:text-emerald-300 text-sm whitespace-nowrap">
                                        {opt.length} мм
                                      </div>
                                      <div className="text-[10px] text-emerald-600 dark:text-emerald-500/80 font-semibold uppercase tracking-wider">
                                        На {opt.pieces}{" "}
                                        {opt.pieces === 1
                                          ? "часть"
                                          : opt.pieces > 1 && opt.pieces < 5
                                            ? "части"
                                            : "частей"}
                                      </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-emerald-200/50 dark:bg-emerald-800/50 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform shrink-0">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                  </button>
                                  {/* Tooltip */}
                                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-emerald-900 text-emerald-50 text-xs font-bold px-4 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover/chip:opacity-100 transition-opacity pointer-events-none z-50">
                                    Волшебный чип: щелкните по зеленой фигуре,
                                    чтобы в один клик подставить безотходный
                                    размер прутка!
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-900 rotate-45"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Remnant processing */}
                  {orderedLength && Number(orderedLength) > 0 && (
                    <div className="bg-slate-50 dark:bg-[#222421] border border-slate-200 dark:border-slate-700 p-4 sm:p-5 rounded-[16px] relative z-10 shadow-sm transition-colors">
                      {remnantLength &&
                        Number(remnantLength) > 0 &&
                        piecesPerBar > 0 && (
                          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-900 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider">
                                  Деловой остаток
                                </h4>
                                <span className="text-[8px] font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase">
                                  после реза {piecesPerBar} шт.
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-normal text-slate-900 dark:text-white tracking-tight">
                                  {remnantLength}{" "}
                                  <span className="text-base text-slate-500 dark:text-slate-400 font-semibold">
                                    мм
                                  </span>
                                </p>
                                {remnantWeight && (
                                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs">
                                    ~ {remnantWeight.tons} т ({remnantWeight.kg}{" "}
                                    кг)
                                  </p>
                                )}
                              </div>
                            </div>
                            {remnantValue && effectiveRemnantPrice && (
                              <div
                                className={`px-4 py-3 rounded-xl w-full lg:w-auto shadow-sm border ${currentRemnantPricingRule === "scrap" ? "bg-[#FFF8E1] dark:bg-amber-900/10 border-[#FFECB3] dark:border-amber-900/30" : "bg-[#E6F4EA] dark:bg-green-900/10 border-[#CEEAD6] dark:border-green-900/30"}`}
                              >
                                <span
                                  className={`block text-[8px] font-bold uppercase tracking-wider ${currentRemnantPricingRule === "scrap" ? "text-[#E65100] dark:text-amber-500" : "text-[#0D652D] dark:text-green-500"}`}
                                >
                                  {currentRemnantPricingRule === "scrap"
                                    ? "Стоимость лома"
                                    : "Оценка остатка"}
                                </span>
                                <span
                                  className={`text-lg font-normal tracking-tight ${currentRemnantPricingRule === "scrap" ? "text-[#E65100] dark:text-amber-500" : "text-[#0D652D] dark:text-green-500"}`}
                                >
                                  {new Intl.NumberFormat("ru-RU").format(
                                    remnantValue,
                                  )}{" "}
                                  руб.
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5 sm:border-r border-slate-200 dark:border-slate-800 sm:pr-4 group/bars">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                              Прутков ({orderedLength} мм) в 1 тн готовой
                              продукции
                            </span>
                          </div>
                          <div className="text-xl font-medium text-slate-900 dark:text-white">
                            ~ {piecesPerTon || 0} шт.
                          </div>
                          {orderedBarWeight && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">
                              Вес 1 прутка:{" "}
                              <span className="font-bold text-slate-700 dark:text-slate-200">
                                {orderedBarWeight.kg} кг
                              </span>
                            </div>
                          )}
                          {orderWeight && orderedBarWeight ? (
                            <div className="text-[10px] text-[#006A6A] dark:text-teal-400 font-bold bg-[#006A6A]/10 dark:bg-teal-900/20 px-2 py-1 rounded-md mt-2 inline-block border border-teal-500/10">
                              В заказе: ~{" "}
                              {new Intl.NumberFormat("ru-RU").format(
                                totalPiecesInOrder || 0,
                              )}{" "}
                              шт.
                            </div>
                          ) : null}
                        </div>

                        {advancedRemnantStats && (
                          <>
                            <div className="space-y-1.5 sm:border-r border-slate-200 dark:border-slate-800 sm:pr-4">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                Стоимость отходов (1 тн)
                              </span>
                              <div className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                {currentAdminRawPrice &&
                                advancedRemnantStats.valuePerTon !== null
                                  ? `${formatCurrency(advancedRemnantStats.valuePerTon)} руб.`
                                  : "—"}
                              </div>
                              {currentAdminRawPrice &&
                                advancedRemnantStats.tonsPerTon !== null && (
                                  <div className="mt-2 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                                    {advancedRemnantStats.techTonsPerTon >
                                      0 && (
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                                        <span>Лом:</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                          {formatCurrency(
                                            advancedRemnantStats.techValuePerTon,
                                          )}{" "}
                                          руб.
                                        </span>
                                      </div>
                                    )}
                                    {advancedRemnantStats.remTonsPerTon > 0 && (
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                                        <span>Остаток:</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                          {formatCurrency(
                                            advancedRemnantStats.remValuePerTon,
                                          )}{" "}
                                          руб.
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                                Отходы на весь заказ
                              </span>
                              <div className="text-xl font-medium tracking-tight text-slate-900 dark:text-white">
                                {currentAdminRawPrice &&
                                orderWeight &&
                                advancedRemnantStats.orderScrapValue !== null
                                  ? `${formatCurrency(advancedRemnantStats.orderScrapValue)} руб.`
                                  : "—"}
                              </div>
                              {currentAdminRawPrice &&
                                orderWeight &&
                                advancedRemnantStats.orderScrapTons !==
                                  null && (
                                  <div className="mt-2 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800 pl-3">
                                    {advancedRemnantStats.orderTechTons > 0 && (
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                                        <span>Лом:</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                          {formatCurrency(
                                            advancedRemnantStats.orderTechValue,
                                          )}{" "}
                                          руб.
                                        </span>
                                      </div>
                                    )}
                                    {advancedRemnantStats.orderRemTons > 0 && (
                                      <div className="text-[10px] text-slate-500 dark:text-slate-400 flex justify-between font-medium">
                                        <span>Остаток:</span>
                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                          {formatCurrency(
                                            advancedRemnantStats.orderRemValue,
                                          )}{" "}
                                          руб.
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {remnantLength && Number(remnantLength) < 0 && (
                    <div className="p-3 bg-[#FFDAD6] border border-[#FFB4AB] rounded-xl flex items-start gap-3 relative z-10 shadow-sm mt-4">
                      <AlertTriangle className="w-5 h-5 text-[#BA1A1A] shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-[#BA1A1A] mb-0.5">
                          Длина заказа превышает вытяжку
                        </p>
                        <p className="text-xs text-[#BA1A1A]/90 font-medium leading-relaxed">
                          Из заготовки {displayedRawLength} мм получится пруток
                          длиной {displayedTargetLength} мм. Заказанная длина{" "}
                          {orderedLength} мм не поместится. Выберите заготовку
                          длиннее или уменьшите длину отгрузки.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
    </>
  );
}
