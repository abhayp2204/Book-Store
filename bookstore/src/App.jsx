import { useState } from 'react'
import './css/App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { auth, firestore } from './firebase'

// components
import SignIn from './components/auth/SignIn'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Products from './components/Products'
import ProductPage from './components/ProductPage';
import Merch from './components/Merch';
import Shop from './components/Shop'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Orders from './components/Orders'

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
                    path='/products'
                    element={<Products />}
                />

                <Route
                    path="/product/:productId"
                    element={<ProductPage />}
                />

                <Route
                    path='/shop'
                    element={<Shop />}
                />

                <Route
                    path='/merch'
                    element={<Merch />}
                />



                <Route
                    path='/cart'
                    element={<Cart />}
                />

                <Route
                    path='/checkout'
                    element={<Checkout />}
                />

                <Route
                    path='/orders'
                    element={<Orders />}
                />
            </Routes>
        </Router>
    )
}

export default App
