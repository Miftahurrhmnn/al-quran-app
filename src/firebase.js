import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwie8T5BoBOAl2p5fN3o-gd-fvinC-bUY",
  authDomain: "marwaquran-3fc47.firebaseapp.com",
  projectId: "marwaquran-3fc47",
  storageBucket: "marwaquran-3fc47.firebasestorage.app",
  messagingSenderId: "874815807953",
  appId: "1:874815807953:web:073ac4c6e1868f415d80f0",
  measurementId: "G-9VK5XZ8HF0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);