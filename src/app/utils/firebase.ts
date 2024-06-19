import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: "novu-chat-f3073.firebaseapp.com",
  projectId: "novu-chat-f3073",
  storageBucket: "novu-chat-f3073.appspot.com",
  messagingSenderId: "687624072813",
  appId: "1:687624072813:web:020b00454a3e7786fcd964",
  measurementId: "G-DX6NWT9DKC"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
export { db, auth, googleProvider, githubProvider}