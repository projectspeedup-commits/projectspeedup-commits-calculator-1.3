const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const returnStart = code.lastIndexOf(
  `  return (\n    <div className="min-h-screen`,
);
const mainContentStart = code.indexOf(`      {/* Main Content Area */}`);

const correctNav = `  return (
    <div className="min-h-screen bg-[#F4F5F4] dark:bg-[#121411] flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile App Navigation Bar */}
      <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-[#1A1C19]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center h-[72px] pb-4 px-2 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto [&::-webkit-scrollbar]:hidden gap-1">
         <button 
           onClick={() => setActiveTab("files")}
           className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'files' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
         >
           <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'files' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
             <FileText className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight">Файлы</span>
         </button>
         {!isPurchasingMode && (
           <button 
             onClick={() => setActiveTab("economy")}
             className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'economy' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
           >
             <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'economy' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
               <TrendingUp className="w-5 h-5" />
             </div>
             <span className="text-[10px] font-bold tracking-tight">Экономика</span>
           </button>
         )}

         <button 
           onClick={() => setActiveTab("production")}
           className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'production' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
         >
           <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'production' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
             <Factory className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight">Пр-во</span>
         </button>

         <button 
           onClick={() => setActiveTab("supply")}
           className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'supply' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
         >
           <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'supply' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
             <Package className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight">Снабжение</span>
         </button>

         <button 
           onClick={() => setActiveTab("logistics")}
           className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'logistics' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
         >
           <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'logistics' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
             <Truck className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight">Логистика</span>
         </button>

         <button 
           onClick={() => setActiveTab("help")}
           className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'help' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
         >
           <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'help' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
             <BookOpen className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight">Справка</span>
         </button>

         <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-800 mx-1 shrink-0"></div>

         <button onClick={toggleTheme} className="flex flex-col items-center justify-center min-w-[56px] shrink-0 h-full py-1 text-slate-400 dark:text-slate-500 active:scale-95 transition-all">
           <div className="px-3 py-1 mb-1">
             {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
           </div>
           <span className="text-[10px] font-bold tracking-tight">Тема</span>
         </button>

         <button onClick={onLogout} className="flex flex-col items-center justify-center min-w-[56px] shrink-0 h-full py-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-all">
           <div className="px-3 py-1 mb-1">
             <LogOut className="w-5 h-5" />
           </div>
           <span className="text-[10px] font-bold tracking-tight font-sans">Выйти</span>
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
           <button 
             onClick={() => setActiveTab("files")}
             className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'files' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
           >
             <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'files' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
               <FileText className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Файлы</span>
           </button>
           {!isPurchasingMode && (
             <button 
               onClick={() => setActiveTab("economy")}
               className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'economy' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
             >
               <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'economy' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
                 <TrendingUp className="w-6 h-6" strokeWidth={2} />
               </div>
               <span className="text-[11px] font-medium tracking-wide">Экономика</span>
             </button>
           )}

           <button 
             onClick={() => setActiveTab("production")}
             className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'production' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
           >
             <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'production' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
               <Factory className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Пр-во</span>
           </button>

           <button 
             onClick={() => setActiveTab("supply")}
             className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'supply' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
           >
             <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'supply' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
               <Package className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Снабжение</span>
           </button>

           <button 
             onClick={() => setActiveTab("logistics")}
             className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'logistics' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
           >
             <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'logistics' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
               <Truck className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Логистика</span>
           </button>

           <button 
             onClick={() => setActiveTab("help")}
             className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'help' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
           >
             <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'help' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
               <BookOpen className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Справка</span>
           </button>

           <button onClick={toggleTheme} className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 group">
              <div className="px-5 py-1.5 mb-1.5 transition-colors group-hover:bg-slate-100 dark:group-hover:bg-slate-800 rounded-full">
                {isDarkMode ? <Sun className="w-6 h-6 text-amber-500" strokeWidth={2} /> : <Moon className="w-6 h-6" strokeWidth={2} />}
              </div>
              <span className="text-[11px] font-medium tracking-wide">{isDarkMode ? 'Светлая' : 'Темная'}</span>
           </button>
        </div>
        <div className="w-full px-3">
           <button onClick={onLogout} className="w-full flex flex-col items-center justify-center py-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
             <div className="px-5 py-1.5 mb-1.5">
               <LogOut className="w-6 h-6" strokeWidth={2} />
             </div>
             <span className="text-[11px] font-medium tracking-wide">Выйти</span>
           </button>
        </div>
      </div>\n\n`;

code =
  code.substring(0, returnStart) +
  correctNav +
  code.substring(mainContentStart);
fs.writeFileSync("src/components/AdminPanel.tsx", code);
console.log("Replaced nav cleanly!");
