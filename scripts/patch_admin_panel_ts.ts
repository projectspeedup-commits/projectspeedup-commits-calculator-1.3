import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// Add imports
if (!code.includes('import { db }')) {
  code = code.replace(
    /import \{ motion, AnimatePresence \} from "motion\/react";/,
    'import { motion, AnimatePresence } from "motion/react";\nimport { db } from "../lib/firebase";\nimport { doc, onSnapshot, setDoc } from "firebase/firestore";'
  );
}

// Add state for tracking cloud sync
const hookInjectionPoint = '  const [saveError, setSaveError] = useState("");';
const hookAddition = `
  const skipCloudSave = useRef(false);

  useEffect(() => {
    if (!isCloudActive || !db) return;

    const unsubProd = onSnapshot(doc(db, "admin_data", "prod_data"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        skipCloudSave.current = true;
        if (data.processedSupplyPlans) setProcessedSupplyPlansProd(data.processedSupplyPlans);
        if (data.processedStock) setProcessedStockProd(data.processedStock);
        if (data.calculationResults) setCalcResultsProd(data.calculationResults);
        setTimeout(() => { skipCloudSave.current = false; }, 500);
      }
    });

    const unsubSup = onSnapshot(doc(db, "admin_data", "sup_data"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        skipCloudSave.current = true;
        if (data.processedSupplyPlans) setProcessedSupplyPlansSup(data.processedSupplyPlans);
        if (data.processedStock) setProcessedStockSup(data.processedStock);
        if (data.calculationResults) setCalcResultsSup(data.calculationResults);
        setTimeout(() => { skipCloudSave.current = false; }, 500);
      }
    });

    return () => {
      unsubProd();
      unsubSup();
    };
  }, [isCloudActive]);

  const saveToCloud = async (type: string, payload: any) => {
    if (!isCloudActive || !db || skipCloudSave.current) return;
    try {
      await setDoc(doc(db, "admin_data", type), payload, { merge: true });
    } catch (e) {
      console.warn("Cloud save failed", e);
    }
  };
`;

if (!code.includes('const skipCloudSave = useRef(false);')) {
  code = code.replace(hookInjectionPoint, hookInjectionPoint + '\n' + hookAddition);
}

// Update useEffects to cloud save
code = code.replace(
  /  useEffect\(\(\) => \{\n    localStorage\.setItem\(\n      "ais_prod_calc_results",\n      JSON\.stringify\(calcResultsProd\),\n    \);\n    localStorage\.setItem\(\n      "ais_sup_calc_results",\n      JSON\.stringify\(calcResultsSup\),\n    \);\n  \}, \[calcResultsProd, calcResultsSup\]\);/g,
  `  useEffect(() => {
    localStorage.setItem("ais_prod_calc_results", JSON.stringify(calcResultsProd));
    localStorage.setItem("ais_sup_calc_results", JSON.stringify(calcResultsSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { calculationResults: calcResultsProd });
      saveToCloud("sup_data", { calculationResults: calcResultsSup });
    }
  }, [calcResultsProd, calcResultsSup]);`
);

code = code.replace(
  /  useEffect\(\(\) => \{\n    localStorage\.setItem\("ais_prod_stock", JSON\.stringify\(processedStockProd\)\);\n    localStorage\.setItem\("ais_sup_stock", JSON\.stringify\(processedStockSup\)\);\n  \}, \[processedStockProd, processedStockSup\]\);/g,
  `  useEffect(() => {
    localStorage.setItem("ais_prod_stock", JSON.stringify(processedStockProd));
    localStorage.setItem("ais_sup_stock", JSON.stringify(processedStockSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { processedStock: processedStockProd });
      saveToCloud("sup_data", { processedStock: processedStockSup });
    }
  }, [processedStockProd, processedStockSup]);`
);

code = code.replace(
  /  useEffect\(\(\) => \{\n    localStorage\.setItem\(\n      "ais_prod_supply_plans",\n      JSON\.stringify\(processedSupplyPlansProd\),\n    \);\n    localStorage\.setItem\(\n      "ais_sup_supply_plans",\n      JSON\.stringify\(processedSupplyPlansSup\),\n    \);\n  \}, \[processedSupplyPlansProd, processedSupplyPlansSup\]\);/g,
  `  useEffect(() => {
    localStorage.setItem("ais_prod_supply_plans", JSON.stringify(processedSupplyPlansProd));
    localStorage.setItem("ais_sup_supply_plans", JSON.stringify(processedSupplyPlansSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { processedSupplyPlans: processedSupplyPlansProd });
      saveToCloud("sup_data", { processedSupplyPlans: processedSupplyPlansSup });
    }
  }, [processedSupplyPlansProd, processedSupplyPlansSup]);`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Patched");
