import { AlertCircle, Circle, Hexagon } from "lucide-react";
import { formatInputValue, handleNumericInput, getGostForGrade } from "../../lib/constants";

export function CalculatorInputs({
  profileType,
  setProfileType,
  setFrontCoef,
  allGrades,
  steelGrade,
  setSteelGrade,
  validationErrors,
  dimensions,
  setDimensions,
  orderWeight,
  setOrderWeight,
  rawPrice,
  setRawPrice,
  manualRawPrice,
  setManualRawPrice,
  currentAdminRawPrice,
  adminScrapPrice,
  adminRemnantPrice,
  targetOptions,
  rawOptions,
  setSelectedTarget,
  setSelectedRaw,
  selectedTarget,
  selectedRaw
}: any) {
  return (
    <>
                <section className="bg-white dark:bg-[#1A1C19] rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5 print-shadow-none transition-colors duration-300">
                  {/* Segmented Control */}
                  <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex w-full sm:max-w-[280px] sm:mx-auto mb-6 print-hide">
                    <button
                      onClick={() => {
                        setProfileType("round");
                        setFrontCoef("1.027");
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all duration-200 focus:outline-none ${
                        profileType === "round"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      <Circle className="w-3.5 h-3.5" /> Круг
                    </button>
                    <button
                      onClick={() => {
                        setProfileType("hex");
                        setFrontCoef("1.03");
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-medium transition-all duration-200 focus:outline-none ${
                        profileType === "hex"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                      }`}
                    >
                      <Hexagon className="w-3.5 h-3.5" /> Шестигранник
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4 sm:gap-6 items-end">
                    <div className="space-y-1.5 text-slate-800 dark:text-white">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1 border-b-0">
                        Марка стали{" "}
                        {steelGrade && (
                          <span className="lowercase font-normal opacity-70">
                            ({getGostForGrade(steelGrade)})
                          </span>
                        )}
                      </label>
                      <div className="relative">
  <select
    value={steelGrade}
    onChange={(e) => setSteelGrade(e.target.value)}
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.steelGrade ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg px-3 h-10 text-sm font-medium appearance-none cursor-pointer focus:border-slate-800 dark:focus:border-white focus:outline-none text-slate-900 dark:text-white transition-all`}
  >
    <option
      value=""
      disabled
      className="bg-white dark:bg-slate-800 text-black dark:text-white"
    >
      Выберите марку...
    </option>
    {allGrades.map((grade) => (
      <option
        key={grade}
        value={grade}
        className="bg-white dark:bg-slate-800 text-black dark:text-white"
      >
        {grade}
      </option>
    ))}
  </select>
  {validationErrors.steelGrade && (
    <div className="absolute -bottom-5 left-0 text-[9px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.steelGrade}
    </div>
  )}
</div>
                    </div>

                    <div className="space-y-1.5 text-slate-800 dark:text-white">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                        Готовый пруток
                      </label>
                      <div className="relative">
  <select
    value={selectedTarget}
    onChange={(e) => setSelectedTarget(e.target.value)}
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.dimensions ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg px-3 h-10 text-sm font-medium appearance-none cursor-pointer focus:border-slate-800 dark:focus:border-white focus:outline-none text-slate-900 dark:text-white transition-all`}
  >
    <option
      value=""
      disabled
      className="bg-white dark:bg-slate-800 text-black dark:text-white"
    >
      Размер, мм...
    </option>
    {targetOptions.map((size) => (
      <option
        key={size}
        value={size}
        className="bg-white dark:bg-slate-800 text-black dark:text-white"
      >
        {size}
      </option>
    ))}
  </select>
</div>
                    </div>

                    <div className="space-y-1.5 text-slate-800 dark:text-white">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                        Заготовка
                      </label>
                      <div className="relative">
  <select
    value={selectedRaw}
    onChange={(e) => setSelectedRaw(e.target.value)}
    disabled={!selectedTarget}
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.dimensions ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg px-3 h-10 text-sm font-medium appearance-none disabled:opacity-50 cursor-pointer focus:border-slate-800 dark:focus:border-white focus:outline-none transition-all text-slate-900 dark:text-white`}
  >
    <option
      value=""
      disabled
      className="bg-white dark:bg-slate-800 text-black dark:text-white"
    >
      {selectedTarget ? "Выбор..." : "Ожидание"}
    </option>
    {rawOptions.map((size) => (
      <option
        key={size}
        value={size}
        className="bg-white dark:bg-slate-800 text-black dark:text-white"
      >
        {size}
      </option>
    ))}
  </select>
  {validationErrors.dimensions && (
    <div className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1 whitespace-nowrap">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.dimensions}
    </div>
  )}
</div>
                    </div>

                    <div className="space-y-1.5 text-slate-800 dark:text-white">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                        Объем заказа
                      </label>
                      <div className="relative">
  <input
    type="text"
    inputMode="decimal"
    placeholder="Напр. 5"
    value={orderWeight}
    onChange={(e) =>
      handleNumericInput(e, setOrderWeight)
    }
    className={`w-full bg-[#F0F4F4] dark:bg-slate-800 border-b ${validationErrors.orderWeight ? "border-red-500 ring-2 ring-red-500/20" : "border-slate-400 dark:border-slate-600"} rounded-t-lg pl-3 pr-8 h-10 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-slate-800 dark:focus:border-white dark:text-white`}
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">
    тн
  </span>
  {validationErrors.orderWeight && (
    <div className="absolute -bottom-5 left-0 text-[10px] font-bold text-red-500 uppercase tracking-tight flex items-center gap-1">
      <AlertCircle className="w-2.5 h-2.5" /> {validationErrors.orderWeight}
    </div>
  )}
</div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 2xl:col-span-4 flex flex-col sm:flex-row gap-2 sm:gap-3 border-t border-slate-200 dark:border-slate-800 pt-4 mt-2">
                      <div className="flex-1 flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Цена заготовки
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {currentAdminRawPrice
                            ? formatInputValue(currentAdminRawPrice)
                            : "—"}{" "}
                          <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                            руб/т
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Цена лома
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {formatInputValue(adminScrapPrice)}{" "}
                          <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                            руб/т
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Цена остатков
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white text-sm">
                          {formatInputValue(adminRemnantPrice)}{" "}
                          <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">
                            руб/т
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
    </>
  );
}
