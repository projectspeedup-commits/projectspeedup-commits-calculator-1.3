const fs = require('fs');
const path = require('path');

['src/components/production', 'src/components/supply'].forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (!file.endsWith('.tsx')) return;
        const p = path.join(dir, file);
        let c = fs.readFileSync(p, 'utf8');
        
        let changed = false;

        // Fix missing 'i' in CalcSection and SupplyCalcSection
        if (file === 'CalcSection.tsx' || file === 'SupplyCalcSection.tsx') {
            const oldStr = '{calculationResults.map((res: any) => (';
            const newStr = '{calculationResults.map((res: any, i: number) => (';
            if (c.includes(oldStr)) {
                c = c.replace(oldStr, newStr);
                changed = true;
            }
        }

        // We need to fix duplicated classNames that are created possibly by the regex logic earlier
        // Wait, "JSX elements cannot have multiple attributes with the same name."
        // We might have `className="xyz" className="abc"` or `className={`...`} className="abc"` etc.
        const duplicateClassPatternStr = /className=\"[^\"]*\"\s+className=\"[^\"]*\"/g;
        while (c.match(duplicateClassPatternStr)) {
            c = c.replace(/className=\"([^\"]*)\"\s+className=\"([^\"]*)\"/g, 'className="$1 $2"');
            changed = true;
        }

        const exactDuplicateClassRegexMix1 = /className=\"([^\"]*)\"\s+className=\{([^}]*)\}/g;
        while (c.match(exactDuplicateClassRegexMix1)) {
            c = c.replace(exactDuplicateClassRegexMix1, 'className={`$1 ${$2}`}');
            changed = true;
        }

        const exactDuplicateClassRegexMix2 = /className=\{([^}]*)\}\s+className=\"([^\"]*)\"/g;
        while (c.match(exactDuplicateClassRegexMix2)) {
            c = c.replace(exactDuplicateClassRegexMix2, 'className={`$2 ${$1}`}');
            changed = true;
        }

        if (changed) {
            fs.writeFileSync(p, c);
            console.log("Fixed", p);
        }
    });
});
