import fs from 'fs';

let content = fs.readFileSync('src/components/AdminPanelProductionTab.tsx', 'utf-8');

const marker1 = '                ) : productionSection === "supply-plans" ? (';
const marker2 = '                ) : null}';

const idx1 = content.indexOf(marker1);
const idx2 = content.indexOf(marker2, idx1 + 1);

if (idx1 !== -1 && idx2 !== -1) {
  const plansContent = content.substring(idx1 + marker1.length, idx2);
  
  const componentStr = `import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

const { ShoppingCart } = LucideIcons;

export function SupplyPlansSection(props: any) {
  const { processedSupplyPlans } = props;
  
  return (
    <React.Fragment>
      ${plansContent.trim()}
    </React.Fragment>
  );
}
`;

  fs.writeFileSync('src/components/production/SupplyPlansSection.tsx', componentStr);
  console.log('extracted supply-plans');
  
  const nextLine = '\\n                  <SupplyPlansSection {...props} />\\n';
  const newContent = content.substring(0, idx1 + marker1.length) + nextLine + content.substring(idx2);
  fs.writeFileSync('src/components/AdminPanelProductionTab.tsx', newContent);
  console.log('replaced supply-plans');
} else {
  console.log('not found');
}
