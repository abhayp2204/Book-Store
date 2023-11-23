// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage } from 'firebase/storage'

const app = firebase.initializeApp({
    apiKey: "AIzaSyDamMlWE1_6NAdCtCz0nqvbayTYUwXdGJw",
    authDomain: "bookstore2-a8756.firebaseapp.com",
    projectId: "bookstore2-a8756",
    storageBucket: "bookstore2-a8756.appspot.com",
    messagingSenderId: "537411982762",
    appId: "1:537411982762:web:4c56fab893abf04a9f87d3",
    measurementId: "G-J8747YQBNL"
    });

export const storage = getStorage(app)
export const auth = firebase.auth();
export const firestore = firebase.firestore();