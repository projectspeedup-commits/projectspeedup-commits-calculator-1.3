import fs from 'fs';

const files = [
  'src/components/AdminPanelSupplyTab.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/text-right md:text-center/g, 'text-center');
  content = content.replace(/md:text-center/g, 'text-center');

  fs.writeFileSync(file, content, 'utf8');
});
