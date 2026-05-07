const fs = require("fs");
let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

content = content.replace(
  /className=\{`flex w-full items-center justify-center gap-1\.5 px-2 py-2 sm:px-4 sm:py-2 rounded-xl text-\[9px\] sm:text-\[12px\] font-bold transition-all shadow-sm \$\{\n\s*copySuccess \n\s*\? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900\/30 dark:text-emerald-400" \n\s*: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"\n\s*\}\`\}\n\s*title="Скопировать заявку для вставки \(Ctrl\+V\) в Google Таблицы"\n\s*>\n\s*\{copySuccess \? \(\n\s*<>\n\s*<svg [^>]+>.*?<\/svg>\n\s*<span className="truncate">Скопировано!<\/span>\n\s*<\/>\n\s*\) : \(\n\s*<>\n\s*<svg [^>]+>.*?<\/svg>\n\s*<span className="truncate">Копировать<\/span>\n\s*<\/>\n\s*\)\}\n\s*<\/button>/s,
  `className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50"\n                      title="Скопировать заявку для вставки (Ctrl+V) в Google Таблицы"\n                    >\n                      {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}\n                    </button>`,
);

content = content.replace(
  /className="flex w-full items-center justify-center gap-1\.5 px-2 py-2 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-\[9px\] sm:text-\[12px\] font-bold transition-colors shadow-sm"\n\s*>\n\s*<svg [^>]+>.*?<\/svg>\n\s*<span className="truncate">Скачать XLSX<\/span>\n\s*<\/button>/s,
  `className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"\n                      title="Скачать в Excel"\n                    >\n                      <Download className="w-4 h-4" />\n                    </button>`,
);

fs.writeFileSync("src/components/AdminPanel.tsx", content);
