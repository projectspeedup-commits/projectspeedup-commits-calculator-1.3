import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export default function AdminPanelHelpTab(props: any) {
  const { activeTab, row } = props;
  const { Activity, Info, FileText, Check } = LucideIcons;

  return (
    <>
      {activeTab === "help" && (
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
                    Обучение и Инструкции
                  </h2>
                  <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
                    Руководство пользователя, техническое обслуживание и требования к данным.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tech Support - Only for Developer Mode */}
                {props.isDeveloperMode && (
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <LucideIcons.Settings className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        Техническое обслуживание (Для разработчика)
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                      <div className="space-y-4">
                        <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                          Шаг 0: Подключение к серверу
                        </h4>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3 shadow-inner">
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">macOS (MacBook):</p>
                             <p className="text-xs text-slate-300 leading-relaxed">
                                Откройте <b>Терминал</b> и введите:
                             </p>
                             <code className="block bg-black/40 p-2 rounded text-emerald-400 text-[10px] select-all">ssh aleksandr@192.168.1.245</code>
                          </div>
                          <div className="space-y-1 mt-3">
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Windows:</p>
                             <p className="text-xs text-slate-300 leading-relaxed">
                                Откройте <b>PowerShell</b> и введите:
                             </p>
                             <code className="block bg-black/40 p-2 rounded text-sky-400 text-[10px] select-all">ssh aleksandr@192.168.1.245</code>
                          </div>
                          <p className="text-[9px] text-slate-500 italic mt-2 italic"># Пароль при вводе не отображается — это нормально.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-orange-500 font-bold uppercase tracking-wider text-xs">
                          Шаг 1: Сохранение кода (GitHub)
                        </h4>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          Чтобы ваши изменения в AI Studio попали на сервер:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-3 text-slate-400 text-sm">
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>В меню <b>Settings</b> → <b>Export to GitHub</b></span>
                          </li>
                          <li className="flex items-center gap-3 text-slate-400 text-sm">
                            <Check className="w-4 h-4 text-emerald-500" />
                            <span>Нажмите <b>Push Changes</b>.</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sky-400 font-bold uppercase tracking-wider text-xs">
                          Шаг 2: Обновление (192.168.1.245)
                        </h4>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
                          <p className="text-xs text-slate-300">
                             Введите в терминале сервера:
                          </p>
                          <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] text-sky-300 space-y-1">
                            <p>cd ~/zmk-app</p>
                            <p>./server_update.sh</p>
                          </div>
                          <p className="text-[9px] text-slate-500">
                            Сервер сам скачает код, соберет проект и перезапустится через PM2.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6 lg:col-span-3 border-t border-slate-800 pt-6">
                        <h4 className="text-fuchsia-400 font-bold uppercase tracking-wider text-xs">
                          Шаг 3: Внешний доступ (Интернет)
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option 1: Ngrok (Recommended) */}
                          <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-xl">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-emerald-500/20 rounded-lg">
                                <LucideIcons.Globe className="w-4 h-4 text-emerald-500" />
                              </div>
                              <p className="text-sm font-bold text-emerald-300">Ngrok (Работа 24/7)</p>
                            </div>
                            <div className="bg-black/60 rounded-xl p-4 font-mono text-[10px] text-emerald-400 border border-emerald-500/20 space-y-3">
                              <div>
                                <p className="text-slate-500 mb-1">// 1. Очистка и авторизация (Ваш актуальный токен):</p>
                                <p className="text-red-400 select-all">pm2 delete zmk-link</p>
                                <p className="text-emerald-300 select-all">ngrok config add-authtoken 3DXodaMEKIPKQ8p4HpEdGdONLaz_2LkCfHR7oLa9BQh4hWHnV</p>
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">// 2. Запуск туннеля в фоне:</p>
                                <p className="select-all">pm2 start ngrok --name "zmk-link" -- http 3000</p>
                              </div>
                              <div>
                                <p className="text-slate-500 mb-1">// 3. ПОЛУЧИТЬ ССЫЛКУ (выполните это):</p>
                                <code className="text-yellow-400 block p-2 bg-yellow-400/5 rounded border border-yellow-400/20 select-all">curl http://localhost:4040/api/tunnels | grep -o 'https://[a-z0-9.-]*'</code>
                              </div>
                            </div>
                          </div>

                          {/* Troubleshooting */}
                          <div className="bg-orange-950/20 p-5 rounded-2xl border border-orange-500/20">
                            <h5 className="text-xs font-bold text-orange-400 uppercase mb-3 flex items-center gap-2">
                              <LucideIcons.AlertTriangle className="w-4 h-4" /> Если ссылка не открывается
                            </h5>
                            <div className="space-y-3">
                              <p className="text-[10px] text-slate-400 leading-relaxed">
                                Если <b>curl</b> ничего не выдает или ссылка не работает, проверьте логи ошибок:
                              </p>
                              <code className="block bg-black/40 p-2 rounded text-orange-300 text-[10px] select-all">pm2 logs zmk-link --lines 20</code>
                              <p className="text-[10px] text-slate-400 font-medium">
                                Возможные причины:
                              </p>
                              <ul className="text-[9px] text-slate-500 list-disc list-inside space-y-1">
                                <li>Неверный Authtoken (проверьте пробелы)</li>
                                <li>Аккаунт Ngrok требует подтверждения почты</li>
                                <li>Уже запущен другой туннель (сделайте <code className="text-slate-400">pm2 delete all</code>)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Automation Setup */}
                    <div className="mt-8 pt-8 border-t border-slate-800">
                       <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs mb-4">
                          Настройка авто-обновления (Cron)
                        </h4>
                        <p className="text-sm text-slate-400 mb-4">
                          Выполните это ОДИН РАЗ, чтобы сервер проверял обновления каждые 5 минут:
                        </p>
                        <div className="bg-black/60 rounded-2xl p-5 border border-slate-700 font-mono text-xs text-emerald-400 leading-relaxed">
                          chmod +x ~/zmk-app/server_update.sh <br/>
                          (crontab -l 2&gt;/dev/null; echo "*/5 * * * * ~/zmk-app/server_update.sh &gt;&gt; ~/zmk-app/update.log 2&gt;&amp;1") | crontab -
                        </div>
                    </div>
                  </div>
                )}

                {/* Intro & Benefits */}
                <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-sky-500" />О Программном
                    Комплексе
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Данный программный комплекс предназначен для автоматизации
                    процессов снабжения, расчетов потребности в заготовке и
                    оценки экономической рентабельности. Система объединяет
                    данные о заказах покупателей (Потребностях) и складских
                    остатках, позволяя быстро и точно вычислять дефицит сырья.
                  </p>

                  <div className="mt-4">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">
                      Ключевые преимущества
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          <b>Мгновенный расчет КИМ:</b> автоматическое
                          определение коэффициента использования металла на
                          основе технологических нормативов.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          <b>Связь Потребности и Склада:</b> алгоритм сам
                          подбирает подходящую заготовку из наличия (по марке,
                          профилю, размеру и длине) и вычисляет дефицит.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          <b>Гибкий экспорт данных:</b> возможность в один клик
                          скопировать результаты в Google Sheets или скачать
                          XLSX файл.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          <b>Оптимизация свободных остатков:</b> прозрачно
                          выделяет объем заготовки, который не покрывает
                          существующие заказы и может быть реализован.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* File Formats Detailed */}
                <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" />
                    Какие Документы Загружать и Правила Загрузки (Подробно)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Для корректной работы системы, загружаемые Excel файлы
                    (.xlsx, .xls) или CSV файлы должны содержать определенные
                    заголовки столбцов. Порядок столбцов абсолютно не важен,
                    программа ориентируется строго по названиям шапок. Вы можете
                    добавлять в ваш рабочий файл любые другие столбцы, они будут
                    просто проигнорированы.
                  </p>

                  <div className="mt-4 space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1 rounded-lg">
                        Документ 1: Файл Потребностей (Заказы Покупателей)
                      </h4>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                        Этот документ формируется из вашей учетной системы как
                        список текущих заказов к выполнению. Обратите внимание,
                        что система умеет распознавать несколько вариаций
                        названий заголовков для одного и того же логического
                        поля.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Номенклатура детали
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Пример заголовка: Номенклатура
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Остаток к выполнению (вес)
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Примеры заголовков: Остаток к выполнению,
                            Количество, Кол-во
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Марка стали
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Пример заголовка: Марка
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Клиент
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Примеры: Клиент, Контрагент, Заказчик
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Номер заказа
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Примеры: № заказа, Заказ, Документ
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Размер
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Примеры: Размер, Диаметр
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Профиль
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Примеры: Профиль, Тип
                          </span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Длина готовой продукции
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Пример: Длина конечной продукции
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 w-fit px-3 py-1 rounded-lg">
                        Документ 2: Файл Складские Остатки (Наличие сырья)
                      </h4>
                      <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                        Этот документ отвечает за свободные остатки сырья в
                        тоннах. <b>ВАЖНОЕ ПРАВИЛО:</b> Система сама анализирует
                        общий столбец с Наименованием позиции на складе, чтобы
                        автоматически выделить из него Профиль, Марку стали,
                        Размер и Длину! Вам не нужно заводить для этих
                        параметров отдельные колонки.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Наименование заготовки на складе
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Варианты заголовков: Номенклатура, Наименование
                          </span>
                          <ul className="text-[10px] text-slate-400 mt-2 list-disc ml-3 space-y-1">
                            <li>Пример: "Круг ст.35 12x2000"</li>
                            <li>Пример: "Шестигранник 45Х 14 МД 6000"</li>
                          </ul>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-sky-300 transition-colors">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
                            Количество или Вес на складе (в тоннах)
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Варианты заголовков: Конечный остаток, Остаток,
                            Кол-во
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Workflow Algorithm */}
                <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col gap-4 md:col-span-2 mt-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Activity className="w-6 h-6 text-indigo-500" />
                    Инструкция: "Быстрый старт" (От 0 к первому расчету
                    снабжения)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {/* Step 1 */}
                    <div className="flex flex-col gap-4 relative z-10 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-xl shadow-sm">
                        1
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                          Планово-Производственный Отдел (ППО)
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          Зайдите во вкладку{" "}
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            ППО
                          </span>
                          . Перетащите скачанные из системы 1С/ERP файлы: список текущих заказов (Потребности) и складские остатки (Склад).
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col gap-4 relative z-10 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center font-black text-blue-600 dark:text-blue-400 text-xl shadow-sm">
                        2
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                          Подготовка Заявки на Обеспечение
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          Программа анализирует данные, подбирает заготовку, рассчитывает КИМ и вычитает доступные запасы. ППО формирует и утверждает итоговую{" "}
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            Заявку на обеспечение
                          </span>
                          .
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col gap-4 relative z-10 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:-translate-y-1 transition-transform">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center font-black text-emerald-600 dark:text-emerald-400 text-xl shadow-sm">
                        3
                      </div>
                      <div className="flex flex-col gap-2">
                        <h4 className="font-bold text-base text-slate-800 dark:text-slate-200">
                          Снабжение
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          Специалист отдела{" "}
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1 py-0.5 rounded">
                            Снабжения
                          </span>{" "}
                          видит готовую заявку. Он может просмотреть свободные остатки для возможной перепродажи и выгрузить дефицит для закупки.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
    </>
  );
}
