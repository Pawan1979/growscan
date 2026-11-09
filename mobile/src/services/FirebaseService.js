import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, enableIndexedDbPersistence } from 'firebase/firestore';

// Replace with your Firebase config when generated from the console
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_FIREBASE_API_KEY",
  authDomain: "kirana-ledger.firebaseapp.com",
  projectId: "kirana-ledger",
  storageBucket: "kirana-ledger.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:12abc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence for firestore specifically if running in a supported env
// Though Expo SQLite is our primary queue, Firestore persistence is a strong backup
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, offline not enabled");
    } else if (err.code == 'unimplemented') {
      console.warn("Current browser does not support offline capabilities");
    }
  });
} catch(e) {
  // Catch mostly for React Native warnings if indexedDB isn't perfectly supported
}

export const syncTransactionToCloud = async (txData) => {
  try {
    const txRef = doc(db, 'transactions', txData.id);
    await setDoc(txRef, {
      ...txData,
      cloudSyncedAt: Date.now()
    });
    return true;
  } catch(e) {
    console.error("Error syncing to cloud:", e);
    return false;
  }
};

export { db };
