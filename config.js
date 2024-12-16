import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANhHBHFRaKOgIIgcWDPv39pk_e91mt7IA",
  authDomain: "e-kart-bdffb.firebaseapp.com",
  projectId: "e-kart-bdffb",
  storageBucket: "e-kart-bdffb.appspot.com",
  messagingSenderId: "594205596166",
  appId: "1:594205596166:web:fb349929c210fe912f4187",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
