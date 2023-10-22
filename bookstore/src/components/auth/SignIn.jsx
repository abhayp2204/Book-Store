import React from 'react'
import '../../css/Auth.css'

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase'

function SignIn() {
    const usersRef = firestore.collection('users')

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        // Sign in with Google
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;

                // Check if the user already exists in the users collection
                const userQuery = usersRef.where('email', '==', user.email);
                userQuery.get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            // If the user doesn't exist, create a new document
                            usersRef.add({
                                name: user.displayName,
                                uid: user.uid,
                                email: user.email,
                                cart: [],
                                orders: []
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking user:", error);
                    });
            })
            .catch((error) => {
                console.error("Error signing in with Google:", error);
            });
    }

    return (
        <div className="sign-in-container">
            <div className='welcome'>Welcome to Campus Bookstore!</div>
            <button className="sign-in-btn" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    )
}

export default SignIn
