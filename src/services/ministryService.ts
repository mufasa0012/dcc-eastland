
'use server';

import { z } from 'zod';
import { imagekit } from '@/lib/imagekit';
import { getDb } from '@/lib/firebase-admin';

const MinistrySchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  imageUrl: z.string().url("A valid image URL is required.").optional(),
  imageFileId: z.string().optional(),
});

export type MinistryInput = z.infer<typeof MinistrySchema>;
export interface Ministry extends MinistryInput {
  id: string;
}

const getMinistriesCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('ministries');
};

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string, fileId?: string; message: string }> {
    const file = formData.get('image') as File;
    if (!file) {
        return { success: false, message: "No image file provided." };
    }

    try {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: file.name,
            folder: '/church-ministries/'
        });

        return { success: true, url: response.url, fileId: response.fileId, message: "Image uploaded successfully."};
    } catch (error) {
        console.error("Image upload error: ", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Image upload failed: ${errorMessage}` };
    }
}

export async function getMinistries(): Promise<Ministry[]> {
  try {
    const ministriesCollection = await getMinistriesCollection();
    if (!ministriesCollection) return [];

    const snapshot = await ministriesCollection.orderBy('name', 'asc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ministry));
  } catch (error) {
    console.error("Error fetching ministries:", error);
    return [];
  }
}

export async function addMinistry(ministryData: MinistryInput): Promise<{ success: boolean; message: string }> {
  try {
    const ministriesCollection = await getMinistriesCollection();
    if (!ministriesCollection) {
        return { success: false, message: "Database not configured." };
    }
    await ministriesCollection.add(ministryData);
    return { success: true, message: "Ministry added successfully." };
  } catch (error) {
    console.error("Error adding ministry:", error);
    return { success: false, message: "Failed to add ministry." };
  }
}

export async function updateMinistry(id: string, ministryData: MinistryInput): Promise<{ success: boolean; message: string }> {
    try {
        const ministriesCollection = await getMinistriesCollection();
        if (!ministriesCollection) {
            return { success: false, message: "Database not configured." };
        }
        const docRef = ministriesCollection.doc(id);
        const oldDoc = await docRef.get();

        if (oldDoc.exists && ministryData.imageFileId && oldDoc.data()?.imageFileId && oldDoc.data()?.imageFileId !== ministryData.imageFileId) {
             try {
                await imagekit?.deleteFile(oldDoc.data()?.imageFileId);
            } catch (deleteError) {
                console.warn(`Could not delete old ministry image (${oldDoc.data()?.imageFileId}):`, deleteError);
            }
        }
        
        await docRef.update(ministryData);
        return { success: true, message: "Ministry updated successfully." };
    } catch (error) {
        console.error("Error updating ministry:", error);
        return { success: false, message: "Failed to update ministry." };
    }
}

export async function deleteMinistry(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const ministriesCollection = await getMinistriesCollection();
     if (!ministriesCollection) {
        return { success: false, message: "Database not configured." };
    }
    const docRef = ministriesCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
        return { success: false, message: "Ministry not found." };
    }
    const ministryData = doc.data() as Ministry;

    await docRef.delete();

    if (ministryData.imageFileId && imagekit) {
        try {
            await imagekit.deleteFile(ministryData.imageFileId);
        } catch (deleteError) {
            console.warn(`Could not delete ministry image (${ministryData.imageFileId}):`, deleteError);
        }
    }
    return { success: true, message: "Ministry deleted successfully." };
  } catch (error) {
    console.error("Error deleting ministry:", error);
    return { success: false, message: "Failed to delete ministry." };
  }
}
