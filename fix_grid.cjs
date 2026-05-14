const fs = require('fs');
const f = 'src/components/supply/SupplyCalcSection.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/className=\{\`grid grid-cols-1 \$\{!isPurchasingMode \?"lg:grid-cols-3" :"lg:grid-cols-2"\} gap-6\`\}/g, 'className={`grid grid-cols-1 md:grid-cols-2 ${!isPurchasingMode ? "xl:grid-cols-3" : ""} gap-4 sm:gap-6 lg:gap-8`}');
fs.writeFileSync(f, c);
