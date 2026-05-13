import { create } from 'zustand';
import { EconomyItem } from '../lib/constants';
import { CalculationResult } from '../types';

interface AdminState {
  rawPrices: Record<string, { md: string; nd: string }>;
  scrap: string;
  remnant: string;
  customGrades: string[];
  deletedGrades: string[];
  remnantPricing: Record<string, { round: string; hex: string }>;
  economyItems: EconomyItem[];
  
  // Processing States
  calcResultsProd: CalculationResult[];
  calcResultsSup: CalculationResult[];
  processedSupplyPlansProd: any[];
  processedSupplyPlansSup: any[];
  processedStockProd: any[];
  processedStockSup: any[];
  
  // UI States
  isSaving: boolean;
  isProcessing: boolean;
  isProcessingStock: boolean;
  isProcessingSupplyPlans: boolean;
  isCloudActive: boolean;
  parsingProgress: {
    active: boolean;
    current: number;
    total: number;
    message: string;
  };
  validationErrors: Record<string, string>;
  uploadWarnings: string[];
  
  // UI States for Filtering/Searching
  stockSearchQuery: string;
  stockStatusFilter: string;
  supplySearchQuery: string;
  supplyStatusFilter: string;
  copySuccess: boolean;
  isCopied: boolean;
  
  // Setters
  setRawPrices: (prices: Record<string, { md: string; nd: string }> | ((prev: Record<string, { md: string; nd: string }>) => Record<string, { md: string; nd: string }>)) => void;
  updatePrice: (grade: string, type: 'md' | 'nd', value: string) => void;
  setScrap: (val: string | ((prev: string) => string)) => void;
  setRemnant: (val: string | ((prev: string) => string)) => void;
  setCustomGrades: (grades: string[] | ((prev: string[]) => string[])) => void;
  setDeletedGrades: (grades: string[] | ((prev: string[]) => string[])) => void;
  setRemnantPricing: (pricing: Record<string, { round: string; hex: string }> | ((prev: Record<string, { round: string; hex: string }>) => Record<string, { round: string; hex: string }>)) => void;
  setEconomyItems: (items: EconomyItem[] | ((prev: EconomyItem[]) => EconomyItem[])) => void;
  
  setStockSearchQuery: (val: string) => void;
  setStockStatusFilter: (val: string) => void;
  setSupplySearchQuery: (val: string) => void;
  setSupplyStatusFilter: (val: string) => void;
  setCopySuccess: (val: boolean) => void;
  setIsCopied: (val: boolean) => void;
  setUploadWarnings: (val: string[] | ((prev: string[]) => string[])) => void;
  
