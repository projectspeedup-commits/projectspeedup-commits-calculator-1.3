import {
  DEFAULT_STEEL_GRADES,
  formatCurrency,
  formatInputValue,
  getGostForGrade,
  getLengthLabel,
  getProfileGost,
  handleNumericInput,
  HEX_DATA,
  ROUND_DATA,
  TECH_COEFS_ROUND,
  EconomyItem,
  DEFAULT_ECONOMY_ITEMS,
} from "../lib/constants";
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Calculator,
  Check,
  Circle,
  Copy,
  Hexagon,
  History,
  Info,
  Key,
  LogOut,
  Moon,
  Package,
  Printer,
  RotateCcw,
  Ruler,
  Save,
  Scale,
  Sun,
  Trash2,
  Wallet,
  TrendingUp,
  BarChart3,
  PieChart,
  Plus,
  Minus,
  BookOpen,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useEffect, useMemo, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { subscribeToUserHistory, saveCalculationToCloud, deleteCalculationFromCloud, clearUserHistoryFromCloud } from '../services/db/calcHistoryService';
import { backendService } from '../services/api/backendService';
import { useAppConfig } from '../hooks/useAppConfig';
import { PrintTemplate } from "./PrintTemplate";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType, validateNumeric, validateDimensions } from "../lib/utils";

import { ConfirmModal } from "./ConfirmModal";
import { UserManualModal } from "./UserManualModal";
import { CalculatorEconomy } from "./calculator/CalculatorEconomy";
import { CalculatorCutAndRemnants } from "./calculator/CalculatorCutAndRemnants";
import { CalculatorInputs } from "./calculator/CalculatorInputs";
import { HistoryPanel } from "./calculator/HistoryPanel";

interface CalculatorAppProps {
  adminRawPrices: Record<string, { md: string; nd: string }>;
  adminScrapPrice: string;
  adminRemnantPrice: string;
  customGrades: string[];
  deletedGrades?: string[];
  remnantPricing: Record<string, { round: string; hex: string }>;
  economyItems?: EconomyItem[];
  onLogout: () => void;
  isCloudActive: boolean;
  user: any;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onAdminSwitch: () => void;
  onPrintDataUpdate: (data: any) => void;
  config?: { usePostgres: boolean; isProduction: boolean } | null;
}

