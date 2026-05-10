import { backendService, CalculationData } from "../api/backendService";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  writeBatch,
  serverTimestamp
} from "firebase/firestore";

export const subscribeToUserHistory = (
  db: any,
  userId: string | undefined,
  onData: (data: any[]) => void,
  onError: (error: any) => void,
  usePostgres: boolean = false
) => {
  if (!userId) {
    onData([]);
    return () => {};
  }

  if (!usePostgres && db) {
    const q = query(
      collection(db, "calculations"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      onData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      onError(error);
    });
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
  usePostgres: boolean = false
) => {
  try {
    if (usePostgres) {
      const res = await backendService.saveCalculation(payload);
      return res.id;
    } else if (db) {
      const docRef = await addDoc(collection(db, "calculations"), {
        ...payload,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteCalculationFromCloud = async (
  db: any,
  id: string,
  usePostgres: boolean = false
) => {
  try {
    if (usePostgres) {
      await backendService.deleteCalculation(id);
    } else if (db) {
      await deleteDoc(doc(db, "calculations", id));
    }
  } catch (err) {
    throw err;
  }
};

export const clearUserHistoryFromCloud = async (
  db: any,
  savedCalculations: any[],
  usePostgres: boolean = false
) => {
  if (savedCalculations.length === 0) return 0;
  const userId = savedCalculations[0]?.userId;
  if (!userId) return 0;

  try {
    if (usePostgres) {
      await backendService.clearHistory(userId);
    } else if (db) {
      const q = query(collection(db, "calculations"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }
  } catch (err) {
    throw err;
  }
  return savedCalculations.length;
};
