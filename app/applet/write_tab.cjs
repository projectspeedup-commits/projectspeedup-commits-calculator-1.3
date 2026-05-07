const fs = require('fs');
const txt = fs.readFileSync('economy_block_raw.txt', 'utf-8');
const componentStr = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EconomyItem } from '../App';
import * as LucideIcons from 'lucide-react';

export default function AdminPanelEconomyTab(props: any) {
  const {
      activeTab, handleSave, isSaving, saved, economyItems, handleDeleteEconomyItem,
      handleAddEconomyItem, handleUpdateEconomyItem, saveError, rawPrices, handlePriceChange,
      updateConstants, scrap, remnant, customGrades, remnantPricing, newGrade, setNewGrade,
      handleAddGrade, handleRestoreGrade, handleDeleteGrade, deletedGrades, savedCalculations,
      handlePricingChange
  } = props;
  
  // mock for activeTab if we just inject the inner part
  // Actually, wait, it has {activeTab === "economy" && ( ... )} around it. Let's just remove that outer wrap if possible?
  // Let's just keep it exactly as is for now and render the fragment
  return (
    <>
      ${txt}
    </>
  );
}`;

fs.writeFileSync('src/components/AdminPanelEconomyTab.tsx', componentStr);
