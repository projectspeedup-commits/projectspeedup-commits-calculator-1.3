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

  let unsubFirebase = () => {};

  if (db) {
    unsubFirebase = onSnapshot(
      doc(db, "users", userId, "settings", "preferences"),
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        } else if (!usePostgres) {
          onData(null);
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
        const data = await backendService.getSettings(userId);
        if (isMounted && data) onData(data);
      } catch (e) {
        if (isMounted && onError) onError(e);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 10000); // 10 seconds poll
  }

  return () => {
    unsubFirebase();
    isMounted = false;
    if (interval) clearInterval(interval);
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
    const promises = [];
    if (usePostgres) {
      promises.push(backendService.saveSettings(userId, payload));
    }
    if (db) {
      promises.push(setDoc(doc(db, "users", userId, "settings", "preferences"), payload));
    }
    await Promise.allSettled(promises);
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
  let unsubFirebase = () => {};

  if (db) {
    unsubFirebase = onSnapshot(
      doc(db, collectionName, type),
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data());
        } else if (!usePostgres) {
          onData(null);
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
        const data = await backendService.getAdminData(`${collectionName}_${type}`);
        if (isMounted && data) onData(data);
      } catch (e) {
        if (isMounted && onError) onError(e);
      }
    };

    fetchData();
    interval = setInterval(fetchData, 10000);
  }

  return () => {
    unsubFirebase();
    isMounted = false;
    if (interval) clearInterval(interval);
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
    const promises = [];
    if (usePostgres) {
      console.log(`Saving to Postgres: ${collectionName}_${type}`);
      promises.push(backendService.saveAdminData(`${collectionName}_${type}`, payload));
    }
    if (db) {
      console.log(`Saving to Firebase: ${collectionName}/${type}`);
      promises.push(setDoc(doc(db, collectionName, type), payload));
    }
    await Promise.allSettled(promises);
  } catch (e) {
    console.warn(`Failed to save system data:`, e);
  }
};
