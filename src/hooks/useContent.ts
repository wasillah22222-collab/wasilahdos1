import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

export const useContent = (collectionName: string, documentId?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (documentId) {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
      } else {
        const q = query(collection(db, collectionName), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
      }
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionName, documentId]);

  const updateContent = async (id: string, updates: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      await fetchData();
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    }
  };

  const createContent = async (data: any) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await fetchData();
    } catch (err) {
      console.error('Error creating content:', err);
      throw err;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      await fetchData();
    } catch (err) {
      console.error('Error deleting content:', err);
      throw err;
    }
  };

  const upsertContent = async (id: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
      await fetchData();
    } catch (err) {
      console.error('Error upserting content:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    updateContent,
    createContent,
    deleteContent,
    upsertContent,
    refetch: fetchData
  };
};
