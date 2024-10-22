import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBjFLxFvZ1goIVAHROjJlpPoO-SRNgVbBQ",
    authDomain: "devilstore-95042.firebaseapp.com",
    projectId: "devilstore-95042",
    storageBucket: "devilstore-95042.appspot.com",
    messagingSenderId: "457194961859",
    appId: "1:457194961859:web:dbf125ba4cf3178a6b9b76",
    measurementId: "G-3V2Y2D2WQJ"
  };

const app = initializeApp(firebaseConfig);
// /const analytics = getAnalytics(app);

export const db = getFirestore(app);