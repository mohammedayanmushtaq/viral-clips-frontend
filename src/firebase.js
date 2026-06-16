import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAA_7SDewv_89eXk-b7XG4FOMFwmXCH4X0",
  authDomain: "flickzclips-fcf9c.firebaseapp.com",
  projectId: "flickzclips-fcf9c",
  storageBucket: "flickzclips-fcf9c.firebasestorage.app",
  messagingSenderId: "891189274351",
  appId: "1:891189274351:web:6b97f7477eb7542a785d1a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);