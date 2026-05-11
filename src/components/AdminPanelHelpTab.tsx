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
                        <div className="flex items-center justify-between">
                          <h4 className="text-fuchsia-400 font-bold uppercase tracking-wider text-xs">
                            Шаг 3: Внешний доступ (Туннели)
                          </h4>
                          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">Рекомендуемый метод: Cloudflare</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option 1: Cloudflare Tunnel (Primary) */}
                          <div className="bg-sky-950/20 p-6 rounded-2xl border border-sky-500/30 shadow-2xl col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="p-3 bg-sky-500/20 rounded-xl">
                                <LucideIcons.ShieldCheck className="w-5 h-5 text-sky-400" />
                              </div>
                              <div>
                                <p className="text-base font-bold text-white">Cloudflare Tunnel (Постоянный)</p>
                                <p className="text-[10px] text-sky-400 font-mono tracking-widest uppercase">Status: Production Ready</p>
                              </div>
                            </div>
                            
                            <div className="space-y-5">
                               <div className="space-y-2">
                                 <p className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-2">
                                   <span className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-[8px]">1</span>
                                   Активация домена (Activation Steps):
                                 </p>
                                 <div className="text-[10px] text-slate-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-sky-500/10 space-y-2">
                                   <p>1. Нажмите <b>Continue to activation</b> в Cloudflare.</p>
                                   <p>2. Скопируйте <b>Nameservers</b> (NS-сервера).</p>
                                   <p>3. У регистратора удалите старые записи (напр. ns1.reg.ru) и оставьте <b>ТОЛЬКО</b> сервера Cloudflare.</p>
                                   <p className="text-yellow-500/80 text-[9px] italic">Нужно подождать (от 1ч), пока статус домена станет "Active".</p>
                                 </div>
                               </div>

                               <div className="space-y-2">
                                 <p className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-2">
                                   <span className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-[8px]">2</span>
                                   Привязка к туннелю (Public Hostname):
                                 </p>
                                 <div className="text-[10px] text-slate-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-sky-500/10 space-y-1">
                                   <p>• В туннеле <b>zmk-server</b> → <b>Public Hostname</b>.</p>
                                   <p>• <b>Domain:</b> выберите свой домен из списка.</p>
                                   <p>• <b>Service:</b> <span className="text-white font-bold">HTTP</span> | <b>URL:</b> <span className="text-sky-300">localhost:3000</span></p>
                                 </div>
                               </div>

                               <div className="space-y-2">
                                 <p className="text-[10px] font-bold text-sky-400 uppercase flex items-center gap-2">
                                   <span className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-[8px]">2</span>
                                   Настройка маршрута (Public Hostname):
                                 </p>
                                 <div className="text-[10px] text-slate-300 space-y-2 bg-black/40 p-4 rounded-xl border border-sky-500/10 shadow-inner">
                                   <div className="flex justify-between border-b border-slate-700 pb-1">
                                      <span className="text-slate-500 italic">Domain:</span>
                                      <span className="text-white font-bold">твой-домен.ru</span>
                                   </div>
                                   <div className="flex justify-between border-b border-slate-700 pb-1">
                                      <span className="text-slate-500 italic">Service Type:</span>
                                      <span className="text-white font-bold uppercase underline decoration-sky-500">HTTP</span>
                                   </div>
                                   <div className="flex justify-between">
                                      <span className="text-slate-500 italic">URL:</span>
                                      <span className="text-sky-300 font-mono font-bold">localhost:3000</span>
                                   </div>
                                 </div>
                               </div>

                               <div className="pt-2 border-t border-sky-500/20">
                                 <p className="text-[10px] text-emerald-400 flex items-center gap-2 font-medium">
                                   <LucideIcons.CloudLightning className="w-3 h-3" /> 
                                   Приложение будет доступно всегда по адресу вашего домена 24/7.
                                 </p>
                               </div>
                            </div>
                          </div>

                          {/* Emergency Backup */}
                          <div className="flex flex-col gap-4">
                            <div className="bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/20">
                              <div className="flex items-center gap-3 mb-3">
                                <LucideIcons.Zap className="w-4 h-4 text-indigo-400" />
                                <p className="text-xs font-bold text-indigo-300">Резерв: Pinggy (Без установки)</p>
                              </div>
                              <code className="block bg-black/60 p-2 rounded text-[9px] text-indigo-300 select-all border border-indigo-500/10 font-mono">
                                ssh -p 443 -R0:localhost:3000 a.pinggy.io
                              </code>
                            </div>

                            <div className="bg-red-950/20 p-5 rounded-2xl border border-red-500/20">
                              <div className="flex items-center gap-3 mb-3 text-red-400">
                                <LucideIcons.RefreshCw className="w-4 h-4" />
                                <p className="text-xs font-bold uppercase">Полный перезапуск PM2</p>
                              </div>
                              <div className="bg-black/60 rounded-lg p-3 font-mono text-[9px] text-red-300 space-y-1">
                                <p>pm2 delete all</p>
                                <p className="text-white">cd ~/zmk-app && npm run build && pm2 start npm --name "zmk-app" -- run start</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 6: Migration & Multi-App Support */}
                    <div className="mt-8 pt-8 border-t border-slate-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <LucideIcons.Laptop className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Перенос на MacBook Pro (Server)
                          </h3>
                          <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono">Step-by-step terminal commands</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
                        {/* Step 1: Navigation */}
                        <div className="space-y-4">
                           <h4 className="text-sky-400 font-bold uppercase tracking-wider text-xs">
                              1. Переход в папку (Терминал)
                           </h4>
                           <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3 shadow-inner">
                              <p className="text-xs text-slate-300">
                                Скопируйте и вставьте в Терминал, чтобы зайти в вашу папку:
                              </p>
                              <code className="block bg-black/60 p-3 rounded-xl text-sky-400 text-[10px] font-mono border border-sky-500/10 select-all leading-relaxed">
                                cd "/Users/aleksandrtrusin/Documents/my-server/ZMK Prodachion/zmk-arsenal-разработка-блок-производс."
                              </code>
                              <p className="text-[9px] text-slate-500 italic">
                                * Обязательно используйте кавычки, так как в пути есть пробелы.
                              </p>
                           </div>
                        </div>

                        {/* Step 2: Docker Start */}
                        <div className="space-y-4">
                           <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-xs">
                              2. Запуск через Docker
                           </h4>
                           <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-4">
                              <p className="text-xs text-slate-300">
                                Убедитесь, что Docker Desktop запущен, затем выполните:
                              </p>
                              <div className="bg-black/60 p-3 rounded-xl text-emerald-300 text-[10px] font-mono border border-emerald-500/10 space-y-2">
                                <p className="text-slate-500 italic"># Если это первый запуск:</p>
                                <p className="select-all">docker compose up -d --build</p>
                                <p className="text-slate-500 italic mt-2"># Если просто перезапустить:</p>
                                <p className="select-all">docker compose restart</p>
                              </div>
                              <p className="text-[9px] text-slate-500 leading-relaxed border-t border-slate-700 pt-2">
                                Теперь приложение работает на <b>порт 3000</b> (по умолчанию). 
                                Вы можете изменить порт в файле <code className="text-slate-400">docker-compose.yml</code>.
                              </p>
                           </div>
                        </div>

                        {/* Final Check */}
                        <div className="lg:col-span-2 bg-blue-900/10 p-5 rounded-2xl border border-blue-500/20">
                          <div className="flex items-start gap-4">
                             <LucideIcons.Search className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                             <div>
                               <h5 className="text-sm font-bold text-blue-300 mb-1 uppercase">Как проверить работу?</h5>
                               <p className="text-xs text-slate-400 leading-relaxed">
                                 1. Откройте <b className="text-white">localhost:3000</b> в браузере на MacBook.<br/>
                                 2. Откройте <b className="text-white">localhost:9000</b> — это Portainer, там вы увидите статус контейнера "Running".<br/>
                                 3. Если нужно остановить: <code className="text-slate-300">docker compose down</code>
                               </p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 7: Docker Compose Config */}
                    <div className="mt-8 pt-8 border-t border-slate-800">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
                          <LucideIcons.FileCode className="w-6 h-6 text-pink-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Конфигурация (docker-compose.yml)
                          </h3>
                          <p className="text-[10px] text-pink-400 uppercase tracking-widest font-mono">Create this file in the project folder</p>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700 space-y-4">
                        <p className="text-xs text-slate-400">
                          Если файла <code className="text-pink-300">docker-compose.yml</code> нет в папке, создайте его и вставьте этот код:
                        </p>
                        <pre className="bg-black/60 p-5 rounded-2xl text-[10px] font-mono text-pink-200 border border-pink-500/20 overflow-x-auto leading-relaxed">
{`services:
  # Проект Снабжения (Этот код)
  zmk_arsenal:
    image: node:18-slim
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    command: sh -c "npm install && npm run build && npm run start"
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.8' # Ограничение CPU, чтобы MacBook не грелся
          memory: '2G'

  # Portainer (Управление контейнерами в браузере)
  portainer:
    image: portainer/portainer-ce:latest
    ports: ["9443:9443", "9000:9000"]
    volumes: 
      - "/var/run/docker.sock:/var/run/docker.sock"
      - "portainer_data:/data"
    restart: always

volumes:
  portainer_data:`}
                        </pre>
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
