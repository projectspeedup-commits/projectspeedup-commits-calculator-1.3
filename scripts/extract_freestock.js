import fs from 'fs';

let content = fs.readFileSync('src/components/AdminPanelProductionTab.tsx', 'utf-8');

const marker1 = '                ) : productionSection === "free-stock" ? (';
const marker2 = '                ) : productionSection === "calc-supply" ? (';

const idx1 = content.indexOf(marker1);
const idx2 = content.indexOf(marker2, idx1 + 1);

if (idx1 !== -1 && idx2 !== -1) {
  const freeStockContent = content.substring(idx1 + marker1.length, idx2);
  
  const componentStr = `import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../lib/utils';
import { getGostForGrade } from '../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download } = LucideIcons;

export function FreeStockSection(props: any) {
  const { freeStock, formatCurrency, freeStockTableRef, onFreeStockMouseDown, handleMouseLeaveOrUp, handleMouseMove, isFreeStockDragging } = props;
  
  return (
    <React.Fragment>
      ${freeStockContent.trim()}
    </React.Fragment>
  );
}
`;

  fs.writeFileSync('src/components/production/FreeStockSection.tsx', componentStr);
  console.log('extracted free-stock');
  
  const nextLine = '\\n                  <FreeStockSection {...props} />\\n';
  const newContent = content.substring(0, idx1 + marker1.length) + nextLine + content.substring(idx2);
  fs.writeFileSync('src/components/AdminPanelProductionTab.tsx', newContent);
  console.log('replaced free-stock');
} else {
  console.log('not found');
}
