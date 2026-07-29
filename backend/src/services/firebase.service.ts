import { initializeApp, cert, applicationDefault, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Option 1: JSON key string in environment variable (production / CI)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({ credential: cert(serviceAccount) });
    console.log('✅ Firebase Admin initialized via service account JSON');
  } else {
    // Option 2: Application Default Credentials
    // Works automatically after running: gcloud auth application-default login
    // Also works with GOOGLE_APPLICATION_CREDENTIALS env var pointing to a JSON file
    initializeApp({ 
      credential: applicationDefault(),
      projectId: 'grocscan-app' // Required for local ADC to know which project to use
    });
    console.log('✅ Firebase Admin initialized via application default credentials');
  }
} catch (error: any) {
  console.warn('⚠️ Firebase Admin not initialized — Firestore features disabled.');
  console.warn('   To enable: run  gcloud auth application-default login');
  console.warn('   Error:', error?.message);
}

// Export db safely — null if Firebase failed to initialize
export const db: Firestore | null = getApps().length > 0 ? getFirestore() : null;
