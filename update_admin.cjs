const fs = require("fs");
let appCode = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const target1 = `  const [planFiles, setPlanFiles] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [stockFiles, setStockFiles] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [supplyPlanFiles, setSupplyPlanFiles] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);`;

const repl1 = `  const [planFilesProd, setPlanFilesProd] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [stockFilesProd, setStockFilesProd] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [supplyPlanFilesProd, setSupplyPlanFilesProd] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);

  const [planFilesSup, setPlanFilesSup] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [stockFilesSup, setStockFilesSup] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);
  const [supplyPlanFilesSup, setSupplyPlanFilesSup] = useState<{ id: string; name: string; size: string; date: string; file?: File }[]>([]);

  const isProduction = activeTab === 'production';
  const planFiles = isProduction ? planFilesProd : planFilesSup;
  const setPlanFiles = isProduction ? setPlanFilesProd : setPlanFilesSup;
  const stockFiles = isProduction ? stockFilesProd : stockFilesSup;
  const setStockFiles = isProduction ? setStockFilesProd : setStockFilesSup;
  const supplyPlanFiles = isProduction ? supplyPlanFilesProd : supplyPlanFilesSup;
  const setSupplyPlanFiles = isProduction ? setSupplyPlanFilesProd : setSupplyPlanFilesSup;`;

if (appCode.includes(target1)) {
  appCode = appCode.replace(target1, repl1);
  console.log("target1 applied");
} else console.log("target1 failed");

const target2 = `  const [processedSupplyPlans, setProcessedSupplyPlans] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ais_supply_plans");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });
  const [isProcessingSupplyPlans, setIsProcessingSupplyPlans] = useState(false);
  const [processedStock, setProcessedStock] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ais_stock");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });`;

const repl2 = `  const [processedSupplyPlansProd, setProcessedSupplyPlansProd] = useState<any[]>(() => { try { const s = localStorage.getItem('ais_prod_supply_plans'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [processedSupplyPlansSup, setProcessedSupplyPlansSup] = useState<any[]>(() => { try { const s = localStorage.getItem('ais_sup_supply_plans'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [isProcessingSupplyPlans, setIsProcessingSupplyPlans] = useState(false);
  const [processedStockProd, setProcessedStockProd] = useState<any[]>(() => { try { const s = localStorage.getItem('ais_prod_stock'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [processedStockSup, setProcessedStockSup] = useState<any[]>(() => { try { const s = localStorage.getItem('ais_sup_stock'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });`;

if (appCode.includes(target2)) {
  appCode = appCode.replace(target2, repl2);
  console.log("target2 applied");
} else console.log("target2 failed");

const target3 = `  const [calculationResults, setCalculationResults] = useState<CalculationResult[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ais_calc_results");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });`;

const repl3 = `  const [calcResultsProd, setCalcResultsProd] = useState<CalculationResult[]>(() => { try { const s = localStorage.getItem('ais_prod_calc_results'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [calcResultsSup, setCalcResultsSup] = useState<CalculationResult[]>(() => { try { const s = localStorage.getItem('ais_sup_calc_results'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });

  const calculationResults = isProduction ? calcResultsProd : calcResultsSup;
  const setCalculationResults = isProduction ? setCalcResultsProd : setCalcResultsSup;
  const processedStock = isProduction ? processedStockProd : processedStockSup;
  const processedSupplyPlans = isProduction ? processedSupplyPlansProd : processedSupplyPlansSup;`;

if (appCode.includes(target3)) {
  appCode = appCode.replace(target3, repl3);
  console.log("target3 applied");
} else console.log("target3 failed");

const targetUseEffectsStore = `  useEffect(() => {
    localStorage.setItem("ais_calc_results", JSON.stringify(calculationResults));
  }, [calculationResults]);

  useEffect(() => {
    localStorage.setItem("ais_stock", JSON.stringify(processedStock));
  }, [processedStock]);

  useEffect(() => {
    localStorage.setItem("ais_supply_plans", JSON.stringify(processedSupplyPlans));
  }, [processedSupplyPlans]);`;

const replUseEffectsStore = `  useEffect(() => {
    localStorage.setItem("ais_prod_calc_results", JSON.stringify(calcResultsProd));
    localStorage.setItem("ais_sup_calc_results", JSON.stringify(calcResultsSup));
  }, [calcResultsProd, calcResultsSup]);

  useEffect(() => {
    localStorage.setItem("ais_prod_stock", JSON.stringify(processedStockProd));
    localStorage.setItem("ais_sup_stock", JSON.stringify(processedStockSup));
  }, [processedStockProd, processedStockSup]);

  useEffect(() => {
    localStorage.setItem("ais_prod_supply_plans", JSON.stringify(processedSupplyPlansProd));
    localStorage.setItem("ais_sup_supply_plans", JSON.stringify(processedSupplyPlansSup));
  }, [processedSupplyPlansProd, processedSupplyPlansSup]);`;

if (appCode.includes(targetUseEffectsStore)) {
  appCode = appCode.replace(targetUseEffectsStore, replUseEffectsStore);
  console.log("targetUseEffectsStore applied");
} else console.log("targetUseEffectsStore failed");

const targetProcessHanders = `  const handleProcessPlans = async () => {
    if (planFiles.length === 0) return;`;

const replProcessHanders = `  const handleProcessPlans = async (type: "production" | "supply", filesToProcess: any[]) => {
    if (filesToProcess.length === 0) return;`;

