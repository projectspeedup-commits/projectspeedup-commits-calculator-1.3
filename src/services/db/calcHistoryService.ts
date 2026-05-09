import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  writeBatch,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../../lib/utils";

export const subscribeToUserHistory = (
  db: Firestore | undefined | null,
  userId: string | undefined,
  onData: (data: any[]) => void,
  onError: (error: any) => void,
) => {
  if (!db || !userId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, "calculations"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const history = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });
      onData(history);
    },
    (err) => {
      onError(err);
      try {
        handleFirestoreError(err, OperationType.GET, "calculations");
      } catch (e) {}
    },
  );
};

export const saveCalculationToCloud = async (
  db: Firestore | undefined | null,
  payload: any,
) => {
  if (!db) return null;
  payload.createdAt = serverTimestamp();

  try {
    const docRef = await addDoc(collection(db, "calculations"), payload);
    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, "calculations");
    throw err;
  }
};

export const deleteCalculationFromCloud = async (
  db: Firestore | undefined | null,
  id: string,
) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, "calculations", id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `calculations/${id}`);
    throw err;
  }
};

export const clearUserHistoryFromCloud = async (
  db: Firestore | undefined | null,
  savedCalculations: any[],
) => {
  if (!db || savedCalculations.length === 0) return 0;

  const totalDocs = savedCalculations.length;
  const BATCH_SIZE = 500;
  let deletedCount = 0;

  for (let i = 0; i < totalDocs; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = savedCalculations.slice(i, i + BATCH_SIZE);
    chunk.forEach((calc) => {
      batch.delete(doc(db, "calculations", calc.id));
      deletedCount++;
    });
    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, "calculations (batch)");
      throw err;
    }
  }

  return deletedCount;
};
