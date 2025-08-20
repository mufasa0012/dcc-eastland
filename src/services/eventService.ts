
'use server';

import { getDb } from '@/lib/firebase-admin';

export interface Event {
  id: string;
  title: string;
  date: string; // Storing date as ISO string
  time: string;
  description: string;
}

export type EventInput = Omit<Event, 'id'>;

const getEventsCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('events');
};

export async function getEvents(): Promise<Event[]> {
  try {
    const eventsCollection = await getEventsCollection();
    if (!eventsCollection) return [];
    
    const snapshot = await eventsCollection.orderBy('date', 'asc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
  } catch (error) {
    console.error("Error fetching events:", error);
    // Return empty array on error to prevent site crash
    return [];
  }
}

export async function addEvent(eventData: EventInput): Promise<{ success: boolean; message: string }> {
  try {
    const eventsCollection = await getEventsCollection();
    if (!eventsCollection) {
        return { success: false, message: "Database not configured." };
    }
    await eventsCollection.add(eventData);
    return { success: true, message: "Event added successfully." };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, message: "Failed to add event." };
  }
}

export async function updateEvent(id: string, eventData: EventInput): Promise<{ success: boolean; message: string }> {
    try {
        const eventsCollection = await getEventsCollection();
        if (!eventsCollection) {
            return { success: false, message: "Database not configured." };
        }
        await eventsCollection.doc(id).update(eventData);
        return { success: true, message: "Event updated successfully." };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, message: "Failed to update event." };
    }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const eventsCollection = await getEventsCollection();
    if (!eventsCollection) {
        return { success: false, message: "Database not configured." };
    }
    await eventsCollection.doc(id).delete();
    return { success: true, message: "Event deleted successfully." };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, message: "Failed to delete event." };
  }
}
