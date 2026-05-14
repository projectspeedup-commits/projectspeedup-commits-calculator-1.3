import { backendService } from "../api/backendService";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// Helper for polling since backendService is single fetch
export const subscribeToAdminData = (
  db: any,
  type: "prod_data" | "sup_data" | "economy" | "system",
  onData: (data: any) => void,
  onError?: (error: any) => void,
  usePostgres: boolean = false
) => {
  let unsubFirebase = () => {};
  let latestUpdatedAt = 0;

  const handleIncomingData = (data: any) => {
    if (!data) {
      if (!usePostgres) onData(null);
      return;
    }
    
    // Pick the newest data using updatedAt 
    const dataTime = data.updatedAt ? new Date(data.updatedAt).getTime() : 0;
    if (dataTime > latestUpdatedAt || (dataTime === latestUpdatedAt && latestUpdatedAt === 0)) {
      latestUpdatedAt = dataTime;
      onData(data);
    }
  };

  if (db) {
    unsubFirebase = onSnapshot(
      doc(db, "admin_data", type),
      (snapshot) => {
        if (snapshot.exists()) {
          handleIncomingData(snapshot.data());
        } else if (!usePostgres) {
          handleIncomingData(null);
        }
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  }

  let isMounted = true;
  let interval: ReturnType<typeof setInterval> | undefined;

  if (usePostgres) {
    const fetchData = async () => {
      try {
        const data = await backendService.getAdminData(type);
        if (isMounted && data) {
          handleIncomingData(data);
        }
      } catch (e) {
        if (isMounted && onError) {
          onError(e);
        }
      }
    };

    fetchData();
    interval = setInterval(fetchData, 15000); // Poll every 15s
  }

  return () => {
    unsubFirebase();
    isMounted = false;
    if (interval) clearInterval(interval);
  };
};

export const saveAdminDataToCloud = async (
  db: any,
  type: "prod_data" | "sup_data" | "economy" | "system",
  payload: any,
  usePostgres: boolean = false
) => {
  try {
    const promises = [];
    if (usePostgres) {
      promises.push(backendService.saveAdminData(type, payload));
    }
    if (db) {
      promises.push(setDoc(doc(db, "admin_data", type), payload));
    }
    await Promise.allSettled(promises);
  } catch (e) {
    console.warn("Cloud save failed", e);
    throw e;
  }
};
