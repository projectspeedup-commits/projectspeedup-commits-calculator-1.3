import AdminPanelHelpTab from './AdminPanelHelpTab';
import AdminPanelLogisticsTab from './AdminPanelLogisticsTab';
import AdminPanelProductionTab from './AdminPanelProductionTab';
import AdminPanelSupplyTab from './AdminPanelSupplyTab';
import AdminPanelEconomyTab from './AdminPanelEconomyTab';
import {
  DEFAULT_STEEL_GRADES,
  formatInputValue,
  handleNumericInput,
  DEFAULT_ECONOMY_ITEMS,
  EconomyItem,
  ROUND_DATA,
  HEX_DATA,
  getGostForGrade,
} from "../lib/constants";
import {
  Activity,
  LogOut,
  Plus,
  Trash2,
  Settings,
  Moon,
  Sun,
  Info,
  TrendingUp,
  Calculator,
  Wallet,
  Layers,
  Package,
  Upload,
  FileText,
  X,
  BookOpen,
  ChevronLeft,
  Download,
  Copy,
  Check,
  ShoppingCart,
  Factory,
  Truck,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  FolderSearch,
  ArrowRight,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  MouseEvent,
  useMemo,
  Fragment,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import * as XLSX from "xlsx-js-style";
import { BatchManualModal } from "./BatchManualModal";
import { StockManualModal } from "./StockManualModal";
import { getTimestampedFilename } from "../lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface CalculationResult {
  id: string;
  grade: string;
  diameter: number;
  billetDia: number;
  length: number;
  lengthType: "НД" | "МД";
  targetLength: number;
  quantity: number;
  billetLength: number;
  drawLength: number;
  usefulLength: number;
  techEnds: number;
  drawRatio: number;
  wastePercent: number;
  totalWeight: number;
  billetCount: number;
  pcsPerBillet: number;
  client: string;
  nomenclature: string;
  type: string;
  orderNo: string;
  shippingDate: string;
  internalNo: string;
  weightTons: number;
  remainingToProcess: number;
  price: number;
  totalCost: number;
  optimizedBilletLength?: number;
  optimizedKim?: number;
  initialScrapTons?: number;
}

interface AdminPanelProps {
  initialRawPrices: Record<string, { md: string; nd: string }>;
  initialScrap: string;
  initialRemnant: string;
  initialCustomGrades: string[];
  initialDeletedGrades?: string[];
  initialRemnantPricing: Record<string, { round: string; hex: string }>;
  initialEconomyItems?: EconomyItem[];
  onSave: (
    rawPrices: Record<string, { md: string; nd: string }>,
    scrap: string,
    remnant: string,
    customGrades: string[],
    remnantPricing: Record<string, { round: string; hex: string }>,
    economyItems: EconomyItem[],
    deletedGrades?: string[],
  ) => Promise<void>;
  onLogout: () => void;
  isCloudActive: boolean;
  isDarkMode: boolean;
  toggleTheme: () => void;
  initialTab?: "files" | "economy" | "supply";
  isPurchasingMode?: boolean;
}

