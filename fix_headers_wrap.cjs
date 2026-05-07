const fs = require("fs");

let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

// For "Расчет с учетом наличия" header (line 3269) and "Расчет с учетом поставок" (line 3921)
content = content.replace(
  /<div className={`flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-\[\#1A1C19\]`}>/g,
  "<div className={`flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 xl:p-6 pb-2 sm:pb-3 xl:pb-6 bg-white dark:bg-[#1A1C19]`}>",
);

content = content.replace(
  /<div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 xl:border-r border-slate-200 dark:border-slate-800 xl:pr-6 w-full xl:w-auto`}>/g,
  "<div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 2xl:border-r border-slate-200 dark:border-slate-800 2xl:pr-6 w-full 2xl:w-auto`}>",
);

content = content.replace(
  /<div className="flex flex-wrap gap-2 sm:gap-4 w-full xl:w-auto">/g,
  '<div className="flex flex-wrap gap-2 sm:gap-4 w-full 2xl:w-auto">',
);

content = content.replace(
  /<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full xl:w-auto`}>/g,
  "<div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full 2xl:w-auto flex-wrap`}>",
);

fs.writeFileSync("src/components/AdminPanel.tsx", content);
