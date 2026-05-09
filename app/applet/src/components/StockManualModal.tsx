import React from "react";
import {
  X,
  BookOpen,
  CheckCircle2,
  PackageOpen,
  Info,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StockManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StockManualModal({ isOpen, onClose }: StockManualModalProps) {
  const steps = [
    {
      title: "1. Подготовка документа (Складские остатки)",
      description:
        "Выгрузите из системы 1С или скачайте файл в формате .xlsx, .xls или .csv. Это должен быть список реальных остатков металла на складе.",
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-500" />,
    },
    {
      title: "2. Требования к заголовкам",
      description:
        "Вам нужны всего два столбца: 'Наименование заготовки на складе' (например: Круг ст.35 12x2000) и 'Конечный остаток' в тоннах. Остальные данные система игнорирует.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    },
    {
      title: "3. Умное распознавание",
      description:
        "Вам не нужно вручную разделять 'Наименование' на профиль, марку и размер. Встроенный алгоритм сам найдет и распарсит эти параметры по ключевым словам внутри названия.",
      icon: <PackageOpen className="w-5 h-5 text-indigo-500" />,
    },
    {
      title: "4. Авто-распределение КИМ",
      description:
        "При совпадении потребностей (заказов) и наличия (склада) система автоматически распределяет заготовку, отдавая приоритет заказам с максимальным коэффициентом КИМ.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
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
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1A1C19] dark:text-white leading-tight">
                    Инструкция: Блок Снабжения (Склад)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Подробное руководство по загрузке складских остатков
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
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Примеры колонок для загрузки
                </h4>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-amber-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Наименование заготовки на складе
                    </span>
                    <span className="text-xs text-slate-400 font-mono block">
                      Примеры: Номенклатура, Наименование
                    </span>
                    <span className="text-xs text-slate-500 mt-2 block">
                      Здесь должна быть длинная строка, например: "Круг ст.35 12x2000". Не нужно делить ее на столбцы самостоятельно!
                    </span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-amber-400/50 transition-colors">
                    <span className="text-sm font-bold text-white block mb-1">
                      Конечный остаток (Объем или вес в тоннах)
                    </span>
                    <span className="text-xs text-slate-400 font-mono block">
                      Примеры: Конечный остаток, Остаток, Кол-во
                    </span>
                    <span className="text-xs text-slate-500 mt-2 block">
                      Убедитесь, что числа указаны в тоннах или килограммах (в зависимости от ваших внутренних стандартов).
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