export function AdminPanel({
  initialRawPrices,
  initialScrap,
  initialRemnant,
  initialCustomGrades,
  initialDeletedGrades,
  initialRemnantPricing,
  initialEconomyItems,
  onSave,
  onLogout,
  isCloudActive,
  isDarkMode,
  toggleTheme,
  initialTab = "economy",
  isPurchasingMode = false,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<
    "files" | "economy" | "supply" | "production" | "logistics" | "help"
  >(initialTab as any);
  const [rawPrices, setRawPrices] =
    useState<Record<string, { md: string; nd: string }>>(initialRawPrices);
  const [scrap, setScrap] = useState(initialScrap);
  const [remnant, setRemnant] = useState(initialRemnant);
  const [customGrades, setCustomGrades] = useState(initialCustomGrades || []);
  const [isBatchManualOpen, setIsBatchManualOpen] = useState(false);
  const [isStockManualOpen, setIsStockManualOpen] = useState(false);
  const [deletedGrades, setDeletedGrades] = useState<string[]>(
    initialDeletedGrades || [],
  );
  const [remnantPricing, setRemnantPricing] = useState<
    Record<string, { round: string; hex: string }>
  >(initialRemnantPricing || {});
  const [economyItems, setEconomyItems] = useState<EconomyItem[]>(() => {
    if (!initialEconomyItems || initialEconomyItems.length === 0)
      return DEFAULT_ECONOMY_ITEMS;
    const initialMap = new Map(
      initialEconomyItems.map((item) => [item.id, item]),
    );
    return DEFAULT_ECONOMY_ITEMS.map(
      (defaultItem) => initialMap.get(defaultItem.id) || defaultItem,
    );
  });

  const [newGrade, setNewGrade] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

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


  const [adminSection, setAdminSection] = useState<
    "direct" | "prices" | "grades"
  >("direct");
  const [supplySection, setSupplySection] = useState<
    | "files"
    | "calc"
    | "stock"
    | "calc-stock"
    | "free-stock"
    | "supply-plans"
    | "calc-supply"
  >("files");
  const [productionSection, setProductionSection] = useState<
    | "files"
    | "calc"
    | "stock"
    | "calc-stock"
    | "free-stock"
    | "supply-plans"
    | "calc-supply"
  >("files");
  const [isCopied, setIsCopied] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Real-time validation for Economy fields
  useEffect(() => {
    const errors: Record<string, string> = {};
    
    // Validate scrap
    const scrapVal = parseFloat(scrap.replace(",", "."));
    if (isNaN(scrapVal) || scrapVal < 0) {
      errors.scrap = "Цена лома должна быть положительным числом";
    }

    // Validate remnant
    const remnantVal = parseFloat(remnant.replace(",", "."));
    if (isNaN(remnantVal) || remnantVal < 0) {
      errors.remnant = "Цена делового отхода должна быть положительным числом";
    }

    // Validate economy items
    economyItems.forEach(item => {
      const val = parseFloat(String(item.norm).replace(",", "."));
      if (isNaN(val) || val < 0) {
        errors[`economy_${item.id}`] = "Значение должно быть положительным числом";
      }
    });

    // Validate raw prices
    Object.entries(rawPrices).forEach(([grade, p]) => {
      const md = parseFloat(p.md.replace(",", "."));
      const nd = parseFloat(p.nd.replace(",", "."));
      if (isNaN(md) || md < 0) errors[`price_${grade}_md`] = "Некорректная цена МД";
      if (isNaN(nd) || nd < 0) errors[`price_${grade}_nd`] = "Некорректная цена НД";
    });

    setValidationErrors(errors);
  }, [scrap, remnant, economyItems, rawPrices]);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [uploadWarnings, setUploadWarnings] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const formatCurrency = (val: number) => {
    return (
      val.toLocaleString("ru-RU", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }) + " ₽"
    );
  };

  const [planFilesProd, setPlanFilesProd] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);
  const [stockFilesProd, setStockFilesProd] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);
  const [supplyPlanFilesProd, setSupplyPlanFilesProd] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);

  const [planFilesSup, setPlanFilesSup] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);
  const [stockFilesSup, setStockFilesSup] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);
  const [supplyPlanFilesSup, setSupplyPlanFilesSup] = useState<
    { id: string; name: string; size: string; date: string; file?: File }[]
  >([]);

  const isProduction = activeTab === "production";
  const planFiles = isProduction ? planFilesProd : planFilesSup;
  const setPlanFiles = isProduction ? setPlanFilesProd : setPlanFilesSup;
  const stockFiles = isProduction ? stockFilesProd : stockFilesSup;
  const setStockFiles = isProduction ? setStockFilesProd : setStockFilesSup;
  const supplyPlanFiles = isProduction
    ? supplyPlanFilesProd
    : supplyPlanFilesSup;
  const setSupplyPlanFiles = isProduction
    ? setSupplyPlanFilesProd
    : setSupplyPlanFilesSup;

  const [processedSupplyPlansProd, setProcessedSupplyPlansProd] = useState<
    any[]
  >(() => {
    try {
      const s = localStorage.getItem("ais_prod_supply_plans");
      return s ? JSON.parse(s) : [];
    } catch (e) {
      localStorage.removeItem("ais_prod_supply_plans");
      return [];
    }
  });
  const [processedSupplyPlansSup, setProcessedSupplyPlansSup] = useState<any[]>(
    () => {
      try {
        const s = localStorage.getItem("ais_sup_supply_plans");
        return s ? JSON.parse(s) : [];
      } catch (e) {
        localStorage.removeItem("ais_sup_supply_plans");
        return [];
      }
    },
  );
  const [isProcessingSupplyPlans, setIsProcessingSupplyPlans] = useState(false);
  const [processedStockProd, setProcessedStockProd] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem("ais_prod_stock");
      return s ? JSON.parse(s) : [];
    } catch (e) {
      localStorage.removeItem("ais_prod_stock");
      return [];
    }
  });
  const [processedStockSup, setProcessedStockSup] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem("ais_sup_stock");
      return s ? JSON.parse(s) : [];
    } catch (e) {
      localStorage.removeItem("ais_sup_stock");
      return [];
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stockFileInputRef = useRef<HTMLInputElement>(null);
  const supplyPlanFileInputRef = useRef<HTMLInputElement>(null);

  // Calculation state
  const [calcLength, setCalcLength] = useState("6");
  const [calcQuantity, setCalcQuantity] = useState("100");
  const [calcWaste, setCalcWaste] = useState("3");
  const [calcKIM, setCalcKIM] = useState("0.92");

  // Supply Calculation Logic & Mock Data Extraction
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState({
    active: false,
    current: 0,
    total: 0,
    message: "",
  });
  const [isProcessingStock, setIsProcessingStock] = useState(false);
  const [calcResultsProd, setCalcResultsProd] = useState<CalculationResult[]>(
    () => {
      try {
        const s = localStorage.getItem("ais_prod_calc_results");
        return s ? JSON.parse(s) : [];
      } catch (e) {
        localStorage.removeItem("ais_prod_calc_results");
        return [];
      }
    },
  );
  const [calcResultsSup, setCalcResultsSup] = useState<CalculationResult[]>(
    () => {
      try {
        const s = localStorage.getItem("ais_sup_calc_results");
        return s ? JSON.parse(s) : [];
      } catch (e) {
        localStorage.removeItem("ais_sup_calc_results");
        return [];
      }
    },
  );

  const calculationResults = isProduction ? calcResultsProd : calcResultsSup;
  const setCalculationResults = isProduction
    ? setCalcResultsProd
    : setCalcResultsSup;
  const processedStock = isProduction ? processedStockProd : processedStockSup;
  const processedSupplyPlans = isProduction
    ? processedSupplyPlansProd
    : processedSupplyPlansSup;

  useEffect(() => {
    localStorage.setItem("ais_prod_calc_results", JSON.stringify(calcResultsProd));
    localStorage.setItem("ais_sup_calc_results", JSON.stringify(calcResultsSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { calculationResults: calcResultsProd });
      saveToCloud("sup_data", { calculationResults: calcResultsSup });
    }
  }, [calcResultsProd, calcResultsSup]);

  useEffect(() => {
    localStorage.setItem("ais_prod_stock", JSON.stringify(processedStockProd));
    localStorage.setItem("ais_sup_stock", JSON.stringify(processedStockSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { processedStock: processedStockProd });
      saveToCloud("sup_data", { processedStock: processedStockSup });
    }
  }, [processedStockProd, processedStockSup]);

  useEffect(() => {
    localStorage.setItem("ais_prod_supply_plans", JSON.stringify(processedSupplyPlansProd));
    localStorage.setItem("ais_sup_supply_plans", JSON.stringify(processedSupplyPlansSup));
    if (!skipCloudSave.current) {
      saveToCloud("prod_data", { processedSupplyPlans: processedSupplyPlansProd });
      saveToCloud("sup_data", { processedSupplyPlans: processedSupplyPlansSup });
    }
  }, [processedSupplyPlansProd, processedSupplyPlansSup]);

  const applyAllOptimizations = () => {
    setCalculationResults((prev) =>
      prev.map((item) => {
        if (
          item.optimizedBilletLength &&
          item.optimizedBilletLength !== item.billetLength &&
          item.optimizedKim &&
          item.optimizedKim > item.remainingToProcess / item.totalWeight + 0.005
        ) {
          const newBilletLength = item.optimizedBilletLength;
          const newDrawLen = newBilletLength * item.drawRatio;
          const newUsefulLen =
            newDrawLen /
            (item.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003);

          let newPcs = 0;
          let newActualUL = 0;
          if (item.lengthType === "НД") {
            for (let i = 1; i <= 20; i++) {
              const optLen = Math.floor(newUsefulLen / i) - 5;
              if (optLen >= 3000 && optLen <= 6000) {
                newPcs = i;
                newActualUL = newPcs * optLen;
                break;
              }
            }
            if (newPcs === 0) newActualUL = newUsefulLen;
          } else {
            newPcs = Math.floor(newUsefulLen / item.length);
            newActualUL = newPcs * item.length;
          }

          const newKim = newDrawLen > 0 ? newActualUL / newDrawLen : 0;
          const newTotalWeight =
            newKim > 0
              ? item.remainingToProcess / newKim
              : item.remainingToProcess;
          const billetArea = (Math.PI * Math.pow(item.billetDia, 2)) / 4;
          const wPerM = billetArea * 0.00000785 * 1000;
          const singleBMass = (newBilletLength / 1000) * wPerM;
          const newBilletCount =
            singleBMass > 0
              ? Math.ceil((newTotalWeight * 1000) / singleBMass)
              : 0;
          const gradePrices = rawPrices[item.grade] || { md: "0", nd: "0" };
          const basePr = parseFloat(gradePrices.nd || "0");
          const newPr = item.lengthType === "МД" ? basePr * 1.06 : basePr;
          const newTotCost = newTotalWeight * newPr;

          return {
            ...item,
            billetLength: newBilletLength,
            drawLength: newDrawLen,
            usefulLength: newUsefulLen,
            actualUsefulLength: newActualUL,
            pcsPerBillet: newPcs,
            kim: newKim,
            totalWeight: newTotalWeight,
            billetCount: newBilletCount,
            totalCost: newTotCost,
          };
        }
        return item;
      }),
    );
  };

  // Grab-to-scroll state for the table
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const summaryContainerRef = useRef<HTMLDivElement>(null);
  const supplyTableRef = useRef<HTMLDivElement>(null);
  const stockTableRef = useRef<HTMLDivElement>(null);
  const freeStockTableRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSummaryDragging, setIsSummaryDragging] = useState(false);
  const [isSupplyDragging, setIsSupplyDragging] = useState(false);
  const [isStockDragging, setIsStockDragging] = useState(false);
  const [isFreeStockDragging, setIsFreeStockDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [summaryStartX, setSummaryStartX] = useState(0);
  const [supplyStartX, setSupplyStartX] = useState(0);
  const [stockStartX, setStockStartX] = useState(0);
  const [freeStockStartX, setFreeStockStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [summaryScrollLeft, setSummaryScrollLeft] = useState(0);
  const [supplyScrollLeft, setSupplyScrollLeft] = useState(0);
  const [stockScrollLeft, setStockScrollLeft] = useState(0);
  const [freeStockScrollLeft, setFreeStockScrollLeft] = useState(0);

  const handleMouseDown = (e: any) => {
    if (!tableContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableContainerRef.current.offsetLeft);
    setScrollLeftState(tableContainerRef.current.scrollLeft);
  };

  const onSummaryMouseDown = (e: any) => {
    if (!summaryContainerRef.current) return;
    setIsSummaryDragging(true);
    setSummaryStartX(e.pageX - summaryContainerRef.current.offsetLeft);
    setSummaryScrollLeft(summaryContainerRef.current.scrollLeft);
  };

  const onSupplyMouseDown = (e: any) => {
    if (!supplyTableRef.current) return;
    setIsSupplyDragging(true);
    setSupplyStartX(e.pageX - supplyTableRef.current.offsetLeft);
    setSupplyScrollLeft(supplyTableRef.current.scrollLeft);
  };

  const onStockMouseDown = (e: any) => {
    if (!stockTableRef.current) return;
    setIsStockDragging(true);
    setStockStartX(e.pageX - stockTableRef.current.offsetLeft);
    setStockScrollLeft(stockTableRef.current.scrollLeft);
  };

  const onFreeStockMouseDown = (e: any) => {
    if (!freeStockTableRef.current) return;
    setIsFreeStockDragging(true);
    setFreeStockStartX(e.pageX - freeStockTableRef.current.offsetLeft);
    setFreeStockScrollLeft(freeStockTableRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
    setIsSummaryDragging(false);
    setIsSupplyDragging(false);
    setIsStockDragging(false);
    setIsFreeStockDragging(false);
  };

  const onSummaryMouseLeaveOrUp = () => {
    setIsSummaryDragging(false);
  };

  const onSupplyMouseLeaveOrUp = () => {
    setIsSupplyDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (isDragging && tableContainerRef.current) {
      e.preventDefault();
      const x = e.pageX - tableContainerRef.current.offsetLeft;
      const walk = (x - startX) * 1.5;
      tableContainerRef.current.scrollLeft = scrollLeftState - walk;
    }
    if (isSummaryDragging && summaryContainerRef.current) {
      e.preventDefault();
      const x = e.pageX - summaryContainerRef.current.offsetLeft;
      const walk = (x - summaryStartX) * 1.5;
      summaryContainerRef.current.scrollLeft = summaryScrollLeft - walk;
    }
    if (isSupplyDragging && supplyTableRef.current) {
      e.preventDefault();
      const x = e.pageX - supplyTableRef.current.offsetLeft;
      const walk = (x - supplyStartX) * 1.5;
      supplyTableRef.current.scrollLeft = supplyScrollLeft - walk;
    }
    if (isStockDragging && stockTableRef.current) {
      e.preventDefault();
      const x = e.pageX - stockTableRef.current.offsetLeft;
      const walk = (x - stockStartX) * 1.5;
      stockTableRef.current.scrollLeft = stockScrollLeft - walk;
    }
    if (isFreeStockDragging && freeStockTableRef.current) {
      e.preventDefault();
      const x = e.pageX - freeStockTableRef.current.offsetLeft;
      const walk = (x - freeStockStartX) * 1.5;
      freeStockTableRef.current.scrollLeft = freeStockScrollLeft - walk;
    }
  };

  // Synchronize prices in calculation results when rawPrices changes
  useEffect(() => {
    const updateFunc = (prev: CalculationResult[]) =>
      prev.map((res) => {
        const gradePrices = rawPrices[res.grade] || { md: "0", nd: "0" };
        const price =
          res.lengthType === "МД"
            ? parseFloat(gradePrices.md || "0")
            : parseFloat(gradePrices.nd || "0");
        const totalCost = res.totalWeight * price;

        return {
          ...res,
          price,
          totalCost,
        };
      });
    setCalcResultsProd(updateFunc);
    setCalcResultsSup(updateFunc);
  }, [rawPrices]);

  const isNDStock = (stock: any) => {
    const sLenStr = String(stock["Длина"] || "").toUpperCase();
    return sLenStr.includes("Н/Д") || sLenStr.includes("НД");
  };

  const getStockBilletLength = (stock: any) => {
    const sLenStr = String(stock["Длина"] || "").toUpperCase();
    let sLen = 6000;
    if (sLenStr.includes("Н/Д") || sLenStr.includes("НД")) sLen = 6000;
    else {
      const m = sLenStr.match(/\d+/);
      if (m) sLen = parseInt(m[0]);
    }
    return sLen;
  };

  const isMD6000Stock = (stock: any) => {
    const sLenStr = String(stock["Длина"] || "").toUpperCase();
    if (isNDStock(stock)) return false;
    return getStockBilletLength(stock) === 6000;
  };

  const isOtherMDStock = (stock: any) => {
    return !isNDStock(stock) && !isMD6000Stock(stock);
  };

  const calculateMetrics = (res: any, bLen: number) => {
    const totalTechCoef =
      res.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003;
    const dLen = bLen * res.drawRatio;
    const uLen = dLen / totalTechCoef;
    let pcs = 0;
    let aUL = 0;
    if (res.lengthType === "НД") {
      for (let i = 1; i <= 20; i++) {
        const optLen = Math.floor(uLen / i) - 5;
        if (optLen >= 3000 && optLen <= 6000) {
          pcs = i;
          aUL = pcs * optLen;
          break;
        }
      }
      if (pcs === 0) aUL = uLen;
    } else {
      pcs = Math.floor(uLen / res.length);
      aUL = pcs * res.length;
    }
    const kim = dLen > 0 ? aUL / dLen : 0;
    const twRate = dLen > 0 ? (dLen - uLen) / dLen : 0;
    const urRate = dLen > 0 ? (uLen - aUL) / dLen : 0;
    return { kim, twRate, urRate };
  };

  const isMatch = (stock: any, res: any) => {
    const stockProfile = stock["Профиль"]?.toLowerCase();
    const reqProfile = res.type?.toLowerCase();

    // Шестигранник делается из круга
    const isValidProfile =
      stockProfile === "круг" || stockProfile === reqProfile;
    if (!isValidProfile) return false;

    if (stock["Марка стали"]?.toLowerCase() !== res.grade?.toLowerCase())
      return false;
    if (parseFloat(String(stock["Размер"]).replace(",", ".")) !== res.billetDia)
      return false;

    const stockLength = String(stock["Длина"] || "").toUpperCase();
    const reqLengthType = String(res.lengthType || "").toUpperCase();

    if (reqLengthType === "НД") {
      if (stockLength.includes("Н/Д") || stockLength.includes("НД"))
        return true;
      if (stockLength.includes("МД")) {
        const numMatch = stockLength.match(/\d+/);
        if (numMatch) {
          return parseInt(numMatch[0]) <= 6000;
        }
        return true;
      }
      return false;
    } else if (reqLengthType.startsWith("МД")) {
      return (
        stockLength.includes("Н/Д") ||
        stockLength.includes("НД") ||
        stockLength.includes("МД")
      );
    }
    return true;
  };

  const sortDemandsForStock = (stock: any, validDemands: any[]) => {
    const bLen = getStockBilletLength(stock);
    const isMD6k = isMD6000Stock(stock);
    const isND = isNDStock(stock);
    const isOtherMD = isOtherMDStock(stock);

    return [...validDemands].sort((d1, d2) => {
      const reqLenType1 = String(d1.lengthType || "").toUpperCase();
      const reqLenType2 = String(d2.lengthType || "").toUpperCase();
      const isNDDemand1 = reqLenType1 === "НД";
      const isNDDemand2 = reqLenType2 === "НД";
      const isMDDemand1 = reqLenType1.startsWith("МД");
      const isMDDemand2 = reqLenType2.startsWith("МД");

      if (isMD6k || isND) {
        if (isNDDemand1 && !isNDDemand2) return -1;
        if (!isNDDemand1 && isNDDemand2) return 1;
      }

      if (isOtherMD) {
        if (isMDDemand1 && !isMDDemand2) return -1;
        if (!isMDDemand1 && isMDDemand2) return 1;
      }

      const kim1 = calculateMetrics(d1, bLen).kim;
      const kim2 = calculateMetrics(d2, bLen).kim;
      if (kim1 !== kim2) return kim2 - kim1;

      return 0;
    });
  };

  const stockCalculationData = useMemo(() => {
    if (calculationResults.length === 0)
      return {
        matchedDemand: [],
        freeStock: [],
        totals: {
          allocated: 0,
          deficit: 0,
          remaining: 0,
          averageKim: 0,
          techWaste2: 0,
          usefulRem2: 0,
        },
      };

    let availableStock = [...processedStock].map((item, idx) => ({
      ...item,
      _id: idx,
      remainingStock:
        typeof item["Конечный остаток тн."] === "number"
          ? item["Конечный остаток тн."]
          : parseFloat(item["Конечный остаток тн."]) || 0,
    }));

    let demands = calculationResults.map((item, idx) => {
      let res = { ...item };

      if (
        res.optimizedBilletLength &&
        res.optimizedBilletLength !== res.billetLength &&
        res.optimizedKim &&
        res.optimizedKim > res.remainingToProcess / res.totalWeight + 0.005
      ) {
        const newBilletLength = res.optimizedBilletLength;
        const newDrawLen = newBilletLength * res.drawRatio;
        const newUsefulLen =
          newDrawLen /
          (res.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003);

        let newPcs = 0;
        let newActualUL = 0;
        if (res.lengthType === "НД") {
          for (let i = 1; i <= 20; i++) {
            const optLen = Math.floor(newUsefulLen / i) - 5;
            if (optLen >= 3000 && optLen <= 6000) {
              newPcs = i;
              newActualUL = newPcs * optLen;
              break;
            }
          }
          if (newPcs === 0) newActualUL = newUsefulLen;
        } else {
          newPcs = Math.floor(newUsefulLen / res.length);
          newActualUL = newPcs * res.length;
        }

        const newKim = newDrawLen > 0 ? newActualUL / newDrawLen : 0;
        const newTotalWeight =
          newKim > 0 ? res.remainingToProcess / newKim : res.remainingToProcess;

        res.billetLength = newBilletLength;
        res.totalWeight = newTotalWeight;
      }

      return {
        ...res,
        _dId: idx,
        allocatedItems: [],
        allocatedWeight: 0,
      };
    });

    availableStock.forEach((stock) => {
      if (stock.remainingStock <= 0) return;

      while (stock.remainingStock > 0.0005) {
        const validDemands = demands.filter(
          (d) => d.allocatedWeight < d.totalWeight && isMatch(stock, d),
        );

        if (validDemands.length === 0) break;

        const sortedDemands = sortDemandsForStock(stock, validDemands);
        const targetDemand = sortedDemands[0];

        const needed = targetDemand.totalWeight - targetDemand.allocatedWeight;
        const take = Math.min(needed, stock.remainingStock);
        const stockBeforeTaking = stock.remainingStock;

        stock.remainingStock -= take;
        targetDemand.allocatedWeight += take;

        targetDemand.allocatedItems.push({
          ...stock,
          allocatedAmount: take,
          stockBeforeTaking,
          stockAfterTaking: stock.remainingStock,
        });
      }
    });

    let totalAllocated = 0;
    let totalDeficit = 0;

    const matchedDemand = demands.map((d) => {
      const allocatedStock = d.allocatedWeight;
      const matchedStockItems = d.allocatedItems;
      const shortageStock = Math.max(0, d.totalWeight - allocatedStock);

      totalAllocated += allocatedStock;
      totalDeficit += shortageStock;

      let combinedTechWaste = 0;
      let combinedUsefulRem = 0;
      let combinedFinishedWeight = 0;
      let baseTotalWeight = 0;

      matchedStockItems.forEach((stock: any) => {
        const sLen = getStockBilletLength(stock);
        const m = calculateMetrics(d, sLen);
        combinedTechWaste += m.twRate * stock.allocatedAmount;
        combinedUsefulRem += m.urRate * stock.allocatedAmount;
        combinedFinishedWeight += m.kim * stock.allocatedAmount;
        baseTotalWeight += stock.allocatedAmount;
      });

      const combinedKim =
        baseTotalWeight > 0 ? combinedFinishedWeight / baseTotalWeight : 0;

      return {
        ...d,
        allocatedStock,
        shortageStock,
        matchedStockItems,
        combinedTechWaste,
        combinedUsefulRem,
        combinedKim,
      };
    });

    const totalRemaining = availableStock.reduce(
      (sum, item) => sum + item.remainingStock,
      0,
    );
    const sumTarget = matchedDemand.reduce(
      (sum, res) => sum + (res.remainingToProcess || 0),
      0,
    );
    const sumTotalWeight = matchedDemand.reduce(
      (sum, res) => sum + (res.totalWeight || 0),
      0,
    );
    const validDemandsForKim = matchedDemand.filter(
      (res) => res.allocatedStock > 0,
    );
    const averageKim =
      validDemandsForKim.length > 0
        ? validDemandsForKim.reduce((sum, res) => sum + res.combinedKim, 0) /
          validDemandsForKim.length
        : 0;
    const totalTechWaste2 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedTechWaste,
      0,
    );
    const totalUsefulRem2 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedUsefulRem,
      0,
    );

    return {
      matchedDemand,
      freeStock: availableStock.filter((item) => item.remainingStock > 0.0005),
      totals: {
        allocated: totalAllocated,
        deficit: totalDeficit,
        remaining: totalRemaining,
        averageKim,
        techWaste2: totalTechWaste2,
        usefulRem2: totalUsefulRem2,
      },
    };
  }, [calculationResults, processedStock]);

  const supplyCalculationData = useMemo(() => {
    if (calculationResults.length === 0)
      return {
        matchedDemand: [],
        freeStock: [],
        totals: {
          allocated: 0,
          deficit: 0,
          remaining: 0,
          averageKim: 0,
          techWaste2: 0,
          usefulRem2: 0,
        },
      };

    let availableStock = [...processedStock].map((item, idx) => ({
      ...item,
      _id: idx,
      remainingStock:
        typeof item["Конечный остаток тн."] === "number"
          ? item["Конечный остаток тн."]
          : parseFloat(item["Конечный остаток тн."]) || 0,
    }));

    let availableSupply = [...processedSupplyPlans].map((item, idx) => ({
      ...item,
      _sId: idx,
      isSupply: true,
      remainingStock: Number(item["Кол-во"]) || 0,
      Профиль: item["ПРОФИЛЬ"] || item["Профиль"],
      "Марка стали": item["МАРКА"] || item["Марка"],
      Размер: item["РАЗМЕР"] || item["Размер"],
      Длина: item["ДЛИНА"] || item["Длина"] || "МД6000",
    }));

    let demands = calculationResults.map((item, idx) => {
      let res = { ...item };

      if (
        res.optimizedBilletLength &&
        res.optimizedBilletLength !== res.billetLength &&
        res.optimizedKim &&
        res.optimizedKim > res.remainingToProcess / res.totalWeight + 0.005
      ) {
        const newBilletLength = res.optimizedBilletLength;
        const newDrawLen = newBilletLength * res.drawRatio;
        const newUsefulLen =
          newDrawLen /
          (res.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003);

        let newPcs = 0;
        let newActualUL = 0;
        if (res.lengthType === "НД") {
          for (let i = 1; i <= 20; i++) {
            const optLen = Math.floor(newUsefulLen / i) - 5;
            if (optLen >= 3000 && optLen <= 6000) {
              newPcs = i;
              newActualUL = newPcs * optLen;
              break;
            }
          }
          if (newPcs === 0) newActualUL = newUsefulLen;
        } else {
          newPcs = Math.floor(newUsefulLen / res.length);
          newActualUL = newPcs * res.length;
        }

        const newKim = newDrawLen > 0 ? newActualUL / newDrawLen : 0;
        const newTotalWeight =
          newKim > 0 ? res.remainingToProcess / newKim : res.remainingToProcess;

        res.billetLength = newBilletLength;
        res.totalWeight = newTotalWeight;
      }

      return {
        ...res,
        _dId: idx,
        allocatedItems: [],
        allocatedWeight: 0,
      };
    });

    // Strategy: First stock, then supply plans
    [availableStock, availableSupply].forEach((sourceList) => {
      sourceList.forEach((item) => {
        if (item.remainingStock <= 0) return;

        while (item.remainingStock > 0.0005) {
          const validDemands = demands.filter(
            (d) => d.allocatedWeight < d.totalWeight && isMatch(item, d),
          );

          if (validDemands.length === 0) break;

          const sortedDemands = sortDemandsForStock(item, validDemands);
          const targetDemand = sortedDemands[0];

          const needed =
            targetDemand.totalWeight - targetDemand.allocatedWeight;
          const take = Math.min(needed, item.remainingStock);
          const stockBeforeTaking = item.remainingStock;

          item.remainingStock -= take;
          targetDemand.allocatedWeight += take;

          targetDemand.allocatedItems.push({
            ...item,
            allocatedAmount: take,
            stockBeforeTaking,
            stockAfterTaking: item.remainingStock,
          });
        }
      });
    });

    let totalAllocated = 0;
    let totalDeficit = 0;

    const matchedDemand = demands.map((d) => {
      const allAllocated = d.allocatedItems || [];
      const stockItems = allAllocated.filter((i: any) => !i.isSupply);
      const supplyItems = allAllocated.filter((i: any) => i.isSupply);

      const allocatedFromStock = stockItems.reduce(
        (sum: number, item: any) => sum + item.allocatedAmount,
        0,
      );
      const shortageAfterStock = Math.max(
        0,
        d.totalWeight - allocatedFromStock,
      );

      const allocatedFromSupply = supplyItems.reduce(
        (sum: number, item: any) => sum + item.allocatedAmount,
        0,
      );
      const finalShortage = Math.max(
        0,
        shortageAfterStock - allocatedFromSupply,
      );

      let combinedTechWaste2 = 0;
      let combinedUsefulRem2 = 0;
      let combinedFinishedWeight2 = 0;
      let stockBaseTotalWeight = 0;

      stockItems.forEach((stock: any) => {
        const sLen = getStockBilletLength(stock);
        const m = calculateMetrics(d, sLen);
        combinedTechWaste2 += m.twRate * stock.allocatedAmount;
        combinedUsefulRem2 += m.urRate * stock.allocatedAmount;
        combinedFinishedWeight2 += m.kim * stock.allocatedAmount;
        stockBaseTotalWeight += stock.allocatedAmount;
      });

      const deficitMetrics = calculateMetrics(d, d.billetLength);
      const combinedKim2 =
        stockBaseTotalWeight > 0
          ? combinedFinishedWeight2 / stockBaseTotalWeight
          : 0;

      let combinedTechWaste3 = 0;
      let combinedUsefulRem3 = 0;
      let combinedFinishedWeight3 = 0;
      let supplyTotalBase = 0;

      supplyItems.forEach((supply: any) => {
        const sLen = getStockBilletLength(supply);
        const m = calculateMetrics(d, sLen);
        combinedTechWaste3 += m.twRate * supply.allocatedAmount;
        combinedUsefulRem3 += m.urRate * supply.allocatedAmount;
        combinedFinishedWeight3 += m.kim * supply.allocatedAmount;
        supplyTotalBase += supply.allocatedAmount;
      });

      const combinedKim3 =
        supplyTotalBase > 0 ? combinedFinishedWeight3 / supplyTotalBase : 0;

      totalAllocated += allocatedFromSupply;
      totalDeficit += finalShortage;

      return {
        ...d,
        allocatedFromStock,
        shortageAfterStock,
        allocatedFromSupply,
        finalShortage,
        stockItems,
        supplyItems,
        combinedTechWaste2,
        combinedUsefulRem2,
        combinedKim2,
        combinedTechWaste3,
        combinedUsefulRem3,
        combinedKim3,
      };
    });

    const totalRemaining = availableSupply.reduce(
      (sum, item) => sum + item.remainingStock,
      0,
    );
    const validDemandsForKim3 = matchedDemand.filter(
      (res) => res.allocatedFromSupply > 0,
    );
    const averageKim3 =
      validDemandsForKim3.length > 0
        ? validDemandsForKim3.reduce((sum, res) => sum + res.combinedKim3, 0) /
          validDemandsForKim3.length
        : 0;
    const totalTechWaste3 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedTechWaste3,
      0,
    );
    const totalUsefulRem3 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedUsefulRem3,
      0,
    );

    return {
      matchedDemand,
      freeSupply: availableSupply.filter(
        (item) => item.remainingStock > 0.0005,
      ),
      totals: {
        allocated: totalAllocated,
        deficit: totalDeficit,
        remaining: totalRemaining,
        averageKim: averageKim3,
        techWaste2: totalTechWaste3,
        usefulRem2: totalUsefulRem3,
      },
    };
  }, [calculationResults, processedStock, processedSupplyPlans]);

  const {
    matchedDemand,
    freeStock,
    totals: stockTotals,
  } = stockCalculationData;

  const filteredMatchedDemand = useMemo(() => {
    return matchedDemand.filter((item) => {
      // Free text search
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        (item.orderNo && String(item.orderNo).toLowerCase().includes(query)) ||
        (item.client && String(item.client).toLowerCase().includes(query)) ||
        (item.nomenclature &&
          String(item.nomenclature).toLowerCase().includes(query)) ||
        (item.internalNo &&
          String(item.internalNo).toLowerCase().includes(query));

      // Status filter
      let matchesStatus = true;
      if (statusFilter === "OK") {
        matchesStatus = item.remainingToProcess <= item.allocatedStock;
      } else if (statusFilter === "DEFICIT") {
        matchesStatus = item.remainingToProcess > item.allocatedStock;
      }

      return matchesSearch && matchesStatus;
    });
  }, [matchedDemand, searchQuery, statusFilter]);

  const groupedByOrderDemand = useMemo(() => {
    const groups: Record<string, any> = {};
    filteredMatchedDemand.forEach((item) => {
      const key = item.orderNo || "Без заказа";
      if (!groups[key]) {
        groups[key] = {
          orderNo: key,
          client: item.client || "—",
          allocatedStock: 0,
          shortageStock: 0,
          totalWeight: 0,
          weightTons: 0,
          nomenclature: key, // Using orderNo as label for Top-5 chart
        };
      }
      groups[key].allocatedStock += item.allocatedStock || 0;
      groups[key].shortageStock += item.shortageStock || 0;
      groups[key].totalWeight += item.totalWeight || 0;
      groups[key].weightTons += item.weightTons || 0;
    });
    return Object.values(groups).sort(
      (a, b) => b.shortageStock - a.shortageStock,
    );
  }, [filteredMatchedDemand]);

  const filteredTotals = useMemo(() => {
    return filteredMatchedDemand.reduce(
      (acc, row) => {
        acc.allocated += row.allocatedStock || 0;
        acc.deficit += row.shortageStock || 0;
        acc.techWaste2 +=
          row.allocatedStock > 0 && row.combinedTechWaste > 0
            ? row.combinedTechWaste
            : 0;
        acc.usefulRem2 +=
          row.allocatedStock > 0 && row.combinedUsefulRem > 0
            ? row.combinedUsefulRem
            : 0;
        return acc;
      },
      { allocated: 0, deficit: 0, techWaste2: 0, usefulRem2: 0 },
    );
  }, [filteredMatchedDemand]);

  // Format supply nomenclature based on profile and marka
  const getSupplyNomenclature = (sp: any) => {
    if (!sp) return "";
    const marka = sp["Марка стали"];
    const profile = sp["Профиль"];
    if (marka) {
      if (profile) {
        let gost = String(profile);
        const p = gost.toLowerCase();
        if (p.includes("круг")) gost = "Гост 2590-2006";
        else if (p.includes("шестигранник")) gost = "Гост 2879-2006";
        else if (p.includes("квадрат")) gost = "Гост 2591-2006";
        else if (p.includes("полоса")) gost = "Гост 103-2006";
        return `ГОСТ= ${marka} / ${gost}`;
      }
      return `ГОСТ= ${marka}`;
    }
    return sp["Номенклатура"] || sp["NOMENCLATURE"] || "";
  };

  // Helper for date formatting
  const formatDate = (input: any): string => {
    if (!input) return "";
    let dateObj: Date | null = null;

    if (typeof input === "number") {
      // Excel date serial conversion
      dateObj = new Date(Math.round((input - 25569) * 86400 * 1000));
    } else if (typeof input === "string" && input.trim()) {
      const parsed = new Date(input);
      if (!isNaN(parsed.getTime())) {
        dateObj = parsed;
      } else {
        // Handle DD.MM.YYYY strings manually if browser can't parse them
        const parts = input.trim().split(/[.-/]/);
        if (parts.length === 3) {
          const d = parseInt(parts[0]);
          const m = parseInt(parts[1]) - 1;
          const y = parseInt(parts[2]);
          if (y > 1000 && m < 12 && d < 32) {
            dateObj = new Date(y, m, d);
          }
        }
      }
    }

    if (dateObj && !isNaN(dateObj.getTime())) {
      const dd = String(dateObj.getDate()).padStart(2, "0");
      const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
      const yyyy = dateObj.getFullYear();
      return `${dd}.${mm}.${yyyy}`;
    }
    return String(input).trim();
  };

  const handleProcessPlans = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;

    setIsProcessing(true);
    setUploadWarnings([]);

    // Give browser time to render loading state
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const allExtractedData: Omit<
        CalculationResult,
        | "billetDia"
        | "billetLength"
        | "drawRatio"
        | "drawLength"
        | "usefulLength"
        | "techEnds"
        | "wastePercent"
        | "totalWeight"
        | "billetCount"
        | "pcsPerBillet"
        | "targetLength"
        | "quantity"
        | "price"
        | "totalCost"
      >[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let colMap = {
            client: 1, // B
            nomenclature: 2, // C
            orderNo: 3, // D
            type: 5, // F
            grade: 6, // G
            size: 7, // H
            weight: 8, // I
            remaining: -1,
            shippingDate: -1,
            internalNo: -1,
            lengthIdx: -1,
          };

          // Dynamically find header row and map columns
          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const row = jsonData[i] || [];
            const rowStr = row.join(" ").toLowerCase();

            if (
              rowStr.includes("заказ") ||
              rowStr.includes("клиент") ||
              rowStr.includes("профиль") ||
              rowStr.includes("марка") ||
              rowStr.includes("размер") ||
              rowStr.includes("кол-во") ||
              rowStr.includes("вес") ||
              rowStr.includes("номенклатура")
            ) {
              startRow = i + 1;

              row.forEach((cell: any, colIdx: number) => {
                const cellStr = String(cell).toLowerCase().trim();

                // Specific mappings requested by user
                if (
                  cellStr === "внутренний номер" ||
                  cellStr === "внутренняя нумерация" ||
                  cellStr === "внутренний №" ||
                  cellStr.includes("внутр. №")
                )
                  colMap.internalNo = colIdx;
                if (
                  cellStr === "дата отгрузки" ||
                  cellStr === "дата заказа" ||
                  cellStr === "дата"
                ) colMap.shippingDate = colIdx;
                if (cellStr === "клиент") colMap.client = colIdx;
                if (cellStr === "номенклатура") colMap.nomenclature = colIdx;
                if (cellStr === "№ заказа") colMap.orderNo = colIdx;
                if (
                  cellStr === "кол-во" || 
                  cellStr === "кол-во тн" ||
                  cellStr === "кол-во тн в заказе" ||
                  cellStr === "кол-во ="
                )
                  colMap.weight = colIdx;
                if (
                  cellStr === "итого остаток к выполнению" ||
                  cellStr === "итого остаток выполнения заказа после расчета / плановое поступление" ||
                  cellStr.includes("итого остаток к выполнению") ||
                  cellStr.includes("итого остаток выполнению") ||
                  cellStr.includes("итог остаток к выполнению") ||
                  cellStr.includes("итого ост. к выполнению") ||
                  cellStr.includes("остаток к выполнению") ||
                  cellStr.includes("остаток") ||
                  cellStr.includes("после расчета / плановое поступление")
                )
                  colMap.remaining = colIdx;

                // Fallbacks and other fields
                if (
                  colMap.internalNo === -1 &&
                  cellStr.includes("внутр") &&
                  (cellStr.includes("номер") || cellStr.includes("№"))
                )
                  colMap.internalNo = colIdx;
                if (
                  colMap.client === -1 &&
                  (cellStr.includes("клиент") ||
                    cellStr.includes("покупатель") ||
                    cellStr.includes("партнер"))
                )
                  colMap.client = colIdx;
                if (
                  colMap.nomenclature === -1 &&
                  (cellStr.includes("номенклатура") ||
                    cellStr.includes("наименование") ||
                    cellStr.includes("товар"))
                )
                  colMap.nomenclature = colIdx;
                if (colMap.orderNo === -1 && cellStr.includes("заказ"))
                  colMap.orderNo = colIdx;
                if (cellStr.includes("профиль") || cellStr.includes("тип"))
                  colMap.type = colIdx;
                if (
                  cellStr.includes("марка") ||
                  cellStr.includes("сталь") ||
                  cellStr.includes("материал")
                )
                  colMap.grade = colIdx;
                if (cellStr.includes("размер") || cellStr.includes("диаметр"))
                  colMap.size = colIdx;
                if (
                  colMap.weight === -1 &&
                  (cellStr.includes("кол-во") ||
                    cellStr.includes("количество") ||
                    cellStr.includes("вес") ||
                    cellStr.includes("масса") ||
                    cellStr.includes("кг") ||
                    cellStr.includes("тн"))
                )
                  colMap.weight = colIdx;
                if (
                  colMap.shippingDate === -1 &&
                  (cellStr.includes("отгруз") || cellStr.includes("дата"))
                )
                  colMap.shippingDate = colIdx;
                if (cellStr.includes("длина")) colMap.lengthIdx = colIdx;
              });
              break;
            }
          }

          // Smart Mapping Validation
          const missingColumns = [];
          if (colMap.client === -1) missingColumns.push("Клиент");
          if (colMap.nomenclature === -1) missingColumns.push("Номенклатура");
          if (colMap.orderNo === -1) missingColumns.push("№ Заказа");
          if (colMap.weight === -1) missingColumns.push("Кол-во (вес)");
          if (colMap.remaining === -1)
            missingColumns.push("Остаток к выполнению");

          if (missingColumns.length > 0) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}": не найдены колонки: ${missingColumns.join(", ")}`,
            ]);
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл планов: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];

            if (
              row.length === 0 ||
              row.every((c: any) => !c || String(c).trim() === "")
            )
              continue;

            const orderNo = String(row[colMap.orderNo] || "").trim();
            const internalNo =
              colMap.internalNo !== -1
                ? String(row[colMap.internalNo] || "").trim()
                : "";
            const shippingDate = formatDate(
              colMap.shippingDate !== -1 ? row[colMap.shippingDate] : "",
            );

            const client = String(row[colMap.client] || "").trim();
            let nomenclature = String(row[colMap.nomenclature] || "");
            nomenclature = nomenclature
              .replace(/Прокат калиброванный/i, "")
              .trim();

            const rawWeight = row[colMap.weight];
            let weightTons =
              typeof rawWeight === "number"
                ? rawWeight
                : parseFloat(
                    String(rawWeight || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(weightTons) || weightTons < 0) {
              weightTons = 0;
              setUploadWarnings(prev => [...prev, `Строка ${i}: Некорректный вес (${rawWeight})`]);
            }

            const rawRemaining =
              colMap.remaining !== -1 ? row[colMap.remaining] : null;
            let remainingToProcess =
              rawRemaining !== null
                ? typeof rawRemaining === "number"
                  ? rawRemaining
                  : parseFloat(
                      String(rawRemaining || "0")
                        .replace(/\s/g, "")
                        .replace(",", "."),
                    )
                : weightTons;
            if (isNaN(remainingToProcess) || remainingToProcess < 0) {
              remainingToProcess = weightTons;
              if (rawRemaining !== null) {
                setUploadWarnings(prev => [...prev, `Строка ${i}: Некорректный остаток к выполнению (${rawRemaining})`]);
              }
            }

            let typeStr = String(
              row[colMap.type] || nomenclature,
            ).toLowerCase();
            let type =
              typeStr.includes("шестигранник") || typeStr.includes("шестиг")
                ? "Шестигранник"
                : "Круг";
            let gradeStr = String(row[colMap.grade] || "").trim();
            let grade = gradeStr || "ст.35";

            // Fix for incorrect grade extraction
            if (
              grade.toUpperCase().includes("1050") ||
              grade.toUpperCase().includes("1414") ||
              grade.toUpperCase().includes("4543") ||
              grade.toUpperCase().includes("ГОСТ") ||
              gradeStr === ""
            ) {
              const gMatch = nomenclature.match(
                /(?:^|[^а-яА-ЯёЁa-zA-Z])(?:ст\.?|сталь)\s*([0-9a-zA-Zа-яА-Я-]+)/i,
              );
              if (gMatch) {
                grade = "ст." + gMatch[1].toUpperCase();
              } else {
                const alloyMatch = nomenclature.match(
                  /\b(\d{2}[ХхНнМмТтВвГгДд]+[0-9a-zA-Zа-яА-Я-]*)\b/,
                );
                if (alloyMatch) {
                  grade = "ст." + alloyMatch[1].toUpperCase();
                } else {
                  if (grade.includes("1050")) grade = "ст.35";
                  else if (grade.includes("1414")) grade = "ст.А12";
                  else if (grade.includes("4543")) grade = "ст.40Х";
                  else grade = "ст.35";
                }
              }
            } else if (grade.toUpperCase().startsWith("СТ.")) {
              grade = "ст." + grade.substring(3).toUpperCase();
            } else if (grade.toUpperCase().startsWith("СТ")) {
              grade = "ст." + grade.substring(2).toUpperCase();
            } else if (
              grade.toUpperCase() !== "А12" &&
              !grade.toLowerCase().startsWith("ст")
            ) {
              grade = "ст." + grade.toUpperCase();
            } else if (grade.toUpperCase() === "А12") {
              grade = "ст.А12";
            }

            grade = grade.replace(/[хХxX]\s*\d{3,}$/i, "");

            const rawSize = row[colMap.size];
            let diameter =
              typeof rawSize === "number"
                ? rawSize
                : parseFloat(
                    String(rawSize || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(diameter) || diameter <= 0) {
              const sizeMatch = nomenclature.match(
                /(?:круг|шестигранник)\s*(?:калибровоченный|калибровочный|калиброванный|калибр\.?)?\s*(\d+(?:[.,]\d+)?)/i,
              );
              if (sizeMatch) {
                diameter = parseFloat(sizeMatch[1].replace(",", "."));
              } else {
                setUploadWarnings(prev => [...prev, `Строка ${i}: Не удалось определить диаметр (${rawSize})`]);
              }
            }
            if (isNaN(diameter) || diameter < 0) diameter = 0;

            const nomCleanForLen = nomenclature
              .toUpperCase()
              .replace(/\s/g, "");
            const isNomND =
              nomCleanForLen.includes("НД") ||
              nomCleanForLen.includes("Н.Д.") ||
              nomCleanForLen.includes("Н/Д");

            let length = 6000;
            let lengthType: "НД" | "МД" = "МД";

            if (isNomND) {
              lengthType = "НД";
              length = 6000;
            } else if (colMap.lengthIdx !== -1 && row[colMap.lengthIdx]) {
              const rawLength = String(row[colMap.lengthIdx])
                .trim()
                .toUpperCase();
              if (
                rawLength.includes("НД") ||
                rawLength.includes("Н/Д") ||
                rawLength.includes("Н.Д.")
              ) {
                lengthType = "НД";
              } else {
                const lengthMatch = rawLength.match(/\d+/);
                if (lengthMatch) {
                  const parsedLen = parseInt(lengthMatch[0], 10);
                  if (!isNaN(parsedLen) && parsedLen > 0) {
                    length = parsedLen;
                    lengthType = "МД";
                  }
                }
              }
            } else {
              const lengthMatch = nomenclature.match(/х\s*(\d+)/i);
              if (lengthMatch) {
                length = parseInt(lengthMatch[1]);
                if (isNaN(length) || length <= 0) length = 6000;
              }
            }

            allExtractedData.push({
              id: Math.random().toString(36).substring(7),
              client,
              nomenclature,
              type,
              grade,
              diameter,
              length,
              lengthType,
              weightTons,
              orderNo,
              shippingDate,
              internalNo,
              remainingToProcess,
            });
          }
        }
      }

      if (allExtractedData.length === 0) {
        alert("Не удалось распознать данные.");
        setIsProcessing(false);
        return;
      }

      const processed: CalculationResult[] = allExtractedData.map((item) => {
        const dataTable = item.type === "Шестигранник" ? HEX_DATA : ROUND_DATA;
        const match = dataTable.find(
          (d) => Math.abs(d.target - item.diameter) < 0.001,
        );

        let billetDia = item.diameter ? item.diameter + 2 : 0;
        let drawRatio = match
          ? match.coef
          : item.diameter > 0
            ? Math.pow(billetDia, 2) / Math.pow(item.diameter, 2)
            : 1;

        if (match) {
          billetDia = match.raw;
        } else if (item.diameter > 0) {
          billetDia = item.diameter + 2;
          drawRatio = Math.pow(billetDia, 2) / Math.pow(item.diameter, 2);
        } else {
          billetDia = 0;
          drawRatio = 1;
        }

        let billetLength = 0;
        const totalTechCoef =
          item.type === "Шестигранник" ? 1.03 * 1.003 : 1.027 * 1.003;

        if (item.lengthType === "НД") {
          billetLength = 6000;
        } else {
          billetLength = 6000;
        }

        const drawLength = billetLength * drawRatio;
        const usefulLength = drawLength / totalTechCoef;
        const techEnds = drawLength - usefulLength;

        let piecesCount = 0;
        let actualUsefulLength = 0;

        if (item.lengthType === "НД") {
          for (let i = 1; i <= 20; i++) {
            const optLen = Math.floor(usefulLength / i) - 5;
            if (optLen >= 3000 && optLen <= 6000) {
              piecesCount = i;
              actualUsefulLength = piecesCount * optLen;
              break;
            }
          }
          if (piecesCount === 0) actualUsefulLength = usefulLength;
        } else {
          piecesCount = Math.floor(usefulLength / item.length);
          actualUsefulLength = piecesCount * item.length;
        }

        // --- Optimization Step for KIM improvement ---
        let optimizedBilletLength = billetLength;
        let optimizedKim = drawLength > 0 ? actualUsefulLength / drawLength : 0;

        if (item.lengthType === "МД" && item.length > 0) {
          const MIN_B = 4000;
          const MAX_B = Math.floor(8400 / drawRatio);
          const STEP = 100;

          for (let l = MIN_B; l <= MAX_B; l += STEP) {
            const dL = l * drawRatio;
            const uL = dL / totalTechCoef;
            const pCount = Math.floor(uL / item.length);
            if (pCount <= 0) continue;
            const aUL = pCount * item.length;
            const k = dL > 0 ? aUL / dL : 0;

            if (k > optimizedKim + 0.005) {
              // Suggest only if improvement > 0.5%
              optimizedKim = k;
              optimizedBilletLength = l;
            }
          }
        } else if (item.lengthType === "НД") {
          const MIN_B = 4000;
          const MAX_B = 6000;
          const STEP = 100;

          for (let l = MIN_B; l <= MAX_B; l += STEP) {
            const dL = l * drawRatio;
            const uL = dL / totalTechCoef;
            let pCount = 0;
            let aUL = 0;
            for (let i = 1; i <= 20; i++) {
              const optLen = Math.floor(uL / i) - 5;
              if (optLen >= 3000 && optLen <= 6000) {
                pCount = i;
                aUL = pCount * optLen;
                break;
              }
            }
            if (pCount === 0) continue;
            const k = dL > 0 ? aUL / dL : 0;

            if (k > optimizedKim + 0.005) {
              // Suggest only if improvement > 0.5%
              optimizedKim = k;
              optimizedBilletLength = l;
            }
          }
        }
        // ----------------------------------------------

        const billetArea = (Math.PI * Math.pow(billetDia, 2)) / 4;
        const weightPerMBillet = billetArea * 0.00000785 * 1000;

        const kim = drawLength > 0 ? actualUsefulLength / drawLength : 0;
        const totalWeight =
          kim > 0 ? item.remainingToProcess / kim : item.remainingToProcess;

        const singleBilletMass = (billetLength / 1000) * weightPerMBillet;
        const billetCount =
          singleBilletMass > 0
            ? Math.ceil((totalWeight * 1000) / singleBilletMass)
            : 0;

        const gradePrices = rawPrices[item.grade] || { md: "0", nd: "0" };
        const basePrice = parseFloat(gradePrices.nd || "0");
        const price = item.lengthType === "МД" ? basePrice * 1.06 : basePrice;
        const totalCost = totalWeight * price;
        const initialLeftovers =
          item.lengthType === "НД"
            ? 0
            : usefulLength - (piecesCount || 0) * item.length;
        const initialScrapTons =
          drawLength > 0 ? (initialLeftovers / drawLength) * totalWeight : 0;

        return {
          ...item,
          billetDia,
          billetLength,
          drawRatio,
          drawLength,
          usefulLength,
          techEnds,
          wastePercent: (1 - kim) * 100,
          totalWeight,
          billetCount,
          pcsPerBillet: piecesCount || 0,
          targetLength: item.length,
          quantity: billetCount,
          price,
          totalCost,
          optimizedBilletLength,
          optimizedKim,
          initialScrapTons,
        } as CalculationResult;
      });

      setCalculationResults(processed);
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      setIsProcessing(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  const handleProcessSupplyPlans = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;
    setIsProcessingSupplyPlans(true);

    // Give browser time to render loading state
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const extractedPlans: any[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let cols: Record<string, number> = {};

          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const rowStr = jsonData[i].join(" ").toLowerCase();
            if (
              rowStr.includes("профиль") ||
              rowStr.includes("марка") ||
              rowStr.includes("размер") ||
              rowStr.includes("поставщик")
            ) {
              startRow = i + 1;
              jsonData[i].forEach((cell: any, idx: number) => {
                const c = String(cell).toLowerCase().trim();
                if (c.includes("профиль")) cols.profile = idx;
                if (c.includes("марка")) cols.grade = idx;
                if (c.includes("размер")) cols.size = idx;
                if (
                  c.includes("кол-во") ||
                  c.includes("количество") ||
                  c.includes("колличество") ||
                  c.includes("вес")
                )
                  cols.qty = idx;
                if (c.includes("длина")) cols.length = idx;
                if (c.includes("дата разм")) cols.datePlaced = idx;
                if (c.includes("ожид") && c.includes("дата"))
                  cols.dateExpected = idx;
                if (c.includes("поставщик")) cols.supplier = idx;
              });
              break;
            }
          }

          if (
            cols.profile === undefined ||
            cols.grade === undefined ||
            cols.size === undefined ||
            cols.qty === undefined ||
            cols.length === undefined ||
            cols.datePlaced === undefined ||
            cols.dateExpected === undefined ||
            cols.supplier === undefined
          ) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}" (Поставки): не найдены или не распознаны все обязательные колонки (Профиль, Марка, Размер, Кол-во, Длина, Дата размещения, Ожидаемая дата поставки, Поставщик)!`,
            ]);
            continue;
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл поставок: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];
            if (!row[cols.profile] && !row[cols.grade]) continue;

            const rawQty = row[cols.qty];
            let qty =
              typeof rawQty === "number"
                ? rawQty
                : parseFloat(
                    String(rawQty || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(qty) || qty <= 0) {
              setUploadWarnings(prev => [...prev, `Строка ${i}: Некорректное количество (${rawQty})`]);
              continue;
            }

            const excelDateToJS = (serial: number | string | undefined) => {
              if (!serial) return "";
              if (typeof serial === "number") {
                const date = new Date((serial - 25569) * 86400 * 1000);
                return date.toLocaleDateString("ru-RU");
              }
              return String(serial).trim();
            };

            extractedPlans.push({
              Профиль: String(row[cols.profile] || "").trim(),
              Марка: String(row[cols.grade] || "").trim(),
              Размер: String(row[cols.size] || "").trim(),
              "Кол-во": qty,
              Длина: String(row[cols.length] || "").trim(),
              "Дата размещения": excelDateToJS(row[cols.datePlaced]),
              "Ожидаемая дата поставки": excelDateToJS(row[cols.dateExpected]),
              Поставщик: String(row[cols.supplier] || "").trim(),
            });
          }
        }
      }

      if (type === "production") setProcessedSupplyPlansProd(extractedPlans);
      else setProcessedSupplyPlansSup(extractedPlans);
    } catch (err) {
      console.error("Error processing supply plans files:", err);
    } finally {
      setIsProcessingSupplyPlans(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  const handleProcessStock = async (
    type: "production" | "supply",
    filesToProcess: any[],
  ) => {
    if (filesToProcess.length === 0) return;
    setIsProcessingStock(true);

    // Give browser time to render loading state
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const extractedStock: any[] = [];

      for (const fileObj of filesToProcess) {
        if (!fileObj.file) continue;

        const data = await fileObj.file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
          }) as any[][];

          let startRow = 0;
          let nomCol = -1;
          let weightCol = -1;

          for (let i = 0; i < Math.min(100, jsonData.length); i++) {
            const rowStr = jsonData[i].join(" ").toLowerCase();
            if (rowStr.includes("номенклатура") || rowStr.includes("остаток")) {
              startRow = i + 1;
              jsonData[i].forEach((cell: any, idx: number) => {
                const c = String(cell).toLowerCase().trim();
                if (c.includes("номенклатура") || c.includes("наименование"))
                  nomCol = idx;
                if (
                  c.includes("конечный остаток") ||
                  c.includes("остаток") ||
                  c.includes("кол-во")
                )
                  weightCol = idx;
              });
              break;
            }
          }

          if (nomCol === -1 || weightCol === -1) {
            setUploadWarnings((prev) => [
              ...prev,
              `Файл "${fileObj.name}" (Склад): не найдены ${nomCol === -1 ? "Номенклатура " : ""}${weightCol === -1 ? "Конечный остаток" : ""}`,
            ]);
            continue;
          }

          for (let i = startRow; i < jsonData.length; i++) {
            if (i % 25 === 0) {
              setParsingProgress({
                active: true,
                current: i,
                total: jsonData.length,
                message: `Файл склада: Обрабатывается строка ${i} из ${jsonData.length}...`,
              });
              await new Promise((resolve) => setTimeout(resolve, 0));
            }

            const row = jsonData[i] || [];
            if (!row[nomCol]) continue;

            const rawNom = String(row[nomCol]).trim();
            const rawWeight = row[weightCol];
            let weight =
              typeof rawWeight === "number"
                ? rawWeight
                : parseFloat(
                    String(rawWeight || "0")
                      .replace(/\s/g, "")
                      .replace(",", "."),
                  );
            if (isNaN(weight) || weight <= 0.0001) {
              if (rawWeight !== undefined && rawWeight !== "") {
                setUploadWarnings(prev => [...prev, `Строка ${i}: Некорректный остаток (${rawWeight})`]);
              }
              continue;
            }

            let profile = "круг";
            if (rawNom.toLowerCase().includes("шестиг"))
              profile = "шестигранник";

            let grade = "ст.35";
            const gMatch = rawNom.match(
              /(?:^|[^а-яА-ЯёЁa-zA-Z])(?:ст\.?|сталь)\s*([0-9a-zA-Zа-яА-Я-]+)/i,
            );
            if (gMatch) {
              grade = "ст." + gMatch[1].toUpperCase();
            } else {
              const alloyMatch = rawNom.match(
                /\b(\d{2}[ХхНнМмТтВвГгДд]+[0-9a-zA-Zа-яА-Я-]*)\b/,
              );
              if (alloyMatch) grade = "ст." + alloyMatch[1].toUpperCase();
            }
            grade = grade.replace(/[хХxX]\s*\d{3,}$/i, "");

            let diameter = "";
            const sizeMatch = rawNom.match(
              /(?:круг|шестигранник)\s*(?:калибровоченный|калибровочный|калиброванный|калибр\.?)?\s*(\d+(?:[.,]\d+)?)/i,
            );
            if (sizeMatch) {
              diameter = sizeMatch[1];
            } else {
              const sizeFallback = rawNom.match(
                /\s+(\d+(?:[.,]\d+)?)\s*(?:мм)?\s*/i,
              );
              if (
                sizeFallback &&
                !sizeFallback[1].includes("1050") &&
                !sizeFallback[1].includes("7417") &&
                !sizeFallback[1].includes("2590")
              ) {
                diameter = sizeFallback[1];
              }
            }

            const nomUpper = rawNom.toUpperCase();
            const nomClean = nomUpper.replace(/\s/g, "");

            let lengthType = "НД";

            // Парсинг М/Д, МД, Н/Д
            const mdMatch = nomClean.match(/(?:М\/Д|МД)(\d+)?/);
            const ndSlashMatch = nomClean.match(/Н\/Д(\d+)?/);
            const ndMatch = nomClean.includes("НД");

            if (mdMatch) {
              const val =
                mdMatch[1] === "6000" || !mdMatch[1] ? "6000" : mdMatch[1];
              lengthType = "МД " + val;
            }

            extractedStock.push({
              "Исходная Номенклатура": rawNom,
              Профиль: profile,
              НТД: getGostForGrade(grade) + " / ГОСТ 2590-2006",
              "Марка стали": grade,
              Размер: diameter,
              Длина: lengthType,
              "Конечный остаток тн.": weight,
            });
          }
        }
      }

      if (extractedStock.length === 0) {
        alert("Не удалось извлечь остатки из загруженных файлов.");
        return;
      }

      if (type === "production") setProcessedStockProd(extractedStock);
      else setProcessedStockSup(extractedStock);
    } catch (err) {
      console.error("Error processing stock files:", err);
    } finally {
      setIsProcessingStock(false);
      setParsingProgress({ active: false, current: 0, total: 0, message: "" });
    }
  };

  const handleCopyForSheets = async () => {
    if (processedStock.length === 0) return;

    const keys = Object.keys(processedStock[0]);
    const headerRow = keys.join("[&_th]");
    const rows = processedStock.map((row) =>
      keys
        .map((key) => {
          const val = row[key];
          return String(val ?? "")
            .replace(/[&_th]/g, " ")
            .replace(/\n/g, " ");
        })
        .join("[&_th]"),
    );

    const tsvData = [headerRow, ...rows].join("\n");

    try {
      await navigator.clipboard.writeText(tsvData);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования: ", err);
      alert("Не удалось скопировать данные.");
    }
  };

  const handleExportStock = () => {
    if (processedStock.length === 0) return;

    // Ensure numeric fields are actually numbers for Excel
    const dataToExport = processedStock.map((item) => ({
      ...item,
      "Конечный остаток тн.":
        typeof item["Конечный остаток тн."] === "number"
          ? item["Конечный остаток тн."]
          : parseFloat(
              String(item["Конечный остаток тн."]).replace(",", "."),
            ) || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const wscols = Object.keys(dataToExport[0]).map((key) => ({
      wch: Math.max(key.length, 15),
    }));
    wscols[0].wch = 50;
    worksheet["!cols"] = wscols;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Остатки_Склад");
    XLSX.writeFile(workbook, getTimestampedFilename("Остатки обработанные"));
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        date: new Date().toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: file,
      }));
      setPlanFiles((prev) => [...newFiles, ...prev]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleStockFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        date: new Date().toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: file,
      }));
      setStockFiles((prev) => [...newFiles, ...prev]);
      if (stockFileInputRef.current) stockFileInputRef.current.value = "";
    }
  };

  const handleSupplyPlanFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map((file: File) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        date: new Date().toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        file: file,
      }));
      setSupplyPlanFiles((prev) => [...newFiles, ...prev]);
      if (supplyPlanFileInputRef.current)
        supplyPlanFileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setPlanFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeStockFile = (id: string) => {
    setStockFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const removeSupplyPlanFile = (id: string) => {
    setSupplyPlanFiles((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    if (stockFilesProd.length > 0)
      handleProcessStock("production", stockFilesProd);
    else setProcessedStockProd([]);
  }, [stockFilesProd]);

  useEffect(() => {
    if (stockFilesSup.length > 0) handleProcessStock("supply", stockFilesSup);
    else setProcessedStockSup([]);
  }, [stockFilesSup]);

  useEffect(() => {
    if (supplyPlanFilesProd.length > 0)
      handleProcessSupplyPlans("production", supplyPlanFilesProd);
    else setProcessedSupplyPlansProd([]);
  }, [supplyPlanFilesProd]);

  useEffect(() => {
    if (supplyPlanFilesSup.length > 0)
      handleProcessSupplyPlans("supply", supplyPlanFilesSup);
    else setProcessedSupplyPlansSup([]);
  }, [supplyPlanFilesSup]);

  useEffect(() => {
    if (planFilesProd.length > 0)
      handleProcessPlans("production", planFilesProd);
    else setCalcResultsProd([]);
  }, [planFilesProd]);

  useEffect(() => {
    if (planFilesSup.length > 0) handleProcessPlans("supply", planFilesSup);
    else setCalcResultsSup([]);
  }, [planFilesSup]);

  useEffect(() => {
    setRawPrices((prev) =>
      JSON.stringify(prev) === JSON.stringify(initialRawPrices)
        ? prev
        : initialRawPrices,
    );
  }, [initialRawPrices]);

  useEffect(() => {
    setScrap((prev) => (prev === initialScrap ? prev : initialScrap));
  }, [initialScrap]);

  useEffect(() => {
    setRemnant((prev) => (prev === initialRemnant ? prev : initialRemnant));
  }, [initialRemnant]);

  useEffect(() => {
    setCustomGrades((prev) =>
      JSON.stringify(prev) === JSON.stringify(initialCustomGrades || [])
        ? prev
        : initialCustomGrades || [],
    );
  }, [initialCustomGrades]);

  useEffect(() => {
    setDeletedGrades((prev) =>
      JSON.stringify(prev) === JSON.stringify(initialDeletedGrades || [])
        ? prev
        : initialDeletedGrades || [],
    );
  }, [initialDeletedGrades]);

  useEffect(() => {
    setRemnantPricing((prev) =>
      JSON.stringify(prev) === JSON.stringify(initialRemnantPricing || {})
        ? prev
        : initialRemnantPricing || {},
    );
  }, [initialRemnantPricing]);

  useEffect(() => {
    if (initialEconomyItems && initialEconomyItems.length > 0) {
      setEconomyItems((prev) => {
        const initialMap = new Map(
          initialEconomyItems.map((item) => [item.id, item]),
        );
        const merged = DEFAULT_ECONOMY_ITEMS.map(
          (defaultItem) => initialMap.get(defaultItem.id) || defaultItem,
        );
        if (JSON.stringify(prev) === JSON.stringify(merged)) return prev;
        return merged;
      });
    }
  }, [initialEconomyItems]);

  const allGrades = [...DEFAULT_STEEL_GRADES, ...customGrades].filter(
    (g) => !deletedGrades.includes(g),
  );

  const RemnantPricingTooltip = () => (
    <div className="group relative inline-block ml-1 align-middle">
      <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help" />
      <div className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-[#1A1C19] dark:bg-slate-700 text-white text-[10px] rounded-xl shadow-2xl w-60 z-[100] transition-all normal-case font-normal text-left border border-slate-700">
        <div className="font-bold mb-1 border-b border-white/10 pb-1 text-[11px]">
          Типы остатков
        </div>
        <div className="space-y-2 opacity-95">
          <div>
            <span className="text-sky-300 font-bold uppercase tracking-tighter">
              Деловой остаток:
            </span>
            <p className="mt-0.5 leading-relaxed">
              Длинные куски (обычно &gt;2.5м), которые можно продать как
              полноценную заготовку по цене делового остатка.
            </p>
          </div>
          <div>
            <span className="text-red-400 font-bold uppercase tracking-tighter">
              По цене лома:
            </span>
            <p className="mt-0.5 leading-relaxed">
              Мелкие обрезки и технические концы, которые не имеют складской
              ценности и продаются по весу лома.
            </p>
          </div>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#1A1C19] dark:border-t-slate-700"></div>
      </div>
    </div>
  );

  const handlePriceChange = (
    grade: string,
    type: "md" | "nd",
    value: string,
  ) => {
    let val = value.replace(/\s/g, "").replace(/,/g, ".");
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setRawPrices((prev) => {
        const current = prev[grade] || { md: "", nd: "" };
        const otherType = type === "md" ? "nd" : "md";

        // If the prices were identical or other was empty, keep them synchronized
        const shouldSync =
          !current.md || !current.nd || current.md === current.nd;

        return {
          ...prev,
          [grade]: {
            ...current,
            [type]: val,
            ...(shouldSync ? { [otherType]: val } : {}),
          },
        };
      });
    }
  };

  const handlePricingChange = (
    grade: string,
    profile: "round" | "hex",
    value: string,
  ) => {
    setRemnantPricing((prev) => ({
      ...prev,
      [grade]: {
        ...(prev[grade] || { round: "remnant", hex: "remnant" }),
        [profile]: value,
      },
    }));
  };

  const handleAddGrade = () => {
    const grade = newGrade.trim();
    if (grade && !allGrades.includes(grade)) {
      setCustomGrades([...customGrades, grade]);
      setRawPrices({ ...rawPrices, [grade]: { md: "", nd: "" } });
      setNewGrade("");
    }
  };

  const handleRemoveGrade = (gradeToRemove: string) => {
    if (DEFAULT_STEEL_GRADES.includes(gradeToRemove)) {
      setDeletedGrades([...deletedGrades, gradeToRemove]);
    } else {
      setCustomGrades(customGrades.filter((g) => g !== gradeToRemove));
    }

    const newPrices = { ...rawPrices };
    delete newPrices[gradeToRemove];
    setRawPrices(newPrices);

    const newPricing = { ...remnantPricing };
    delete newPricing[gradeToRemove];
    setRemnantPricing(newPricing);
  };

  const handleSave = async () => {
    if (Object.keys(validationErrors).length > 0) {
      setSaveError("Пожалуйста, исправьте ошибки валидации перед сохранением.");
      setTimeout(() => setSaveError(""), 4000);
      return;
    }
    setIsSaving(true);
    setSaveError("");
    try {
      const savePromise = onSave(
        rawPrices,
        scrap,
        remnant,
        customGrades,
        remnantPricing,
        economyItems,
        deletedGrades,
      );
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("CloudTimeout")), 5000),
      );

      await Promise.race([savePromise, timeoutPromise]);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error("Ошибка сохранения:", e);
      setSaveError("Облако недоступно. Сохранено локально.");
      setTimeout(() => setSaveError(""), 4000);
    }
    setIsSaving(false);
  };

  const handleEconomyChange = (
    id: string,
    field: keyof EconomyItem,
    value: string,
  ) => {
    const val = value.replace(/\s/g, "").replace(/,/g, ".");
    if (val === "" || /^\d*\.?\d*$/.test(val)) {
      setEconomyItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
      );
    }
  };

  const directItems = economyItems.filter((i) => i.category === "direct");
  const overheadItems = economyItems.filter((i) => i.category === "overhead");

  const tabs = [
    "files",
    "economy",
    "supply",
    "production",
    "logistics",
    "help",
  ];
  const handleSwipe = (direction: number) => {
    const currentIndex = tabs.indexOf(activeTab);
    if (direction > 0 && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1] as any);
    } else if (direction < 0 && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1] as any);
    }
  };

  const renderFilesContent = (hideExtraBlocks = false) => {
    const isAnyProcessing = isProcessing || isProcessingStock || isProcessingSupplyPlans;
    return (
    <div className="relative">
      {isAnyProcessing && (
        <div className="absolute inset-0 bg-white/50 dark:bg-[#121411]/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center min-h-[400px] rounded-3xl">
          <div className="bg-white dark:bg-[#1A1C19] p-8 rounded-[24px] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Обработка файлов
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {isProcessing ? "Анализируем планы и заявки..." : isProcessingStock ? "Обрабатываем складские остатки..." : "Загружаем реестры..."}
              </p>
            </div>
          </div>
        </div>
      )}
    <motion.div
      key="files"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-8 h-full"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          Файлы данных
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {hideExtraBlocks
            ? "Расчет потребности в сырье."
            : "Расчет потребности в сырье, наличия на складе и реестров поставок."}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {uploadWarnings.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h4 className="font-bold text-amber-800 dark:text-amber-400">
                Предупреждения при маппинге файлов
              </h4>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {uploadWarnings.map((warn, i) => (
                <li
                  key={i}
                  className="text-sm text-amber-700 dark:text-amber-500"
                >
                  {warn}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* File Upload Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">
              {activeTab === "supply"
                ? "Заявка на обеспечение"
                : "Планы производства"}
            </h3>
          </div>

          <div className="relative group/dropzone">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  const event = {
                    target: { files },
                  } as unknown as ChangeEvent<HTMLInputElement>;
                  handleFileUpload(event);
                }
              }}
              className={`relative bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed ${planFiles.length === 0 ? "border-blue-400 dark:border-blue-500 animate-pulse-border shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "border-slate-200 dark:border-slate-800"} p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-4 sm:gap-5 group cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all z-10 w-full`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                multiple
                accept=".pdf,.xlsx,.csv,.txt,.docx"
              />
              <div className="relative w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl shrink-0 flex items-center justify-center text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                <Upload className="w-6 h-6" />
                {planFiles.length === 0 && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-75"></div>
                )}
              </div>
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Нажмите или перетащите файл
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {activeTab === "supply"
                    ? "Excel или CSV файлы заявок"
                    : "Excel или CSV файлы планов"}
                </p>
              </div>
            </motion.div>
            {/* Tooltip */}
            {planFiles.length === 0 && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover/dropzone:opacity-100 transition-opacity pointer-events-none z-20">
                Загрузите выгрузку из 1С в формате Excel (.xlsx). Важен столбец
                «Остаток к выполнению» или «Количество».
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsBatchManualOpen(true);
              }}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 bg-white dark:bg-[#1A1C19] hover:bg-slate-100 dark:hover:bg-[#252824] text-slate-600 dark:text-[#E2E3DE] rounded-xl transition-all focus:outline-none border border-slate-200 dark:border-[#2C2F2B] shadow-sm z-10"
              title="Инструкция по расчетам"
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>

          {planFiles.length > 0 && (
            <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  Загруженные файлы
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full">
                    {planFiles.length} файлов
                  </span>
                  {isProcessing && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-2 font-medium">
                      <div className="w-3 h-3 border-2 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                      {parsingProgress.active
                        ? parsingProgress.message
                        : "Расчет..."}
                    </div>
                  )}
                  {!isProcessing && calculationResults.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (activeTab === "supply") setSupplySection("calc");
                        else {
                          setProductionSection("calc");
                        }
                      }}
                      className="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-bold px-4 py-1.5 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-all flex items-center gap-2"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Показать расчеты</span>
                    </motion.button>
                  )}
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {planFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors px-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {file.name}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{file.size}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span>{file.date}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stock Inventory Section */}
          {!hideExtraBlocks && (
            <>
              <div className="flex items-center gap-2 px-1 mt-2">
                <Layers className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  Наличие на складе (г/к прокат)
                </h3>
              </div>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => stockFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      const event = {
                        target: { files },
                      } as unknown as ChangeEvent<HTMLInputElement>;
                      handleStockFileUpload(event);
                    }
                  }}
                  className="bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed border-sky-200 dark:border-sky-900/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-4 sm:gap-5 group cursor-pointer hover:border-sky-400 dark:hover:border-sky-700 transition-all shadow-sm w-full"
                >
                  <input
                    type="file"
                    ref={stockFileInputRef}
                    onChange={handleStockFileUpload}
                    className="hidden"
                    multiple
                    accept=".pdf,.xlsx,.csv,.txt,.docx"
                  />
                  <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl shrink-0 flex items-center justify-center text-sky-400 group-hover:text-sky-600 transition-colors">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      Загрузить реестр склада
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                      Остатки горячекатаного проката в любом формате
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsStockManualOpen(true);
                      }}
                      className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium text-sm mt-2 underline"
                    >
                      Как правильно подготовить файл склада?
                    </button>
                  </div>
                </motion.div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStockManualOpen(true);
                  }}
                  className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 bg-white dark:bg-[#1A1C19] hover:bg-slate-100 dark:hover:bg-[#252824] text-slate-600 dark:text-[#E2E3DE] rounded-xl transition-all focus:outline-none border border-slate-200 dark:border-[#2C2F2B] shadow-sm z-10"
                  title="Инструкция по складу"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
              </div>

              {stockFiles.length > 0 && (
                <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Загруженные файлы склада
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 px-2.5 py-1 rounded-full">
                        {stockFiles.length} файлов
                      </span>

                      {isProcessingStock && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 font-medium">
                          <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                          {parsingProgress.active
                            ? parsingProgress.message
                            : "Обработка..."}
                        </div>
                      )}

                      {!isProcessingStock && processedStock.length > 0 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (activeTab === "supply")
                              setSupplySection("stock");
                            else {
                              setProductionSection("stock");
                            }
                          }}
                          className="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-bold px-4 py-1.5 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-all flex items-center gap-2"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Показать наличие</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {stockFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors px-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400">
                            <Layers className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {file.name}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{file.size}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{file.date}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStockFile(file.id);
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supply Plan Registry Section */}
              <div className="flex items-center gap-2 px-1 mt-2">
                <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                  Реестр поставок
                </h3>
              </div>

              <div className="relative">
                <div
                  onClick={() => supplyPlanFileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const files = e.dataTransfer.files;
                    if (files && files.length > 0) {
                      const event = {
                        target: { files },
                      } as unknown as ChangeEvent<HTMLInputElement>;
                      handleSupplyPlanFileUpload(event);
                    }
                  }}
                  className="bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed border-sky-200 dark:border-sky-900/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-center sm:justify-start text-center sm:text-left gap-4 sm:gap-6 group cursor-pointer hover:border-sky-400 dark:hover:border-sky-700 transition-all shadow-sm"
                >
                  <input
                    type="file"
                    ref={supplyPlanFileInputRef}
                    onChange={handleSupplyPlanFileUpload}
                    className="hidden"
                    multiple
                    accept=".pdf,.xlsx,.csv,.txt,.docx"
                  />
                  <div className="w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl shrink-0 flex items-center justify-center text-sky-400 group-hover:text-sky-600 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      Загрузить реестр с планом поставок сырья
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                      График ожидаемых поступлений металла
                    </p>
                  </div>
                </div>
              </div>

              {supplyPlanFiles.length > 0 && (
                <div className="bg-white dark:bg-[#1A1C19] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      Загруженные файлы поставок
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-300 px-2.5 py-1 rounded-full">
                        {supplyPlanFiles.length} файлов
                      </span>

                      {isProcessingSupplyPlans && (
                        <div className="text-[10px] text-slate-500 flex items-center gap-2 font-medium">
                          <div className="w-3 h-3 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                          {parsingProgress.active
                            ? parsingProgress.message
                            : "Обработка..."}
                        </div>
                      )}

                      {!isProcessingSupplyPlans &&
                        processedSupplyPlans.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              if (activeTab === "supply")
                                setSupplySection("supply-plans");
                            }}
                            className="bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-bold px-4 py-1.5 rounded-full hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-all flex items-center gap-2"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Показать поставки</span>
                          </motion.button>
                        )}
                    </div>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {supplyPlanFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors px-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400">
                            <ShoppingCart className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                              {file.name}
                            </h4>
                            <p className="text-[10px] font-medium text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{file.size}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span>{file.date}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSupplyPlanFile(file.id);
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
    </div>
  );
  };
  return (
    <div className="min-h-screen bg-[#F4F5F4] dark:bg-[#121411] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile App Navigation Bar */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-[#1A1C19]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center h-[72px] pb-4 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto [&::-webkit-scrollbar]:hidden gap-1">
        {!isPurchasingMode && (
          <button
            onClick={() => setActiveTab("economy")}
            className={`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all ${activeTab === "economy" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
          >
            <div
              className={`px-3 py-1 rounded-full mb-1 transition-colors ${activeTab === "economy" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
            >
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">
              Экономика
            </span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("production")}
          className={`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all ${activeTab === "production" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
        >
          <div
            className={`px-3 py-1 rounded-full mb-1 transition-colors ${activeTab === "production" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
          >
            <Factory className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Пр-во</span>
        </button>

        <button
          onClick={() => setActiveTab("supply")}
          className={`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all ${activeTab === "supply" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
        >
          <div
            className={`px-3 py-1 rounded-full mb-1 transition-colors ${activeTab === "supply" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
          >
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            Снабжение
          </span>
        </button>

        <button
          onClick={() => setActiveTab("logistics")}
          className={`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all ${activeTab === "logistics" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
        >
          <div
            className={`px-3 py-1 rounded-full mb-1 transition-colors ${activeTab === "logistics" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
          >
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            Логистика
          </span>
        </button>

        <button
          onClick={() => setActiveTab("help")}
          className={`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all ${activeTab === "help" ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}
        >
          <div
            className={`px-3 py-1 rounded-full mb-1 transition-colors ${activeTab === "help" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Справка</span>
        </button>

        <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 mx-1 shrink-0"></div>

        <button
          onClick={toggleTheme}
          className="flex flex-col items-center justify-center min-w-[56px] shrink-0 h-full py-1 text-slate-400 dark:text-slate-500 active:scale-95 transition-all"
        >
          <div className="px-3 py-1 mb-1">
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Тема</span>
        </button>

        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center min-w-[56px] shrink-0 h-full py-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-all"
        >
          <div className="px-3 py-1 mb-1">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight font-sans">
            Выйти
          </span>
        </button>
      </div>

      {/* Desktop Navigation Rail */}
      <div className="hidden md:flex flex-col w-[88px] bg-[#F0F4F4] dark:bg-[#1A1C19] border-r border-slate-200 dark:border-slate-800 items-center py-6 fixed h-full z-50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-xl flex items-center justify-center text-white mb-2 shadow-sm">
            <Calculator className="w-6 h-6" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4 w-full px-3">
          {!isPurchasingMode && (
            <button
              onClick={() => setActiveTab("economy")}
              className={`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group ${activeTab === "economy" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              <div
                className={`px-5 py-1.5 mb-1.5 rounded-full transition-colors ${activeTab === "economy" ? "bg-slate-200 dark:bg-slate-700" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}
              >
                <TrendingUp className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                Экономика
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("production")}
            className={`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group ${activeTab === "production" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <div
              className={`px-5 py-1.5 mb-1.5 rounded-full transition-colors ${activeTab === "production" ? "bg-slate-200 dark:bg-slate-700" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}
            >
              <Factory className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Пр-во</span>
          </button>

          <button
            onClick={() => setActiveTab("supply")}
            className={`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group ${activeTab === "supply" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <div
              className={`px-5 py-1.5 mb-1.5 rounded-full transition-colors ${activeTab === "supply" ? "bg-slate-200 dark:bg-slate-700" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}
            >
              <Package className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">
              Снабжение
            </span>
          </button>

          <button
            onClick={() => setActiveTab("logistics")}
            className={`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group ${activeTab === "logistics" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <div
              className={`px-5 py-1.5 mb-1.5 rounded-full transition-colors ${activeTab === "logistics" ? "bg-slate-200 dark:bg-slate-700" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}
            >
              <Truck className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">
              Логистика
            </span>
          </button>

          <button
            onClick={() => setActiveTab("help")}
            className={`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group ${activeTab === "help" ? "text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
          >
            <div
              className={`px-5 py-1.5 mb-1.5 rounded-full transition-colors ${activeTab === "help" ? "bg-slate-200 dark:bg-slate-700" : "group-hover:bg-slate-100 dark:group-hover:bg-slate-800"}`}
            >
              <BookOpen className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">
              Справка
            </span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 group"
          >
            <div className="px-5 py-1.5 mb-1.5 transition-colors group-hover:bg-slate-100 dark:group-hover:bg-slate-800 rounded-full">
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-amber-500" strokeWidth={2} />
              ) : (
                <Moon className="w-6 h-6" strokeWidth={2} />
              )}
            </div>
            <span className="text-[11px] font-medium tracking-wide">
              {isDarkMode ? "Светлая" : "Темная"}
            </span>
          </button>
        </div>
        <div className="w-full px-3">
          <button
            onClick={onLogout}
            className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <div className="px-5 py-1.5 mb-1.5">
              <LogOut className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Выйти</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div className="flex-1 ml-0 md:ml-[88px] pb-32 md:pb-8 pt-6 sm:pt-8 px-3 sm:px-8 w-full min-w-0">
        <AnimatePresence mode="wait">
          {activeTab === "supply" && (
          <AdminPanelSupplyTab
            activeTab={activeTab}
            formatCurrency={formatCurrency}
            calculationResults={calculationResults}
            setCalculationResults={setCalculationResults}
            processedStock={processedStock}
            processedSupplyPlans={processedSupplyPlans}
            applyAllOptimizations={applyAllOptimizations}
            tableContainerRef={tableContainerRef}
            summaryContainerRef={summaryContainerRef}
            supplyTableRef={supplyTableRef}
            stockTableRef={stockTableRef}
            freeStockTableRef={freeStockTableRef}
            handleMouseDown={handleMouseDown}
            onSummaryMouseDown={onSummaryMouseDown}
            onSupplyMouseDown={onSupplyMouseDown}
            onStockMouseDown={onStockMouseDown}
            onFreeStockMouseDown={onFreeStockMouseDown}
            handleMouseLeaveOrUp={handleMouseLeaveOrUp}
            onSummaryMouseLeaveOrUp={onSummaryMouseLeaveOrUp}
            handleMouseMove={handleMouseMove}
            matchedDemand={matchedDemand}
            supplyCalculationData={supplyCalculationData}
            getSupplyNomenclature={getSupplyNomenclature}
            handleCopyForSheets={handleCopyForSheets}
            handleExportStock={handleExportStock}
            tabs={tabs}
            renderFilesContent={renderFilesContent}
            setActiveTab={setActiveTab}
            supplySection={supplySection}
            setSupplySection={setSupplySection}
            setProductionSection={setProductionSection}
            isCopied={isCopied}
            setIsCopied={setIsCopied}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isProcessing={isProcessing}
            isDragging={isDragging}
            isSummaryDragging={isSummaryDragging}
            isSupplyDragging={isSupplyDragging}
            isStockDragging={isStockDragging}
            isFreeStockDragging={isFreeStockDragging}
            copySuccess={copySuccess}
            setCopySuccess={setCopySuccess}
            stockTotals={stockTotals}
            isPurchasingMode={isPurchasingMode}
            freeStock={freeStock}
            validationErrors={validationErrors}
          />
        )}
          {activeTab === "economy" && (
          <AdminPanelEconomyTab
            activeTab={activeTab}
            handleSave={handleSave}
            isSaving={isSaving}
            saved={saved}
            economyItems={economyItems}
            handleEconomyChange={handleEconomyChange}
            handleRemoveGrade={handleRemoveGrade}
            setScrap={setScrap}
            setRemnant={setRemnant}
            allGrades={allGrades}
                                                saveError={saveError}
            rawPrices={rawPrices}
            handlePriceChange={handlePriceChange}
            adminSection={adminSection}
            setAdminSection={setAdminSection}
                        scrap={scrap}
            remnant={remnant}
            customGrades={customGrades}
            remnantPricing={remnantPricing}
            newGrade={newGrade}
            setNewGrade={setNewGrade}
            handleAddGrade={handleAddGrade}
                                    deletedGrades={deletedGrades}
                        handlePricingChange={handlePricingChange}
            formatDate={formatDate}
            validationErrors={validationErrors}
          />
        )}
          {activeTab === "production" && (
          <AdminPanelProductionTab
            activeTab={activeTab}
            formatCurrency={formatCurrency}
            planFiles={planFiles}
            stockFiles={stockFiles}
            calculationResults={calculationResults}
            processedStock={processedStock}
            processedSupplyPlans={processedSupplyPlans}
            tableContainerRef={tableContainerRef}
            summaryContainerRef={summaryContainerRef}
            supplyTableRef={supplyTableRef}
            stockTableRef={stockTableRef}
            freeStockTableRef={freeStockTableRef}
            handleMouseDown={handleMouseDown}
            onSummaryMouseDown={onSummaryMouseDown}
            onSupplyMouseDown={onSupplyMouseDown}
            onStockMouseDown={onStockMouseDown}
            onFreeStockMouseDown={onFreeStockMouseDown}
            handleMouseLeaveOrUp={handleMouseLeaveOrUp}
            onSummaryMouseLeaveOrUp={onSummaryMouseLeaveOrUp}
            handleMouseMove={handleMouseMove}
            matchedDemand={matchedDemand}
            supplyCalculationData={supplyCalculationData}
            filteredMatchedDemand={filteredMatchedDemand}
            filteredTotals={filteredTotals}
            getSupplyNomenclature={getSupplyNomenclature}
            handleCopyForSheets={handleCopyForSheets}
            handleExportStock={handleExportStock}
            renderFilesContent={renderFilesContent}
            setActiveTab={setActiveTab}
            setSupplySection={setSupplySection}
            productionSection={productionSection}
            setProductionSection={setProductionSection}
            isCopied={isCopied}
            setIsCopied={setIsCopied}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            isProcessing={isProcessing}
            isDragging={isDragging}
            isSummaryDragging={isSummaryDragging}
            isSupplyDragging={isSupplyDragging}
            isStockDragging={isStockDragging}
            isFreeStockDragging={isFreeStockDragging}
            copySuccess={copySuccess}
            setCopySuccess={setCopySuccess}
            stockTotals={stockTotals}
            freeStock={freeStock}
          />
        )}
          {activeTab === "logistics" && (
          <AdminPanelLogisticsTab
            activeTab={activeTab}
          />
        )}
          {activeTab === "help" && (
          <AdminPanelHelpTab
            activeTab={activeTab}
            />
        )}

        </AnimatePresence>
      </motion.div>
      <BatchManualModal
        isOpen={isBatchManualOpen}
        onClose={() => setIsBatchManualOpen(false)}
      />
      <StockManualModal
        isOpen={isStockManualOpen}
        onClose={() => setIsStockManualOpen(false)}
      />
    </div>
  );
}
