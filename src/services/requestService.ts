
'use server';

import { getDb } from '@/lib/firebase-admin';

export interface Request {
  id: string;
  note: string;
  phone?: string;
  date: string; // Storing date as ISO string
}

const getRequestsCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('requests');
};

export async function getRequests(): Promise<Request[]> {
  try {
    const requestsCollection = await getRequestsCollection();
    if (!requestsCollection) return [];
    
    const snapshot = await requestsCollection.orderBy('date', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
  } catch (error) {
    console.error("Error fetching requests:", error);
    return [];
  }
}

export async function addRequest(note: string, phone?: string): Promise<{ success: boolean; message: string }> {
  try {
     const requestsCollection = await getRequestsCollection();
    if (!requestsCollection) {
        return { success: false, message: "Database not configured." };
    }
    if (!note || note.trim().length === 0) {
        return { success: false, message: "Note cannot be empty." };
    }
    const newRequest = {
        note,
        phone: phone || "",
        date: new Date().toISOString(),
    };
    await requestsCollection.add(newRequest);
    return { success: true, message: "Request added successfully." };
  } catch (error) {
      console.error("Error adding request:", error);
      return { success: false, message: "Failed to add request." };
  }
}

export async function deleteRequest(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const requestsCollection = await getRequestsCollection();
    if (!requestsCollection) {
        return { success: false, message: "Database not configured." };
    }
    await requestsCollection.doc(id).delete();
    return { success: true, message: "Request deleted successfully." };
  } catch (error) {
    console.error("Error deleting request:", error);
    return { success: false, message: "Failed to delete request." };
  }
}
