const fs = require('fs');
let content = fs.readFileSync('src/components/AdminPanelProductionTab.tsx', 'utf8');

const targetContent = `                          {/* Item 1: Взято из заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl relative overflow-hidden group">
                            <span className="text-[9px] text-emerald-700 dark:text-emerald-500 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <Package className="w-3 h-3 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                взято из заг.
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-lg font-black text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                {activeDashboardTotals.allocated.toFixed(3)}
                              </span>
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 2: Дефицит */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl relative overflow-hidden group">
                            <span className="text-[9px] text-rose-700 dark:text-rose-500 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <ShoppingCart className="w-3 h-3 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                дефицит
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-lg font-black text-rose-600 dark:text-rose-500">
                                {activeDashboardTotals.deficit.toFixed(3)}
                              </span>
                              <span className="text-[9px] text-rose-600 dark:text-rose-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 3: Остаток заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl">
                            <span className="text-[9px] text-sky-700 dark:text-sky-500 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              остаток заг.
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {activeDashboardTotals.remaining.toFixed(3)}
                              </span>
                              <span className="text-[9px] text-sky-600 dark:text-sky-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 4: Тех. отходы 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                            <span className="text-[9px] text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              тех. отходы 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {activeDashboardTotals.techWaste2.toFixed(3)}
                              </span>
                              <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 5: Дел. остатки 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                            <span className="text-[9px] text-amber-700 dark:text-amber-500 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              дел. остатки 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {activeDashboardTotals.usefulRem2.toFixed(3)}
                              </span>
                              <span className="text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 6: СР. КИМ 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col justify-center px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="text-[9px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-widest leading-tight truncate">
                                ср. ким 2
                              </span>
                              <span className="text-[8px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1 rounded font-bold">
                                ср.
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span
                                className={\`text-lg font-black transition-colors \${activeDashboardTotals.averageKim < 0.98 ? "text-amber-600 dark:text-amber-500" : "text-emerald-600 dark:text-emerald-500"}\`}
                              >
                                {Math.max(
                                  0,
                                  activeDashboardTotals.averageKim || 0,
                                ).toFixed(3)}
                              </span>
                              <div className="flex flex-col">
                                <span className="text-[8px] text-slate-500 leading-none">
                                  ЦЕЛЬ
                                </span>
                                <span className="text-[8px] text-slate-400 font-bold leading-none select-none">
                                  &ge; 0.980
                                </span>
                              </div>
                            </div>
                          </div>`;

const replacementContent = `                          {/* Item 1: Взято из заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                взято из заг.
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                                {activeDashboardTotals.allocated.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600/80 dark:text-emerald-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 2: Дефицит */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-rose-950/40 dark:to-rose-900/10 border border-rose-200/50 dark:border-rose-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-widest mb-0.5 relative z-10 flex items-center leading-tight">
                              <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 opacity-80" />
                              <span className="truncate whitespace-nowrap">
                                дефицит
                              </span>
                            </span>
                            <div className="flex items-baseline gap-1 relative z-10">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-rose-600 dark:text-rose-400">
                                {activeDashboardTotals.deficit.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-rose-600/80 dark:text-rose-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 3: Остаток заг. */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-sky-50 to-sky-100/30 dark:from-sky-950/40 dark:to-sky-900/10 border border-sky-200/50 dark:border-sky-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              остаток заг.
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.remaining.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-sky-600/80 dark:text-sky-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 4: Тех. отходы 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              тех. отходы 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.techWaste2.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 5: Дел. остатки 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-amber-950/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-widest mb-0.5 flex items-center leading-tight truncate">
                              дел. остатки 2
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black text-slate-800 dark:text-white">
                                {activeDashboardTotals.usefulRem2.toFixed(3)}
                              </span>
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-amber-600/80 dark:text-amber-500 font-bold uppercase">
                                тн
                              </span>
                            </div>
                          </div>

                          {/* Item 6: СР. КИМ 2 */}
                          <div className="shrink-0 xl:shrink-0 snap-start flex flex-col min-w-[130px] sm:min-w-[140px] xl:min-w-max justify-center px-4 py-2.5 sm:py-3 xl:px-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl sm:rounded-2xl shadow-sm relative overflow-hidden group">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] sm:text-[11px] xl:text-[9px] 2xl:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest leading-tight truncate">
                                ср. ким 2
                              </span>
                              <span className="text-[9px] sm:text-[10px] xl:text-[8px] bg-white/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-slate-700/50 font-bold uppercase shadow-sm">
                                ср.
                              </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span
                                className={\`text-xl sm:text-2xl xl:text-lg 2xl:text-xl font-black transition-colors \${activeDashboardTotals.averageKim < 0.98 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}\`}
                              >
                                {Math.max(
                                  0,
                                  activeDashboardTotals.averageKim || 0,
                                ).toFixed(3)}
                              </span>
                              <span className="text-[7px] sm:text-[8px] xl:text-[6px] 2xl:text-[7px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase flex flex-col leading-[1.1] ml-1">
                                <span>цель</span>
                                <span className="text-emerald-500/70 dark:text-emerald-500/50">
                                  ≥ 0.980
                                </span>
                              </span>
                            </div>
                          </div>`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync('src/components/AdminPanelProductionTab.tsx', content, 'utf8');
console.log('Replaced AdminPanelProductionTab items');
