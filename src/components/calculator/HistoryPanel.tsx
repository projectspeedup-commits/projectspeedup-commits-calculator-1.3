import { History, RotateCcw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HistoryPanelProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  savedCalculations: any[];
  clearAllHistory: () => void;
  isClearing: boolean;
  deleteCalculation: (id: string) => void;
  loadCalculation: (calc: any) => void;
}

export function HistoryPanel({
  showHistory,
  setShowHistory,
  savedCalculations,
  clearAllHistory,
  isClearing,
  deleteCalculation,
  loadCalculation,
}: HistoryPanelProps) {
  if (!showHistory) return null;

  return (
    <div className="lg:col-span-12 bg-white dark:bg-[#1A1C19] rounded-[16px] border border-slate-200 dark:border-slate-800 shadow-md p-5 mb-4 animate-in fade-in slide-in-from-top-2 duration-300 text-slate-800 dark:text-slate-200">
      <div className="flex items-center justify-between mb-4 pb-2 border-b dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <History className="w-5 h-5" /> Сохраненные расчеты
        </h3>
        <div className="flex items-center gap-4">
          {savedCalculations.length > 0 && (
            <button
              onClick={clearAllHistory}
              disabled={isClearing}
              className="text-[10px] text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              {isClearing ? (
                <RotateCcw className="w-3 h-3 animate-spin" />
              ) : (
                <Trash2 className="w-3 h-3" />
              )}
              {isClearing ? "Очистка..." : "Очистить всё"}
            </button>
          )}
          <button
            onClick={() => {
              setShowHistory(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
      {savedCalculations.length === 0 ? (
        <p className="text-center py-8 text-slate-400 italic">История пуста</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-3"
        >
          <AnimatePresence>
            {savedCalculations.map((calc, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={calc.id}
                className="group relative bg-[#F8FAFA] dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 transition-all hover:shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {calc.createdAt?.toDate
                      ? calc.createdAt.toDate().toLocaleDateString("ru-RU")
                      : "—"}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteCalculation(calc.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div
                  className="cursor-pointer space-y-1 mt-1"
                  onClick={() => loadCalculation(calc)}
                >
                  <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 px-2 py-1 rounded-md mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                      Сталь:
                    </span>
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase">
                      {calc.steelGrade || calc.steel_grade || "—"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                        Готовый:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {parseFloat(
                          String(calc.selectedTarget || calc.selected_target || "0")
                        )}{" "}
                        мм
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                        Заготовка:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {calc.lengthInputValue || calc.length_input_value || "—"} мм
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-semibold text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                        Заказ:
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {calc.orderedLength || calc.ordered_length || "—"} мм
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] uppercase font-semibold text-[#0D652D] dark:text-green-500 leading-none mb-0.5">
                        Полезная:
                      </span>
                      <span className="font-bold text-[#0D652D] dark:text-green-400">
                        {calc.usefulLength || calc.useful_length || "—"} мм
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                      {calc.orderWeight || calc.order_weight} тн
                    </span>
                    <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">
                      {(() => {
                        const pt = String(
                          calc.profileType || calc.profile_type || "round"
                        ).toLowerCase();
                        return pt.includes("round") || pt.includes("круг")
                          ? "Круг"
                          : "Шестигр.";
                      })()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
