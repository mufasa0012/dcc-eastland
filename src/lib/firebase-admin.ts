
'use server';

import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;
let isInitialized = false;

function initializeFirebaseAdmin() {
  if (isInitialized) {
    return;
  }
  isInitialized = true;

  if (admin.apps.length > 0) {
    db = admin.firestore();
    return;
  }

  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn("Firebase Admin SDK credentials are not fully set in environment variables. Server-side Firebase services will be disabled.");
        return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });

    console.log('Firebase Admin SDK initialized successfully.');
    db = admin.firestore();
  } catch (error) {
    console.error('Firebase Admin SDK initialization error:', error);
  }
}

export async function getDb(): Promise<admin.firestore.Firestore | null> {
  initializeFirebaseAdmin();
  return db;
}
