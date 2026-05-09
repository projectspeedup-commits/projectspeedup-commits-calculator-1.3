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

  // Fix the tr className 
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/20 transition-colors[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"');

  // Fix the tr group className
  content = content.replace(/className="hover:bg-slate-50\/50 dark:hover:bg-slate-800\/30 transition-colors group[^"]+"/g, 'className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"');
  
  fs.writeFileSync(file, content, 'utf8');
});
