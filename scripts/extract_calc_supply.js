import fs from 'fs';

let content = fs.readFileSync('src/components/AdminPanelProductionTab.tsx', 'utf-8');

const marker1 = '                ) : productionSection === "calc-supply" ? (';
const marker2 = '                ) : productionSection === "supply-plans" ? (';

const idx1 = content.indexOf(marker1);
const idx2 = content.indexOf(marker2, idx1 + 1);

if (idx1 !== -1 && idx2 !== -1) {
  const calcSupplyContent = content.substring(idx1 + marker1.length, idx2);
  
  const componentStr = `import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../lib/utils';
import { getGostForGrade } from '../lib/constants';

const { ClipboardList, HelpCircle, Package, Upload, Search, Filter, Check, Copy, Download } = LucideIcons;

export function CalcSupplySection(props: any) {
  const { 
    supplyCalculationData, activeTab, setSupplySection, setProductionSection, setActiveTab,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredTotals,
    isCopied, setIsCopied, supplyTableRef, onSupplyMouseDown, handleMouseLeaveOrUp,
    handleMouseMove, isSupplyDragging, formatCurrency
  } = props;
  
  return (
    <React.Fragment>
      ${calcSupplyContent.trim()}
    </React.Fragment>
  );
}
`;

  fs.writeFileSync('src/components/production/CalcSupplySection.tsx', componentStr);
  console.log('extracted calc-supply');
  
  const nextLine = '\\n                  <CalcSupplySection {...props} />\\n';
  const newContent = content.substring(0, idx1 + marker1.length) + nextLine + content.substring(idx2);
  fs.writeFileSync('src/components/AdminPanelProductionTab.tsx', newContent);
  console.log('replaced calc-supply');
} else {
  console.log('not found');
}