export function CalculatorApp({
  adminRawPrices,
  adminScrapPrice,
  adminRemnantPrice,
  customGrades,
  deletedGrades = [],
  remnantPricing,
  economyItems = DEFAULT_ECONOMY_ITEMS,
  onLogout,
  isCloudActive,
  user,
  isDarkMode,
  toggleTheme,
  onAdminSwitch,
  onPrintDataUpdate,
  config,
}: CalculatorAppProps) {
  const [profileType, setProfileType] = useState<"round" | "hex">("round");
  const [steelGrade, setSteelGrade] = useState("");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [selectedRaw, setSelectedRaw] = useState("");
  const [orderWeight, setOrderWeight] = useState("");

  const [lengthInput, setLengthInput] = useState({
    value: "6000",
    source: "raw",
  });
  const [orderedLength, setOrderedLength] = useState("6000");

  const [frontCoef, setFrontCoef] = useState("1.027");
  const [backCoef, setBackCoef] = useState("1.003");

  const [sellPrice, setSellPrice] = useState("");

  const [dimensions, setDimensions] = useState({ value: "", source: "target" });
  const [rawPrice, setRawPrice] = useState("");
  const [manualRawPrice, setManualRawPrice] = useState("");
  const [cutLength, setCutLength] = useState("");
  const [cutThickness, setCutThickness] = useState("");
  const [remnantLengthManual, setRemnantLengthManual] = useState("");
  const [remnantType, setRemnantType] = useState("6000");
  const [isRemnantModeAuto, setIsRemnantModeAuto] = useState(true);

  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const suggestedValues = useMemo(() => {
    return ["6000", "9000", "11700", "12000"];
  }, []);

  const handleCutLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleNumericInput(e, setCutLength);
  };

  const handleCutThicknessChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleNumericInput(e, setCutThickness);
  };

  const handleBilletLengthInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleNumericInput(e, (val) => setLengthInput({ value: val, source: "raw" }));
  };

  useEffect(() => {
    if (config?.usePostgres && user) {
      const loadPostgresHistory = async () => {
        try {
          const calcs = await backendService.getCalculations(user.uid);
          setSavedCalculations(calcs);
        } catch (err) {
          console.error("PostgreSQL history load failed", err);
        }
      };
      loadPostgresHistory();
    }
  }, [config, user]);

  useEffect(() => {
    const errors: Record<string, string> = {};

    // Validate Steel Grade
    if (!steelGrade) {
      errors.steelGrade = "Выберите марку стали";
    }

    // Validate Weights
    const weightVal = validateNumeric(orderWeight, { min: 0.001, fieldName: "Объем заказа" });
    if (!weightVal.isValid && orderWeight) errors.orderWeight = weightVal.message!;

    // Validate Dimensions
    if (selectedTarget && selectedRaw) {
      const dimVal = validateDimensions(selectedTarget, selectedRaw);
      if (!dimVal.isValid) errors.dimensions = dimVal.message!;
    }

    // Validate Lengths
    if (lengthInput.value) {
      const rawLenVal = validateNumeric(lengthInput.value, { min: 1000, max: 9000, fieldName: "Длина заготовки" });
      if (!rawLenVal.isValid) errors.rawLength = rawLenVal.message!;
    }

    if (orderedLength && orderedLength !== "НД" && !orderedLength.includes("НД")) {
      const orderLenVal = validateNumeric(orderedLength.replace(/[^\d]/g, ""), { 
        min: 200, 
        max: 8500, 
        fieldName: "Длина заказа" 
      });
      if (!orderLenVal.isValid) errors.orderedLength = orderLenVal.message!;
    }

    // Validate Sell Price
    if (sellPrice) {
      const priceVal = validateNumeric(sellPrice, { min: 1, fieldName: "Цена продажи" });
      if (!priceVal.isValid) errors.sellPrice = priceVal.message!;
    }

    setValidationErrors(errors);
  }, [steelGrade, selectedTarget, selectedRaw, orderWeight, lengthInput.value, orderedLength, sellPrice]);

  const [showManual, setShowManual] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isEconomyExpanded, setIsEconomyExpanded] = useState(false);

  const activeData = profileType === "round" ? ROUND_DATA : HEX_DATA;
  const allGrades = useMemo(() => {
    return [...DEFAULT_STEEL_GRADES, ...(customGrades || [])].filter(
      (g) => !deletedGrades.includes(g),
    );
  }, [customGrades, deletedGrades]);

  const currentAdminRawPrice = useMemo(() => {
    if (!steelGrade || !adminRawPrices) return "";
    const prices = adminRawPrices[steelGrade];
    if (!prices) return "";

    // Auto-select MD or ND based on ordered length
    const label = getLengthLabel(orderedLength);
    const isMD = label.startsWith("МД");
    return isMD ? prices.md : prices.nd;
  }, [steelGrade, adminRawPrices, orderedLength]);

  const currentRemnantPricingRule = useMemo(() => {
    if (!steelGrade) return "remnant";
    return remnantPricing &&
      remnantPricing[steelGrade] &&
      remnantPricing[steelGrade][profileType]
      ? remnantPricing[steelGrade][profileType]
      : "remnant";
  }, [steelGrade, profileType, remnantPricing]);

  const effectiveRemnantPrice = useMemo(() => {
    return currentRemnantPricingRule === "scrap"
      ? adminScrapPrice
      : adminRemnantPrice;
  }, [currentRemnantPricingRule, adminScrapPrice, adminRemnantPrice]);

  const targetOptions = useMemo(() => {
    const targets = activeData.map((item) => item.target);
    return [...new Set(targets)].sort((a, b) => a - b);
  }, [activeData]);

  const rawOptions = useMemo(() => {
    if (!selectedTarget) return [];
    const targetVal = Number(selectedTarget);
    return activeData
      .filter((item) => {
        if (item.target !== targetVal) return false;
        // Business logic: if target >= 50.5, raw material should be no more than 3mm above target
        if (
          profileType === "round" &&
          targetVal >= 50.5 &&
          item.raw > targetVal + 3
        ) {
          return false;
        }
        return true;
      })
      .map((item) => item.raw)
      .sort((a, b) => a - b);
  }, [selectedTarget, activeData, profileType]);

  const currentCoefficient = useMemo(() => {
    if (!selectedTarget || !selectedRaw) return null;
    const targetVar = Number(selectedTarget);
    const rawVar = Number(selectedRaw);

    // Try to find exact match in data tables first (preserves proprietary/manual coefficients)
    const match = activeData.find(
      (item) => item.target === targetVar && item.raw === rawVar,
    );
    if (match) return match.coef;

    // Physical rule fallback: Area ratio
    // For Rounds it's (D_raw/D_target)^2
    // For Hex it depends if it's Round-to-Hex or Hex-to-Hex.
    // Based on HEX_DATA coefs (mostly ~1.22), it seems to be a specific technical rule.
    // But since we restored the table lookup, the standard cases are covered.
    return Math.pow(rawVar, 2) / Math.pow(targetVar, 2);
  }, [selectedTarget, selectedRaw, activeData]);

  useEffect(() => {
    if (selectedTarget && selectedRaw) {
      if (profileType === "round") {
        const target = Number(selectedTarget);
        const key = `${selectedTarget}_${selectedRaw}`;

        if (TECH_COEFS_ROUND[key]) {
          setFrontCoef(TECH_COEFS_ROUND[key][0].toString());
          setBackCoef(TECH_COEFS_ROUND[key][1].toString());
        } else if (target > 50) {
          let fCoef = 1.032;
          if (target > 50 && target <= 54) fCoef = 1.033;
          else if (target > 54 && target <= 58) fCoef = 1.034;
          else if (target > 58) fCoef = 1.035;

          setFrontCoef(fCoef.toFixed(3));
          setBackCoef("1.003");
        } else {
          setFrontCoef("1.027");
          setBackCoef("1.003");
        }
      } else {
        setFrontCoef("1.030");
        setBackCoef("1.003");
      }
    }
  }, [selectedTarget, selectedRaw, profileType]);

  useEffect(() => {
    setSelectedTarget("");
    setSelectedRaw("");
  }, [profileType]);

  useEffect(() => {
    if (rawOptions.length > 0) {
      const targetVal = Number(selectedTarget);
      // Try to find the exact "standard" billet for this target in activeData
      const standardMatch = activeData.find(
        (item) => item.target === targetVal,
      );

      if (standardMatch && rawOptions.includes(standardMatch.raw)) {
        setSelectedRaw(standardMatch.raw.toString());
      } else if (!selectedRaw || !rawOptions.includes(Number(selectedRaw))) {
        // Fallback: select the first option if nothing is selected or current selection is invalid
        setSelectedRaw(rawOptions[0].toString());
      }
    } else {
      setSelectedRaw("");
    }
  }, [selectedTarget, rawOptions, activeData]);

  const currentDrawCoef = useMemo(() => {
    return currentCoefficient;
  }, [currentCoefficient]);

  const displayedRawLength =
    lengthInput.source === "raw"
      ? lengthInput.value
      : lengthInput.value && currentDrawCoef
        ? (Number(lengthInput.value) / currentDrawCoef).toFixed(1)
        : "";

  const displayedTargetLength =
    lengthInput.source === "target"
      ? lengthInput.value
      : lengthInput.value && currentDrawCoef
        ? (Number(lengthInput.value) * currentDrawCoef).toFixed(1)
        : "";

  const totalTechCoef = useMemo(() => {
    const f = Number(frontCoef) || 1;
    const b = Number(backCoef) || 1;
    return f * b;
  }, [frontCoef, backCoef]);

  const lengthAfterTechEnds = useMemo(() => {
    const draw = Number(displayedTargetLength);
    if (!isNaN(draw) && draw > 0 && totalTechCoef > 0) {
      return (draw / totalTechCoef).toFixed(1);
    }
    return "";
  }, [displayedTargetLength, totalTechCoef]);

  const techEndsMm = useMemo(() => {
    const draw = Number(displayedTargetLength);
    const after = Number(lengthAfterTechEnds);
    if (!isNaN(draw) && !isNaN(after) && draw > after) {
      return (draw - after).toFixed(1);
    }
    return "";
  }, [displayedTargetLength, lengthAfterTechEnds]);

  const piecesPerBar = useMemo(() => {
    if (lengthAfterTechEnds && orderedLength) {
      const usable = Number(lengthAfterTechEnds);
      const order = Number(orderedLength);
      return order > 0 && usable >= order ? Math.floor(usable / order) : 0;
    }
    return 0;
  }, [lengthAfterTechEnds, orderedLength]);

  const remnantLength = useMemo(() => {
    if (lengthAfterTechEnds && orderedLength) {
      const usable = Number(lengthAfterTechEnds);
      const order = Number(orderedLength);
      if (isNaN(usable) || isNaN(order)) return "";
      if (order > usable) return (usable - order).toFixed(1);
      return (usable - order * piecesPerBar).toFixed(1);
    }
    return "";
  }, [lengthAfterTechEnds, orderedLength, piecesPerBar]);

  const optimalLengths = useMemo(() => {
    if (!lengthAfterTechEnds) return [];
    const target = Number(lengthAfterTechEnds);
    if (isNaN(target) || target <= 0) return [];

    const options = [];
    for (let i = 1; i <= 20; i++) {
      const optLen = Math.floor(target / i) - 5;
      if (optLen >= 2500 && optLen <= 6500) {
        options.push({ pieces: i, length: optLen });
      }
    }

    const currentOrder = Number(orderedLength);
    if (!isNaN(currentOrder) && currentOrder > 0) {
      options.sort(
        (a, b) =>
          Math.abs(a.length - currentOrder) - Math.abs(b.length - currentOrder),
      );
    }

    return options.slice(0, 4);
  }, [lengthAfterTechEnds, orderedLength]);

  const optimalBilletLengths = useMemo(() => {
    if (!orderedLength || !currentDrawCoef || !totalTechCoef) return [];

    let isND =
      orderedLength.toUpperCase().includes("НД") ||
      orderedLength.toUpperCase().includes("Н/Д");
    const targetPiece = Number(orderedLength);

    if (!isND && (isNaN(targetPiece) || targetPiece <= 0)) return [];

    const draw = currentDrawCoef;
    const tech = totalTechCoef;
    const options = [];
    const maxBillet = Math.floor(8400 / draw);
    const maxAllowedBillet = Math.min(6000, maxBillet);

    if (isND) {
      for (let b = 4000; b <= maxAllowedBillet; b += 100) {
        const estUseful = (b * draw) / tech;
        let bestScrapForB = 999999;
        let bestN = 0;
        for (let i = 1; i <= 20; i++) {
          const optLen = Math.floor(estUseful / i) - 5;
          if (optLen >= 3000 && optLen <= 6000) {
            const scrap = estUseful - i * optLen;
            if (scrap >= 0 && scrap < bestScrapForB) {
              bestScrapForB = scrap;
              bestN = i;
            }
          }
        }
        if (bestN > 0) {
          options.push({ n: bestN, billetLength: b, scrap: bestScrapForB });
        }
      }
    } else {
      // Пробуем разное количество деталей (n), чтобы найти подходящие длины заготовок
      for (let n = 1; n <= 60; n++) {
        const idealBillet = (n * targetPiece * tech) / draw;
        // Округляем вверх до ближайших 100 мм (согласно запросу)
        const roundedBillet = Math.ceil(idealBillet / 100) * 100;

        if (roundedBillet >= 4000 && roundedBillet <= maxAllowedBillet) {
          const estUseful = (roundedBillet * draw) / tech;
          const scrap = estUseful - n * targetPiece;
          // Добавляем только если остаток положительный (поместится)
          if (scrap >= 0) {
            options.push({ n, billetLength: roundedBillet, scrap });
          }
        }
      }
    }
    // Сортируем по минимальному остатку и берем топ-3 уникальных длин
    const uniqueOptions = Array.from(
      new Map(options.map((item) => [item.billetLength, item])).values(),
    );
    return uniqueOptions.sort((a, b) => a.scrap - b.scrap).slice(0, 3);
  }, [orderedLength, currentDrawCoef, totalTechCoef]);

  const requiredWeight = useMemo(() => {
    if (!orderWeight) return null;
    const baseWeight = Number(orderWeight);
    if (isNaN(baseWeight) || baseWeight <= 0) return null;

    // Use the KIM-based rule: Total Weight = Order Weight / KIM
    // KIM = usefulLength / drawLength
    if (
      piecesPerBar > 0 &&
      orderedLength &&
      Number(orderedLength) > 0 &&
      displayedTargetLength
    ) {
      const usefulLength = Number(orderedLength) * piecesPerBar;
      const drawLength = Number(displayedTargetLength);

      if (drawLength > 0) {
        const kim = usefulLength / drawLength;
        const val = baseWeight / (kim > 0 ? kim : 1);
        return isNaN(val) ? baseWeight.toFixed(3) : val.toFixed(3);
      }
    }

    // If drawing dimensions are not fully set, we cannot calculate
    // the required weight accurately. Don't default to 1:1.
    if (!displayedTargetLength || piecesPerBar === 0) return null;

    return baseWeight.toFixed(3);
  }, [orderWeight, piecesPerBar, orderedLength, displayedTargetLength]);

  const consumptionCoefficient = useMemo(() => {
    if (requiredWeight && orderWeight && Number(orderWeight) > 0) {
      return Number(requiredWeight) / Number(orderWeight);
    }
    return currentCoefficient || null;
  }, [requiredWeight, orderWeight, currentCoefficient]);

  const orderedBarWeight = useMemo(() => {
    if (!orderedLength || Number(orderedLength) <= 0 || !selectedTarget)
      return null;
    const lengthMm = Number(orderedLength);
    const sizeMm = Number(selectedTarget);
    const area =
      profileType === "round"
        ? (Math.PI * Math.pow(sizeMm, 2)) / 4
        : (Math.sqrt(3) / 2) * Math.pow(sizeMm, 2);
    const weightKg = area * lengthMm * 0.00000785;
    return { tons: (weightKg / 1000).toFixed(5), kg: weightKg.toFixed(2) };
  }, [orderedLength, selectedTarget, profileType]);

  const piecesPerTon = useMemo(() => {
    if (!orderedBarWeight || Number(orderedBarWeight.kg) === 0) return 0;
    return Math.floor(1000 / Number(orderedBarWeight.kg));
  }, [orderedBarWeight]);

  const totalPiecesInOrder = useMemo(() => {
    if (!orderWeight || !orderedBarWeight || Number(orderedBarWeight.kg) === 0)
      return 0;
    return Math.floor(
      (Number(orderWeight) * 1000) / Number(orderedBarWeight.kg),
    );
  }, [orderWeight, orderedBarWeight]);

  const remnantWeight = useMemo(() => {
    if (!remnantLength || Number(remnantLength) <= 0 || !selectedTarget)
      return null;
    const lengthMm = Number(remnantLength);
    const sizeMm = Number(selectedTarget);
    const area =
      profileType === "round"
        ? (Math.PI * Math.pow(sizeMm, 2)) / 4
        : (Math.sqrt(3) / 2) * Math.pow(sizeMm, 2);
    const weightKg = area * lengthMm * 0.00000785;
    return { tons: (weightKg / 1000).toFixed(5), kg: weightKg.toFixed(2) };
  }, [remnantLength, selectedTarget, profileType]);

  const remnantValue = useMemo(() => {
    if (!remnantWeight || !effectiveRemnantPrice) return null;
    const val = Number(remnantWeight.tons) * Number(effectiveRemnantPrice);
    return isNaN(val) ? null : val.toFixed(2);
  }, [remnantWeight, effectiveRemnantPrice]);

  const advancedRemnantStats = useMemo(() => {
    const hasRemnant =
      remnantLength &&
      Number(remnantLength) > 0 &&
      orderedLength &&
      Number(orderedLength) > 0 &&
      piecesPerBar > 0;
    const hasTechScrap = techEndsMm && Number(techEndsMm) > 0;

    if (!hasRemnant && !hasTechScrap) return null;

    const productMm =
      orderedLength && piecesPerBar > 0
        ? Number(orderedLength) * piecesPerBar
        : 0;
    if (productMm === 0) return null;

    const rawRemMm = hasRemnant ? Number(remnantLength) : 0;
    const rawTechMm = hasTechScrap ? Number(techEndsMm) : 0;

    const rawRemRatio = rawRemMm / productMm;
    const rawTechRatio = rawTechMm / productMm;
    const totalRatio = rawRemRatio + rawTechRatio;

    const remRatio = rawRemRatio;
    const techRatio = rawTechRatio;

    const kgPerTon = totalRatio * 1000;
    const tonsPerTon = totalRatio;
    const valuePerTon = currentAdminRawPrice
      ? totalRatio * Number(currentAdminRawPrice)
      : 0;

    const techValuePerTon = currentAdminRawPrice
      ? techRatio * Number(currentAdminRawPrice)
      : 0;
    const remValuePerTon = currentAdminRawPrice
      ? remRatio * Number(currentAdminRawPrice)
      : 0;

    const remnantRevenuePerTon = remRatio * Number(effectiveRemnantPrice || 0);
    const techScrapRevenuePerTon = techRatio * Number(adminScrapPrice || 0);
    const revenuePerTon = remnantRevenuePerTon + techScrapRevenuePerTon;

    let orderScrapTons = 0,
      orderScrapValue = null,
      orderRevenue = 0;
    let orderTechTons = 0,
      orderRemTons = 0;
    let orderTechValue = null,
      orderRemValue = null;
    let orderTechRevenue = 0,
      orderRemRevenue = 0;

    if (orderWeight && Number(orderWeight) > 0) {
      const w = Number(orderWeight);
      orderScrapTons = totalRatio * w;
      orderTechTons = techRatio * w;
      orderRemTons = remRatio * w;

      if (currentAdminRawPrice) {
        orderScrapValue = orderScrapTons * Number(currentAdminRawPrice);
        orderTechValue = orderTechTons * Number(currentAdminRawPrice);
        orderRemValue = orderRemTons * Number(currentAdminRawPrice);
      }

      orderTechRevenue = techScrapRevenuePerTon * w;
      orderRemRevenue = remnantRevenuePerTon * w;
      orderRevenue = revenuePerTon * w;
    }

    return {
      kgPerTon: kgPerTon.toFixed(1),
      tonsPerTon: tonsPerTon.toFixed(3),
      techTonsPerTon: techRatio,
      remTonsPerTon: remRatio,
      valuePerTon: valuePerTon !== null ? valuePerTon.toFixed(2) : null,
      techValuePerTon,
      remValuePerTon,
      revenuePerTon,
      techScrapRevenuePerTon,
      remnantRevenuePerTon,

      orderScrapTons: orderScrapTons.toFixed(3),
      orderTechTons,
      orderRemTons,
      orderScrapValue:
        orderScrapValue !== null ? orderScrapValue.toFixed(2) : null,
      orderTechValue,
      orderRemValue,
      orderRevenue,
      orderTechRevenue,
      orderRemRevenue,
    };
  }, [
    remnantLength,
    orderedLength,
    currentAdminRawPrice,
    adminScrapPrice,
    effectiveRemnantPrice,
    orderWeight,
    piecesPerBar,
    techEndsMm,
  ]);

  const commercialStats = useMemo(() => {
    if (!sellPrice || !currentAdminRawPrice || !orderWeight) return null;
    const sPrice = Number(sellPrice);
    const rPrice = Number(currentAdminRawPrice);
    const weight = Number(orderWeight);
    if (isNaN(sPrice) || isNaN(rPrice) || isNaN(weight)) return null;

    // Calculate detailed economy costs from economyItems
    const economyData = economyItems.map((item) => {
      let costPerTon = 0;
      if (item.type === "variable") {
        // Now treating "norm" field as the absolute cost per ton for direct costs
        costPerTon = Number(item.norm) || 0;
      } else {
        // Fixed costs distributed over the order weight (simplified logic)
        // In a real scenario, fixed costs are distributed over monthly volume, but here we can show it per order total
        costPerTon =
          ((Number(item.quantity) || 0) * (Number(item.price) || 0)) / weight;
      }
      return { ...item, costPerTon };
    });

    const directEconomyCostsPerTon = economyData
      .filter((i) => i.category === "direct")
      .reduce((acc, curr) => acc + curr.costPerTon, 0);
    const overheadEconomyCostsPerTon = economyData
      .filter((i) => i.category === "overhead")
      .reduce((acc, curr) => acc + curr.costPerTon, 0);

    const totalProcessingCostsPerTon =
      directEconomyCostsPerTon + overheadEconomyCostsPerTon;

    const lossesPerTon =
      advancedRemnantStats && advancedRemnantStats.valuePerTon
        ? Number(advancedRemnantStats.valuePerTon)
        : 0;
    const scrapRevenuePerTon =
      advancedRemnantStats && advancedRemnantStats.revenuePerTon
        ? Number(advancedRemnantStats.revenuePerTon)
        : 0;

    const netLossesPerTon = lossesPerTon - scrapRevenuePerTon;

    // Total variable costs = raw material + direct processing + net losses
    // Margin calculated after all costs (direct + overheads)
    const totalCostsPerTon =
      rPrice + totalProcessingCostsPerTon + netLossesPerTon;
    const profitPerTon = sPrice - totalCostsPerTon;
    const profitTotal = profitPerTon * weight;

    const marginPercent = sPrice > 0 ? (profitPerTon / sPrice) * 100 : 0;

    return {
      lossesPerTon,
      scrapRevenuePerTon,
      netLossesPerTon,
      directEconomyCostsPerTon,
      overheadEconomyCostsPerTon,
      totalProcessingCostsPerTon,
      totalCostsPerTon,
      profitPerTon,
      profitTotal,
      marginPercent,
      sellTotal: sPrice * weight,
      sellTotalVat: sPrice * weight * 1.22,
      rawTotal: rPrice * weight,
      lossesTotal: lossesPerTon * weight,
      scrapRevenueTotal: advancedRemnantStats
        ? advancedRemnantStats.orderRevenue
        : 0,
      netLossesTotal: netLossesPerTon * weight,
      economyData,
      isPositive: profitTotal >= 0,
    };
  }, [
    sellPrice,
    currentAdminRawPrice,
    adminScrapPrice,
    effectiveRemnantPrice,
    orderWeight,
    advancedRemnantStats,
    economyItems,
  ]);

  useEffect(() => {
    if (config?.usePostgres && user) {
      backendService.getCalculations(user.uid)
        .then(calcs => {
          setSavedCalculations(calcs);
        })
        .catch(err => {
          console.error("Failed to load calculations from server:", err);
          showNotify("Ошибка загрузки истории с сервера", "error");
        });
      return;
    }

    if (!isCloudActive) {
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem("arsenal_offline_calcs");
          if (raw) {
            const parsed = JSON.parse(raw);
            const loaded = parsed.map((c: any) => ({
              ...c,
              createdAt: { toDate: () => new Date(c._createdAtMs || Date.now()) }
            }));
            setSavedCalculations(loaded);
          }
        } catch (e) {}
      }
      return;
    }

    if ((!isCloudActive && !config?.usePostgres) || (!db && !config?.usePostgres) || !user) return;

    const unsubscribe = subscribeToUserHistory(
      db,
      user.uid,
      (calcs) => setSavedCalculations(calcs),
      (error) => console.error(error),
      config?.usePostgres
    );

    return () => unsubscribe && unsubscribe();
  }, [user, isCloudActive, config]);

  const showNotify = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = async () => {
    // Check for validation errors first
    const errorMessages = Object.values(validationErrors);
    if (errorMessages.length > 0) {
      showNotify(`Исправьте ошибки: ${errorMessages[0]}`, "error");
      return;
    }

    if (!steelGrade || !selectedTarget || !selectedRaw) {
      showNotify("Заполните основные поля расчета перед сохранением.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        userId: user?.uid || "offline",
        profileType,
        steelGrade,
        selectedTarget,
        selectedRaw,
        orderWeight,
        orderedLength,
        lengthInputValue: lengthInput.value,
        lengthInputSource: lengthInput.source,
        frontCoef,
        backCoef,
        usefulLength: lengthAfterTechEnds,
        sellPrice,
        rawPriceUsed: currentAdminRawPrice,
        scrapPriceUsed: adminScrapPrice,
        remnantPriceUsed: effectiveRemnantPrice,
        label: `${getProfileGost(profileType)} ${selectedTarget}мм, ${steelGrade}`,
      };

      if ((isCloudActive && db && user) || (config?.usePostgres && user)) {
        await saveCalculationToCloud(db, payload, config?.usePostgres);
      } else {
        payload.id = Date.now().toString();
        payload.createdAt = { toDate: () => new Date() };
        const newSaved = [payload, ...savedCalculations];
        setSavedCalculations(newSaved);
        if (typeof window !== "undefined") {
          window.localStorage.setItem("arsenal_offline_calcs", JSON.stringify(newSaved.map(c => ({...c, _createdAtMs: Date.now()}))));
        }
      }
      showNotify("Расчет успешно сохранен");
    } catch (err) {
      console.error("Error saving calculation:", err);
      if (isCloudActive) {
        try {
          handleFirestoreError(err, OperationType.CREATE, "calculations");
        } catch (e) {}
      }
      showNotify("Ошибка при сохранении", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCalculation = async (id: string) => {
    if (confirm("Удалить этот расчет?")) {
      try {
        if ((isCloudActive && db) || config?.usePostgres) {
          await deleteCalculationFromCloud(db, id, config?.usePostgres);
          setSavedCalculations(prev => prev.filter(c => c.id !== id));
        } else {
          const newSaved = savedCalculations.filter(c => c.id !== id);
          setSavedCalculations(newSaved);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("arsenal_offline_calcs", JSON.stringify(newSaved.map(c => ({...c, _createdAtMs: c.createdAt?.toDate ? c.createdAt.toDate().getTime() : Date.now()}))));
          }
        }
        showNotify("Расчет удален");
      } catch (err) {
        if (isCloudActive) {
          try {
            handleFirestoreError(err, OperationType.DELETE, `calculations/${id}`);
          } catch(e) {}
        }
        showNotify("Ошибка при удалении", "error");
      }
    }
  };

  const clearAllHistory = async () => {
    if (savedCalculations.length === 0) {
      showNotify("История уже пуста");
      return;
    }

    setShowDeleteConfirm(true);
  };

  const confirmClearAllHistory = async () => {
    setShowDeleteConfirm(false);
    setIsClearing(true);
    try {
      let deletedCount = savedCalculations.length;
      if ((config?.usePostgres && user) || (isCloudActive && db)) {
        deletedCount = await clearUserHistoryFromCloud(db, savedCalculations, config?.usePostgres);
        setSavedCalculations([]);
      } else {
        setSavedCalculations([]);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("arsenal_offline_calcs");
        }
      }

      showNotify(`История успешно очищена (${deletedCount} записей)`);
    } catch (err) {
      console.error("Error clearing history:", err);
      if (isCloudActive) {
        try {
          handleFirestoreError(err, OperationType.DELETE, "calculations (batch)");
        } catch(e) {}
      }
      showNotify(
        "Ошибка при очистке истории: " +
          (err instanceof Error ? err.message : String(err)),
        "error",
      );
    } finally {
      setIsClearing(false);
    }
  };

  const loadCalculation = (calc: any) => {
    // Determine profile type with fallback and case-insensitivity
    const pType = String(calc.profileType || calc.profile_type || "round").toLowerCase();
    setProfileType(pType.includes("hex") || pType.includes("шест") ? "hex" : "round");
    
    setSteelGrade(calc.steelGrade || calc.steel_grade || "");
    setSelectedTarget(calc.selectedTarget || calc.selected_target || "");
    setSelectedRaw(calc.selectedRaw || calc.selected_raw || "");
    setOrderWeight(calc.orderWeight || calc.order_weight || "");
    
    // Fix: don't default order length to 6000 unless it's genuinely missing
    setOrderedLength(calc.orderedLength || calc.ordered_length || "НД");
    setSellPrice(calc.sellPrice || calc.sell_price || "");

    const lVal = calc.lengthInputValue || calc.length_input_value;
    const lSrc = calc.lengthInputSource || calc.length_input_source;
    if (lVal) {
      setLengthInput({
        value: lVal,
        source: lSrc || "raw",
      });
    }
    
    const fCoef = calc.frontCoef || calc.front_coef;
    const bCoef = calc.backCoef || calc.back_coef;
    if (fCoef) setFrontCoef(fCoef);
    if (bCoef) setBackCoef(bCoef);

    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setProfileType("round");
    setFrontCoef("1.027");
    setSteelGrade("");
    setSelectedTarget("");
    setSelectedRaw("");
    setOrderWeight("");
    setLengthInput({ value: "6000", source: "raw" });
    setOrderedLength("НД");
    setSellPrice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrint = () => {
    window.print();
  };

  const reportData = useMemo(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const gost = getGostForGrade(steelGrade);
    const profileGost = getProfileGost(profileType);
    const lengthLabel = getLengthLabel(orderedLength);
    const rawPriceNum = Number(currentAdminRawPrice) || 0;
    const sellPriceNum = Number(sellPrice) || 0;
    const orderWeightNum = Number(orderWeight) || 0;
    const scrapPriceNum = Number(adminScrapPrice) || 0;
    const remnantPriceNum = Number(effectiveRemnantPrice) || 0;

    let formattedGrade = steelGrade;
    if (
      steelGrade &&
      !steelGrade.toLowerCase().startsWith("ст") &&
      !steelGrade.toLowerCase().includes("а12")
    ) {
      formattedGrade = `ст.${steelGrade}`;
    }

    const techTons = advancedRemnantStats?.orderTechTons || 0;
    const remTons = advancedRemnantStats?.orderRemTons || 0;

    return {
      dateStr,
      gost,
      profileTypeStr: profileType === "round" ? "Круг" : "Шестигранник",
      profileGost,
      lengthLabel,
      rawPriceNum,
      sellPriceNum,
      orderWeightNum,
      scrapPriceNum,
      remnantPriceNum,
      formattedGrade,
      sellTotal: sellPriceNum * orderWeightNum,
      displayedRawLength,
      selectedRaw,
      displayedTargetLength,
      currentDrawCoef,
      techEndsMm,
      frontCoef,
      backCoef,
      lengthAfterTechEnds,
      techTons,
      remTons,
      requiredWeight,
      commercialStats,
      advancedRemnantStats,
      orderedLength,
      remnantLength,
    };
  }, [
    steelGrade,
    profileType,
    orderedLength,
    currentAdminRawPrice,
    sellPrice,
    orderWeight,
    adminScrapPrice,
    effectiveRemnantPrice,
    selectedTarget,
    selectedRaw,
    displayedRawLength,
    displayedTargetLength,
    currentDrawCoef,
    techEndsMm,
    frontCoef,
    backCoef,
    lengthAfterTechEnds,
    requiredWeight,
    commercialStats,
    advancedRemnantStats,
    remnantLength,
  ]);

  const reportText = useMemo(() => {
    const {
      dateStr,
      formattedGrade,
      gost,
      profileTypeStr,
      profileGost,
      lengthLabel,
      sellPriceNum,
      sellTotal,
      displayedRawLength,
      selectedRaw,
      displayedTargetLength,
      currentDrawCoef,
      techEndsMm,
      frontCoef,
      backCoef,
      lengthAfterTechEnds,
      techTons,
      remTons,
      requiredWeight,
      commercialStats,
      advancedRemnantStats,
      rawPriceNum,
      scrapPriceNum,
      remnantPriceNum,
      orderWeightNum,
      orderedLength,
      remnantLength,
    } = reportData;

    let text = `Детали расчета (ООО "ЗМК Арсенал") - ${dateStr}\n`;
    text += `-----------------------------------\n`;
    text += `Коммерческий блок:\n`;
    text += `Марка стали: ${formattedGrade || "Не выбрана"}${gost ? ` (${gost})` : ""}\n`;
    text += `Профиль: ${profileTypeStr} ${selectedTarget || "?"} мм (${profileGost})\n`;
    text += `Длина: ${orderedLength || "?"} мм\n`;
    text += `Объем заказа: ${orderWeight || "?"} тонн\n`;
    text += `Цена за 1 тн продукции без НДС: ${formatCurrency(sellPriceNum)} руб.\n`;
    text += `Цена за весь заказ без НДС: ${formatCurrency(sellTotal)} руб.\n`;
    text += `Цена за весь заказ с НДС (22%): ${formatCurrency(sellTotal * 1.22)} руб.\n`;
    text += `-----------------------------------\n`;
    text += `Производственный блок:\n`;
    text += `Заготовка длина: ${displayedRawLength || "?"} мм\n`;
    text += `Диаметр заготовки: ${selectedRaw || "?"} мм\n`;
    text += `Вытяжка после волочения: ${displayedTargetLength || "?"} мм. (коф.- ${currentDrawCoef ? currentDrawCoef.toFixed(3) : "?"})\n`;
    text += `Тех. концы: ${techEndsMm || "0.0"} мм (Перед: ${frontCoef}, Зад: ${backCoef})\n`;
    text += `Длина после удаления: = ${lengthAfterTechEnds || "0.0"} мм\n`;

    if (advancedRemnantStats) {
      text += `Лом количество: ${(techTons * 1000).toFixed(1)} кг. (${techTons.toFixed(3)} тн)\n`;
      text += `Деловые остатки: ${(remTons * 1000).toFixed(1)} кг. (${remTons.toFixed(3)} тн)\n`;
      text += `Длина делового остатка: ${remnantLength || "0"} мм\n`;
    } else {
      text += `Лом количество: ? кг.\n`;
      text += `Деловые остатки: ? кг.\n`;
    }
    text += `-----------------------------------\n`;
    text += `Блок снабжение:\n`;
    text += `Сырье к закупке: Круг г/к ГОСТ 2590-2006 ф${selectedRaw || "?"} мм ${formattedGrade || "?"} (${gost || "?"})\n`;

    if (optimalBilletLengths && optimalBilletLengths.length > 0) {
      const recStr = optimalBilletLengths
        .map((opt) => `${opt.billetLength} мм (на ${opt.n} шт.)`)
        .join(", ");
      text += `Рекомендуемая длина заготовки: ${recStr}\n`;
    }

    text += `Количество: ${requiredWeight || "?"} тн.\n`;
    text += `-----------------------------------\n`;
    text += `Блок экономика:\n`;
    text += `Расчет на 1 тонну продукции\n`;
    text += `Продажная цена (за 1 т): без НДС ${formatCurrency(sellPriceNum)} руб.\n`;
    text += `- Стоимость заготовки: без НДС ${formatCurrency(rawPriceNum)} руб.\n`;

    if (commercialStats) {
      const directCosts = commercialStats.economyData.filter(
        (i) => i.category === "direct" && i.costPerTon > 0,
      );
      if (directCosts.length > 0) {
        text += `- Прямые затраты: ${formatCurrency(commercialStats.totalProcessingCostsPerTon)} руб.\n`;
        directCosts.forEach((item) => {
          text += `  └ ${item.name}: ${formatCurrency(item.costPerTon)} руб.\n`;
        });
      }
    }

    if (commercialStats && advancedRemnantStats && rawPriceNum > 0) {
      text += `- Затраты на отходы (1 т): ${formatCurrency(commercialStats.lossesPerTon)} руб.\n`;
      text += `  Лом (${(advancedRemnantStats.techTonsPerTon * 1000).toFixed(1)} кг): ${formatCurrency(advancedRemnantStats.techValuePerTon)} руб.\n`;
      text += `  Деловой остаток (${(advancedRemnantStats.remTonsPerTon * 1000).toFixed(1)} кг):  ${formatCurrency(advancedRemnantStats.remValuePerTon)} руб.\n`;

      text += `+ Возврат лома и остатков: ${formatCurrency(commercialStats.scrapRevenuePerTon)} руб.\n`;
      text += `  Лом (${(advancedRemnantStats.techTonsPerTon * 1000).toFixed(1)} кг × ${formatCurrency(scrapPriceNum)} руб/т): ${formatCurrency(advancedRemnantStats.techScrapRevenuePerTon)} руб.\n`;
      text += `  Деловой остаток (${(advancedRemnantStats.remTonsPerTon * 1000).toFixed(1)} кг × ${formatCurrency(remnantPriceNum)} руб/т): ${formatCurrency(advancedRemnantStats.remnantRevenuePerTon)} руб.\n`;

      const marginPrefix = commercialStats.isPositive ? "+" : "";
      text += `Маржа (1 тн, без НДС): ${marginPrefix}${formatCurrency(commercialStats.profitPerTon)} руб. (${marginPrefix}${commercialStats.marginPercent.toFixed(1)}%)\n`;
    }
    return text;
  }, [reportData, selectedTarget, orderWeight, optimalBilletLengths]);

  useEffect(() => {
    onPrintDataUpdate({
      reportData,
      orderWeight,
      selectedTarget,
      reportText,
    });
  }, [reportData, orderWeight, selectedTarget, reportText, onPrintDataUpdate]);

  const handleCopy = () => {
    const textArea = document.createElement("textarea");
    textArea.value = reportText;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка копирования", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <>
      <div className="min-h-screen bg-[#F4F5F4] dark:bg-[#121411] flex flex-col md:flex-row print:hidden transition-colors duration-300">
        {/* Mobile App Bar */}
        <div className="md:hidden fixed bottom-0 w-full bg-[#F0F4F4]/90 dark:bg-[#1A1C19]/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 z-50 print-hide">
          <div className="flex flex-col items-center justify-center w-full h-full text-slate-800 dark:text-slate-200">
            <div className="bg-slate-200 dark:bg-slate-700 px-4 py-1 rounded-full mb-1 text-slate-800 dark:text-white">
              <Calculator className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">
              Расчет
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-all active:scale-90"
          >
            <div className="px-4 py-1 mb-1 transition-colors">
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">
              {isDarkMode ? "Светлая" : "Темная"}
            </span>
          </button>
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center w-full h-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <div className="px-4 py-1 mb-1">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium tracking-wide">Выйти</span>
          </button>
        </div>

        {/* Desktop Navigation Rail */}
        <div className="hidden md:flex flex-col w-[88px] bg-[#F0F4F4] dark:bg-[#1A1C19] border-r border-slate-200 dark:border-slate-800 items-center py-6 fixed h-full z-50 print-hide">
          <div className="flex flex-col items-center mb-8 relative group">
            <button
              onClick={onAdminSwitch}
              className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-xl flex items-center justify-center text-white mb-2 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-500 transition-all active:scale-95 peer"
              title="Вход для управления"
            >
              <Key className="w-6 h-6 outline-none" />
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[60]">
              Вход для управления
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full px-3">
            <div className="w-full flex flex-col items-center justify-center py-4 text-slate-900 dark:text-slate-100">
              <div className="bg-slate-200 dark:bg-slate-700 px-5 py-1.5 rounded-full mb-1.5 text-slate-800 dark:text-white">
                <Calculator className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                Расчет
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-all active:scale-95 group"
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
              className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <div className="px-5 py-1.5 mb-1.5">
                <LogOut className="w-6 h-6" strokeWidth={2} />
              </div>
              <span className="text-[11px] font-medium tracking-wide">
                Выйти
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 md:ml-[88px] pb-24 md:pb-8 relative">
          <div className="max-w-[1920px] w-full px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
            {notification && (
              <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in slide-in-from-top-4 duration-300 border ${
                  notification.type === "success"
                    ? "bg-green-600 border-green-500 text-white"
                    : "bg-red-600 border-red-500 text-white"
                }`}
              >
                <div className="flex items-center gap-3 text-sm font-semibold">
                  {notification.type === "success" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  {notification.message}
                </div>
              </div>
            )}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print-hide transition-colors duration-300">
              <div className="flex flex-col mb-1 sm:mb-0">
                <h1 className="text-xl font-medium tracking-tight text-[#1A1C19] dark:text-[#E2E3DE]">
                  Система расчетов
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
                  ООО "ЗМК Арсенал"
                </p>
              </div>
            </div>

            <div className="sticky top-0 z-40 bg-[#F4F5F4]/95 dark:bg-[#121411]/95 backdrop-blur-md py-3 sm:py-3 border-b border-slate-200/50 dark:border-slate-800/50 flex flex-row overflow-x-auto hide-scrollbar items-center justify-start sm:justify-end gap-2 w-[calc(100%+2rem)] -mx-4 px-4 sm:w-auto sm:mx-0 sm:px-0 sm:overflow-visible sm:border-none sm:backdrop-blur-none sm:bg-transparent sm:mb-2 translate-z-0">
              <div className="flex items-center gap-2 w-max sm:w-auto">
                <button
                  onClick={() => setShowManual(true)}
                  className="flex items-center justify-center w-9 h-9 bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] rounded-xl transition-all font-medium focus:outline-none border border-[#DDE0DC] dark:border-[#2C2F2B] shadow-sm mr-1 shrink-0"
                  title="Инструкция"
                >
                  <BookOpen className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setShowHistory(!showHistory);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 h-9 min-w-[36px] sm:min-w-[115px] rounded-xl transition-all font-medium text-xs focus:outline-none border shadow-sm shrink-0 ${
                    showHistory
                      ? "bg-[#1A1C19] dark:bg-[#E2E3DE] text-white dark:text-[#121411] border-[#1A1C19] dark:border-white"
                      : "bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] border-[#DDE0DC] dark:border-[#2C2F2B]"
                  }`}
                  title="История расчетов"
                >
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">История</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || !steelGrade}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 h-9 min-w-[36px] sm:min-w-[115px] bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] rounded-xl transition-all font-medium text-xs focus:outline-none disabled:opacity-50 border border-[#DDE0DC] dark:border-[#2C2F2B] shadow-sm shrink-0"
                  title="Сохранить расчет"
                >
                  {isSaving ? (
                    <RotateCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Сохранить</span>
                </button>
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 px-3 sm:px-4 h-9 min-w-[36px] sm:min-w-[115px] rounded-xl transition-all font-medium text-xs focus:outline-none border shadow-sm shrink-0 ${
                    isCopied
                      ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                      : "bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] border-[#DDE0DC] dark:border-[#2C2F2B]"
                  }`}
                  title="Копировать расчет"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isCopied ? "Скопировано" : "Копировать"}
                  </span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 h-9 min-w-[36px] sm:min-w-[115px] bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] rounded-xl transition-all font-medium text-xs focus:outline-none border border-[#DDE0DC] dark:border-[#2C2F2B] shadow-sm shrink-0"
                  title="Печатная форма"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Печать</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 h-9 min-w-[36px] sm:min-w-[115px] bg-[#EAECE9] dark:bg-[#1A1C19] hover:bg-[#DDE0DC] dark:hover:bg-[#252824] text-[#1A1C19] dark:text-[#E2E3DE] rounded-xl transition-all font-medium text-xs focus:outline-none border border-[#DDE0DC] dark:border-[#2C2F2B] shadow-sm shrink-0"
                  title="Сбросить все"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Сбросить</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pb-8">
              <HistoryPanel
                showHistory={showHistory}
                setShowHistory={setShowHistory}
                savedCalculations={savedCalculations}
                clearAllHistory={clearAllHistory}
                isClearing={isClearing}
                deleteCalculation={deleteCalculation}
                loadCalculation={loadCalculation}
              />

              <div className="lg:col-span-12 xl:col-span-7 space-y-4">
                <CalculatorInputs
                  profileType={profileType}
                  setProfileType={setProfileType}
                  setFrontCoef={setFrontCoef}
                  allGrades={allGrades}
                  steelGrade={steelGrade}
                  setSteelGrade={setSteelGrade}
                  validationErrors={validationErrors}
                  dimensions={dimensions}
                  setDimensions={setDimensions}
                  orderWeight={orderWeight}
                  setOrderWeight={setOrderWeight}
                  rawPrice={rawPrice}
                  setRawPrice={setRawPrice}
                  manualRawPrice={manualRawPrice}
                  setManualRawPrice={setManualRawPrice}
                  currentAdminRawPrice={currentAdminRawPrice}
                  adminScrapPrice={adminScrapPrice}
                  adminRemnantPrice={adminRemnantPrice}
                  targetOptions={targetOptions}
                  rawOptions={rawOptions}
                  setSelectedTarget={setSelectedTarget}
                  setSelectedRaw={setSelectedRaw}
                  selectedTarget={selectedTarget}
                  selectedRaw={selectedRaw}
                />

                <CalculatorCutAndRemnants
                  optimalBilletLengths={optimalBilletLengths}
                  orderedLength={orderedLength}
                  setLengthInput={setLengthInput}
                  lengthInput={lengthInput}
                  validationErrors={validationErrors}
                  suggestedValues={suggestedValues}
                  cutLength={cutLength}
                  setCutLength={setCutLength}
                  handleCutLengthChange={handleCutLengthChange}
                  cutThickness={cutThickness}
                  setCutThickness={setCutThickness}
                  handleCutThicknessChange={handleCutThicknessChange}
                  remnantLength={remnantLengthManual}
                  setRemnantLength={setRemnantLengthManual}
                  remnantType={remnantType}
                  setRemnantType={setRemnantType}
                  isRemnantModeAuto={isRemnantModeAuto}
                  setIsRemnantModeAuto={setIsRemnantModeAuto}
                  handleBilletLengthInput={handleBilletLengthInput}
                  selectedTarget={selectedTarget}
                  frontCoef={frontCoef}
                  backCoef={backCoef}
                  techEndsMm={techEndsMm}
                  lengthAfterTechEnds={lengthAfterTechEnds}
                  piecesPerBar={piecesPerBar}
                  remnantWeight={remnantWeight}
                  remnantValue={remnantValue}
                  effectiveRemnantPrice={effectiveRemnantPrice}
                  currentRemnantPricingRule={currentRemnantPricingRule}
                  orderedBarWeight={orderedBarWeight}
                  piecesPerTon={piecesPerTon}
                  totalPiecesInOrder={totalPiecesInOrder}
                  advancedRemnantStats={advancedRemnantStats}
                  currentAdminRawPrice={currentAdminRawPrice}
                  displayedRawLength={displayedRawLength}
                  displayedTargetLength={displayedTargetLength}
                  orderWeight={orderWeight}
                  setOrderedLength={setOrderedLength}
                  optimalLengths={optimalLengths}
                />
              </div>

              <div className="lg:col-span-12 xl:col-span-5 space-y-4">
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                  <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 flex flex-col justify-center relative z-10 border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-sm transition-colors overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl">
                        <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Вес заготовки
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">
                        {requiredWeight || "0.00"}
                      </span>
                      <span className="text-base font-medium text-slate-500 dark:text-slate-400">
                        тонн
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#1A1C19] p-4 sm:p-5 flex flex-col justify-center relative z-10 border border-slate-200 dark:border-slate-800 rounded-[16px] shadow-sm transition-colors overflow-hidden">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl">
                        <Scale className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <h3 className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Расходный коэффициент общий
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-medium text-slate-900 dark:text-white tracking-tight">
                        {consumptionCoefficient
                          ? consumptionCoefficient.toFixed(3)
                          : "—"}
                      </span>
                    </div>
                  </div>
                </section>

                <CalculatorEconomy
                  sellPrice={sellPrice}
                  setSellPrice={setSellPrice}
                  orderWeight={orderWeight}
                  validationErrors={validationErrors}
                  commercialStats={commercialStats}
                  currentAdminRawPrice={currentAdminRawPrice}
                  advancedRemnantStats={advancedRemnantStats}
                  isEconomyExpanded={isEconomyExpanded}
                  setIsEconomyExpanded={setIsEconomyExpanded}
                  totalPiecesInOrder={totalPiecesInOrder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmClearAllHistory}
        title="Подтвердите действие"
        message={`Вы действительно хотите удалить историю расчетов (${savedCalculations.length} записей)? Это действие необратимо.`}
        confirmText="Удалить все"
        cancelText="Отмена"
      />
      <UserManualModal
        isOpen={showManual}
        onClose={() => setShowManual(false)}
      />
    </>
  );
}
