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

  // Replace block md:table
  content = content.replace(/\bblock md:table\b/g, '');

  // Replace hidden md:table-header-group
  content = content.replace(/\bhidden md:table-header-group\b/g, '');

  // Replace block md:table-row-group
  content = content.replace(/\bblock md:table-row-group\b/g, '');

  // Replace tr classes
  content = content.replace(/\bblock md:table-row mb-4 md:mb-0 border border-slate-200 dark:border-slate-800 md:border-none p-2 md:p-0 rounded-xl md:rounded-none bg-white dark:bg-\[\#1A1C19\] md:bg-transparent\b/g, '');

  // Replace td classes
  content = content.replace(/\bflex justify-between items-center md:table-cell\b/g, '');
  content = content.replace(/\bborder-b border-slate-100 dark:border-slate-800\/50 md:border-0\b/g, '');
  content = content.replace(/\bmin-h-\[44px\]\b/g, '');

  // SupplyPlansSection has py-3 md:py-2.5
  content = content.replace(/\bpy-3 md:py-2\.5\b/g, '');
  
  // also FreeStockSection / StockSection has extra classes, e.g. "px-4 md:px-8 py-3 md:py-4 ... border-b ... min-h-[44px]"
  content = content.replace(/\bpx-4 md:px-8\b/g, 'px-8');
  content = content.replace(/\bpx-4 md:px-6\b/g, 'px-6');
  content = content.replace(/\bpx-4 md:px-5\b/g, 'px-5');
  content = content.replace(/\bpy-3 md:py-4\b/g, 'py-3');
  
  content = content.replace(/\btext-right md:text-center\b/g, 'text-center');

  // Remove the <span className="md:hidden ...">...</span>
  content = content.replace(/<span className="md:hidden[^>]+>[\s\S]*?<\/span>\s*/g, '');
  
  // Fix multiple spaces a bit
  content = content.replace(/className="\s+/g, 'className="');
  content = content.replace(/\s+"/g, '"');
  
  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed', file);
});
