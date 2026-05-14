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
    "login" | "manager" | "admin" | "purchasing" | "developer"
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
                (defaultItem) => {
                  const savedItem = initialMap.get(defaultItem.id);
                  return savedItem ? { ...savedItem, name: defaultItem.name, category: defaultItem.category, type: defaultItem.type } : defaultItem;
                }
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

    if (user && ((db && isCloudActive) || config?.usePostgres)) {
      const unsub = subscribeToSystemData(
        db,
        "settings",
        "prices",
        (data) => {
          if (data) {
            console.log("System data updated from server");
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
                (defaultItem) => {
                  const savedItem = initialMap.get(defaultItem.id);
                  return savedItem ? { ...savedItem, name: defaultItem.name, category: defaultItem.category, type: defaultItem.type } : defaultItem;
                }
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
          if (isCloudActive) {
            handleFirestoreError(error, OperationType.GET, "settings/prices");
            setIsCloudActive(false);
          }
        },
        !!config?.usePostgres
      );
      return () => unsub();
    }
  }, [user, isCloudActive, config]);

  // Load User Personal Settings
  useEffect(() => {
    if (user && ((db && isCloudActive) || config?.usePostgres)) {
      const unsub = subscribeToUserSettings(db, user.uid, (data) => {
          if (data) {
            // We only load personal settings if they don't conflict with global settings 
            // OR if we want to store specific UI preferences here.
            // For prices, global (settings/prices) should have priority.
            
            // If global settings haven't loaded yet, or if we purposefully allow personal override 
            // (not requested by user), we would set it here.
            // For this app, let's keep personal settings for non-pricing data if needed.
            
            setIsUserSettingsLoaded(true);
          } else {
            setIsUserSettingsLoaded(true);
          }
        },
        (error) => {
          console.warn("Ошибка загрузки пользовательских настроек:", error);
          setIsUserSettingsLoaded(true);
        },
        !!config?.usePostgres
      );
      return () => unsub();
    }
  }, [user, isCloudActive, config]);

  const handleAnonymousLogin = async (targetView: "manager" | "purchasing" | "admin" | "developer") => {
    if (!user || user.uid.startsWith("local_")) {
      try {
        const result = await signInAnonymously(auth);
        setUser(result.user);
        setIsCloudActive(true);
      } catch (error) {
        console.error("Anonymous login failed, falling back to local:", error);
        
        if (config?.usePostgres) {
          setUser({ uid: "local_manager", isAnonymous: true, displayName: "Локальный пользователь" });
        } else {
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

    if ((db || config?.usePostgres) && user) {
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
        const promises = [];
        // Save to any configured cloud backends
        promises.push(saveSystemDataToCloud(db, "settings", "prices", payload, config?.usePostgres));
        
        if (config?.usePostgres) {
          promises.push(backendService.saveGlobalSettings(payload));
        }
        
        await Promise.allSettled(promises);
        console.log("Global prices save attempts finished");
      } catch (error) {
        console.error("Global settings save process error:", error);
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

        await saveUserSettingsToCloud(db, user.uid, personalPayload, config?.usePostgres);
      } catch (error) {
        if (isCloudActive) {
          handleFirestoreError(error as any, OperationType.WRITE, `users/${user.uid}/settings/preferences`);
        } else {
          console.error("Failed to save personal settings:", error);
        }
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
      <div className="min-h-screen overflow-x-hidden bg-[#F0F4F4] dark:bg-[#111310] flex flex-col font-sans print:hidden relative">
        {/* Status Indicator Bar */}
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 pointer-events-none overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              isCloudActive ? 'bg-emerald-500 opacity-60' : 'bg-amber-500 opacity-80 animate-pulse'
            }`} 
            style={{ width: '100%' }}
          />
        </div>

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
                onAdminLogin={(role) => {
                  if (role === "developer") {
                    handleAnonymousLogin("developer");
                  } else {
                    handleAnonymousLogin("admin");
                  }
                }}
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

          {(view === "admin" || view === "developer") && (
            <motion.div
              key={view}
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
                  initialDeletedGrades={deletedGrades || []}
                  initialRemnantPricing={remnantPricing}
                  initialEconomyItems={economyItems}
                  onSave={handleSaveGlobal}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  isDeveloperMode={view === "developer"}
                  config={config}
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
                  initialDeletedGrades={deletedGrades || []}
                  initialRemnantPricing={remnantPricing}
                  initialEconomyItems={economyItems}
                  onSave={handleSaveGlobal}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  initialTab="production"
                  isPurchasingMode={true}
                  config={config}
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
                  deletedGrades={deletedGrades || []}
                  remnantPricing={remnantPricing}
                  economyItems={economyItems}
                  onLogout={() => setView("login")}
                  isCloudActive={isCloudActive}
                  user={user}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  onAdminSwitch={() => setView("login")}
                  onPrintDataUpdate={setPrintData}
                  config={config}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
