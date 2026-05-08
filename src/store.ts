import { create } from 'zustand';
import { doc, setDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { DEFAULT_RAW_PRICES, DEFAULT_ECONOMY_ITEMS, sanitizeKey } from "./lib/constants";

interface StoreState {
  globalRawPrices: Record<string, { md: string; nd: string }>;
  globalScrapPrice: string;
  globalRemnantPrice: string;
  customGrades: string[];
  deletedGrades: string[];
  remnantPricing: Record<string, { round: string; hex: string }>;
  economyItems: any[];
  isUserSettingsLoaded: boolean;
  
  setGlobalRawPrices: (prices: Record<string, { md: string; nd: string }>) => void;
  setGlobalScrapPrice: (price: string) => void;
  setGlobalRemnantPrice: (price: string) => void;
  setCustomGrades: (grades: string[]) => void;
  setDeletedGrades: (grades: string[]) => void;
  setRemnantPricing: (pricing: Record<string, { round: string; hex: string }>) => void;
  setEconomyItems: (items: any[]) => void;
  setIsUserSettingsLoaded: (loaded: boolean) => void;

  saveSettings: (user: any) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  globalRawPrices: DEFAULT_RAW_PRICES,
  globalScrapPrice: "20000",
  globalRemnantPrice: "30000",
  customGrades: [],
  deletedGrades: [],
  remnantPricing: {},
  economyItems: DEFAULT_ECONOMY_ITEMS,
  isUserSettingsLoaded: false,

  setGlobalRawPrices: (prices) => set({ globalRawPrices: prices }),
  setGlobalScrapPrice: (price) => set({ globalScrapPrice: price }),
  setGlobalRemnantPrice: (price) => set({ globalRemnantPrice: price }),
  setCustomGrades: (grades) => set({ customGrades: grades }),
  setDeletedGrades: (grades) => set({ deletedGrades: grades }),
  setRemnantPricing: (pricing) => set({ remnantPricing: pricing }),
  setEconomyItems: (items) => set({ economyItems: items }),
  setIsUserSettingsLoaded: (loaded) => set({ isUserSettingsLoaded: loaded }),

  saveSettings: async (user) => {
    if (!user || !db) return;
    const state = get();
    
    // Always save to personal settings
    try {
      const sanitizedRawPrices: Record<string, { md: string; nd: string }> = {};
      for (const [k, v] of Object.entries(state.globalRawPrices)) {
        sanitizedRawPrices[sanitizeKey(k)] = v;
      }

      await setDoc(doc(db, "users", user.uid, "settings", "preferences"), {
        rawPrices: sanitizedRawPrices,
        scrapPrice: state.globalScrapPrice,
        remnantPrice: state.globalRemnantPrice,
        remnantPricing: state.remnantPricing,
        customGrades: state.customGrades,
        deletedGrades: state.deletedGrades,
        economyItems: state.economyItems,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.error("Personal settings save failed", e);
    }
  }
}));
