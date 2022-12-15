import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'

const firebaseConfig = {
    apiKey: "AIzaSyDSizzeaFa-gmS-gkkjW-k6MwLQPhsRiSM",
    authDomain: "space-adventure-js.firebaseapp.com",
    projectId: "space-adventure-js",
    storageBucket: "space-adventure-js.appspot.com",
    messagingSenderId: "844833013830",
    appId: "1:844833013830:web:b85782bdf20619fef54a47"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
