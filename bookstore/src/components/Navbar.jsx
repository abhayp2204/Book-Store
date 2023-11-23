import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../css/Navbar.css'
import SignOut from './auth/SignOut'

// Firebase
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore, storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function Navbar() {
    const adminsRef = firestore.collection('admin')
    const [isAdmin, setIsAdmin] = useState(false); // Track admin status

    useEffect(() => {
        const user = auth.currentUser;
        const curUid = user.uid;
    
        if (user) {
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
        }
    }, []);
    


    return (
        <div className='navbar'>
            <Link to='/home' className='nav-link'>Home</Link>
            <Link to='/cart' className='nav-link'>Cart</Link>
            <Link to='/checkout' className='nav-link'>Checkout</Link>
            {isAdmin && <Link to='/add' className='nav-link-admin'>Add Product</Link>}
            <SignOut />
        </div>
    )
}

export default Navbar