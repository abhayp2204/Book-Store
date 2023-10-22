import React, { useState, useEffect } from 'react';
import '../css/Book.css';

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"

import BookDetails from './BookDetails';

function Book(props) {
    const usersRef = firestore.collection('users');

    const [hovered, setHovered] = useState(false);
    const [bookDetails, setBookDetails] = useState(null);
    const [cartCount, setCartCount] = useState(0); // New state to track the count of books in the cart

    useEffect(() => {
        if (props.id) {
            fetchBookDetails(props.id);
            fetchCartCount(props.id); // Fetch the count of this book in the cart
        }
    }, [props.id]);

    const fetchBookDetails = (bookId) => {
        const booksRef = firestore.collection('books');

        booksRef.where('id', '==', bookId).get()
            .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    const bookData = querySnapshot.docs[0].data();
                    setBookDetails(bookData);
                } else {
                    console.log('Book not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching book details:', error);
            });
    };

    const fetchCartCount = async (bookId) => {
        const user = auth.currentUser;
        if (user) {
            const userRefQuery = usersRef.where('uid', '==', user.uid);
    
            // Fetch the user data based on the query
            userRefQuery.get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userData = userDoc.data();
                        const currentCart = userData.cart || [];
    
                        // Count the number of occurrences of the book in the cart
                        const count = currentCart.filter(id => id === bookId).length;
                        setCartCount(count);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    };

    const updateCartCount = (count) => {
        setCartCount(count);
    };

    

    return (
        <div className='books-display' >
            <BookDetails
                bookDetails={bookDetails}
                // addToCart={addBook}
                cartCount={cartCount}
                updateCartCount={updateCartCount}
            />
        </div>
    );
}

export default Book;
