import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4wzedvWzxV0d15SMTw_IKfh_qWcScZSc",
  authDomain: "magic-cards-store-a00fd.firebaseapp.com",
  projectId: "magic-cards-store-a00fd",
  storageBucket: "magic-cards-store-a00fd.firebasestorage.app",
  messagingSenderId: "108927871470",
  appId: "1:108927871470:web:94f03d3df84a0b2b29c6ff",
  measurementId: "G-8BF62KCM40"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

