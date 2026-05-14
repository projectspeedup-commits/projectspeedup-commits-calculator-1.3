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
        "Начните с выбора типа профиля (например, Круг или Шестигранник) и нужной марки стали. Это очень важный шаг, так как он определяет базовые коэффициенты плотности и привязывает расчет к нужным ГОСТам.",
      icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "2. Настройка размеров и габаритов",
      description:
        "Укажите 'Целевой размер' — это то, что просит клиент. Затем выберите 'Размер заготовки' — это металл, из которого будет производиться деталь. Чем точнее совпадают эти размеры, тем меньше металла уйдет в стружку и тем выше будет Выход годного.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "3. Оптимизация раскроя",
      description:
        "Обратите внимание на блок 'Безотходный раскрой'. Программа сама высчитывает идеальную длину прутка. Просто кликните на одну из предложенных зеленых фишек с длиной, чтобы применить её и минимизировать некратные остатки (обрезки).",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    },
    {
      title: "4. Коммерческий расчет и выгода",
      description:
        "Самый важный этап: введите цену продажи за 1 тонну и стоимость закупки. Калькулятор мгновенно рассчитает вашу чистую маржу с учетом всех производственных отходов. Если сделка убыточна, цифры станут красными — это сигнал быть осторожным!",
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
            className="relative w-full max-w-2xl bg-white dark:bg-[#1A1C19] sm:rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 dark:bg-white/10 rounded-2xl flex items-center justify-center text-white">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C19] dark:text-white leading-tight">
                    Инструкция пользователя
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Быстрый старт и основные функции инструмента
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 text-slate-400 hover:text-slate-900 dark:text-white dark:hover:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-hide">
              <div className="grid grid-cols-1 gap-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 sm:gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      {idx !== steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 mt-2 rounded-full" />
                      )}
                    </div>
                    <div className="pt-1 pb-4">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:translate-x-1 transition-transform">
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
                  Горячие клавиши и хитрости для ускорения работы
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">
                        Кнопка "Копировать":
                      </strong>{" "}
                      Сразу формирует красивый текстовый отчет со всеми деталями
                      (вес, отходы, экономика), который можно отправить клиенту
                      или руководству в мессенджер.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">
                        Светофор рентабельности:
                      </strong>{" "}
                      Если маржа ниже 10 000 руб/т, калькулятор зажжет желтое
                      предупреждение. Если сделка приносит убыток — загорится
                      красная тревога.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">
                        Волшебный чип (Реком. заготовка):
                      </strong>{" "}
                      Нажмите на зеленый чип в блоке "Размеры и Раскрой", чтобы
                      в один клик применить оптимальную длину заготовки, при
                      которой вообще не будет некратных обрезков.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">
                        Что такое "Прутков в 1 тн":
                      </strong>{" "}
                      Это справочный расчет: сколько целых прутков готовой длины
                      содержится в 1 тонне физического веса металла.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Мгновенная печать:</strong>{" "}
                      Вы можете сразу распечатать коммерческое предложение или
                      отправить его в PDF, нажав на иконку принтера в правом
                      верхнем углу.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-[24px] p-6 text-white shadow-xl mt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Автоматическая оптимизация (КИМ)
                </h4>
                <p className="text-sm text-slate-400 mb-4 font-medium">
                  При расчете наличия на складе действуют правила улучшения
                  коэффициента использования металла:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Правило 1:</strong> Если
                      заготовка МД (не 6000), приоритет заказам МД по
                      максимальному КИМ.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Правило 2:</strong>{" "}
                      Заготовки МД 6000, НД в первую очередь отдаются заказам с
                      НД.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Авто-применение:</strong>{" "}
                      Оптимизация применяется автоматически в разделе
                      "Потребность с учетом наличия" даже до нажатия кнопки
                      "Применить улучшения КИМ".
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
