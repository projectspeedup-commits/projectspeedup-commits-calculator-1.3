import fs from 'fs';

const files = [
  'src/components/AdminPanelSupplyTab.tsx',
  'src/components/AdminPanelProductionTab.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace block md:table
  content = content.replace(/\bblock md:table\b/g, '');

  content = content.replace(/\bhidden md:table-header-group\b/g, '');

  content = content.replace(/\bblock md:table-row-group\b/g, '');

  // Fix tr
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/20 transition-colors block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none p-2 md:p-0 rounded-xl md:rounded-none bg-white dark:bg-\[\#1A1C19\] md:bg-transparent"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"');
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/30 transition-colors group block md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none rounded-xl md:rounded-none bg-white dark:bg-\[\#1A1C19\] p-2 md:p-0 md:bg-transparent"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"');
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/20 transition-colors[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"');
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/30 transition-colors group[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"');

  // remove md:hidden spans
  content = content.replace(/<span className="md:hidden[^>]+>[\s\S]*?<\/span>\s*/g, '');

  // Fix the trailing fragments on td
  content = content.replace(/\sflex justify-between items-center md:table-cell\b/g, '');
  content = content.replace(/\sborder-b border-slate-100 dark:border-slate-800\/50 md:border-0\b/g, '');
  content = content.replace(/\sborder-b border-sky-100 dark:border-sky-900\/50 md:border-0\b/g, '');
  
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s*(md:max-w-\[200px\])?\s*bg-sky-50\/50 dark:bg-sky-900\/10/g, 'className="px-$1 py-3 bg-sky-50/50 dark:bg-sky-900/10');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+min-h-\[44px\]"/g, 'className="px-$1 py-3"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+md:max-w-\[200px\]"/g, 'className="px-$1 py-3 max-w-[200px]"');
  content = content.replace(/className="px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+"/g, 'className="px-$1 py-3"');
  
  // also clean up FreeStock / StockSection
  content = content.replace(/className="px-[0-9]+\smd:px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors"');
  content = content.replace(/className="px-[0-9]+\smd:px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-right md:text-center font-bold text-slate-700 dark:text-slate-200\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center font-bold text-slate-700 dark:text-slate-200"');
  content = content.replace(/className="px-[0-9]+\smd:px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-right md:text-center\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center"');
  content = content.replace(/className="px-[0-9]+\smd:px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+text-right\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center"');
  content = content.replace(/className="px-[0-9]+\smd:px-([0-9]+) py-[0-9]+(?:\s+md:py-[0-9.]+)?\s+min-h-\[44px\]"/g, 'className="px-$1 py-3"');
  
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s*truncate max-w-\[150px\]\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 truncate max-w-[150px]"');
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s*text-right md:text-center font-bold text-slate-700 dark:text-slate-200\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center font-bold text-slate-700 dark:text-slate-200"');
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s*text-right md:text-center\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center"');
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s*text-right md:text-center font-black text-slate-900 dark:text-white\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center font-black text-slate-900 dark:text-white"');
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s*text-right md:text-center text-slate-500 dark:text-slate-400 font-mono\s+min-h-\[44px\]"/g, 'className="px-$1 py-3 text-center text-slate-500 dark:text-slate-400 font-mono"');
  content = content.replace(/className="px-([0-9]+) py-[0-9.]+ md:py-[0-9.]+\s*(?:py-[0-9.]+ md:py-[0-9.]+)?\s+min-h-\[44px\]"/g, 'className="px-$1 py-3"');
  
  content = content.replace(/className="px-([0-9]+) md:px-([0-9]+)/g, 'className="px-$2');

  // remove empty min-h left over
  content = content.replace(/\s+min-h-\[44px\]"/g, '"');
  
  // also clean empty classes
  content = content.replace(/className="\s+"/g, 'className=""');
  content = content.replace(/ className=""/g, '');
  content = content.replace(/\s+"/g, '"');
  
  fs.writeFileSync(file, content, 'utf8');
});
