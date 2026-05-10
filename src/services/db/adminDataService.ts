import { backendService } from "../api/backendService";

// Helper for polling since backendService is single fetch
export const subscribeToAdminData = (
  db: any,
  type: "prod_data" | "sup_data",
  onData: (data: any) => void,
  onError?: (error: any) => void,
) => {
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
) => {
  try {
    await backendService.saveAdminData(type, payload);
  } catch (e) {
    console.warn("Cloud save failed", e);
    throw e;
  }
};
