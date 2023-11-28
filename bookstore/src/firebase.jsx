// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getStorage } from 'firebase/storage'

const app = firebase.initializeApp({
    apiKey: "AIzaSyDKAh9myDKV3bfEJQDcK6uJhfIlRY7fTJI",
    authDomain: "poss-84821.firebaseapp.com",
    projectId: "poss-84821",
    storageBucket: "poss-84821.appspot.com",
    messagingSenderId: "772475170596",
    appId: "1:772475170596:web:9a4f2ea69c0f4a56bf4db1",
    measurementId: "G-KGL5FJKLX2"
});

export const storage = getStorage(app)
export const auth = firebase.auth();
export const firestore = firebase.firestore();