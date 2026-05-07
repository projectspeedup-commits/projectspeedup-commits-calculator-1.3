const fs = require("fs");
let lines = fs
  .readFileSync("src/components/AdminPanel.tsx", "utf8")
  .split("\n");

const startIdx = lines.findIndex((l) =>
  l.includes(
    '<h5 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 sm:mb-4">Топ-5 по дефициту (тн)</h5>',
  ),
);
const endIdx = lines.findIndex(
  (l, i) =>
    i > startIdx &&
    l.includes(
      "<tbody className={`divide-y divide-slate-100 dark:divide-slate-800 text-[11px]`}>",
    ),
);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `                                  <div className="flex-1 min-h-[160px] w-full relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={filteredMatchedDemand.filter(d => d.shortageStock > 0).sort((a, b) => b.shortageStock - a.shortageStock).slice(0, 5)} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="nomenclature" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#64748b' }} width={80} />
                                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px' }} formatter={(value) => [\`\${Number(value).toFixed(2)} тн\`, 'Дефицит']} />
                                        <Bar dataKey="shortageStock" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={12} />
                                      </BarChart>
                                    </ResponsiveContainer>
                                  </div>
                                </div>
                              </div>
                            </div>
                              
                              <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full rounded-t-none border-t-0">
                                <div className="flex-1 overflow-auto custom-scrollbar">
                                  <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10 shadow-sm">
                                      <tr>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Вх. №</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Дата отгр.</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">№ Заказа</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Заказчик</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Номенклатура</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">М. стали</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Размер</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest whitespace-nowrap">Кол-во тн заг.</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Длина мм.</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">Тех. Отходы</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-amber-500/80">Делов. Остаток</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">КИМ / Совет</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">Статус обеспечения.</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-rose-500 uppercase tracking-widest whitespace-nowrap">К закупке тн (дефицит)</th>
                                        <th className="px-5 py-2 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap align-middle">
                                          <div className="flex flex-col items-center justify-center gap-1">
                                            <span>Тех. отходы 2</span>
                                            <div className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                                              <span className="text-amber-500/70">Σ</span>
                                              <span>{(stockTotals as any).techWaste2?.toFixed(3) || "0.000"} тн</span>
                                            </div>
                                          </div>
                                        </th>
                                        <th className="px-5 py-2 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap align-middle">
                                          <div className="flex flex-col items-center justify-center gap-1">
                                            <span>Дел. Остатки 2</span>
                                            <div className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">
                                              <span className="text-amber-500/70">Σ</span>
                                              <span>{(stockTotals as any).usefulRem2?.toFixed(3) || "0.000"} тн</span>
                                            </div>
                                          </div>
                                        </th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-amber-500 uppercase tracking-widest whitespace-nowrap">КИМ 2</th>
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Исход Номенклатура</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Профиль</th>
                                        <th className="px-5 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">НТД</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Марка стали</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Размер</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Длина</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Исх. Остаток (тн)</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest whitespace-nowrap">Взято (тн)</th>
                                        <th className="px-5 py-4 text-center text-[10px] font-bold text-sky-500 uppercase tracking-widest whitespace-nowrap">Остаток на складе (тн)</th>
                                      </tr>
                                    </thead>`;

  const before = lines.slice(0, startIdx + 1);
  const after = lines.slice(endIdx);

  fs.writeFileSync(
    "src/components/AdminPanel.tsx",
    before.join("\n") + "\n" + replacement + "\n" + after.join("\n"),
  );
} else {
  console.log("NOT FOUND");
}
