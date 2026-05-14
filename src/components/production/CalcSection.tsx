import React from 'react';
import { motion } from 'motion/react';
import { FolderSearch, ArrowRight, Check, Copy, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getTimestampedFilename } from '../../lib/utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function CalcSection({
  calculationResults,
  activeTab,
  setSupplySection,
  setProductionSection,
  setActiveTab,
  isProcessing,
  copySuccess,
  setCopySuccess,
  tableContainerRef,
  handleMouseDown,
  handleMouseLeaveOrUp,
  handleMouseMove,
  isDragging
}: any) {
  const totalRemaining = calculationResults.reduce(
    (sum: any, res: any) => sum + (res.remainingToProcess || 0),
    0,
  );

  if (calculationResults.length === 0) {
    return (
      <motion.div
        key="empty-calc"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="flex flex-col items-center justify-center py-24 bg-slate-50 dark:bg-slate-900/40 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800"
      >
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0  dark: rounded-3xl rotate-6 mix-blend-multiply opacity-50"></div>
          <div className="absolute inset-0 bg-white dark:bg-[#1A1C19] rounded-3xl -rotate-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg">
            <FolderSearch className="w-10 h-10 text-slate-800 dark:text-slate-200" />
          </div>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
          Портфель заказов пуст
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm px-6 leading-relaxed mb-8 font-medium">
          Загрузите файл с заказами клиентов во вкладке «Файлы», чтобы система могла произвести расчет потребности.
        </p>

        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            if (activeTab === "supply") setSupplySection("files");
            else if (activeTab === "production") setProductionSection("files");
            else {
              setActiveTab("production");
              setProductionSection("files");
            }
          }}
          className="font-black px-8"
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Перейти к загрузке файлов
        </Button>

        {isProcessing && (
          <div className="mt-8 flex items-center gap-3 h-12 px-8 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs shadow-sm border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
            <div className="w-4 h-4 border-2 border-slate-200 dark:border-slate-800 border-t-sky-500 rounded-full animate-spin"></div>
            Расчёт в процессе...
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      key="supply-calc"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <Card
        isPadded={false}
        header={
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight shrink-0">
                Портфель заказов
              </h4>
              <div className="flex items-center px-4 py-1.5 text-slate-800 dark:text-slate-200 font-black border border-slate-200 dark:border-slate-800 rounded-xl">
                <span className="text-[9px] mr-2 uppercase font-bold opacity-60 tracking-widest">
                  Остаток выполнения
                </span>
                <div>
                  <span className="text-base tracking-tight leading-none">
                    {totalRemaining.toFixed(3)}
                  </span>
                  <span className="text-[8px] ml-1 uppercase font-bold">
                    тн
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full xl:w-auto">
              <Button
                variant={copySuccess ? "success" : "secondary"}
                size="sm"
                onClick={() => {
                  const headers = ["Внутренний №", "Дата Заказа", "№ Заказа", "Клиент", "Номенклатура", "Профиль", "Марка", "Размер", "Длина", "Кол-во тн в заказе", "Остаток выполнения"];
                  const rows = calculationResults.map((res: any) => [
                    res.internalNo || "", res.shippingDate || "", res.orderNo || "", res.client || "", res.nomenclature || "", res.type || "", res.grade || "", Number(res.diameter) || 0, res.lengthType === "НД" ? "НД" : `МД ${res.length}`, Number(res.weightTons || 0), Number((res.remainingToProcess || 0).toFixed(3)),
                  ]);
                  const tsv = [headers, ...rows].map(row => row.join("\t")).join("\n");
                  navigator.clipboard.writeText(tsv);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className="font-bold flex-1 sm:flex-none"
                leftIcon={copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                title="Скопировать для вставки в Google Таблицы"
              >
                {copySuccess ? "Скопировано" : "Sheets"}
              </Button>

              <Button
                variant="success"
                size="sm"
                onClick={() => {
                  const headers = ["Внутренний №", "Дата Заказа", "№ Заказа", "Клиент", "Номенклатура", "Профиль", "Марка", "Размер", "Длина", "Кол-во тн в заказе", "Остаток выполнения"];
                  const rows = calculationResults.map((res: any) => [
                    res.internalNo || "", res.shippingDate || "", res.orderNo || "", res.client || "", res.nomenclature || "", res.type || "", res.grade || "", String(res.diameter).replace(".", ","), res.lengthType === "НД" ? "НД" : `МД ${res.length}`, String(res.weightTons).replace(".", ","), String((res.remainingToProcess || 0).toFixed(3)).replace(".", ","),
                  ]);
                  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
                  const workbook = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(workbook, worksheet, "Заказы");
                  XLSX.writeFile(workbook, getTimestampedFilename("Заказы"));
                }}
                className="font-bold flex-1 sm:flex-none"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Excel
              </Button>
            </div>
          </div>
        }
      >
        <div
          ref={tableContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className={`overflow-auto max-h-[calc(100vh-350px)] custom-scrollbar relative ${isDragging ? "select-none cursor-grabbing" : "cursor-grab"}`}
        >
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10"  style={{ width: "8rem" }}>Внутр. №</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Дата</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >№ Заказа</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Клиент</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10"  style={{ width: '12rem', maxWidth: '12rem', minWidth: '12rem' }}>Номенклатура</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Профиль</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Марка</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Размер</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Длина</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >План (тн)</th>
                <th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >Остаток выполнения</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {calculationResults.map((res: any, i: number) => (
                <tr key={i} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{res.internalNo}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{res.shippingDate}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{res.orderNo}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{res.client}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left" >
                    <div className="truncate font-mono text-[10px] text-slate-400 group-hover:text-slate-900 dark:text-white dark:group-hover:text-white transition-colors text-center" title={res.nomenclature}>
                      {res.nomenclature}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <Badge variant="outline" className="font-bold border-slate-200">{res.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{res.grade}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <span className="font-mono font-black text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200  dark: px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                      {parseFloat(Number(res.diameter || 0).toFixed(2))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    <Badge variant={res.lengthType === "НД" ? "info" : "secondary"}>
                      {res.lengthType === "НД" ? "НД" : `МД ${res.length}`}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >{(res.weightTons || 0).toFixed(3)}</td>
                  <td className="px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center" >
                    {(res.remainingToProcess || 0).toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
