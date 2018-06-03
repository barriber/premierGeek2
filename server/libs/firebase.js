import admin from 'firebase-admin';

export function firebaseInit(context) {
    context.callbackWaitsForEmptyEventLoop = false;  //<---Important

    const projectId = process.env.PROJECT_ID;
    const clientEmail = process.env.CLIENT_EMAIL;
    const privateKey = process.env.PRIVATE_KEY;

    if(admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
            databaseURL: "https://premiergeek-3c409.firebaseio.com",
        })
    }
    return admin.firestore()
}
