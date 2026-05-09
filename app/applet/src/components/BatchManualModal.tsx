import React from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
  FileSpreadsheet,
  Download,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BatchManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchManualModal({ isOpen, onClose }: BatchManualModalProps) {
  const steps = [
    {
      title: "1. Подготовка документа (План продаж / Заказы)",
      description:
        "Выгрузите из вашей ERP-системы или таблицы план текущих потребностей в производстве. Допустимые форматы: .xlsx, .xls или .csv.",
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "2. Обязательные колонки (Заголовки)",
      description:
        "Система привязывается к названиям колонок. Обязательно должны присутствовать: 'Остаток к выполнению' (или Количество, Кол-во) — это вес, и 'Номенклатура детали' (наименование). Опционально: 'Марка стали', 'Размер', 'Профиль', 'Длина готовой продукции'.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "3. Загрузка файла",
      description:
        "Просто перетащите документ в окно загрузки или выберите его, кликнув на иконку области загрузки посреди экрана. Порядок столбцов не имеет значения.",
      icon: <Upload className="w-5 h-5 text-indigo-500" />,
    },
    {
      title: "4. Ожидаемый результат (Сводка)",
      description:
        "После загрузки система распознает данные и выведет таблицу 'Сводка: Требуемая заготовка', сгруппировав заказы по нужному профилю, размеру и марке, автоматически рассчитав средний КИМ и необходимый вес заготовки в тоннах.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-white dark:bg-[#1A1C19] sm:rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C19] dark:text-white leading-tight">
                    Инструкция: Блок ППО (Заказы)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Подробное руководство по загрузке плана производства
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 sm:gap-4 group bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform"
                  >
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        {step.icon}
                      </div>
                    </div>
                    <div className="pt-1">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:translate-x-1 transition-transform">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-[24px] p-6 text-white shadow-xl">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Детальные примеры колонок для загрузки
                </h4>
                <p className="text-sm text-slate-400 mb-4 font-medium leading-relaxed">
                  Система ищет нужные колонки по их заголовкам. Наличие дополнительных колонок не мешает расчетам.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Остаток к выполнению (вес)
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Примеры: Остаток к выполнению, Количество, Кол-во
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Номенклатура детали
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Примеры: Номенклатура
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Марка стали
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Примеры: Марка
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Размер и Профиль
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Примеры: Размер, Диаметр, Профиль, Тип
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-12 h-12 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-900/10"
              >
                Понятно, приступим загрузку!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
