const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const mobileSupply = `        <button 
          onClick={() => setActiveTab("supply")}
          className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'supply' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
        >
          <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'supply' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
            <Package className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Снабжение</span>
        </button>`;

const mobileProd = `        <button 
          onClick={() => setActiveTab("production")}
          className={\`flex flex-col items-center justify-center min-w-[64px] shrink-0 h-full py-1 transition-all \${activeTab === 'production' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}\`}
        >
          <div className={\`px-3 py-1 rounded-full mb-1 transition-colors \${activeTab === 'production' ? 'bg-slate-100 dark:bg-slate-800' : ''}\`}>
            <Factory className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Пр-во</span>
        </button>`;

const mobileFind = mobileSupply + "\n\n" + mobileProd;
const mobileReplace = mobileProd + "\n\n" + mobileSupply;

code = code.replace(mobileFind, mobileReplace);

const desktopSupply = `          <button 
            onClick={() => setActiveTab("supply")}
            className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'supply' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
          >
            <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'supply' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
              <Package className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Снабжение</span>
          </button>`;

const desktopProd = `          <button 
            onClick={() => setActiveTab("production")}
            className={\`w-full flex flex-col items-center justify-center py-4 transition-all active:scale-95 group \${activeTab === 'production' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}\`}
          >
            <div className={\`px-5 py-1.5 mb-1.5 rounded-full transition-colors \${activeTab === 'production' ? 'bg-slate-200 dark:bg-slate-700' : 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}\`}>
              <Factory className="w-6 h-6" strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium tracking-wide">Пр-во</span>
          </button>`;

const desktopFind = desktopSupply + "\n\n" + desktopProd;
const desktopReplace = desktopProd + "\n\n" + desktopSupply;

code = code.replace(desktopFind, desktopReplace);

fs.writeFileSync("src/components/AdminPanel.tsx", code);
console.log("Swapped menus");
