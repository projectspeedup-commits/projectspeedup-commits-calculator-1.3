import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  doc,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const databaseId = (firebaseConfig as any).firestoreDatabaseId;
let db: any;

try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  }, databaseId);
} catch (e) {
  db = getFirestore(app, databaseId);
}

// CRITICAL: Validate Connection to Firestore on boot
async function testConnection() {
  try {
    // Only attempt the network connection check, ignore permission errors
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error(
        "Please check your Firebase configuration. The client is offline.",
      );
    }
  }
}
testConnection();

const appId = firebaseConfig.projectId;

export { app, auth, db, appId };
