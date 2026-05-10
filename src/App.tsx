import {
  DEFAULT_RAW_PRICES,
  sanitizeKey,
  DEFAULT_ECONOMY_ITEMS,
  DEFAULT_STEEL_GRADES,
} from "./lib/constants";
import { useStore } from "./store";
import { app as firebaseApp, auth, db, appId } from "./lib/firebase";
import { signInAnonymously } from "firebase/auth";
import { subscribeToUserSettings, saveUserSettingsToCloud, subscribeToSystemData, saveSystemDataToCloud } from './services/db/userSettingsService';
import { backendService } from './services/api/backendService';
import { useAppConfig } from './hooks/useAppConfig';
import { useEffect, useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import { AdminPanel } from "./components/AdminPanel";
import { CalculatorApp } from "./components/CalculatorApp";
import { LoginScreen } from "./components/LoginScreen";
import { PrintTemplate } from "./components/PrintTemplate";
import { motion, AnimatePresence } from "motion/react";
import { handleFirestoreError, OperationType } from "./lib/utils";

export default function App() {
  const [view, setView] = useState<
    "login" | "manager" | "admin" | "purchasing"
  >("login");
  const { config, loading: configLoading } = useAppConfig();
  const [user, setUser] = useState<any>(null);
  const [isCloudActive, setIsCloudActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [printData, setPrintData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("arsenal_theme");
      return (
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      window.localStorage.setItem("arsenal_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      window.localStorage.setItem("arsenal_theme", "light");
    }
  }, [isDarkMode]);

  // Global state from Zustand
  const {
    globalRawPrices,
    setGlobalRawPrices,
    globalScrapPrice,
    setGlobalScrapPrice,
    globalRemnantPrice,
    setGlobalRemnantPrice,
    customGrades,
    setCustomGrades,
    deletedGrades,
    setDeletedGrades,
    remnantPricing,
    setRemnantPricing,
    economyItems,
    setEconomyItems,
    isUserSettingsLoaded,
    setIsUserSettingsLoaded,
    saveSettings
  } = useStore();
  
  const isInitialLoad = useRef(true);

  // Load data from PostgreSQL if enabled
  useEffect(() => {
    if (config?.usePostgres && user) {
      const loadPostgresData = async () => {
        try {
          // Load shared global settings first
          const globalData = await backendService.getGlobalSettings();
          if (globalData) {
            if (globalData.rawPrices) setGlobalRawPrices(globalData.rawPrices);
            if (globalData.scrapPrice !== undefined) setGlobalScrapPrice(globalData.scrapPrice);
            if (globalData.remnantPrice !== undefined) setGlobalRemnantPrice(globalData.remnantPrice);
            if (globalData.remnantPricing) setRemnantPricing(globalData.remnantPricing);
            if (globalData.customGrades) setCustomGrades(globalData.customGrades);
            if (globalData.deletedGrades) setDeletedGrades(globalData.deletedGrades);
            if (globalData.economyItems) setEconomyItems(globalData.economyItems);
          }

          // Then load personal user overrides if any
          const personalData = await backendService.getSettings(user.uid);
          if (personalData) {
            if (personalData.rawPrices) setGlobalRawPrices(personalData.rawPrices);
            // ... add other overrides if needed
          }
        } catch (err) {
          console.error("PostgreSQL settings load failed", err);
        }
      };
      loadPostgresData();
    }
  }, [config, user]);

  useEffect(() => {
    const handleOnline = () => {
      setIsCloudActive(true);
      setConnectionError(null);
    };
    const handleOffline = () => {
      setIsCloudActive(false);
      setConnectionError("Нет подключения к интернету");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Connect to Firebase Auth
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsCloudActive(true);
      } else {
        setUser(null);
      }
      setIsConnecting(false);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedRaw = window.localStorage.getItem("arsenal_raw_prices");
        const savedScrap = window.localStorage.getItem("arsenal_scrap_price");
        const savedRemnant = window.localStorage.getItem(
          "arsenal_remnant_price",
        );
        const savedCustomGrades = window.localStorage.getItem(
          "arsenal_custom_grades",
        );
        const savedDeletedGrades = window.localStorage.getItem(
          "arsenal_deleted_grades",
        );
        const savedRemnantPricing = window.localStorage.getItem(
          "arsenal_remnant_pricing",
        );
        const savedEconomy = window.localStorage.getItem(
          "arsenal_economy_items",
        );

        let loadedCustomGrades: string[] = [];
        try {
          if (savedCustomGrades) {
            loadedCustomGrades = JSON.parse(savedCustomGrades);
            setCustomGrades(loadedCustomGrades);
          }
        } catch (e) {
          window.localStorage.removeItem("arsenal_custom_grades");
        }

        let loadedDeletedGrades: string[] = [];
        try {
          if (savedDeletedGrades) {
            loadedDeletedGrades = JSON.parse(savedDeletedGrades);
            setDeletedGrades(loadedDeletedGrades);
          }
        } catch (e) {
          window.localStorage.removeItem("arsenal_deleted_grades");
        }

        try {
          if (savedRemnantPricing) {
            setRemnantPricing(JSON.parse(savedRemnantPricing));
          }
        } catch (e) {
          window.localStorage.removeItem("arsenal_remnant_pricing");
        }

        try {
          if (savedEconomy) {
            const parsed = JSON.parse(savedEconomy);
            const initialMap = new Map(
              parsed.map((item: any) => [item.id, item]),
            );
            setEconomyItems(
              DEFAULT_ECONOMY_ITEMS.map(
                (defaultItem) => initialMap.get(defaultItem.id) || defaultItem,
              ),
            );
          }
        } catch (e) {
          window.localStorage.removeItem("arsenal_economy_items");
        }

        try {
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            const loadedPrices = { ...DEFAULT_RAW_PRICES };
            const allG = [
              ...Object.keys(DEFAULT_RAW_PRICES),
              ...loadedCustomGrades,
            ];
            allG.forEach((grade) => {
              if (parsed[grade] !== undefined) {
                if (typeof parsed[grade] === "string") {
                  loadedPrices[grade] = {
                    md: parsed[grade],
                    nd: parsed[grade],
                  };
                } else {
                  loadedPrices[grade] = parsed[grade];
                }
              }
            });
            setGlobalRawPrices(loadedPrices);
          }
        } catch (e) {
          window.localStorage.removeItem("arsenal_raw_prices");
        }
        if (savedScrap) setGlobalScrapPrice(savedScrap);
        if (savedRemnant) setGlobalRemnantPrice(savedRemnant);
      }
    } catch (e) {}

    isInitialLoad.current = false;

    if (db && isCloudActive && user && !config?.usePostgres) {
      const unsubscribe = subscribeToSystemData(db, "settings", "prices", (data) => {
          if (data) {

            const storeState = useStore.getState();
            const resultingCustomGrades =
              data.customGrades || storeState.customGrades;
            setCustomGrades(resultingCustomGrades);
            if (data.customGrades && typeof window !== "undefined") {
              window.localStorage.setItem(
                "arsenal_custom_grades",
                JSON.stringify(resultingCustomGrades),
              );
            }

            const resultingDeletedGrades =
              data.deletedGrades || storeState.deletedGrades;
            setDeletedGrades(resultingDeletedGrades);
            if (data.deletedGrades && typeof window !== "undefined") {
              window.localStorage.setItem(
                "arsenal_deleted_grades",
                JSON.stringify(resultingDeletedGrades),
              );
            }

            // Now update raw prices with the correct dependency references
            if (data.rawPrices || data.rawPricesV2) {
                  const loadedPrices = { ...DEFAULT_RAW_PRICES };
                  const allG = [
                    ...Object.keys(DEFAULT_RAW_PRICES),
                    ...resultingCustomGrades,
                  ];
                  allG.forEach((grade) => {
                    const dbKey = sanitizeKey(grade);
                    const valObj = data.rawPricesV2
                      ? data.rawPricesV2[dbKey]
                      : undefined;
                    const valString = data.rawPrices
                      ? data.rawPrices[dbKey]
                      : undefined;

                    if (valObj && valObj.md !== undefined) {
                      if (
                        typeof valString === "string" &&
                        valString !== valObj.md &&
                        valString !== valObj.nd
                      ) {
                        loadedPrices[grade] = { md: valString, nd: valString };
                      } else {
                        loadedPrices[grade] = valObj;
                      }
                    } else if (typeof valString === "string") {
                      loadedPrices[grade] = { md: valString, nd: valString };
                    } else if (valString && typeof valString === "object") {
                      loadedPrices[grade] = valString;
                    }
                  });
                  setGlobalRawPrices(loadedPrices);
                  if (typeof window !== "undefined")
                    window.localStorage.setItem(
                      "arsenal_raw_prices",
                      JSON.stringify(loadedPrices),
                    );
                }

            if (data.remnantPricing) {
              setRemnantPricing(data.remnantPricing);
              if (typeof window !== "undefined")
                window.localStorage.setItem(
                  "arsenal_remnant_pricing",
                  JSON.stringify(data.remnantPricing),
                );
            }

            if (data.economyItems) {
              const initialMap = new Map(
                data.economyItems.map((item: any) => [item.id, item]),
              );
              const merged = DEFAULT_ECONOMY_ITEMS.map(
                (defaultItem) => initialMap.get(defaultItem.id) || defaultItem,
              );
              setEconomyItems(merged);
              if (typeof window !== "undefined")
                window.localStorage.setItem(
                  "arsenal_economy_items",
                  JSON.stringify(merged),
                );
            }

            if (data.scrapPrice !== undefined) {
              setGlobalScrapPrice(data.scrapPrice);
              if (typeof window !== "undefined")
                window.localStorage.setItem(
                  "arsenal_scrap_price",
                  data.scrapPrice,
                );
            }
            if (data.remnantPrice !== undefined) {
              setGlobalRemnantPrice(data.remnantPrice);
              if (typeof window !== "undefined")
                window.localStorage.setItem(
                  "arsenal_remnant_price",
                  data.remnantPrice,
                );
            }
          }
        },
        (error) => {
          console.warn("Облако недоступно, работаем локально:", error);
          handleFirestoreError(error, OperationType.GET, "settings/prices");
          setIsCloudActive(false);
        },
      );
      return () => unsubscribe();
    }
  }, [user, isCloudActive]);

  // Load User Personal Settings
  useEffect(() => {
    if (db && isCloudActive && user) {
      const unsubscribe = subscribeToUserSettings(db, user.uid, (data) => {
          if (data) {
            if (data.rawPrices) {
              const loadedPrices = { ...DEFAULT_RAW_PRICES };
              // Since keys might be sanitized, we match them against all possible grades
              // Or better: just use the data.rawPrices keys if they don't have dots
              // But we saved them sanitized. So we need to match them back.
              // All known grades include DEFAULT + custom
              // Or we can just iterate the keys and replace _ back to .?
              // But grade names can have underscores originally? unlikely.

              // Robust approach: match by comparing sanitized versions
              const allPossibleGrades = [...DEFAULT_STEEL_GRADES, ...(data.customGrades || [])];
              Object.entries(data.rawPrices).forEach(([dbKey, val]: [string, any]) => {
                const match = allPossibleGrades.find(g => sanitizeKey(g) === dbKey);
                if (match) {
                  loadedPrices[match] = val;
                } else {
                  // If it doesn't match a known grade, we still keep it using dbKey as is (might be okay)
                  loadedPrices[dbKey] = val;
                }
              });
              setGlobalRawPrices(loadedPrices);
            }
            if (data.scrapPrice !== undefined) setGlobalScrapPrice(data.scrapPrice);
            if (data.remnantPrice !== undefined) setGlobalRemnantPrice(data.remnantPrice);
            if (data.remnantPricing) setRemnantPricing(data.remnantPricing);
            if (data.customGrades) setCustomGrades(data.customGrades);
            if (data.deletedGrades) setDeletedGrades(data.deletedGrades);
            if (data.economyItems) {
              const initialMap = new Map(
                data.economyItems.map((item: any) => [item.id, item]),
              );
              const merged = DEFAULT_ECONOMY_ITEMS.map(
                (defaultItem) => initialMap.get(defaultItem.id) || defaultItem,
              );
              setEconomyItems(merged);
            }
            setIsUserSettingsLoaded(true);
          } else {
            setIsUserSettingsLoaded(true); // Document doesn't exist, we are done loading
          }
        },
        (error) => {
          console.warn("Ошибка загрузки пользовательских настроек:", error);
          setIsUserSettingsLoaded(true);
        }
      );
      return () => unsubscribe();
    } else {
      setIsUserSettingsLoaded(true);
    }
  }, [user, isCloudActive]);

  const handleAnonymousLogin = async (targetView: "manager" | "purchasing" | "admin") => {
    if (!user) {
      try {
        if (!isCloudActive && config?.usePostgres) {
          // If Firestore is NOT active, use a local placeholder
          setUser({ uid: "local_manager", isAnonymous: true, displayName: "Локальный пользователь" });
        } else {
          // If Firestore IS active, use the real Firebase sign-in
          const result = await signInAnonymously(auth);
          setUser(result.user);
        }
      } catch (error) {
        console.error("Anonymous login failed:", error);
        // Even if both fail, we might want to let them see the UI in offline mode if we have local storage
        if (config?.usePostgres) {
           setUser({ uid: "local_emergency", isAnonymous: true });
        }
      }
    }
    setView(targetView);
  };

  const handleSaveGlobal = async (
    rawPricesObj: Record<string, { md: string; nd: string }>,
    scrapStr: string,
    remnantStr: string,
    cGrades: string[],
    rPricing: Record<string, { round: string; hex: string }>,
    eItems?: any[],
    dGrades?: string[],
  ) => {
    setGlobalRawPrices(rawPricesObj);
    setGlobalScrapPrice(scrapStr);
    setGlobalRemnantPrice(remnantStr);
    if (cGrades) setCustomGrades(cGrades);
    if (dGrades) setDeletedGrades(dGrades);
    if (rPricing) setRemnantPricing(rPricing);
    if (eItems) setEconomyItems(eItems);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "arsenal_raw_prices",
          JSON.stringify(rawPricesObj),
        );
        window.localStorage.setItem("arsenal_scrap_price", scrapStr);
        window.localStorage.setItem("arsenal_remnant_price", remnantStr);
        if (cGrades)
          window.localStorage.setItem(
            "arsenal_custom_grades",
            JSON.stringify(cGrades),
          );
        if (dGrades)
          window.localStorage.setItem(
            "arsenal_deleted_grades",
            JSON.stringify(dGrades),
          );
        if (rPricing)
          window.localStorage.setItem(
            "arsenal_remnant_pricing",
            JSON.stringify(rPricing),
          );
        if (eItems)
          window.localStorage.setItem(
            "arsenal_economy_items",
            JSON.stringify(eItems),
          );
      }
    } catch (e) {}

    if (db && isCloudActive && user && !config?.usePostgres) {
      const firestoreRawPricesV2: Record<string, { md: string; nd: string }> =
        {};
      const firestoreRawPricesOld: Record<string, string> = {};

      for (const [k, v] of Object.entries(rawPricesObj)) {
        const sanitized = sanitizeKey(k);
        firestoreRawPricesV2[sanitized] = v;
        // Old versions expect a string for price. 'nd' is usually priority, then 'md'
        firestoreRawPricesOld[sanitized] = v.nd || v.md || "0";
      }

      const payload: any = {
        rawPrices: firestoreRawPricesOld,
        rawPricesV2: firestoreRawPricesV2,
        scrapPrice: scrapStr,
        remnantPrice: remnantStr,
        updatedAt: new Date().toISOString(),
      };
      if (cGrades) payload.customGrades = cGrades;
      if (dGrades) payload.deletedGrades = dGrades;
      if (rPricing) payload.remnantPricing = rPricing;
      if (eItems) payload.economyItems = eItems;

      try {
        if (config?.usePostgres) {
          await backendService.saveGlobalSettings(payload);
        } else {
          await saveSystemDataToCloud(db, "settings", "prices", payload);
        }
      } catch (error) {
        // Fallback for non-admins: save only to their personal settings
        console.warn("Could not save to global settings, saving to personal only.");
      }

      // Always save to personal settings for the user
      try {
        const sanitizedRawPrices: Record<string, { md: string; nd: string }> = {};
        for (const [k, v] of Object.entries(rawPricesObj)) {
          sanitizedRawPrices[sanitizeKey(k)] = v;
        }

        const personalPayload = {
          rawPrices: sanitizedRawPrices,
          scrapPrice: scrapStr,
          remnantPrice: remnantStr,
          remnantPricing: rPricing,
          customGrades: cGrades,
          deletedGrades: dGrades,
          economyItems: eItems,
          updatedAt: new Date().toISOString()
        };

        if (config?.usePostgres) {
          await backendService.saveSettings(user.uid, personalPayload);
        } else {
          await saveUserSettingsToCloud(db, user.uid, personalPayload);
        }
      } catch (error) {
        handleFirestoreError(error as any, OperationType.WRITE, `users/${user.uid}/settings/preferences`);
      }
    }
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <>
      {printData && (
        <PrintTemplate
          reportData={printData.reportData}
          orderWeight={printData.orderWeight}
          selectedTarget={printData.selectedTarget}
          printText={printData.reportText}
        />
      )}
      <div className="min-h-screen overflow-x-hidden bg-[#F0F4F4] dark:bg-[#111310] flex flex-col font-sans print:hidden">
        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <LoginScreen
                onManagerLogin={() => handleAnonymousLogin("manager")}
                onPurchasingLogin={() => handleAnonymousLogin("purchasing")}
                onAdminLogin={() => handleAnonymousLogin("admin")}
                user={user}
                isCloudActive={isCloudActive}
                isConnecting={isConnecting}
                connectionError={connectionError}
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                config={config}
              />
            </motion.div>
          )}

          {view === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8">
                <AdminPanel
                  initialRawPrices={globalRawPrices}
                  initialScrap={globalScrapPrice}
                  initialRemnant={globalRemnantPrice}
                  initialCustomGrades={customGrades}
                  initialDeletedGrades={deletedGrades}
                  initialRemnantPricing={remnantPricing}
                  initialEconomyItems={economyItems}
                  onSave={handleSaveGlobal}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </div>
            </motion.div>
          )}

          {view === "purchasing" && (
            <motion.div
              key="purchasing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-8">
                <AdminPanel
                  initialRawPrices={globalRawPrices}
                  initialScrap={globalScrapPrice}
                  initialRemnant={globalRemnantPrice}
                  initialCustomGrades={customGrades}
                  initialDeletedGrades={deletedGrades}
                  initialRemnantPricing={remnantPricing}
                  initialEconomyItems={economyItems}
                  onSave={handleSaveGlobal}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  initialTab="production"
                  isPurchasingMode={true}
                />
              </div>
            </motion.div>
          )}

          {view === "manager" && (
            <motion.div
              key="manager"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
                <CalculatorApp
                  adminRawPrices={globalRawPrices}
                  adminScrapPrice={globalScrapPrice}
                  adminRemnantPrice={globalRemnantPrice}
                  customGrades={customGrades}
                  deletedGrades={deletedGrades}
                  remnantPricing={remnantPricing}
                  economyItems={economyItems}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  user={user}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onAdminSwitch={() => setView("login")}
                  onPrintDataUpdate={setPrintData}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
