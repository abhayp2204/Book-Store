import React, { useState } from 'react';
import '../../css/Auth.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from '../../firebase';

function SignIn() {
    const [accountType, setAccountType] = useState('customer'); // Default to 'customer'
    const [shopName, setShopName] = useState('');
    const [timings, setTimings] = useState('');
    const [description, setDescription] = useState('');
    const usersRef = firestore.collection('users');

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
                            // If the user doesn't exist, create a new document with account type and additional attributes for vendors
                            const userData = {
                                name: user.displayName,
                                uid: user.uid,
                                email: user.email,
                                cart: [],
                                orders: [],
                                accountType: accountType,
                            };

                            if (accountType === 'vendor') {
                                userData.shopName = shopName;
                                userData.timings = timings;
                                userData.description = description;
                                userData.items = [];
                            }

                            usersRef.add(userData);
                        }
                    })
                    .catch((error) => {
                        console.error("Error checking user:", error);
                    });
            })
            .catch((error) => {
                console.error("Error signing in with Google:", error);
            });
    };

    const handleAccountTypeChange = (type) => {
        setAccountType(type);
    };

    return (
        <div className="sign-in-container">
            <div className='welcome'>Welcome to Campus Bookstore!</div>
            <div className="account-type">
                <label>Select Account Type: </label>
                <select className='account-options' value={accountType} onChange={(e) => handleAccountTypeChange(e.target.value)}>
                    <option className='account-option' value="customer">Customer</option>
                    <option className='account-option' value="vendor">Vendor</option>
                </select>
            </div>

            {accountType === 'vendor' && (
                <div>
                    <label>Shop Name: </label>
                    <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} />
                    <label>Timings: </label>
                    <input type="text" value={timings} onChange={(e) => setTimings(e.target.value)} />
                    <label>Description: </label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
            )}

            <button className="sign-in-btn" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    );
}

export default SignIn;
