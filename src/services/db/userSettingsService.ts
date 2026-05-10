import { backendService } from "../api/backendService";

export const subscribeToUserSettings = (
  db: any,
  userId: string,
  onData: (data: any) => void,
  onError?: (error: any) => void,
) => {
  if (!userId) return () => {};

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
  interval = setInterval(fetchData, 60000); // 1 minute poll

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
};

export const saveUserSettingsToCloud = async (
  db: any,
  userId: string,
  payload: any,
) => {
  if (!userId) return;
  try {
    await backendService.saveSettings(userId, payload);
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
) => {
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
  interval = setInterval(fetchData, 60000);

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
) => {
  try {
    await backendService.saveAdminData(`${collectionName}_${type}`, payload);
  } catch (e) {
    console.warn("Failed to save system data", e);
  }
};
