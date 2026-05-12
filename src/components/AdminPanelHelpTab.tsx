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
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col gap-6 md:col-span-2">
                    <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <LucideIcons.Server className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Техническое обслуживание (Инфраструктура)
                        </h3>
                        <p className="text-sm text-slate-400">Логины, пароли и основные команды</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                      {/* СЕРВЕР 1: VDS UBUNTU */}
                      <div className="space-y-4">
                        <h4 className="text-sky-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                          <LucideIcons.Globe className="w-5 h-5"/>
                          1. Облачный Сервер (VDS Ubuntu)
                        </h4>
                        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3 shadow-inner">
                          <p className="text-xs text-slate-300">Принимает домены, раздает HTTPS и перенаправляет на MacBook.</p>
                          
                          <div className="bg-black/40 p-3 rounded-lg border border-slate-700 space-y-2 text-xs">
                             <div className="flex justify-between"><span className="text-slate-400">IP-адрес:</span><span className="font-mono text-white">194.87.234.241</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Логин:</span><span className="font-mono text-sky-400">root</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Пароль:</span><span className="font-mono text-orange-400">[Укажите ваш пароль VDS]</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">SSH:</span><code className="text-emerald-400 select-all">ssh root@194.87.234.241</code></div>
                          </div>

                          <div className="mt-3 space-y-2">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">Настройки и где они лежат:</p>
                             <ul className="text-xs text-slate-300 space-y-1 list-disc ml-4">
                               <li><b>Nginx Конфиг:</b> <code className="text-sky-300">/etc/nginx/sites-enabled/zmk</code></li>
                               <li><b>SSHD Конфиг:</b> <code className="text-sky-300">/etc/ssh/sshd_config</code> (важно: GatewayPorts yes)</li>
                               <li><b>Домены:</b> zmk-project.ru (→ 8001), supply.zmk-project.ru (→ 8002)</li>
                             </ul>
                          </div>

                          <div className="mt-3 space-y-2">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">Полезные команды (Ubuntu):</p>
                             <div className="bg-black/40 rounded p-3 text-[10px] font-mono text-slate-300 space-y-2 border border-slate-700">
                               <p className="flex flex-col gap-1"><span className="text-slate-500 italic"># Перезапуск веб-сервера</span><span className="text-green-400 select-all">systemctl restart nginx</span></p>
                               <p className="flex flex-col gap-1"><span className="text-slate-500 italic"># Обновить SSL-сертификаты</span><span className="text-green-400 select-all">certbot --nginx</span></p>
                               <p className="flex flex-col gap-1"><span className="text-slate-500 italic"># Статус фаервола (должны быть открыты порты 22, 80, 443)</span><span className="text-green-400 select-all">ufw status</span></p>
                             </div>
                          </div>
                        </div>
                      </div>

                      {/* СЕРВЕР 2: MACBOOK */}
                      <div className="space-y-4">
                        <h4 className="text-indigo-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                          <LucideIcons.Laptop className="w-5 h-5"/>
                          2. Локальный Сервер (MacBook Pro)
                        </h4>
                        <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3 shadow-inner">
                          <p className="text-xs text-slate-300">Реально работает код через Docker, отправляет порты в Облако.</p>
                          
                          <div className="bg-black/40 p-3 rounded-lg border border-slate-700 space-y-2 text-xs">
                             <div className="flex justify-between"><span className="text-slate-400">Локальный IP:</span><span className="font-mono text-white">192.168.1.46</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Логин:</span><span className="font-mono text-indigo-400">aleksandrtrusin</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Пароль:</span><span className="font-mono text-orange-400">[Пароль от Mac]</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">SSH:</span><code className="text-emerald-400 select-all">ssh aleksandrtrusin@192.168.1.46</code></div>
                             <div className="flex justify-between border-t border-slate-700 pt-2"><span className="text-slate-400 w-1/3">Папка проекта:</span><span className="font-mono text-[9px] text-sky-200 text-right">~/Documents/my-server/ZMK Prodachion/zmk-server</span></div>
                          </div>

                          <div className="mt-3 space-y-2">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">Контейнеры (Docker Compose):</p>
                             <ul className="text-xs text-slate-300 space-y-1 list-disc ml-4">
                               <li><b>zmk_production:</b> Порт 8001</li>
                               <li><b>zmk_supply:</b> Порт 8002</li>
                               <li><b>zmk_postgres:</b> Порт 5432</li>
                             </ul>
                          </div>

                          <div className="mt-3 space-y-2">
                             <p className="text-[10px] uppercase text-slate-400 font-bold">Туннель и Скрипты:</p>
                             <ul className="text-[10px] text-slate-300 space-y-1 list-disc ml-4">
                               <li><b>Туннель:</b> <code className="text-indigo-300">~/Library/LaunchAgents/com.zmk.tunnel.plist</code> <br/>(авто-проброс ssh -R 8001, 8002 к VDS)</li>
                               <li><b>Обновление:</b> <code className="text-indigo-300">auto-update.sh</code> (ищет обновления в Github 24/7)</li>
                             </ul>
                          </div>
                        </div>
                      </div>

                      {/* 3. ЖИВУЧЕСТЬ И ВОССТАНОВЛЕНИЕ */}
                      <div className="lg:col-span-2 space-y-4">
                        <h4 className="text-orange-400 font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                          <LucideIcons.ShieldAlert className="w-5 h-5"/>
                          3. Живучесть и восстановление (macOS Ventura 13.7.8)
                        </h4>
                        <div className="bg-orange-950/10 border border-orange-500/20 rounded-2xl p-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              <div className="space-y-3">
                                <p className="text-xs font-bold text-white uppercase border-b border-orange-500/20 pb-1">АВТОСТАРТ ПОСЛЕ СБОЯ</p>
                                <ul className="text-[10px] text-slate-400 space-y-2 list-disc ml-4">
                                  <li>Зайдите в <b className="text-slate-200">Системные настройки</b>.</li>
                                  <li>Перейдите в раздел <b className="text-slate-200">Энергосбережение</b>.</li>
                                  <li>Включите галочку <b className="text-orange-400">"Автоматически запускать после сбоя питания"</b>.</li>
                                </ul>
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-bold text-white uppercase border-b border-orange-500/20 pb-1">ВХОД БЕЗ ПАРОЛЯ (Авто-вход)</p>
                                <ul className="text-[10px] text-slate-400 space-y-2 list-disc ml-4">
                                  <li><b className="text-red-400">Важно:</b> Сначала отключите <b className="text-slate-200">FileVault</b> (Настройки → Конфиденциальность и безопасность → FileVault).</li>
                                  <li>Зайдите в <b className="text-slate-200">Пользователи и группы</b>.</li>
                                  <li>Нажмите <b className="text-slate-200">"Автоматический вход"</b> и выберите пользователя <b className="text-indigo-400">aleksandrtrusin</b>.</li>
                                  <li>В настройках <b className="text-slate-200">Docker Desktop</b> включите <b className="text-sky-400">"Start Docker when you log in"</b>.</li>
                                </ul>
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-bold text-white uppercase border-b border-orange-500/20 pb-1">АВТОЗАПУСК ТУННЕЛЯ</p>
                                <p className="text-[10px] text-slate-400 leading-relaxed">
                                  Все скрипты (обновление и проброс портов) работают как <b>LaunchAgents</b>. Они стартуют автоматически сразу после логина Mac.
                                </p>
                                <div className="bg-black/40 p-2 rounded text-[9px] font-mono text-emerald-400 flex flex-col gap-1">
                                   <span># Проверить что всё запустилось:</span>
                                   <span className="text-emerald-200 select-all">launchctl list | grep zmk</span>
                                </div>
                              </div>
                           </div>
                        </div>
                      </div>

                      {/* БЛОК АВТООБНОВЛЕНИЯ И КОМАНДЫ */}
                      <div className="lg:col-span-2 mt-4">
                        <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-500/20">
                          <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
                            <LucideIcons.RefreshCw className="w-5 h-5"/>
                            Как обновлять сайт и полезные команды
                          </h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <p className="text-sm text-slate-300 font-bold">1. Выгрузка из AI Studio</p>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                Хотите применить новые изменения из AI Studio на рабочем сервере?
                                В меню AI Studio нажмите <b>Settings → Export to GitHub</b> и сделайте Push. 
                              </p>
                              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                                <p className="text-xs text-emerald-300 leading-relaxed font-medium">
                                  Скрипт <code className="text-emerald-200 bg-emerald-900/40 px-1 rounded">auto-update.sh</code> сам увидит изменения (через github), сделает pull из ветки main и аккуратно перезапустит контейнеры в фоне. <b className="text-white">Вам ничего в терминале нажимать не надо.</b>
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <p className="text-sm text-slate-300 font-bold">2. Инструменты макбука (Терминал)</p>
                              <div className="bg-black/50 p-4 rounded-xl border border-slate-700 space-y-3 text-[11px] font-mono leading-relaxed">
                                <div className="space-y-1">
                                  <p className="text-slate-500 italic"># Посмотреть работают ли контейнеры (Up X hours)</p>
                                  <p className="text-blue-300 select-all">docker ps</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-slate-500 italic"># Вручную перезапустить скрипт авто-обновления в фоне</p>
                                  <p className="text-emerald-400 text-[10px] select-all">nohup ./auto-update.sh &gt; update.log 2&gt;&amp;1 &amp;</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-slate-500 italic"># Посмотреть логи работы Production (что сейчас происходит)</p>
                                  <p className="text-yellow-300 select-all">docker compose logs -f zmk_production</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-slate-500 italic"># Посмотреть логи работы Supply</p>
                                  <p className="text-orange-300 select-all">docker compose logs -f zmk_supply</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
