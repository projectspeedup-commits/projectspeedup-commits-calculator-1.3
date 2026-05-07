const fs = require("fs");
let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

content = content.replace(
  /className="flex items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50"/g,
  'className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white dark:bg-[#121411] sm:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"',
);

content = content.replace(
  /className="flex items-center justify-center p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500\/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500\/20 hover:bg-indigo-100 dark:hover:bg-indigo-500\/30"/g,
  'className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30"',
);

fs.writeFileSync("src/components/AdminPanel.tsx", content);
