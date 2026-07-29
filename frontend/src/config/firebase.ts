import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || 'dummy_api_key',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789:web:123456789'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
