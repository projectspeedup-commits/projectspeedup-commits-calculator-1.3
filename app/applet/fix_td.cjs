const fs = require('fs');

const files = [
  'src/components/production/CalcSection.tsx',
  'src/components/production/FreeStockSection.tsx',
  'src/components/production/StockSection.tsx',
  'src/components/production/SupplyPlansSection.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Fix the td trailing classes left from previous replace
  content = content.replace(/className="px-([0-9]+) py-3\s+min-h-\[44px\]"/g, 'className="px-$1 py-3"');
  content = content.replace(/className="px-([0-9]+) py-3\s+md:max-w-\[200px\]"/g, 'className="px-$1 py-3 max-w-[200px]"');
  
  // also clean up FreeStock / StockSection
  content = content.replace(/className="px-([0-9]+) py-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors\s+"/g, 'className="px-$1 py-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"');
  content = content.replace(/className="px-([0-9]+) py-3 text-center font-bold text-slate-700 dark:text-slate-200\s+"/g, 'className="px-$1 py-3 text-center font-bold text-slate-700 dark:text-slate-200"');
  content = content.replace(/className="px-([0-9]+) py-3 text-center\s+"/g, 'className="px-$1 py-3 text-center"');
  content = content.replace(/className="px-([0-9]+) py-3 text-right\s+"/g, 'className="px-$1 py-3 text-center"');

  // SupplyPlansSection
  content = content.replace(/className="px-([0-9]+) py-3\s+truncate max-w-\[150px\]\s+"/g, 'className="px-$1 py-3 truncate max-w-[150px]"');
  content = content.replace(/className="px-([0-9]+) py-3 text-center text-slate-500 dark:text-slate-400 font-mono\s+"/g, 'className="px-$1 py-3 text-center text-slate-500 dark:text-slate-400 font-mono"');
  content = content.replace(/className="px-([0-9]+) py-3 text-center font-black text-slate-900 dark:text-white\s+"/g, 'className="px-$1 py-3 text-center font-black text-slate-900 dark:text-white"');
  
  // finally clean up all double spaces that might be left due to regex removes
  content = content.replace(/\s+min-h-\[44px\]/g, '');
  content = content.replace(/\s+"/g, '"');
  
  fs.writeFileSync(file, content, 'utf8');
});
