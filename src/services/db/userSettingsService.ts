import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";

export const subscribeToUserSettings = (
  db: Firestore | undefined | null,
  userId: string,
  onData: (data: any) => void,
) => {
  if (!db || !userId) return () => {};
  return onSnapshot(
    doc(db, "users", userId, "settings", "preferences"),
    (docSnap) => {
      if (docSnap.exists()) {
        onData(docSnap.data());
      }
    },
  );
};

export const saveUserSettingsToCloud = async (
  db: Firestore | undefined | null,
  userId: string,
  payload: any,
) => {
  if (!db || !userId) return;
  try {
    await setDoc(doc(db, "users", userId, "settings", "preferences"), payload, {
      merge: true,
    });
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const subscribeToSystemData = (
  db: Firestore | undefined | null,
  collectionName: string,
  type: string,
  onData: (data: any) => void,
) => {
  if (!db) return () => {};
  return onSnapshot(doc(db, collectionName, type), (docSnap) => {
    if (docSnap.exists()) {
      onData(docSnap.data());
    }
  });
};

export const saveSystemDataToCloud = async (
  db: Firestore | undefined | null,
  collectionName: string,
  type: string,
  payload: any,
) => {
  if (!db) return;
  try {
    await setDoc(doc(db, collectionName, type), payload, { merge: true });
  } catch (e) {
    console.warn("Failed to save system data", e);
  }
};
