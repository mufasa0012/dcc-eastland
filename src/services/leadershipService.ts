
'use server';

import { z } from 'zod';
import { imagekit } from '@/lib/imagekit';
import { getDb } from '@/lib/firebase-admin';

const LeadershipSchema = z.object({
  name: z.string().min(1, "Name is required."),
  title: z.string().min(1, "Title is required."),
  imageUrl: z.string().url("A valid image URL is required."),
  imageFileId: z.string().optional(),
});

export type LeadershipMemberInput = z.infer<typeof LeadershipSchema>;

export interface LeadershipMember extends LeadershipMemberInput {
  id: string;
}

const getLeadershipCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('leadership');
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
            folder: '/church-leadership/'
        });

        return { success: true, url: response.url, fileId: response.fileId, message: "Image uploaded successfully."};
    } catch (error) {
        console.error("Image upload error: ", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Image upload failed: ${errorMessage}` };
    }
}


export async function getLeadership(): Promise<LeadershipMember[]> {
    try {
        const leadershipCollection = await getLeadershipCollection();
        if (!leadershipCollection) return [];
        
        const snapshot = await leadershipCollection.orderBy('name', 'asc').get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadershipMember));
    } catch (error) {
        console.error("Error fetching leadership:", error);
        return [];
    }
}

export async function addLeadershipMember(memberData: LeadershipMemberInput): Promise<{ success: boolean; message: string }> {
  try {
    const leadershipCollection = await getLeadershipCollection();
    if (!leadershipCollection) {
        return { success: false, message: "Database not configured." };
    }
    await leadershipCollection.add(memberData);
    return { success: true, message: "Leadership member added successfully." };
  } catch (error) {
    console.error("Error adding leadership member:", error);
    return { success: false, message: "Failed to add leadership member." };
  }
}

export async function updateLeadershipMember(id: string, memberData: LeadershipMemberInput): Promise<{ success: boolean; message: string }> {
    try {
        const leadershipCollection = await getLeadershipCollection();
        if (!leadershipCollection) {
            return { success: false, message: "Database not configured." };
        }
        const docRef = leadershipCollection.doc(id);
        const oldDoc = await docRef.get();

        // Only try to delete the old image if it exists and a new one was uploaded
        if (oldDoc.exists && memberData.imageFileId && oldDoc.data()?.imageFileId && oldDoc.data()?.imageFileId !== memberData.imageFileId) {
            try {
                await imagekit?.deleteFile(oldDoc.data()?.imageFileId);
            } catch (deleteError) {
                console.warn(`Could not delete old leadership image (${oldDoc.data()?.imageFileId}):`, deleteError);
            }
        }
        
        await docRef.update(memberData);

        return { success: true, message: "Leadership member updated successfully." };
    } catch (error) {
        console.error("Error updating leadership member:", error);
        return { success: false, message: "Failed to update leadership member." };
    }
}

export async function deleteLeadershipMember(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const leadershipCollection = await getLeadershipCollection();
    if (!leadershipCollection) {
        return { success: false, message: "Database not configured." };
    }
    const docRef = leadershipCollection.doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
        return { success: false, message: "Leadership member not found." };
    }
    const memberData = doc.data() as LeadershipMember;

    await docRef.delete();

    if (memberData.imageFileId && imagekit) {
        try {
            await imagekit.deleteFile(memberData.imageFileId);
        } catch (deleteError) {
            console.warn(`Could not delete leadership image (${memberData.imageFileId}):`, deleteError);
        }
    }
    
    return { success: true, message: "Leadership member deleted successfully." };
  } catch (error) {
    console.error("Error deleting leadership member:", error);
    return { success: false, message: "Failed to delete leadership member." };
  }
}
