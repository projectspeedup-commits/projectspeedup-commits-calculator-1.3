import fs from 'fs';

const files = [
  'src/components/production/CalcSection.tsx',
  'src/components/production/FreeStockSection.tsx',
  'src/components/production/StockSection.tsx',
  'src/components/production/SupplyPlansSection.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace block md:table
  content = content.replace(/\bblock md:table\b/g, '');

  content = content.replace(/\bhidden md:table-header-group\b/g, '');

  content = content.replace(/\bblock md:table-row-group\b/g, '');

  // Fix tr
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/20 transition-colors[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"');
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/30 transition-colors group[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"');

  // Fix the trailing fragments on td
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+min-h-\[44px\]"/g, 'className="px-$1 py-3"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+md:max-w-\[200px\]"/g, 'className="px-$1 py-3 max-w-[200px]"');
  
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors\s+"/g, 'className="px-$1 py-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-center font-bold text-slate-700 dark:text-slate-200\s+"/g, 'className="px-$1 py-3 text-center font-bold text-slate-700 dark:text-slate-200"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-center\s+"/g, 'className="px-$1 py-3 text-center"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-right\s+"/g, 'className="px-$1 py-3 text-center"');

  // SupplyPlansSection specific
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+truncate max-w-\[150px\]\s+"/g, 'className="px-$1 py-3 truncate max-w-[150px]"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-center text-slate-500 dark:text-slate-400 font-mono\s+"/g, 'className="px-$1 py-3 text-center text-slate-500 dark:text-slate-400 font-mono"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-center font-black text-slate-900 dark:text-white\s+"/g, 'className="px-$1 py-3 text-center font-black text-slate-900 dark:text-white"');

  // remove empty min-h left over
  content = content.replace(/\s+min-h-\[44px\]"/g, '"');
  
  // also clean empty classes
  content = content.replace(/className="\s+"/g, 'className=""');
  content = content.replace(/\s+"/g, '"');
  
  fs.writeFileSync(file, content, 'utf8');
});
