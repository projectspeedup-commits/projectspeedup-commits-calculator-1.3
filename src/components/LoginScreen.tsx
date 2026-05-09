import { Calculator, Key, Package, User, Sun, Moon } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoginScreenProps {
  onManagerLogin: () => void;
  onPurchasingLogin: () => void;
  onAdminLogin: () => void;
  user: any;
  isCloudActive: boolean;
  isConnecting?: boolean;
  connectionError?: string | null;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export function LoginScreen({
  onManagerLogin,
  onPurchasingLogin,
  onAdminLogin,
  user,
  isCloudActive,
  isConnecting,
  connectionError,
  isDarkMode,
  toggleTheme,
}: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "trushin" && password === "rfhectkm") {
      setError(false);
      onAdminLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center sm:justify-center px-4 py-4 sm:py-8 bg-[#F4F5F4] dark:bg-[#121411] transition-colors duration-300 relative overflow-y-auto">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] rounded-full" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white dark:bg-[#1A1C19] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all z-50 focus:outline-none"
      >
        {isDarkMode ? (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
        ) : (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 sm:gap-6 w-full max-w-md relative z-10 py-4"
      >
        <div className="flex flex-col items-center mb-1 sm:mb-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-10 h-10 sm:w-16 sm:h-16 bg-slate-800 dark:bg-slate-700 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-xl mb-2 sm:mb-4 text-white"
          >
            <Calculator className="w-5 h-5 sm:w-8 sm:h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl sm:text-4xl tracking-tight text-[#1A1C19] dark:text-white mb-0.5 sm:mb-2 font-light"
          >
            Система расчетов
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#43483F] dark:text-slate-400 font-semibold tracking-[0.2em] uppercase text-[8px] sm:text-[10px]"
          >
            ООО "ЗМК Арсенал"
          </motion.p>
        </div>

        <div className="space-y-3 sm:space-y-6">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-[#1A1C19] p-4 sm:p-8 rounded-[20px] sm:rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center group transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-3 justify-center">
              <User
                className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-400"
                strokeWidth={1.5}
              />
              <h2 className="text-base sm:text-xl font-medium text-[#1A1C19] dark:text-white">
                Менеджер по продажам
              </h2>
            </div>
            <button
              onClick={onManagerLogin}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl sm:rounded-2xl h-11 sm:h-14 px-6 text-sm font-semibold transition-all shadow-md active:scale-[0.98] focus:outline-none"
            >
              Войти в калькулятор
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-[#1A1C19] p-4 sm:p-8 rounded-[20px] sm:rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center group transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-3 justify-center">
              <Package
                className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-400"
                strokeWidth={1.5}
              />
              <h2 className="text-base sm:text-xl font-medium text-[#1A1C19] dark:text-white">
                Производственно-плановый отдел
              </h2>
            </div>
            <button
              onClick={onPurchasingLogin}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl sm:rounded-2xl h-11 sm:h-14 px-6 text-sm font-semibold transition-all shadow-md active:scale-[0.98] focus:outline-none"
            >
              Войти
            </button>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-white dark:bg-[#1A1C19] p-4 sm:p-8 rounded-[20px] sm:rounded-[32px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center transition-colors"
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-5 justify-center">
              <Key
                className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-400"
                strokeWidth={1.5}
              />
              <h2 className="text-base sm:text-xl font-medium text-[#1A1C19] dark:text-white">
                Управление
              </h2>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3 sm:space-y-4 w-full">
              <div className="space-y-2 sm:space-y-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Логин"
                  className="w-full bg-[#f8f9f8] dark:bg-slate-800/50 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 h-11 sm:h-14 text-sm sm:text-base focus:border-slate-800 dark:focus:border-white focus:outline-none focus:ring-0 transition-all placeholder:text-slate-500"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full bg-[#f8f9f8] dark:bg-slate-800/50 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 h-11 sm:h-14 text-sm sm:text-base focus:border-slate-800 dark:focus:border-white focus:outline-none focus:ring-0 transition-all placeholder:text-slate-500"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 dark:text-red-400 text-[10px] sm:text-xs font-semibold px-2"
                  >
                    Неверный логин или пароль
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 border border-slate-800/10 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl sm:rounded-2xl h-11 sm:h-14 px-6 text-sm font-bold transition-all active:scale-[0.98] focus:outline-none mt-1"
              >
                Войти
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnecting
                  ? "bg-amber-400 animate-pulse"
                  : isCloudActive
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    : "bg-slate-400"
              }`}
            />
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isConnecting ? "text-amber-500 dark:text-amber-400" : isCloudActive ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}
            >
              {isConnecting
                ? "Подключение..."
                : isCloudActive
                  ? (user?.isAnonymous ? "FIREBASE ACTIVE" : "ОНЛАЙН")
                  : "АВТОНОМНЫЙ РЕЖИМ"}
            </span>
          </div>
          {connectionError && !isCloudActive && !isConnecting && (
            <p className="mt-2 text-[10px] text-red-500 dark:text-red-400 max-w-[300px] mx-auto">
              Ошибка: {connectionError}
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
