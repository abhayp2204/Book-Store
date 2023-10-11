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
import Home from './components/Home'

function App() {
    const [user] = useAuthState(auth)

    // not signed in
    if (!user) {
        return (<SignIn />)
    }

    return (
        <Router>
            <Routes>
                <Route
                    path='/'
                    element={<Home />}
                />
            </Routes>
        </Router>
    )
}

export default App
