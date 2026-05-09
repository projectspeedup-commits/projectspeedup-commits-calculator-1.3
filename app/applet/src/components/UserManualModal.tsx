import React from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Info,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManualModal({ isOpen, onClose }: UserManualModalProps) {
  const steps = [
    {
      title: "1. Выбор параметров заготовки (Марка и Профиль)",
      description:
        "Начните с выбора типа профиля (например, Круг или Шестигранник) и нужной марки стали. Это задаст физические свойства металла (плотность).",
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "2. Настройка размеров",
      description:
        "Укажите 'Целевой размер' (размер готовой детали). Затем укажите 'Размер заготовки' с учетом припуска. Чем меньше разница, тем выше коэффициент выхода годного.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "3. Оптимизация безотходного раскроя",
      description:
        "Обратите внимание на блок 'Раскрой'. Кликните на одну из предложенных зеленых фишек с длиной прутка, чтобы свести некратные остатки к нулю.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "4. Коммерческий расчет",
      description:
        "Укажите цены продажи и закупки. Калькулятор мгновенно рассчитает ожидаемую маржу. Светофор покажет: красный - убыток, зеленый - отличная сделка.",
      icon: <ChevronRight className="w-5 h-5 text-indigo-500" />,
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
                <div className="w-12 h-12 bg-slate-900 dark:bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C19] dark:text-white leading-tight">
                    Инструкция: Калькулятор Деталей
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Быстрый расчет отдельной позиции и оценка экономики
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
                  Советы и Горячие клавиши
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Печать и Копирование:</strong>{" "}
                      Результат расчета отображается внизу. Вы можете в 1 клик нажать "Копировать", чтобы отправить отчет клиенту в мессенджер, или распечатать карточку расчета через кнопку печати в шапке.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Светофор рентабельности:</strong>{" "}
                      Индикатор обрамляет блок "Коммерческий расчет". При марже менее 10,000 руб/т он желтеет, при убытке — краснеет.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 sm:p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-slate-800 flex justify-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-12 h-12 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-900/10"
              >
                Понятно, приступим!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
