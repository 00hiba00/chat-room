import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Vos clés de configuration récupérées sur la console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBebm_QvthXxXQvipsE8RkG8-dk3GmRIfc",
    authDomain: "chat-room-b87e2.firebaseapp.com",
    projectId: "chat-room-b87e2",
    storageBucket: "chat-room-b87e2.firebasestorage.app",
    messagingSenderId: "885973379150",
    appId: "1:885973379150:web:e4230ff944b44a94aebb1f"
  };

// Initialiser l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services que vous souhaitez utiliser
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };