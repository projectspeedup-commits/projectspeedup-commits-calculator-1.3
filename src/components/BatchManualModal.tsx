import React from "react";
import { X, BookOpen, CheckCircle2, ChevronRight, Info, FileSpreadsheet, Download, Upload } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface BatchManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchManualModal({ isOpen, onClose }: BatchManualModalProps) {
  const steps = [
    {
      title: "1. Подготовка документа (План продаж / Заказы)",
      description: "Выгрузите из вашей ERP-системы или таблицы план текущих потребностей в производстве (формат .xlsx, .xls или .csv).",
      icon: <FileSpreadsheet className="w-5 h-5 text-green-500" />
    },
    {
      title: "2. Требования к заголовкам",
      description: "В файле обязательно должен быть столбец с остатком к выполнению (система ищет по словам 'Остаток к выполнению' или 'Кол-во') и 'Номенклатура детали'.",
      icon: <Info className="w-5 h-5 text-blue-500" />
    },
    {
      title: "3. Загрузка файла",
      description: "Просто перетащите документ в окно загрузки или выберите его, кликнув на иконку области загрузки.",
      icon: <Upload className="w-5 h-5 text-indigo-500" />
    },
    {
      title: "4. Автоматическая обработка",
      description: "Система автоматически распознает марки стали, профиль, размеры и длину. Вам останется лишь скачать готовые результаты: 'Заявку на сырье' или 'Сводку для производства'.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    }
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
                    Инструкция: Заказы (Потребности)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                    Подробное руководство по загрузке плана производства (Excel/CSV)
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
                  <div key={idx} className="flex gap-4 sm:gap-4 group bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                        {step.icon}
                      </div>
                    </div>
                    <div className="pt-1">
                       <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight group-hover:translate-x-1 transition-transform">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-[24px] p-6 text-white shadow-xl">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Обязательные колонки (Заголовки в Excel)
                </h4>
                <p className="text-xs text-slate-400 mb-4 font-medium leading-relaxed">
                  Система ищет нужные колонки по частичному совпадению. Порядок столбцов абсолютно не важен. Остальные колонки в вашем файле будут просто проигнорированы.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Остаток к выполнению (вес)</span>
                     <span className="text-[10px] text-slate-400 font-mono">Примеры заголовков: Остаток к выполнению, Количество, Кол-во</span>
                     <p className="text-[10px] text-slate-500 mt-1">Обязательное числовое поле. Если пусто или меньше 0.001 - строка игнорируется.</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Номенклатура детали</span>
                     <span className="text-[10px] text-slate-400 font-mono">Примеры: Номенклатура</span>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Марка стали</span>
                     <span className="text-[10px] text-slate-400 font-mono">Примеры: Марка</span>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Размер</span>
                     <span className="text-[10px] text-slate-400 font-mono">Примеры: Размер, Диаметр</span>
                     <p className="text-[10px] text-slate-500 mt-1">Если указано, система подберет заготовку по таблице припусков.</p>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Профиль</span>
                     <span className="text-[10px] text-slate-400 font-mono">Примеры: Профиль, Тип</span>
                   </div>
                   <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:border-blue-400/50 transition-colors">
                     <span className="text-xs font-bold text-white block mb-1">Длина готовой продукции</span>
                     <span className="text-[10px] text-slate-400 font-mono">Пример: Длина конечной продукции</span>
                     <p className="text-[10px] text-slate-500 mt-1">Опционально. Нужна для расчета безотходного прутка.</p>
                   </div>
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-slate-800 rounded-[24px] p-6 text-white shadow-xl mt-6">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-4 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Правила оптимизации КИМ (Коэффициент Использования Металла)
                </h4>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Правило 1 (МД заготовка):</strong> Если заготовка имеет мерную длину (МД), отличную от 6000 мм, наивысший приоритет отдается заказам с назначением МД по наибольшему значению КИМ. Система распределяет такую заготовку по заказам, сортируя их по убыванию пользы от применения.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Правило 2 (НД и МД 6000 заготовка):</strong> Для заготовок с длиной МД 6000, НД или Н/Д высший приоритет отдается заказам с назначением НД (3000-6000, НД, Н/Д). Система сначала закрывает потребность в НД заказах, а остаток распределяет на заказы с МД.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    <p className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 text-slate-200">
                      <strong className="text-white">Авто-улучшение:</strong> При расчете потребности с учетом наличия на складе, эти правила применяются автоматически даже до нажатия кнопки "Применить все улучшения КИМ".
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
