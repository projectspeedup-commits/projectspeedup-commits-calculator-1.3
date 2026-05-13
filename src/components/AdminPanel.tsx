import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { useAdminStore } from "../store/useAdminStore";
import { useExcelProcessors } from "../hooks/useExcelProcessors";
import {
  subscribeToAdminData,
  saveAdminDataToCloud,
} from "../services/db/adminDataService";
import AdminPanelHelpTab from "./AdminPanelHelpTab";
import AdminPanelLogisticsTab from "./AdminPanelLogisticsTab";
import AdminPanelProductionTab from "./AdminPanelProductionTab";
import AdminPanelSupplyTab from "./AdminPanelSupplyTab";
import AdminPanelEconomyTab from "./AdminPanelEconomyTab";
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

import { CalculationResult } from "../types";

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
  initialTab?:
    | "files"
    | "economy"
    | "supply"
    | "production"
    | "logistics"
    | "help";
  isPurchasingMode?: boolean;
  isDeveloperMode?: boolean;
  config?: { usePostgres: boolean; isProduction: boolean } | null;
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
  isDeveloperMode = false,
  config,
}: AdminPanelProps) {
  const store = useAdminStore();

  // Sync props to store on mount
  useEffect(() => {
    store.setRawPrices(initialRawPrices);
    store.setScrap(initialScrap);
    store.setRemnant(initialRemnant);
    store.setCustomGrades(initialCustomGrades || []);
    store.setDeletedGrades(initialDeletedGrades || []);
    store.setRemnantPricing(initialRemnantPricing || {});
    if (initialEconomyItems) store.setEconomyItems(initialEconomyItems);

    // Load from localStorage
    try {
      const prodResults = localStorage.getItem("ais_prod_calc_results");
      if (prodResults) store.setCalcResultsProd(JSON.parse(prodResults));
      
      const supResults = localStorage.getItem("ais_sup_calc_results");
      if (supResults) store.setCalcResultsSup(JSON.parse(supResults));
      
      const prodPlans = localStorage.getItem("ais_prod_supply_plans");
      if (prodPlans) store.setProcessedSupplyPlansProd(JSON.parse(prodPlans));
      
      const supPlans = localStorage.getItem("ais_sup_supply_plans");
      if (supPlans) store.setProcessedSupplyPlansSup(JSON.parse(supPlans));
      
      const prodStock = localStorage.getItem("ais_prod_stock");
      if (prodStock) store.setProcessedStockProd(JSON.parse(prodStock));
      
      const supStock = localStorage.getItem("ais_sup_stock");
      if (supStock) store.setProcessedStockSup(JSON.parse(supStock));
    } catch (e) {
      console.error("Error loading from localStorage", e);
    }
  }, []);

  const [activeTab, setActiveTab] = useState<
    "files" | "economy" | "supply" | "production" | "logistics" | "help"
  >(initialTab as any);

  // Use store instead of local state for data
  const { 
    rawPrices, scrap, remnant, customGrades, deletedGrades, remnantPricing, economyItems,
    isSaving, setIsSaving, updatePrice, setScrap, setRemnant, removeGrade, 
    updateRemnantPricing, updateEconomyItem, addCustomGrade,
    validationErrors, setValidationErrors,
    setRawPrices, setCustomGrades, setDeletedGrades, setRemnantPricing, setEconomyItems
  } = useAdminStore();

  const [isBatchManualOpen, setIsBatchManualOpen] = useState(false);
  const [isStockManualOpen, setIsStockManualOpen] = useState(false);
  // Processing States from Store
  const {
    isProcessing, setIsProcessing,
    isProcessingStock, setIsProcessingStock,
    isProcessingSupplyPlans, setIsProcessingSupplyPlans,
    parsingProgress, setParsingProgress,
    calcResultsProd, setCalcResultsProd,
    calcResultsSup, setCalcResultsSup,
    processedSupplyPlansProd, setProcessedSupplyPlansProd,
    processedSupplyPlansSup, setProcessedSupplyPlansSup,
    processedStockProd, setProcessedStockProd,
    processedStockSup, setProcessedStockSup,
    stockSearchQuery, setStockSearchQuery,
    stockStatusFilter, setStockStatusFilter,
    supplySearchQuery, setSupplySearchQuery,
    supplyStatusFilter, setSupplyStatusFilter,
    copySuccess, setCopySuccess,
    isCopied, setIsCopied,
    uploadWarnings, setUploadWarnings
  } = store;

  const { handleProcessPlans, handleProcessSupplyPlans, handleProcessStock } =
    useExcelProcessors();

  const [newGrade, setNewGrade] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stockFileInputRef = useRef<HTMLInputElement>(null);
  const supplyPlanFileInputRef = useRef<HTMLInputElement>(null);

  // Calculation state
  const [calcLength, setCalcLength] = useState("6");
  const [calcQuantity, setCalcQuantity] = useState("100");
  const [calcWaste, setCalcWaste] = useState("3");
  const [calcKIM, setCalcKIM] = useState("0.92");

  const skipCloudSave = useRef(false);

  useEffect(() => {
    if (!isCloudActive || !db) return;

    const unsubProd = subscribeToAdminData(db, "prod_data", (data) => {
      if (data) {
        skipCloudSave.current = true;
        setTimeout(() => {
          skipCloudSave.current = false;
        }, 500);
      }
    }, undefined, config?.usePostgres);

    const unsubSup = subscribeToAdminData(db, "sup_data", (data) => {
      if (data) {
        skipCloudSave.current = true;
        setTimeout(() => {
          skipCloudSave.current = false;
        }, 500);
      }
    }, undefined, config?.usePostgres);

    return () => {
      unsubProd();
      unsubSup();
    };
  }, [isCloudActive]);

  const saveToCloud = async (type: string, payload: any) => {
    if ((!isCloudActive && !config?.usePostgres) || (!db && !config?.usePostgres) || skipCloudSave.current) return;
    try {
      await saveAdminDataToCloud(db, type as any, payload, config?.usePostgres);
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

  // Real-time validation for Economy fields
  useEffect(() => {
    const errors: Record<string, string> = {};

    const parseNum = (val: any) => {
      if (val === undefined || val === null || val === "") return 0;
      const str = String(val).trim();
      if (str === "") return 0;
      return parseFloat(str.replace(/,/g, "."));
    };

    // Validate scrap
    const scrapVal = parseNum(scrap);
    if (isNaN(scrapVal) || scrapVal < 0) {
      errors.scrap = "Цена лома должна быть неотрицательным числом";
    }

    // Validate remnant
    const remnantVal = parseNum(remnant);
    if (isNaN(remnantVal) || remnantVal < 0) {
      errors.remnant = "Цена делового отхода должна быть неотрицательным числом";
    }

    // Validate economy items
    economyItems.forEach((item) => {
      const val = parseNum(item.norm);
      if (isNaN(val) || val < 0) {
        errors[`economy_${item.id}`] =
          "Значение должно быть неотрицательным числом";
      }
    });

    // Validate raw prices
    Object.entries(rawPrices || {}).forEach(([grade, p]: [string, any]) => {
      if (!p) return;
      const md = parseNum(p.md);
      const nd = parseNum(p.nd);
      if (isNaN(md) || md < 0)
        errors[`price_${grade}_md`] = "Некорректная цена МД";
      if (isNaN(nd) || nd < 0)
        errors[`price_${grade}_nd`] = "Некорректная цена НД";
    });

    setValidationErrors(errors);
  }, [scrap, remnant, economyItems, rawPrices, remnantPricing]);

  // Search & Filters state (Moved to store)

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

  const calculationResults = isProduction ? calcResultsProd : calcResultsSup;
  const setCalculationResults = isProduction
    ? setCalcResultsProd
    : setCalcResultsSup;
  const processedStock = isProduction ? processedStockProd : processedStockSup;
  const processedSupplyPlans = isProduction
    ? processedSupplyPlansProd
    : processedSupplyPlansSup;

  useEffect(() => {
    localStorage.setItem(
      "ais_prod_calc_results",
      JSON.stringify(calcResultsProd),
    );
    localStorage.setItem(
      "ais_sup_calc_results",
      JSON.stringify(calcResultsSup),
    );
  }, [calcResultsProd, calcResultsSup]);

  useEffect(() => {
    localStorage.setItem("ais_prod_stock", JSON.stringify(processedStockProd));
    localStorage.setItem("ais_sup_stock", JSON.stringify(processedStockSup));
  }, [processedStockProd, processedStockSup]);

  useEffect(() => {
    localStorage.setItem(
      "ais_prod_supply_plans",
      JSON.stringify(processedSupplyPlansProd),
    );
    localStorage.setItem(
      "ais_sup_supply_plans",
      JSON.stringify(processedSupplyPlansSup),
    );
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

    const isValidProfile =
      stockProfile === reqProfile ||
      (reqProfile === "шестигранник" && stockProfile === "круг");
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
        
        stock.calculatedTechWaste = m.twRate * stock.allocatedAmount;
        stock.calculatedUsefulRem = m.urRate * stock.allocatedAmount;
        stock.calculatedKim = m.kim;

        combinedTechWaste += stock.calculatedTechWaste;
        combinedUsefulRem += stock.calculatedUsefulRem;
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
        stock.calculatedTechWaste = m.twRate * stock.allocatedAmount;
        stock.calculatedUsefulRem = m.urRate * stock.allocatedAmount;
        stock.calculatedKim = m.kim;

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
        supply.calculatedTechWaste = m.twRate * supply.allocatedAmount;
        supply.calculatedUsefulRem = m.urRate * supply.allocatedAmount;
        supply.calculatedKim = m.kim;

        combinedTechWaste3 += m.twRate * supply.allocatedAmount;
        combinedUsefulRem3 += m.urRate * supply.allocatedAmount;
        combinedFinishedWeight3 += m.kim * supply.allocatedAmount;
        supplyTotalBase += supply.allocatedAmount;
      });

      const combinedKim3 =
        supplyTotalBase > 0 ? combinedFinishedWeight3 / supplyTotalBase : 0;

      totalAllocated += (allocatedFromStock + allocatedFromSupply);
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

    const validDemandsForKim2 = matchedDemand.filter(
      (res) => res.allocatedFromStock > 0,
    );
    const averageKim2 =
      validDemandsForKim2.length > 0
        ? validDemandsForKim2.reduce((sum, res) => sum + res.combinedKim2, 0) /
          validDemandsForKim2.length
        : 0;
    const totalTechWaste2 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedTechWaste2,
      0,
    );
    const totalUsefulRem2 = matchedDemand.reduce(
      (sum, res) => sum + res.combinedUsefulRem2,
      0,
    );
    
    // Specifically for supply dashboard, calculate total from supply alone
    const totalAllocatedSupply = matchedDemand.reduce((sum, res) => sum + (res.allocatedFromSupply || 0), 0);

    return {
      matchedDemand,
      freeSupply: availableSupply.filter(
        (item) => item.remainingStock > 0.0005,
      ),
      totals: {
        allocated: totalAllocated,
        allocatedSupply: totalAllocatedSupply,
        deficit: totalDeficit,
        remaining: totalRemaining,
        averageKim2: averageKim2,
        techWaste2: totalTechWaste2,
        usefulRem2: totalUsefulRem2,
        averageKim3: averageKim3,
        techWaste3: totalTechWaste3,
        usefulRem3: totalUsefulRem3,
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
      const query = stockSearchQuery.toLowerCase();
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
      if (stockStatusFilter === "OK") {
        matchesStatus = item.allocatedStock > 0;
      } else if (stockStatusFilter === "DEFICIT") {
        matchesStatus = item.remainingToProcess > item.allocatedStock;
      } else if (stockStatusFilter === "NOT_PROVIDED") {
        matchesStatus = item.allocatedStock === 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [matchedDemand, stockSearchQuery, stockStatusFilter]);

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

  const handleCopyForSheets = async () => {
    let container = tableContainerRef.current;
    if (
      activeTab === "supply" &&
      supplySection === "calc" &&
      supplyTableRef.current
    ) {
      container = supplyTableRef.current;
    }
    if (!container) return;

    const table = container.querySelector("table");
    if (!table) return;

    const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
      const cells = (tr as HTMLElement).querySelectorAll("td");
      return Array.from(cells)
        .map((td) => (td as HTMLElement).innerText.trim())
        .join("\t");
    });

    const header = table.querySelector("thead");
    const headerRow = Array.from(header?.querySelectorAll("th") || [])
      .map((th) => (th as HTMLElement).innerText.trim())
      .join("\t");

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

  // Removed aggressive sync useEffects which overwrote user input

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

  const handleSave = async () => {
    if (Object.keys(validationErrors).length > 0) {
      console.warn("Validation errors preventing save:", validationErrors);
      setSaveError("Пожалуйста, исправьте ошибки валидации перед сохранением. " + Object.keys(validationErrors).join(", "));
      setTimeout(() => setSaveError(""), 8000);
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

  const formatDate = (input: any) => {
    if (!input) return "";
    const date = new Date(input);
    if (isNaN(date.getTime())) return String(input);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
          <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center min-h-[400px] rounded-3xl transition-all duration-500">
            <Card className="flex flex-col items-center gap-8 p-12 max-w-sm w-full animate-in zoom-in-95 duration-300">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-500 animate-bounce" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Обработка данных
                </h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {isProcessing
                    ? "Анализируем планы и заявки..."
                    : isProcessingStock
                      ? "Обрабатываем складские остатки..."
                      : "Загружаем реестры..."}
                </p>
              </div>
            </Card>
          </div>
        )}

        <motion.div
          key="files"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
              Файлы данных
            </h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest opacity-70">
              {hideExtraBlocks
                ? "Расчет потребности в сырье."
                : "Расчет потребности, складских запасов и входящих поставок."}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {uploadWarnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-6 rounded-[24px] shadow-sm animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center text-amber-600">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-amber-900 dark:text-amber-400 uppercase tracking-tight">
                    Конфликты распознавания
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  {uploadWarnings.map((warn, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-500/80 uppercase">
                      <span className="mt-1 text-amber-400 lowercase italic select-none">#</span>
                      {warn}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Main Plans Upload */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {activeTab === "supply" ? "Заявка на обеспечение" : "Планы производства"}
                  </h3>
                </div>
                {planFiles.length > 0 && (
                  <Badge variant="outline" className="font-black">{planFiles.length} файла(ов)</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className={`${planFiles.length > 0 ? "lg:col-span-5 xl:col-span-4" : "lg:col-span-8 xl:col-span-6"} relative group`}>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) {
                        const event = { target: { files } } as unknown as ChangeEvent<HTMLInputElement>;
                        handleFileUpload(event);
                      }
                    }}
                    className={`relative bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed ${planFiles.length === 0 ? "border-blue-400 dark:border-blue-500 animate-pulse-border shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "border-slate-200 dark:border-slate-800"} p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-all min-h-[140px]`}
                  >
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" multiple accept=".pdf,.xlsx,.csv,.txt,.docx" />
                    <div className="relative w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-6 h-6" />
                      {planFiles.length === 0 && (
                        <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">
                        Загрузить план
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                        Перетащите файлы 1С или кликните
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setIsBatchManualOpen(true); }}
                      className="mt-2 text-[10px] uppercase font-black tracking-widest text-slate-400"
                      leftIcon={<BookOpen className="w-4 h-4" />}
                    >
                      Как загружать?
                    </Button>
                  </motion.div>
                </div>

                {planFiles.length > 0 && (
                  <div className="lg:col-span-7 xl:col-span-8 h-full">
                    <Card isPadded={false} className="h-full border-slate-200/60 transition-all hover:shadow-md">
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[230px] overflow-auto custom-scrollbar">
                        {planFiles.map((file) => (
                          <div key={file.id} className="p-5 flex items-center justify-between group/item hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 transition-colors">
                                <FileText className="w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">{file.name}</h4>
                                <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                  <span>{file.size}</span>
                                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                  <span>{file.date}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-10 w-10 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
                              leftIcon={<X className="w-5 h-5" />}
                            />
                          </div>
                        ))}
                      </div>
                      {calculationResults.length > 0 && !isProcessing && (
                        <div className="p-4 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            variant="primary"
                            className="w-full font-black uppercase tracking-widest text-[11px] h-12 shadow-[0_8px_16px_rgba(59,130,246,0.15)]"
                            onClick={() => {
                              if (activeTab === "supply") setSupplySection("calc");
                              else setProductionSection("calc");
                            }}
                            leftIcon={<Activity className="w-4 h-4 animate-pulse" />}
                          >
                            Анализировать расчеты
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                )}
              </div>
            </div>

            {/* Sections: Stock & Supply Registry */}
            {!hideExtraBlocks && (
              <div className="flex flex-col gap-12">
                {/* Stock Inventory */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
                        <Layers className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Наличие на складе (г/к прокат)
                      </h3>
                    </div>
                    {stockFiles.length > 0 && (
                      <Badge variant="outline" className="font-black border-emerald-200 text-emerald-600 dark:text-emerald-400">{stockFiles.length} файла(ов)</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className={`${stockFiles.length > 0 ? "lg:col-span-5 xl:col-span-4" : "lg:col-span-8 xl:col-span-6"} relative group`}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => stockFileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            const event = { target: { files } } as unknown as ChangeEvent<HTMLInputElement>;
                            handleStockFileUpload(event);
                          }
                        }}
                        className={`relative bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed ${stockFiles.length === 0 ? "border-emerald-400 dark:border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-slate-200 dark:border-slate-800"} p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-emerald-500 transition-all min-h-[140px]`}
                      >
                        <input type="file" ref={stockFileInputRef} onChange={handleStockFileUpload} className="hidden" multiple accept=".pdf,.xlsx,.csv,.txt,.docx" />
                        <div className="relative w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                          <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                            Складской реестр
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                            Загрузите актуальные остатки
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); setIsStockManualOpen(true); }}
                          className="mt-2 text-[10px] uppercase font-black tracking-widest text-emerald-600/70"
                          leftIcon={<BookOpen className="w-4 h-4" />}
                        >
                          Как подготовить файл?
                        </Button>
                      </motion.div>
                    </div>

                    {stockFiles.length > 0 && (
                      <div className="lg:col-span-7 xl:col-span-8 h-full">
                        <Card isPadded={false} className="h-full border-slate-200/60 transition-all hover:shadow-md">
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[230px] overflow-auto custom-scrollbar">
                            {stockFiles.map((file) => (
                              <div key={file.id} className="p-5 flex items-center justify-between group/item hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover/item:text-emerald-600 transition-colors">
                                    <Layers className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">{file.name}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                      <span>{file.size}</span>
                                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                      <span>{file.date}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeStockFile(file.id)}
                                  className="h-10 w-10 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
                                  leftIcon={<X className="w-5 h-5" />}
                                />
                              </div>
                            ))}
                          </div>
                          {processedStock.length > 0 && !isProcessingStock && (
                            <div className="p-4 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-slate-800">
                              <Button
                                variant="secondary"
                                className="w-full font-black uppercase tracking-widest text-[11px] h-12 border-emerald-200/50 text-emerald-600"
                                onClick={() => {
                                  if (activeTab === "supply") setSupplySection("stock");
                                  else setProductionSection("stock");
                                }}
                                leftIcon={<Layers className="w-4 h-4" />}
                              >
                                Показать наличие
                              </Button>
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </div>
                </div>

                {/* Supply Plan Registry */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-50 dark:bg-sky-900/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800/50">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Будущие поставки сырья
                      </h3>
                    </div>
                    {supplyPlanFiles.length > 0 && (
                      <Badge variant="outline" className="font-black border-sky-200 text-sky-600 dark:text-sky-400">{supplyPlanFiles.length} файла(ов)</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className={`${supplyPlanFiles.length > 0 ? "lg:col-span-5 xl:col-span-4" : "lg:col-span-8 xl:col-span-6"} relative group`}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => supplyPlanFileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => {
                          e.preventDefault(); e.stopPropagation();
                          const files = e.dataTransfer.files;
                          if (files && files.length > 0) {
                            const event = { target: { files } } as unknown as ChangeEvent<HTMLInputElement>;
                            handleSupplyPlanFileUpload(event);
                          }
                        }}
                        className={`relative bg-white dark:bg-[#1A1C19] rounded-[24px] border-2 border-dashed ${supplyPlanFiles.length === 0 ? "border-sky-400 dark:border-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.1)]" : "border-slate-200 dark:border-slate-800"} p-5 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-sky-500 transition-all min-h-[140px]`}
                      >
                        <input type="file" ref={supplyPlanFileInputRef} onChange={handleSupplyPlanFileUpload} className="hidden" multiple accept=".pdf,.xlsx,.csv,.txt,.docx" />
                        <div className="relative w-14 h-14 bg-sky-50 dark:bg-sky-900/20 rounded-2xl flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform duration-300">
                          <ShoppingCart className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                            Реестр поставок
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed max-w-[200px]">
                            График ожидаемых поступлений
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {supplyPlanFiles.length > 0 && (
                      <div className="lg:col-span-7 xl:col-span-8 h-full">
                        <Card isPadded={false} className="h-full border-slate-200/60 transition-all hover:shadow-md">
                          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[230px] overflow-auto custom-scrollbar">
                            {supplyPlanFiles.map((file) => (
                              <div key={file.id} className="p-5 flex items-center justify-between group/item hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/10 rounded-2xl flex items-center justify-center text-sky-400 group-hover/item:text-sky-600 transition-colors">
                                    <ShoppingCart className="w-6 h-6" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">{file.name}</h4>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                      <span>{file.size}</span>
                                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                      <span>{file.date}</span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeSupplyPlanFile(file.id)}
                                  className="h-10 w-10 p-0 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl"
                                  leftIcon={<X className="w-5 h-5" />}
                                />
                              </div>
                            ))}
                          </div>
                          {processedSupplyPlans.length > 0 && !isProcessingSupplyPlans && (
                            <div className="p-4 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-slate-800">
                              <Button
                                variant="secondary"
                                className="w-full font-black uppercase tracking-widest text-[11px] h-12 border-sky-200/50 text-sky-600"
                                onClick={() => {
                                  if (activeTab === "supply") setSupplySection("supply-plans");
                                }}
                                leftIcon={<ShoppingCart className="w-4 h-4" />}
                              >
                                Показать поставки
                              </Button>
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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
              stockSearchQuery={stockSearchQuery}
              setStockSearchQuery={setStockSearchQuery}
              stockStatusFilter={stockStatusFilter}
              setStockStatusFilter={setStockStatusFilter}
              supplySearchQuery={supplySearchQuery}
              setSupplySearchQuery={setSupplySearchQuery}
              supplyStatusFilter={supplyStatusFilter}
              setSupplyStatusFilter={setSupplyStatusFilter}
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
            />
          )}
          {activeTab === "economy" && (
            <AdminPanelEconomyTab
              activeTab={activeTab}
              handleSave={handleSave}
              saved={saved}
              allGrades={allGrades}
              saveError={saveError}
              adminSection={adminSection}
              setAdminSection={setAdminSection}
              formatDate={formatDate}
            />
          )}
          {activeTab === "production" && (
            <AdminPanelProductionTab
              activeTab={activeTab}
              formatCurrency={formatCurrency}
              planFiles={planFiles}
              stockFiles={stockFiles}
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
              isDragging={isDragging}
              isSummaryDragging={isSummaryDragging}
              isSupplyDragging={isSupplyDragging}
              isStockDragging={isStockDragging}
              isFreeStockDragging={isFreeStockDragging}
              stockTotals={stockTotals}
              freeStock={freeStock}
            />
          )}
          {activeTab === "logistics" && (
            <AdminPanelLogisticsTab activeTab={activeTab} />
          )}
          {activeTab === "help" && (
            <AdminPanelHelpTab 
              activeTab={activeTab} 
              isDeveloperMode={isDeveloperMode} 
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
