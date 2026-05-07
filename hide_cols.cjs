const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const thToRemove = `                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Номенклатура</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Марка<br/>заг.</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Размер мм.</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-emerald-600">Кол-во тн<br/>заг.</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Длина мм.</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">Тех.<br/>Отходы</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">Делов.<br/>Остаток</th>
                                  <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1.5">
                                      КИМ / Совет
                                      <div className="group relative z-[100]">
                                        <Info className="w-3.5 h-3.5 text-amber-500/70 hover:text-amber-500 cursor-help transition-colors" />
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-900 dark:bg-slate-800 border border-slate-700 text-white text-[10.5px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover:translate-y-0 shadow-xl normal-case tracking-normal whitespace-normal">
                                          Показывает, какая часть заготовки идет в продукцию. Чем ближе к 1.0, тем лучше.
                                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 rotate-45"></div>
                                        </div>
                                      </div>
                                    </div>
                                  </th>`;

const tdToRemove = `                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Номенклатура заг.</span>
                                      <div className="max-w-[150px] md:mx-auto truncate font-medium text-[10px] text-slate-500 text-right md:text-center" title={\`Круг \${getGostForGrade(res.grade)}/ГОСТ 2590-2006\`}>
                                        Круг {getGostForGrade(res.grade)}/ГОСТ 2590-2006
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Марка заг.</span>
                                      <div className="text-right md:text-center font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">{res.grade}</div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Размер мм.</span>
                                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded ml-auto md:ml-0 md:mx-auto">
                                        {parseFloat(res.billetDia.toFixed(2))}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px]">Кол-во тн заг.</span>
                                      <div className="text-right md:text-center font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{res.totalWeight.toFixed(3)}</div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-slate-500 uppercase text-[10px]">Длина мм.</span>
                                      <span className={\`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold \${res.lengthType === "НД" ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/10' : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'} ml-auto md:ml-0 md:mx-auto\`}>
                                        {res.lengthType === "НД" ? "НД" : \`МД \${res.billetLength}\`}
                                      </span>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500/80 uppercase text-[10px]">Тех. Отходы</span>
                                      <div className="text-right md:text-center whitespace-nowrap">
                                        <span className={\`font-bold text-red-500/80 block\`}>{res.drawLength > 0 ? ((res.techEnds / res.drawLength) * res.totalWeight).toFixed(3) : 0} тн</span>
                                        <span className={\`text-[9px] text-slate-400 block\`}>{res.drawLength > 0 ? (((res.techEnds / res.drawLength) * res.totalWeight / res.totalWeight) * 100).toFixed(1) : 0}%</span>
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500/80 uppercase text-[10px]">Делов. Остаток</span>
                                      <div className="text-right md:text-center whitespace-nowrap">
                                        <span className={\`font-bold text-sky-500/80 block\`}>{(res.lengthType === "НД" || res.drawLength <= 0 ? 0 : ((res.usefulLength - (res.pcsPerBillet * res.length)) / res.drawLength * res.totalWeight)).toFixed(3)} тн</span>
                                        <span className={\`text-[9px] text-slate-400 block\`}>{(res.lengthType === "НД" || res.drawLength <= 0 ? 0 : (((res.usefulLength - (res.pcsPerBillet * res.length)) / res.drawLength * res.totalWeight / res.totalWeight) * 100)).toFixed(1)}%</span>
                                      </div>
                                    </td>
                                    <td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800/50 md:border-0 min-h-[44px]">
                                      <span className="md:hidden font-bold text-amber-500 uppercase text-[10px]">КИМ / Совет</span>
                                      <div className="text-right md:text-center whitespace-nowrap">
                                        <span className={\`font-bold \${
                                          isNaN(res.optimizedKim || res.kim) ? 'text-slate-400' :
                                          (res.optimizedKim || res.kim) >= 0.98 ? 'text-emerald-500' : 
                                          (res.optimizedKim || res.kim) >= 0.95 ? 'text-amber-500' : 'text-red-500'
                                        } block\`}>{isNaN(res.optimizedKim || res.kim) ? 'NaN' : (res.optimizedKim || res.kim).toFixed(3)}</span>
                                        {!isNaN(res.optimizedKim || res.kim) && res.optimizedBilletLength && res.optimizedBilletLength !== res.billetLength && (
                                          <div className="mt-1 flex items-center justify-end md:justify-center gap-1 group/tooltip relative">
                                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded cursor-help">
                                              {res.optimizedBilletLength}
                                            </span>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-32 p-1.5 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity z-10 text-center">
                                              Рекомендуемая длина заготовки
                                              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-800 rotate-45"></div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </td>`;

// We specifically want to remove these only from the production block.
// The production block starts at `activeTab === "production"`
const prodIdx = code.indexOf('activeTab === "production"');
let prodCode = code.substring(prodIdx);
let preCode = code.substring(0, prodIdx);

if (prodCode.indexOf(thToRemove) !== -1) {
  prodCode = prodCode.replace(thToRemove, "");
  console.log("Successfully removed TH from production.");
} else {
  // maybe parts match? Let's try matching with regex to be safe.
  console.log("Could not find exactly matching TH.");
}

if (prodCode.indexOf(tdToRemove) !== -1) {
  prodCode = prodCode.replace(tdToRemove, "");
  console.log("Successfully removed TD from production.");
} else {
  console.log("Could not find exactly matching TD.");
}

fs.writeFileSync("src/components/AdminPanel.tsx", preCode + prodCode);
