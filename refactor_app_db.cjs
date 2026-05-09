const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const imports = "import { subscribeToUserSettings, saveUserSettingsToCloud, subscribeToSystemData, saveSystemDataToCloud } from './services/db/userSettingsService';\n";
code = code.replace('import { doc, onSnapshot, setDoc } from "firebase/firestore";', imports);

/*
Line 204:
      const unsubscribe = onSnapshot(
        doc(db, "admin_data", "prices"),
        (docSnap) => {
*/
code = code.replace(/      const unsubscribe = onSnapshot\\(\\n        doc\\(db, "admin_data", "prices"\\),\\n        \\(docSnap\\) => \\{\\n          if \\(docSnap.exists\\(\\)\\) \\{\\n            const data = docSnap.data\\(\\);/g,
  \`      const unsubscribe = subscribeToSystemData(db, "prices", (data) => {\n          if (data) {\`);

// Find user settings onSnapshot line 327
/*
      const unsubscribe = onSnapshot(
        doc(db, "users", user.uid, "settings", "preferences"),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
*/
code = code.replace(/      const unsubscribe = onSnapshot\\(\\n        doc\\(db, "users", user.uid, "settings", "preferences"\\),\\n        \\(docSnap\\) => \\{\\n          if \\(docSnap.exists\\(\\)\\) \\{\\n            const data = docSnap.data\\(\\);/g,
  \`      const unsubscribe = subscribeToUserSettings(db, user.uid, (data) => {\n          if (data) {\`);

/*
Line 469:
        await setDoc(pricesDocRef, payload, { merge: true });
*/
code = code.replace(/        const pricesDocRef = doc\\(db, "admin_data", "prices"\\);\\n        await setDoc\\(pricesDocRef, payload, \\{ merge: true \\}\\);/g,
  \`        await saveSystemDataToCloud(db, "prices", payload);\`);

/*
Line 483:
        await setDoc(userSettingsRef, { ...
        }, { merge: true });
*/
code = code.replace(/        const userSettingsRef = doc\\(db, "users", user.uid, "settings", "preferences"\\);\\n        await setDoc\\(userSettingsRef, \\{(.*?)\\}, \\{ merge: true \\}\\);/gs,
  \`        await saveUserSettingsToCloud(db, user.uid, {$1});\`);

fs.writeFileSync('src/App.tsx', code);
