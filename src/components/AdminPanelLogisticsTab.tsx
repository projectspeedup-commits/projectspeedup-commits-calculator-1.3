import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx-js-style';
import * as LucideIcons from 'lucide-react';
import { getGostForGrade } from '../lib/constants';

export default function AdminPanelLogisticsTab(props: any) {
  const { activeTab } = props;
  const { Truck } = LucideIcons;

  return (
    <>
      {activeTab === "logistics" && (
            <motion.div
             key="logistics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8 pb-24 md:pb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1A1C19] dark:text-white">
                    Логистика
                  </h2>
                  <p className="text-sm text-[#43483F] dark:text-slate-400 mt-2 max-w-2xl">
                    Управление отгрузками, транспортными накладными и графиком
                    поставок.
                  </p>
                </div>
              </div>
              <div className="bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                <Truck className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Модуль в разработке
                </h3>
                <p className="text-sm text-slate-500 max-w-md">
                  Функционал управления логистикой находится на стадии
                  проектирования. Доступ будет открыт в следующих обновлениях.
                </p>
              </div>
            </motion.div>
          )}


    </>
  );
}
