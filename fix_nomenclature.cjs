const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const helper = `  // Format supply nomenclature based on profile and marka
  const getSupplyNomenclature = (sp: any) => {
    if (!sp) return "";
    const marka = sp["Марка стали"];
    const profile = sp["Профиль"];
    if (marka) {
      if (profile) {
        let gost = String(profile);
        const p = gost.toLowerCase();
        if (p.includes('круг')) gost = "Гост 2590-2006";
        else if (p.includes('шестигранник')) gost = "Гост 2879-2006";
        else if (p.includes('квадрат')) gost = "Гост 2591-2006";
        else if (p.includes('полоса')) gost = "Гост 103-2006";
        return \`ГОСТ= \${marka} / \${gost}\`;
      }
      return \`ГОСТ= \${marka}\`;
    }
    return sp["Номенклатура"] || sp["NOMENCLATURE"] || "";
  };`;

if (!content.includes('getSupplyNomenclature')) {
  // inject it somewhere appropriate, e.g. before "const formatDate"
  content = content.replace(
    /  \/\/ Helper for date formatting/,
    helper + '\n\n  // Helper for date formatting'
  );
}

// In export (first match)
content = content.replace(
  /outRow\[29\] = sp\["Номенклатура"\] \|\| sp\["NOMENCLATURE"\] \|\| "";/g,
  'outRow[29] = getSupplyNomenclature(sp);'
);

// In Export 2 (if any)
content = content.replace(
  /outRow\[28\] = sp\["Номенклатура"\] \|\| sp\["NOMENCLATURE"\] \|\| "";/g,
  'outRow[28] = getSupplyNomenclature(sp);'
);

// In UI table
const oldUITable = `{supplyItem ? <div className="max-w-[150px] truncate font-medium text-[10px]" title={supplyItem["Номенклатура"] || supplyItem["NOMENCLATURE"]}>{supplyItem["Номенклатура"] || supplyItem["NOMENCLATURE"] || ""}</div> : ""}`;
const newUITable = `{supplyItem ? <div className="max-w-[150px] truncate font-medium text-[10px]" title={getSupplyNomenclature(supplyItem)}>{getSupplyNomenclature(supplyItem)}</div> : ""}`;

content = content.replace(oldUITable, newUITable);

fs.writeFileSync('src/components/AdminPanel.tsx', content);
