// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage } from 'firebase/storage'

const app = firebase.initializeApp({
    apiKey: "AIzaSyCuXH6AeR9D2iytYI4l5T8aTqs5y7tC4jc",
    authDomain: "bookstore-c18be.firebaseapp.com",
    projectId: "bookstore-c18be",
    storageBucket: "bookstore-c18be.appspot.com",
    messagingSenderId: "29155929727",
    appId: "1:29155929727:web:0bf13f7e1eca18a37d194a",
    measurementId: "G-PPJB0XR2CZ"
});

export const storage = getStorage(app)
export const auth = firebase.auth();
export const firestore = firebase.firestore();