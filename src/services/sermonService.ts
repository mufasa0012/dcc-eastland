
'use server';

import { getDb } from '@/lib/firebase-admin';

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string; // Storing date as ISO string
  audioUrl?: string;
  videoUrl?: string;
}

export type SermonInput = Omit<Sermon, 'id'>;

const getSermonsCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('sermons');
}

export async function getSermons(): Promise<Sermon[]> {
  try {
    const sermonsCollection = await getSermonsCollection();
    if (!sermonsCollection) return [];

    const snapshot = await sermonsCollection.orderBy('date', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sermon));
  } catch (error) {
    console.error("Error fetching sermons:", error);
    // Return empty array on error to prevent site crash
    return [];
  }
}

export async function addSermon(sermonData: SermonInput): Promise<{ success: boolean; message: string }> {
  try {
    const sermonsCollection = await getSermonsCollection();
    if (!sermonsCollection) {
        return { success: false, message: "Database not configured." };
    }
    await sermonsCollection.add(sermonData);
    return { success: true, message: "Sermon added successfully." };
  } catch (error) {
    console.error("Error adding sermon:", error);
    return { success: false, message: "Failed to add sermon." };
  }
}

export async function updateSermon(id: string, sermonData: SermonInput): Promise<{ success: boolean; message: string }> {
    try {
        const sermonsCollection = await getSermonsCollection();
        if (!sermonsCollection) {
            return { success: false, message: "Database not configured." };
        }
        await sermonsCollection.doc(id).update(sermonData);
        return { success: true, message: "Sermon updated successfully." };
    } catch (error) {
        console.error("Error updating sermon:", error);
        return { success: false, message: "Failed to update sermon." };
    }
}

export async function deleteSermon(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const sermonsCollection = await getSermonsCollection();
    if (!sermonsCollection) {
        return { success: false, message: "Database not configured." };
    }
    await sermonsCollection.doc(id).delete();
    return { success: true, message: "Sermon deleted successfully." };
  } catch (error) {
    console.error("Error deleting sermon:", error);
    return { success: false, message: "Failed to delete sermon." };
  }
}
