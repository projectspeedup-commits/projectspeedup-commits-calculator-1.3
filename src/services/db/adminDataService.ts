import { doc, onSnapshot, setDoc, Firestore } from "firebase/firestore";

export const subscribeToAdminData = (
  db: Firestore | undefined | null,
  type: "prod_data" | "sup_data",
  onData: (data: any) => void,
) => {
  if (!db) {
    onData(null);
    return () => {};
  }

  return onSnapshot(doc(db, "admin_data", type), (docSnap) => {
    if (docSnap.exists()) {
      onData(docSnap.data());
    } else {
      onData(null);
    }
  });
};

export const saveAdminDataToCloud = async (
  db: Firestore | undefined | null,
  type: "prod_data" | "sup_data" | "economy" | "system",
  payload: any,
) => {
  if (!db) return;
  try {
    await setDoc(doc(db, "admin_data", type), payload, { merge: true });
  } catch (e) {
    console.warn("Cloud save failed", e);
    throw e;
  }
};
