
'use server';

import { imagekit } from '@/lib/imagekit';
import { getDb } from '@/lib/firebase-admin';

export interface MinistriesPageContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageFileId?: string;
}

const DOC_ID = 'ministries-page-content';
const getContentCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('content');
};

const defaultMinistriesPageContent: MinistriesPageContent = {
    title: "Our Ministries",
    subtitle: "Find your place to serve and grow within our church family.",
    imageUrl: "https://placehold.co/1600x400.png"
};

export async function getMinistriesPageContent(): Promise<MinistriesPageContent> {
  try {
    const contentCollection = await getContentCollection();
    if (!contentCollection) return defaultMinistriesPageContent;

    const doc = await contentCollection.doc(DOC_ID).get();
    if (!doc.exists) {
      return defaultMinistriesPageContent;
    }
    return doc.data() as MinistriesPageContent;
  } catch (error) {
    console.error("Error fetching ministries page content:", error);
    return defaultMinistriesPageContent;
  }
}

export async function saveMinistriesPageContent(content: MinistriesPageContent): Promise<{ success: boolean; message: string }> {
  try {
    const contentCollection = await getContentCollection();
    if (!contentCollection) {
        return { success: false, message: "Database not configured." };
    }
    await contentCollection.doc(DOC_ID).set(content, { merge: true });
    return { success: true, message: "Ministries page content updated successfully!" };
  } catch (error) {
    console.error("Error saving ministries page content:", error);
    return { success: false, message: "Failed to save ministries page content." };
  }
}

export async function uploadMinistriesPageImage(formData: FormData): Promise<{ success: boolean; url?: string, fileId?: string; message: string }> {
    const file = formData.get('image') as File;
    if (!file) {
        return { success: false, message: "No image file provided." };
    }

    try {
        const currentContent = await getMinistriesPageContent();
        
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: file.name,
            folder: '/church-ministries-page/'
        });

        if (currentContent.imageFileId) {
            try {
                await imagekit.deleteFile(currentContent.imageFileId);
            } catch (deleteError) {
                console.warn(`Could not delete old ministries page image (${currentContent.imageFileId}):`, deleteError);
            }
        }

        return { success: true, url: response.url, fileId: response.fileId, message: "Image uploaded successfully."};
    } catch (error) {
        console.error("Image upload error: ", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Image upload failed: ${errorMessage}` };
    }
}