  setCalcResultsProd: (val: CalculationResult[] | ((prev: CalculationResult[]) => CalculationResult[])) => void;
  setCalcResultsSup: (val: CalculationResult[] | ((prev: CalculationResult[]) => CalculationResult[])) => void;
  setProcessedSupplyPlansProd: (val: any[] | ((prev: any[]) => any[])) => void;
  setProcessedSupplyPlansSup: (val: any[] | ((prev: any[]) => any[])) => void;
  setProcessedStockProd: (val: any[] | ((prev: any[]) => any[])) => void;
  setProcessedStockSup: (val: any[] | ((prev: any[]) => any[])) => void;
  setValidationErrors: (val: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  
  setIsSaving: (val: boolean) => void;
  setIsProcessing: (val: boolean) => void;
  setIsProcessingStock: (val: boolean) => void;
  setIsProcessingSupplyPlans: (val: boolean) => void;
  setIsCloudActive: (val: boolean) => void;
  setParsingProgress: (progress: any) => void;

  // Actions
  addCustomGrade: (grade: string) => void;
  removeGrade: (grade: string) => void;
  updateRemnantPricing: (grade: string, type: 'round' | 'hex', value: string) => void;
  updateEconomyItem: (id: string, field: string, value: any) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  rawPrices: {},
  scrap: "0",
  remnant: "0",
  customGrades: [],
  deletedGrades: [],
  remnantPricing: {},
  economyItems: [],
  
  calcResultsProd: [],
  calcResultsSup: [],
  processedSupplyPlansProd: [],
  processedSupplyPlansSup: [],
  processedStockProd: [],
  processedStockSup: [],
  
  isSaving: false,
  isProcessing: false,
  isProcessingStock: false,
  isProcessingSupplyPlans: false,
  isCloudActive: false,
  parsingProgress: {
    active: false,
    current: 0,
    total: 0,
    message: "",
  },
  validationErrors: {},
  stockSearchQuery: "",
  stockStatusFilter: "all",
  supplySearchQuery: "",
  supplyStatusFilter: "all",
  copySuccess: false,
  isCopied: false,
  uploadWarnings: [],

  setRawPrices: (prices) => set((state) => ({ rawPrices: typeof prices === 'function' ? prices(state.rawPrices) : prices })),
  updatePrice: (grade, type, value) => set((state) => ({
    rawPrices: {
      ...state.rawPrices,
      [grade]: {
        ...(state.rawPrices[grade] || { md: "0", nd: "0" }),
        [type]: value
      }
    }
  })),
  setScrap: (val) => set((state) => ({ scrap: typeof val === 'function' ? val(state.scrap) : val })),
  setRemnant: (val) => set((state) => ({ remnant: typeof val === 'function' ? val(state.remnant) : val })),
  setCustomGrades: (grades) => set((state) => ({ customGrades: typeof grades === 'function' ? grades(state.customGrades) : grades })),
  setDeletedGrades: (grades) => set((state) => ({ deletedGrades: typeof grades === 'function' ? grades(state.deletedGrades) : grades })),
  setRemnantPricing: (pricing) => set((state) => ({ remnantPricing: typeof pricing === 'function' ? pricing(state.remnantPricing) : pricing })),
  setEconomyItems: (items) => set((state) => ({ economyItems: typeof items === 'function' ? items(state.economyItems) : items })),

  setStockSearchQuery: (val) => set({ stockSearchQuery: val }),
  setStockStatusFilter: (val) => set({ stockStatusFilter: val }),
  setSupplySearchQuery: (val) => set({ supplySearchQuery: val }),
  setSupplyStatusFilter: (val) => set({ supplyStatusFilter: val }),
  setCopySuccess: (val) => set({ copySuccess: val }),
  setIsCopied: (val) => set({ isCopied: val }),
  setUploadWarnings: (val) => set((state) => ({ uploadWarnings: typeof val === 'function' ? val(state.uploadWarnings) : val })),

  addCustomGrade: (grade) => set((state) => {
    if (!grade || state.customGrades.includes(grade)) return state;
    return {
      customGrades: [...state.customGrades, grade],
      rawPrices: {
        ...state.rawPrices,
        [grade]: { md: "0", nd: "0" }
      },
      deletedGrades: state.deletedGrades.filter(g => g !== grade)
    };
  }),

  removeGrade: (grade) => set((state) => ({
    customGrades: state.customGrades.filter(g => g !== grade),
    deletedGrades: [...state.deletedGrades, grade]
  })),

  updateRemnantPricing: (grade, type, value) => set((state) => ({
    remnantPricing: {
      ...state.remnantPricing,
      [grade]: {
        ...(state.remnantPricing[grade] || { round: "0", hex: "0" }),
        [type]: value
      }
    }
  })),

  updateEconomyItem: (id, field, value) => set((state) => ({
    economyItems: state.economyItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    )
  })),
  
  setCalcResultsProd: (val) => set((state) => ({ calcResultsProd: typeof val === 'function' ? val(state.calcResultsProd) : val })),
  setCalcResultsSup: (val) => set((state) => ({ calcResultsSup: typeof val === 'function' ? val(state.calcResultsSup) : val })),
  setProcessedSupplyPlansProd: (val) => set((state) => ({ processedSupplyPlansProd: typeof val === 'function' ? val(state.processedSupplyPlansProd) : val })),
  setProcessedSupplyPlansSup: (val) => set((state) => ({ processedSupplyPlansSup: typeof val === 'function' ? val(state.processedSupplyPlansSup) : val })),
  setProcessedStockProd: (val) => set((state) => ({ processedStockProd: typeof val === 'function' ? val(state.processedStockProd) : val })),
  setProcessedStockSup: (val) => set((state) => ({ processedStockSup: typeof val === 'function' ? val(state.processedStockSup) : val })),
  
  setIsSaving: (val) => set({ isSaving: val }),
  setIsProcessing: (val) => set({ isProcessing: val }),
  setIsProcessingStock: (val) => set({ isProcessingStock: val }),
  setIsProcessingSupplyPlans: (val) => set({ isProcessingSupplyPlans: val }),
  setIsCloudActive: (val) => set({ isCloudActive: val }),
  setParsingProgress: (val) => set({ parsingProgress: val }),
  setValidationErrors: (val: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => set((state) => ({ validationErrors: typeof val === 'function' ? val(state.validationErrors) : val })),
}));
