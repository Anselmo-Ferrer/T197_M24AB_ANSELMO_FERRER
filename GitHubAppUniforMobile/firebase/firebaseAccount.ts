// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import {
  FIREBASE_API_KEY_ACCOUNTS,
  FIREBASE_AUTH_DOMAIN_ACCOUNTS,
  FIREBASE_PROJECT_ID_ACCOUNTS,
  FIREBASE_STORAGE_BUCKET_ACCOUNTS,
  FIREBASE_MESSAGING_SENDER_ID_ACCOUNTS,
  FIREBASE_APP_ID_ACCOUNTS
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY_ACCOUNTS,
  authDomain: FIREBASE_AUTH_DOMAIN_ACCOUNTS,
  projectId: FIREBASE_PROJECT_ID_ACCOUNTS,
  storageBucket: FIREBASE_STORAGE_BUCKET_ACCOUNTS,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID_ACCOUNTS,
  appId: FIREBASE_APP_ID_ACCOUNTS
};

// Initialize Firebase
const app = getApps().find(app => app.name === 'accountApp') || initializeApp(firebaseConfig, 'accountApp');
export const dbAccounts = getFirestore(app);