
'use server';

import { getDb } from '@/lib/firebase-admin';

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

const DOC_ID = 'contact-info';
const getContentCollection = async () => {
    const db = await getDb();
    if (!db) return null;
    return db.collection('content');
};

const defaultContactInfo: ContactInfo = {
    address: "123 Church Street, Eastland, 12345",
    phone: "(123) 456-7890",
    email: "contact@docceastland.org",
};


export async function getContactInfo(): Promise<ContactInfo> {
    try {
        const contentCollection = await getContentCollection();
        if (!contentCollection) return defaultContactInfo;

        const doc = await contentCollection.doc(DOC_ID).get();
        if (!doc.exists) {
            return defaultContactInfo;
        }
        return doc.data() as ContactInfo;
    } catch (error) {
        console.error("Error fetching contact info:", error);
        return defaultContactInfo;
    }
}

export async function saveContactInfo(info: ContactInfo): Promise<{ success: boolean; message: string }> {
  try {
    const contentCollection = await getContentCollection();
    if (!contentCollection) {
        return { success: false, message: "Database not configured." };
    }
    await contentCollection.doc(DOC_ID).set(info);
    return { success: true, message: "Contact information updated successfully!" };
  } catch (error) {
    console.error("Error saving contact info:", error);
    return { success: false, message: "Failed to save contact information." };
  }
}
