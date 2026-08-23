import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3JIPqjkkU2k-4HqiPV8kpmzfV5fbpw8M",
  authDomain: "vikshana-eye-care.firebaseapp.com",
  projectId: "vikshana-eye-care",
  storageBucket: "vikshana-eye-care.firebasestorage.app",
  messagingSenderId: "966196723279",
  appId: "1:966196723279:web:fa900371b7528d235cb43a",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
