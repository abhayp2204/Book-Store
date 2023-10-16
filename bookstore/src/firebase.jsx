// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage } from 'firebase/storage'

const app = firebase.initializeApp({
    apiKey: "AIzaSyD9GzuLv6EgqJlQw21mEpNeuXjaFlN4PBk",
    authDomain: "chat-app-c0815.firebaseapp.com",
    projectId: "chat-app-c0815",
    storageBucket: "chat-app-c0815.appspot.com",
    messagingSenderId: "994297262002",
    appId: "1:994297262002:web:51bcc4c554661f4c117eab",
    measurementId: "G-6F0P6QYCMJ"
});

export const storage = getStorage(app)
export const auth = firebase.auth();
export const firestore = firebase.firestore();