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

  // Clean trailing -row-group and -row
  content = content.replace(/\s-row-group/g, '');
  content = content.replace(/\s-row/g, '');
  content = content.replace(/\smd:table-cell/g, '');

  content = content.replace(/ className="\s+"/g, ' className=""');
  content = content.replace(/ className=""/g, '');

  fs.writeFileSync(file, content, 'utf8');
});
