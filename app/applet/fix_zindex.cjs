const fs = require('fs');

const files = [
  'src/components/production/CalcStockSection.tsx',
  'src/components/production/CalcSupplySection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(
    /border-slate-800 rounded-\[20px\] sm:rounded-\[32px\] flex flex-col shadow-xl shadow-slate-200\/50 dark:shadow-none/g,
    'border-slate-800 rounded-[20px] sm:rounded-[32px] flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-none relative z-30'
  );
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