appCode = appCode.replace(targetProcessHanders, replProcessHanders);
appCode = appCode.replace(
  `for (const fileObj of planFiles) {`,
  `for (const fileObj of filesToProcess) {`,
);
appCode = appCode.replace(
  `      setCalculationResults(processed);\n    } catch (error) {\n      console.error(error);`,
  `      if (type === 'production') setCalcResultsProd(processed); else setCalcResultsSup(processed);\n    } catch (error) {\n      console.error(error);`,
);

appCode = appCode.replace(
  `  const handleProcessStock = async () => {\n    if (stockFiles.length === 0) return;`,
  `  const handleProcessStock = async (type: "production" | "supply", filesToProcess: any[]) => {\n    if (filesToProcess.length === 0) return;`,
);
appCode = appCode.replace(
  `for (const fileObj of stockFiles) {`,
  `for (const fileObj of filesToProcess) {`,
);
appCode = appCode.replace(
  `      setProcessedStock(extractedStock);\n    } catch (error) {\n      console.error(error);`,
  `      if (type === 'production') setProcessedStockProd(extractedStock); else setProcessedStockSup(extractedStock);\n    } catch (error) {\n      console.error(error);`,
);

appCode = appCode.replace(
  `  const handleProcessSupplyPlans = async () => {\n    if (supplyPlanFiles.length === 0) return;`,
  `  const handleProcessSupplyPlans = async (type: "production" | "supply", filesToProcess: any[]) => {\n    if (filesToProcess.length === 0) return;`,
);
appCode = appCode.replace(
  `for (const fileObj of supplyPlanFiles) {`,
  `for (const fileObj of filesToProcess) {`,
);
appCode = appCode.replace(
  `      setProcessedSupplyPlans(extractedPlans);\n    } catch (error) {\n      console.error(error);`,
  `      if (type === 'production') setProcessedSupplyPlansProd(extractedPlans); else setProcessedSupplyPlansSup(extractedPlans);\n    } catch (error) {\n      console.error(error);`,
);

const targetProcEffects = `  useEffect(() => {
    if (stockFiles.length > 0) {
      handleProcessStock();
    } else {
      setProcessedStock([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockFiles]);

  useEffect(() => {
    if (supplyPlanFiles.length > 0) {
      handleProcessSupplyPlans();
    } else {
      setProcessedSupplyPlans([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplyPlanFiles]);

  useEffect(() => {
    if (planFiles.length > 0) {
      handleProcessPlans();
    } else {
      setCalculationResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planFiles]);`;

const replProcEffects = `  useEffect(() => {
    if (stockFilesProd.length > 0) handleProcessStock('production', stockFilesProd);
    else setProcessedStockProd([]);
  }, [stockFilesProd]);

  useEffect(() => {
    if (stockFilesSup.length > 0) handleProcessStock('supply', stockFilesSup);
    else setProcessedStockSup([]);
  }, [stockFilesSup]);

  useEffect(() => {
    if (supplyPlanFilesProd.length > 0) handleProcessSupplyPlans('production', supplyPlanFilesProd);
    else setProcessedSupplyPlansProd([]);
  }, [supplyPlanFilesProd]);

  useEffect(() => {
    if (supplyPlanFilesSup.length > 0) handleProcessSupplyPlans('supply', supplyPlanFilesSup);
    else setProcessedSupplyPlansSup([]);
  }, [supplyPlanFilesSup]);

  useEffect(() => {
    if (planFilesProd.length > 0) handleProcessPlans('production', planFilesProd);
    else setCalcResultsProd([]);
  }, [planFilesProd]);

  useEffect(() => {
    if (planFilesSup.length > 0) handleProcessPlans('supply', planFilesSup);
    else setCalcResultsSup([]);
  }, [planFilesSup]);`;

if (appCode.includes(targetProcEffects)) {
  appCode = appCode.replace(targetProcEffects, replProcEffects);
  console.log("targetProcEffects applied");
} else console.log("targetProcEffects failed");

const targetPricesGlobal = `  useEffect(() => {
    if (calculationResults.length === 0) return;
    
    setCalculationResults(prev => prev.map(res => {
      let cost = 0;
      const type = res.type;
      const sizeStr = String(res.size).trim();
      if (['Круг', 'Круг г/к'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.md || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Шестигранник', 'Шестигранник г/к'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.nd || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Круг со специальной отделкой поверхности'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.md || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Шестигранник калиброванный'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.nd || '0') * res.totalWeight * 1.2 * 1000;
      }
      return { ...res, price: cost / (res.totalWeight || 1) / 1.2 / 1000, totalCost: cost };
    }));
  }, [rawPrices]);`;

const replPricesGlobal = `  useEffect(() => {
    const updatePrices = (prev: CalculationResult[]) => prev.map(res => {
      let cost = 0;
      const type = res.type;
      const sizeStr = String(res.size).trim();
      if (['Круг', 'Круг г/к'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.md || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Шестигранник', 'Шестигранник г/к'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.nd || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Круг со специальной отделкой поверхности'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.md || '0') * res.totalWeight * 1.2 * 1000;
      } else if (['Шестигранник калиброванный'].includes(type) && sizeStr) {
        cost = parseFloat(rawPrices[sizeStr]?.nd || '0') * res.totalWeight * 1.2 * 1000;
      }
      return { ...res, price: cost / (res.totalWeight || 1) / 1.2 / 1000, totalCost: cost };
    });
    setCalcResultsProd(updatePrices);
    setCalcResultsSup(updatePrices);
  }, [rawPrices]);`;

if (appCode.includes(targetPricesGlobal)) {
  appCode = appCode.replace(targetPricesGlobal, replPricesGlobal);
  console.log("targetPricesGlobal applied");
} else console.log("targetPricesGlobal failed");

fs.writeFileSync("src/components/AdminPanel.tsx", appCode);
