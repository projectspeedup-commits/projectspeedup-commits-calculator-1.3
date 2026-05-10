import { backendService } from "../api/backendService";

export const subscribeToUserHistory = (
  db: any,
  userId: string | undefined,
  onData: (data: any[]) => void,
  onError: (error: any) => void,
) => {
  if (!userId) {
    onData([]);
    return () => {};
  }

  let isMounted = true;
  let interval: ReturnType<typeof setInterval>;

  const fetchData = async () => {
    try {
      const data = await backendService.getCalculations(userId);
      if (isMounted) {
        onData(data);
      }
    } catch (e) {
      if (isMounted) {
        onError(e);
      }
    }
  };

  fetchData();
  interval = setInterval(fetchData, 10000); // Poll every 10s

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
};

export const saveCalculationToCloud = async (
  db: any,
  payload: any,
) => {
  try {
    const res = await backendService.saveCalculation(payload);
    return res.id;
  } catch (err) {
    throw err;
  }
};

export const deleteCalculationFromCloud = async (
  db: any,
  id: string,
) => {
  try {
    await backendService.deleteCalculation(id);
  } catch (err) {
    throw err;
  }
};

export const clearUserHistoryFromCloud = async (
  db: any,
  savedCalculations: any[],
) => {
  if (savedCalculations.length === 0) return 0;
  const userId = savedCalculations[0]?.userId;
  if (!userId) return 0;

  try {
    await backendService.clearHistory(userId);
  } catch (err) {
    throw err;
  }
  return savedCalculations.length;
};
