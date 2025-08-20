
'use server';

import { getDb } from "@/lib/firebase-admin";

const initialData = {
    sermons: [
      { id: '1', title: "The Parable of the Sower: A Deeper Look", speaker: "Pastor Evelyn Reed", date: new Date("2024-07-28").toISOString(), audioUrl: "#" },
      { id: '2', title: "Foundations of Faith: The Rock on Which We Stand", speaker: "Rev. Dr. Samuel Parris", date: new Date("2024-07-21").toISOString(), audioUrl: "#" },
      { id: '3', title: "Love in Action: Serving the Community", speaker: "Guest Speaker, Dr. Anita Jones", date: new Date("2024-07-14").toISOString(), audioUrl: "#" },
      { id: '4', title: "Navigating Life's Storms with Hope", speaker: "John Hawthorne", date: new Date("2024-07-07").toISOString(), audioUrl: "#" },
    ],
    events: [
        {
            id: '1',
            title: "Men's Breakfast Fellowship",
            date: new Date("2024-08-03").toISOString(),
            time: "8:00 AM",
            description: "Join the men of the church for a time of food, fellowship, and a brief devotional.",
        },
        {
            id: '2',
            title: "Vacation Bible School Sign-ups",
            date: new Date("2024-08-04").toISOString(),
            time: "After Both Services",
            description: "Sign up your children for our upcoming VBS week, 'Jungle Journey'!",
        },
        {
            id: '3',
            title: "Senior's Potluck Luncheon",
            date: new Date("2024-08-08").toISOString(),
            time: "12:30 PM",
            description: "A wonderful time for our seniors to connect over a shared meal. Please bring a dish to pass.",
        },
    ],
    ministries: [
      {
        id: '1',
        name: "Children's Ministry",
        description: "Nurturing faith in our youngest members through fun and foundational teaching.",
      },
      {
        id: '2',
        name: "Missions Committee",
        description: "Supporting missionaries and outreach efforts both locally and globally.",
      },
      {
        id: '3',
        name: "Hospitality Team",
        description: "Creating a welcoming environment for guests and members alike.",
      },
      {
        id: '4',
        name: "Young Adults Group",
        description: "Connecting those in their 20s and 30s through study and social events.",
      },
    ],
    leadership: [
        { id: '1', name: "Rev. Dr. Samuel Parris", title: "Senior Pastor", imageUrl: "https://placehold.co/200x200.png" },
        { id: '2', name: "Pastor Evelyn Reed", title: "Associate Pastor", imageUrl: "https://placehold.co/200x200.png" },
        { id: '3', name: "John Hawthorne", title: "Youth Pastor", imageUrl: "https://placehold.co/200x200.png" },
        { id: '4', name: "Abigail Williams", title: "Worship Leader", imageUrl: "https://placehold.co/200x200.png" },
    ],
    content: {
        'about-content': {
            mission: "To know Christ and to make Him known, fostering a community of believers dedicated to worship, fellowship, and service.",
            beliefs: "We hold to the historic tenets of the Christian faith, affirming the Bible as the inspired Word of God and Jesus Christ as our Lord and Savior.",
            history: "Founded in 1924, our church has been a spiritual home in Eastland for a century, growing in faith and community through generations.",
        },
        'contact-info': {
            address: "123 Church Street, Eastland, 12345",
            phone: "(123) 456-7890",
            email: "contact@docceastland.org",
        },
        'hero-content': {
            headline: "Welcome to the Disciple of Christ Church",
            subheadline: "Eastland Parish — A place to believe, belong, and become.",
            serviceTimes: "Service Times: Sundays at 9:00 AM & 11:00 AM",
            address: "123 Church Street, Eastland",
            buttonText: "Plan Your Visit",
            imageUrl: "https://placehold.co/1600x900.png"
        }
    }
}


export async function seedDatabase(): Promise<{ success: boolean; message: string; logs: string[] }> {
    const db = await getDb();
    if (!db) {
        return { success: false, message: "Firestore is not initialized.", logs: [] };
    }

    const logs: string[] = [];
    
    try {
        const collectionsToSeed = ['sermons', 'events', 'ministries', 'leadership'];

        for (const collectionName of collectionsToSeed) {
            logs.push(`--- Seeding ${collectionName} ---`);
            const collectionRef = db.collection(collectionName);
            const snapshot = await collectionRef.limit(1).get();
            if (!snapshot.empty) {
                logs.push(`Collection '${collectionName}' already has data. Deleting existing documents...`);
                const allDocs = await collectionRef.listDocuments();
                await Promise.all(allDocs.map(doc => doc.delete()));
                logs.push(`Deleted all documents in '${collectionName}'.`);
            }
            
            const data = initialData[collectionName as keyof typeof initialData] as {id: string}[];
            for (const item of data) {
                const { id, ...itemData } = item;
                await collectionRef.doc(id).set(itemData);
                logs.push(`Added document ${id} to ${collectionName}.`);
            }
            logs.push(`Successfully seeded ${data.length} documents into ${collectionName}.\n`);
        }

        logs.push(`--- Seeding content ---`);
        const contentCollectionRef = db.collection('content');
        const contentData = initialData.content;
        for (const [docId, docData] of Object.entries(contentData)) {
            await contentCollectionRef.doc(docId).set(docData);
            logs.push(`Set document '${docId}' in content collection.`);
        }
        logs.push(`Successfully seeded content.\n`);

        logs.push("✅ Database seeding completed successfully!");
        return { success: true, message: "Database seeded successfully.", logs };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Database seeding error:", error);
        logs.push(`❌ Error: ${errorMessage}`);
        return { success: false, message: `Database seeding failed: ${errorMessage}`, logs };
    }
}
