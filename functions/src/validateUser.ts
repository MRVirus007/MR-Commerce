/* eslint-disable */
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const validateUser = functions.https.onCall(async (data, context) => {
    const { email, password } = data;
    try {
        const auth: any = admin.auth();
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return {
            uid: userCredential.user?.uid,
            displayName: userCredential.user?.displayName,
            email: userCredential.user?.email,
        };
    } catch (error) {
        throw new functions.https.HttpsError('invalid-argument', 'Invalid email or password');
    }
});
