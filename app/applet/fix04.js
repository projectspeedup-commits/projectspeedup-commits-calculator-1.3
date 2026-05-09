import fs from 'fs';

const files = [
  'src/components/production/CalcSection.tsx',
  'src/components/AdminPanelSupplyTab.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/min-h-\[44px\]/g, '');
  content = content.replace(/ className="\s+"/g, ' className=""');
  content = content.replace(/ className=""/g, '');
  content = content.replace(/  +/g, ' '); // remove multiple spaces

  fs.writeFileSync(file, content, 'utf8');
});
