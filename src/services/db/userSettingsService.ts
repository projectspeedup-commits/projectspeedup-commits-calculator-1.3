import { backendService } from "../api/backendService";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export const subscribeToUserSettings = (
  db: any,
  userId: string,
  onData: (data: any) => void,
  onError?: (error: any) => void,
  usePostgres: boolean = false
) => {
  if (!userId) return () => {};

  if (!usePostgres && db) {
    return onSnapshot(
      doc(db, "users", userId, "settings", "preferences"),
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
      const data = await backendService.getSettings(userId);
      if (isMounted) onData(data);
    } catch (e) {
      if (isMounted && onError) onError(e);
    }
  };

  fetchData();
  interval = setInterval(fetchData, 10000); // 10 seconds poll

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
};

export const saveUserSettingsToCloud = async (
  db: any,
  userId: string,
  payload: any,
  usePostgres: boolean = false
) => {
  if (!userId) return;
  try {
    if (usePostgres) {
      await backendService.saveSettings(userId, payload);
    } else if (db) {
      await setDoc(doc(db, "users", userId, "settings", "preferences"), payload);
    }
  } catch (e) {
    console.error("Failed to save settings", e);
  }
};

export const subscribeToSystemData = (
  db: any,
  collectionName: string,
  type: string,
  onData: (data: any) => void,
  onError?: (error: any) => void,
  usePostgres: boolean = false
) => {
  if (!usePostgres && db) {
    return onSnapshot(
      doc(db, collectionName, type),
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
      const data = await backendService.getAdminData(`${collectionName}_${type}`);
      if (isMounted) onData(data);
    } catch (e) {
      if (isMounted && onError) onError(e);
    }
  };

  fetchData();
  interval = setInterval(fetchData, 10000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
};

export const saveSystemDataToCloud = async (
  db: any,
  collectionName: string,
  type: string,
  payload: any,
  usePostgres: boolean = false
) => {
  try {
    if (usePostgres) {
      console.log(`Saving to Postgres: ${collectionName}_${type}`);
      await backendService.saveAdminData(`${collectionName}_${type}`, payload);
      console.log(`Successfully saved to Postgres: ${collectionName}_${type}`);
    } else if (db) {
      console.log(`Saving to Firebase: ${collectionName}/${type}`);
      await setDoc(doc(db, collectionName, type), payload);
      console.log(`Successfully saved to Firebase: ${collectionName}/${type}`);
    }
  } catch (e) {
    console.warn(`Failed to save system data to ${usePostgres ? 'Postgres' : 'Firebase'}:`, e);
  }
};
