import { useState } from 'react'
import './css/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, firestore } from './firebase';

// components
import SignIn from './components/auth/SignIn'
import Navbar from './components/Navbar';
import Home from './components/Home'
import Books from './components/Books'
import AddBook from './components/AddBook'
import Cart from './components/Cart'
import Checkout from './components/Checkout';

function App() {
    const [user] = useAuthState(auth)

    // not signed in
    if (!user) {
        return (<SignIn />)
    }

    console.log("Logged in as : ", user.displayName)

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route
                    path='/'
                    element={<Home />}
                />
                <Route
                    path='/home'
                    element={<Books />}
                />
                <Route
                    path='/add'
                    element={<AddBook />}
                />
                <Route
                    path='/cart'
                    element={<Cart />}
                />
                <Route
                    path='/checkout'
                    element={<Checkout />}
                />
            </Routes>
        </Router>
    )
}

export default App
