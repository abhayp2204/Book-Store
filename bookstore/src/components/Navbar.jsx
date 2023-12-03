import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

// Firebase
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore } from "../firebase";

import SignOut from './auth/SignOut'

function Navbar() {
    const adminsRef = firestore.collection('admin');
    const [isAdmin, setIsAdmin] = useState(false); // Track admin status
    const [isVendor, setIsVendor] = useState(false); // Track vendor status
    const [userImage, setUserImage] = useState(null); // Track user image URL
    const [showDropdown, setShowDropdown] = useState(false); // Show/hide dropdown

    useEffect(() => {
        const user = auth.currentUser;
        const curUid = user.uid;
        console.log(user)

        if (user) {
            // Fetch user image URL from Google provider data
            setUserImage(user.photoURL);

            adminsRef.where('uid', '==', curUid).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        setIsAdmin(true); // User is an admin
                    } else {
                        setIsAdmin(false); // User is not an admin
                    }
                })
                .catch((error) => {
                    console.error('Error checking admin status: ', error);
                });

            // Check if the user is a vendor
            const usersRef = firestore.collection('users');
            usersRef.where('uid', '==', curUid).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const userData = querySnapshot.docs[0].data();
                        if (userData.accountType === 'vendor') {
                            setIsVendor(true);
                        } else {
                            setIsVendor(false);
                        }
                    }
                })
                .catch((error) => {
                    console.error('Error checking vendor status: ', error);
                });
        }
    }, []);

    const handleDropdownToggle = () => {
        setShowDropdown(!showDropdown);
    }


    return (
        <div className='navbar'>
            <Link to='/' className='nav-link'>Home</Link>
            <Link to='/products' className='nav-link'>Products</Link>
            {isVendor && <Link to='/shop' className='nav-link'>Shop</Link>}
            <Link to='/merch' className='nav-link'>Merch</Link>
            <Link to='/cart' className='nav-link'>Cart</Link>
            <Link to='/checkout' className='nav-link'>Checkout</Link>

            {/* User Image and Dropdown */}
            {/* <div className='user-dropdown' onClick={handleDropdownToggle}>
                <img src={auth.currentUser.photoURL} alt="User" className='user-image' />
                {showDropdown && (
                    <div className='dropdown-content'>
                        <SignOut />
                    </div>
                )}
            </div> */}
            <SignOut />

        </div>
    );
}

export default Navbar;
