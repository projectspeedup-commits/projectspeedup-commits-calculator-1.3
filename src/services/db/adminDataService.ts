import { backendService } from "../api/backendService";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Helper for polling since backendService is single fetch
export const subscribeToAdminData = (
  db: any,
  type: "prod_data" | "sup_data",
  onData: (data: any) => void,
  onError?: (error: any) => void,
  usePostgres: boolean = false
) => {
  if (!usePostgres && db) {
    return onSnapshot(
      doc(db, "admin_data", type),
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        } else {
          onData(null);
        }
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  }

  let isMounted = true;
  let interval: ReturnType<typeof setInterval>;

  const fetchData = async () => {
    try {
      const data = await backendService.getAdminData(type);
      if (isMounted) {
        onData(data);
      }
    } catch (e) {
      if (isMounted && onError) {
        onError(e);
      }
    }
  };

  fetchData();
  interval = setInterval(fetchData, 15000); // Poll every 15s

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
};

export const saveAdminDataToCloud = async (
  db: any,
  type: "prod_data" | "sup_data" | "economy" | "system",
  payload: any,
  usePostgres: boolean = false
) => {
  try {
    if (usePostgres) {
      await backendService.saveAdminData(type, payload);
    } else if (db) {
      await setDoc(doc(db, "admin_data", type), payload);
    }
  } catch (e) {
    console.warn("Cloud save failed", e);
    throw e;
  }
};
