
'use server';

import { getDb } from '@/lib/firebase-admin';

export interface AboutContent {
  identity: string;
  mission: string;
  beliefs: string;
  history: string;
  vision: string;
}

const DOC_ID = 'about-content';
const getAboutCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('content');
};

const defaultAboutContent: AboutContent = {
    identity: "We are a Christ-centered, Bible-based community, committed to loving God and loving others.",
    mission: "To know Christ and to make Him known, fostering a community of believers dedicated to worship, fellowship, and service.",
    beliefs: "We hold to the historic tenets of the Christian faith, affirming the Bible as the inspired Word of God and Jesus Christ as our Lord and Savior.",
    history: "Founded in 1924, our church has been a spiritual home in Eastland for a century, growing in faith and community through generations.",
    vision: "To be a beacon of hope and a center for spiritual growth, reaching our community and the world with the transformative message of the Gospel.",
};

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const aboutCollection = await getAboutCollection();
    if (!aboutCollection) return defaultAboutContent;

    const doc = await aboutCollection.doc(DOC_ID).get();
    if (!doc.exists) {
      // Return default content if nothing is in the database
      return defaultAboutContent;
    }
    return doc.data() as AboutContent;
  } catch (error) {
    console.error("Error fetching about content:", error);
    // Return default content on error to prevent site crash
    return defaultAboutContent;
  }
}

export async function saveAboutContent(content: AboutContent): Promise<{ success: boolean; message: string }> {
  try {
    const aboutCollection = await getAboutCollection();
    if (!aboutCollection) {
        return { success: false, message: "Database not configured." };
    }
    await aboutCollection.doc(DOC_ID).set(content);
    return { success: true, message: "Content updated successfully!" };
  } catch (error) {
    console.error("Error saving about content:", error);
    return { success: false, message: "Failed to save content." };
  }
}
