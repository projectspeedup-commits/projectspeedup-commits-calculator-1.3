const fs = require("fs");

let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");
const prodIdx = code.indexOf('activeTab === "production"');
let preCode = code.substring(0, prodIdx);
let prodCode = code.substring(prodIdx);

const r1 =
  /<td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800\/50 md:border-0 min-h-\[44px\]">\s*<span className="md:hidden font-bold text-slate-500 uppercase text-\[10px\]">Номенклатура заг\.<\/span>[\s\S]*?<td className="px-4 md:px-5 py-3 flex justify-between items-center md:table-cell border-b border-slate-100 dark:border-slate-800\/50 md:border-0 min-h-\[44px\]">\s*<span className="md:hidden font-bold text-amber-500 uppercase text-\[10px\]">КИМ \/ Совет<\/span>[\s\S]*?<\/td>/m;

const match = prodCode.match(r1);

if (match) {
  prodCode = prodCode.replace(r1, "");
  console.log("Successfully removed TDs");
} else {
  console.log("Could not find TDs");
}

fs.writeFileSync("src/components/AdminPanel.tsx", preCode + prodCode);
