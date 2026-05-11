import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export default function AdminPanelHelpTab(props: any) {
  const { activeTab } = props;
  const { Activity, Info, FileText, Check, Settings, PackageOpen, Truck, Landmark, Calculator } = LucideIcons;

  if (activeTab !== "help") return null;

  return (
    <motion.div
      key="help"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
            Инструкция пользователя (User Manual)
          </h2>
          <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
            Подробное описание работы с каждым разделом и блоком приложения, загружаемые документы, форматы колонок и ожидаемый результат.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Section 1: Calculator */}
        <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-6 h-6 text-indigo-500" />
            1. Раздел "Калькулятор деталей" (Главный экран)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Этот блок используется для ручного расчета одной конкретной детали. Он позволяет технологу или менеджеру по продажам быстро прикинуть потребность в металле и рассчитать экономику сделки.
          </p>
          <div className="mt-2 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3">Как пользоваться (пошагово):</h4>
              <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>Выберите <b>Профиль</b> (Круг, Шестигранник, Труба) и <b>Марку стали</b>. Это задаст правильную плотность.</li>
                <li>В блоке "Размеры детали" укажите целевой размер по чертежу. В блоке "Размер заготовки" появится размер с учетом припусков, или вы можете задать его вручную.</li>
                <li>В блоке "Раскрой" можете кликнуть на зеленую фишку — <b>безотходную длину</b> прутка, чтобы свести обрезки к нулю.</li>
                <li>В блоке "Коммерческий расчет" укажите цены, чтобы узнать маржинальность. Цветовой индикатор в рамке подскажет: красный — вероятный убыток, желтый — низкая маржа, зеленый — хорошая прибыль.</li>
              </ol>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
              <h4 className="font-bold text-sky-800 dark:text-sky-300 mb-2">Ожидаемый внешний вид результата:</h4>
              <p className="text-sm text-sky-700 dark:text-sky-400 leading-relaxed">
                Снизу экрана отобразится интерактивная карточка с подробным раскладом веса (Вес заготовки, Вес детали, Отходы) и коммерческим итогом. Результат можно одним кликом скопировать текстом или вывести на печать.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: ППО (Производство) */}
        <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-500" />
            2. Раздел "ППО" (Планово-производственный отдел)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Создан для массового, пакетного расчета потребностей в заготовке на основе загруженного списка заказов от клиентов или плана производства.
          </p>
          <div className="mt-2 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Прикрепляемые документы:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Загрузите файл <b>"План продаж"</b> или <b>"Заказы"</b>. Допустимые форматы: <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm">.xlsx</code>, <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm">.xls</code> или <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm">.csv</code>.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Обязательные колонки (заголовки):</h5>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li><b>Остаток к выполнению</b> <span className="text-xs text-slate-400">(Варианты: Количество, Кол-во)</span> — требуемый вес заказа (числовое значение).</li>
                    <li><b>Номенклатура детали</b> <span className="text-xs text-slate-400">(Варианты: Номенклатура)</span> — наименование продукции. Это поле помогает идентифицировать строку.</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Опциональные (рекомендуемые) колонки:</h5>
                  <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li><b>Марка стали</b> (Марка)</li>
                    <li><b>Размер</b> (Диаметр)</li>
                    <li><b>Профиль</b> (Тип)</li>
                    <li><b>Длина готовой продукции</b></li>
                  </ul>
                  <p className="text-xs text-slate-500 mt-2">Порядок следования колонок в файле не имеет значения.</p>
                </div>
              </div>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
              <h4 className="font-bold text-sky-800 dark:text-sky-300 mb-2">Ожидаемый внешний вид результата:</h4>
              <p className="text-sm text-sky-700 dark:text-sky-400 leading-relaxed">
                Появится таблица <b>"Сводка: Требуемая заготовка"</b>. Система сгруппирует заказы с одинаковым профилем, маркой и размером, автоматически рассчитает средний КИМ (Коэффициент использования металла) и выдаст итоговый вес необходимой заготовки в тоннах. Заявку можно выгрузить в Excel.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Снабжение / Склад */}
        <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PackageOpen className="w-6 h-6 text-amber-500" />
            3. Раздел "Снабжение" (Склад и формирование дефицита)
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            В этом разделе вычисляется, сколько металла нужно докупить. Система сопоставляет требуемую заготовку (из ППО) с тем, что уже есть на складах.
          </p>
          <div className="mt-2 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" /> Прикрепляемые документы:
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Загрузите файл <b>"Складские остатки"</b>. Форматы: <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm">.xlsx</code> или <code className="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-sm">.csv</code>.
              </p>
              
              <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Обязательные колонки (заголовки):</h5>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <b>Наименование заготовки на складе</b> <span className="text-xs text-slate-400">(Номенклатура, Наименование)</span> — объединяет профиль, марку и размеры 
                  <span className="block ml-5 text-xs text-slate-500 mt-1">Пример "Круг ст.35 12x2000" — система сама распарсит строку на нужные параметры.</span>
                </li>
                <li>
                  <b>Конечный остаток</b> <span className="text-xs text-slate-400">(Вычислить Конечный остаток, Остаток, Кол-во)</span> — физический вес наличия в тоннах.
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/50">
              <h4 className="font-bold text-amber-800 dark:text-amber-500 mb-2">Умная оптимизация КИМ (Скрытие в деталях):</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
                Алгоритм автоматически "спаривает" заказы и складские остатки:
                <br/>1. Заготовки с мерной длиной (не 6000 мм) приоритетно направляются на заказы с МД, где КИМ будет максимальным.
                <br/>2. Заготовки с длиной 6000 мм (или немерной) идут в первую очередь на заказы с НД.
              </p>
            </div>

            <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
              <h4 className="font-bold text-sky-800 dark:text-sky-300 mb-2">Ожидаемый внешний вид результата:</h4>
              <p className="text-sm text-sky-700 dark:text-sky-400 leading-relaxed">
                Раздел разделится на три визуальные таблицы:
              </p>
              <ul className="list-disc list-inside text-sm text-sky-700 dark:text-sky-400 space-y-1 mt-2">
                <li><b>Сводка: Дефицит (Заявка на Металл)</b> — чистый объем, который нужно срочно закупить.</li>
                <li><b>Свободный запас на складе</b> — расчет того, что останется на складе после выполнения всех текущих заказов (полезно для перепродажи излишков).</li>
                <li><b>Детализированные остатки</b> — общая картина первоначального импорта.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4: Логистика */}
        <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-500" />
            4. Раздел "Логистика"
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Здесь хранятся тарифы и цены на доставку металлопроката. Эти суммы автоматически подмешиваются в "Калькулятор деталей" для оценки коммерческой выгоды.
          </p>
          <div className="mt-2 space-y-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Как пользоваться:</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Вы можете редактировать таблицу тарифов, где столбцы это грузоподъемность машин (от 1т до 20т), а строки — города или регионы.
                <br/>Кликните на любую ячейку с ценой, введите новую стоимость и нажмите Enter. Данные сохраняются автоматически.
              </p>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
              <h4 className="font-bold text-sky-800 dark:text-sky-300 mb-2">Ожидаемый внешний вид:</h4>
              <p className="text-sm text-sky-700 dark:text-sky-400">
                Двумерная матрица (таблица), где на пересечении Города и Тоннажа указан тариф. Добавление новых городов или весовых категорий доступно по кнопкам сверху таблицы.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Экономика */}
        <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Landmark className="w-6 h-6 text-fuchsia-500" />
            5. Раздел "Экономика"
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Вкладка для управления базовыми финансовыми константами предприятия. Эти настройки прямо влияют на расчет итоговой маржи и себестоимости во всех остальных блоках.
          </p>
          <div className="mt-2 space-y-4">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Что настраивается:</h4>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-2">
                <li><b>Цена лома (стружки)</b> — почем завод сдает металлическую стружку за кг.</li>
                <li><b>Цена делового остатка</b> — почем можно реализовать качественные некратные обрезки.</li>
                <li><b>Базовые наценки базы</b> (МД и НД) — базовая стоимость "добавочной ценности" к стоимости сырья.</li>
              </ul>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl border border-sky-100 dark:border-sky-900/50">
              <h4 className="font-bold text-sky-800 dark:text-sky-300 mb-2">Ожидаемый внешний вид:</h4>
              <p className="text-sm text-sky-700 dark:text-sky-400">
                Аккуратная сетка карточек с полями ввода. Вводите число, нажимаете кнопку "Сохранить", и новый параметр немедленно начинает участвовать во всех расчетах системы.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Техническая поддержка (Для разработчика) */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-400" />
              6. Техническая поддержка (Deployment & Support)
            </h3>
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded-full border border-indigo-500/30">
              Только для администратора сервера
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm">
            {/* Cloudflare Support */}
            <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-sky-400 font-bold flex items-center gap-2 uppercase text-xs">
                <LucideIcons.ShieldCheck className="w-4 h-4" /> Cloudflare Tunnel (Решение проблем)
              </h4>
              <div className="space-y-3">
                <p className="text-slate-400 text-xs">Если статус в панели Cloudflare <b>"Down"</b> или ошибка <b>"Service already installed"</b>:</p>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">1. Полная очистка:</p>
                  <code className="block bg-black/60 p-2 rounded text-sky-300 text-[10px] font-mono">sudo cloudflared service uninstall</code>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">2. Повторная установка:</p>
                  <p className="text-[10px] text-slate-400 italic">Скопируйте команду "sudo cloudflared service install [TOKEN]" из панели Cloudflare и запустите её.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">3. Настройка маршрута:</p>
                  <ul className="text-[10px] text-slate-400 space-y-1 ml-4 list-disc">
                    <li>Public Hostname: ваш-домен.ru</li>
                    <li>Service: HTTP</li>
                    <li>URL: localhost:3000</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PM2 & Update Support */}
            <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-slate-800">
              <h4 className="text-emerald-400 font-bold flex items-center gap-2 uppercase text-xs">
                <LucideIcons.Terminal className="w-4 h-4" /> Обновление и PM2
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Быстрое обновление:</p>
                  <code className="block bg-black/60 p-2 rounded text-emerald-300 text-[10px] font-mono">cd ~/zmk-app && ./server_update.sh</code>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Если приложение не стартует:</p>
                  <div className="bg-black/60 p-2 rounded text-red-300 text-[10px] font-mono space-y-1">
                    <p>pm2 delete all</p>
                    <p>npm run build</p>
                    <p>pm2 start npm --name "zmk-app" -- run start</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * Команда "npm run start" запускает "server.ts", который объединяет API и Frontend на порту 3000.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
