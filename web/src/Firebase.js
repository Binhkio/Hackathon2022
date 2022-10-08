import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB_IBFgGra89T3ZcHvArdOepFiR9v5rLSU",
    authDomain: "hackathon2022-df7ef.firebaseapp.com",
    databaseURL: "https://hackathon2022-df7ef-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hackathon2022-df7ef",
    storageBucket: "hackathon2022-df7ef.appspot.com",
    messagingSenderId: "114848819501",
    appId: "1:114848819501:web:522b717705fba84f8b4ba4"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const firebase = getDatabase(app)