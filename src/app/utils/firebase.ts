import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "novu-chat.firebaseapp.com",
  projectId: "novu-chat",
  storageBucket: "novu-chat.appspot.com",
  messagingSenderId: "376513346025",
  appId: "1:376513346025:web:4a09673f999a77e9a4f378",
  measurementId: "G-4DF616HTLV"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
export { db, auth, googleProvider, githubProvider}
