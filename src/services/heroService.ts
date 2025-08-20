
'use server';

import { imagekit } from '@/lib/imagekit';
import { getDb } from '@/lib/firebase-admin';

export interface HeroContent {
  headline: string;
  subheadline: string;
  serviceTimes: string;
  address: string;
  buttonText: string;
  imageUrl: string;
  imageFileId?: string;
}

const DOC_ID = 'hero-content';
const getContentCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('content');
};

const defaultHeroContent: HeroContent = {
    headline: "Welcome to the Disciple of Christ Church",
    subheadline: "Eastland Parish — A place to believe, belong, and become.",
    serviceTimes: "Service Times: Sundays at 9:00 AM & 11:00 AM",
    address: "123 Church Street, Eastland",
    buttonText: "Plan Your Visit",
    imageUrl: "https://placehold.co/1600x900.png"
};

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const contentCollection = await getContentCollection();
    if (!contentCollection) return defaultHeroContent;
    
    const doc = await contentCollection.doc(DOC_ID).get();
    if (!doc.exists) {
      return defaultHeroContent;
    }
    return doc.data() as HeroContent;
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return defaultHeroContent;
  }
}

export async function saveHeroContent(content: HeroContent): Promise<{ success: boolean; message: string }> {
  try {
    const contentCollection = await getContentCollection();
    if (!contentCollection) {
        return { success: false, message: "Database not configured." };
    }
    await contentCollection.doc(DOC_ID).set(content, { merge: true });
    return { success: true, message: "Hero content updated successfully!" };
  } catch (error) {
    console.error("Error saving hero content:", error);
    return { success: false, message: "Failed to save hero content." };
  }
}

export async function uploadHeroImage(formData: FormData): Promise<{ success: boolean; url?: string, fileId?: string; message: string }> {
    const file = formData.get('image') as File;
    if (!file) {
        return { success: false, message: "No image file provided." };
    }

    try {
        const currentContent = await getHeroContent();
        
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: file.name,
            folder: '/church-hero/'
        });

        if (currentContent.imageFileId) {
            try {
                await imagekit.deleteFile(currentContent.imageFileId);
            } catch (deleteError) {
                console.warn(`Could not delete old hero image (${currentContent.imageFileId}):`, deleteError);
            }
        }

        return { success: true, url: response.url, fileId: response.fileId, message: "Image uploaded successfully."};
    } catch (error) {
        console.error("Image upload error: ", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, message: `Image upload failed: ${errorMessage}` };
    }
}
