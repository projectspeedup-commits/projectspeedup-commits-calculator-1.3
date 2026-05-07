const fs = require("fs");
let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

content = content.replace(
  /<button \n\s*onClick=\{handleCopyForSheets\}\n\s*className="h-12 w-full sm:w-auto px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2"\n\s*>\n\s*\{isCopied \? <Check className="w-4 h-4 text-emerald-500 shrink-0" \/> : <Copy className="w-4 h-4 shrink-0" \/>\}\n\s*<span className="truncate">\{isCopied \? <span className="text-emerald-500">Скопировано!<\/span> : "Копировать для sheets"\}<\/span>\n\s*<\/button>/s,
  `<button \n                           onClick={handleCopyForSheets}\n                           className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50"\n                           title="Скопировать для Excel"\n                         >\n                           {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}\n                         </button>`,
);

content = content.replace(
  /<button \n\s*onClick=\{handleExportStock\}\n\s*className="h-12 w-full sm:w-auto px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-emerald-500\/20 flex items-center justify-center gap-2"\n\s*>\n\s*<Download className="w-4 h-4 shrink-0" \/>\n\s*<span className="truncate">Скачать Excel<\/span>\n\s*<\/button>/s,
  `<button \n                           onClick={handleExportStock}\n                           className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"\n                           title="Скачать в Excel"\n                         >\n                           <Download className="w-4 h-4" />\n                         </button>`,
);

// We should also replace the container's gap possibly so the buttons don't take full width on mobile or something, but let's just make sure they look fine as is.
fs.writeFileSync("src/components/AdminPanel.tsx", content);
