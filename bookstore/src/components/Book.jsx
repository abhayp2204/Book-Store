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


    useEffect(() => {
        if (props.id) {
            fetchBookDetails(props.id);
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

    const addBook = async (bookId) => {
        const user = auth.currentUser;
        if (user) {
            const userRefQuery = usersRef.where('uid', '==', user.uid);
    
            // Fetch the user data based on the query
            userRefQuery.get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userData = userDoc.data();
                        const currentCart = userData.cart || []; // Get the current cart, initialize as an empty array if it doesn't exist
    
                        // Append the bookId to the cart array if it's not already there
                        if (!currentCart.includes(bookId)) {
                            currentCart.push(bookId);
    
                            // Update the user's document with the new cart array
                            userDoc.ref.update({ cart: currentCart })
                                .then(() => {
                                    console.log(`Book ${bookId} added to the cart for user ${user.uid}`);
                                    alert("Added to Cart")
                                })
                                .catch((error) => {
                                    console.error('Error updating user document:', error);
                                });
                        } else {
                            console.log(`Book ${bookId} is already in the cart.`);
                        }
                    } else {
                        console.log('User document not found');
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    };
    

    return (
        <div className='books-display0' >
            <BookDetails bookDetails={bookDetails} addToCart={addBook} />
        </div>
    );
}

export default Book;
