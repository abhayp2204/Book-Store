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
                        const count = currentCart.reduce((total, cartItem) => {
                            if (cartItem.bookId === bookId) {
                                return total + cartItem.count;
                            }
                            return total;
                        }, 0);
                    
                        setCartCount(count);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    };

    const updateCartCount = (newCount) => {
        // Ensure the user is authenticated
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
    
                        // Find the index of the book in the cart
                        const index = currentCart.findIndex(cartItem => cartItem.bookId === props.id);
    
                        if (newCount === 0) {
                            // If newCount is 0, remove the book from the cart
                            if (index !== -1) {
                                currentCart.splice(index, 1); // Remove the item from the array
                            }
                        } else {
                            // If the book is in the cart, update its count
                            if (index !== -1) {
                                currentCart[index].count = newCount;
                            } else {
                                // If the book is not in the cart, add it with the new count
                                currentCart.push({ bookId: props.id, count: newCount });
                            }
                        }
    
                        // Update the user's cart in Firestore using the user document reference
                        userDoc.ref.update({ cart: currentCart })
                            .then(() => {
                                // Cart count updated in Firestore
                                setCartCount(newCount);
                                console.log('Cart count updated in Firestore');
                            })
                            .catch((error) => {
                                console.error('Error updating cart in Firestore:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    };
    
    
    

    

    return (
        <div className='books-display' >
            <BookDetails
                bookDetails={bookDetails}
                cartCount={cartCount}
                updateCartCount={updateCartCount}
            />
        </div>
    );
}

export default Book;
