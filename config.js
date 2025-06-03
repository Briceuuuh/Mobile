import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANhHBHFRaKOgIIgcWDPv39pk_e91mt7IA",
  authDomain: "e-kart-bdffb.firebaseapp.com",
  projectId: "e-kart-bdffb",
  storageBucket: "e-kart-bdffb.appspot.com",
  messagingSenderId: "594205596166",
  appId: "1:594205596166:web:fb349929c210fe912f4187",
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const store = getStorage(app);

// Export them
export { app, auth, db, store };
