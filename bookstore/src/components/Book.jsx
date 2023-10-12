import React, { useState, useEffect } from 'react';
import '../css/Book.css';

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"

function Book(props) {
    const usersRef = firestore.collection('users');

    const [hovered, setHovered] = useState(false);
    const [bookDetails, setBookDetails] = useState(null);

    const bookStyle = {
        position: 'relative',
        width: '400px',
        height: '400px',
        color: 'white',
        fontWeight: 'bolder',
        // fontSize: hovered ? '40px' : '35px',
        margin: '20px',
        backgroundColor: hovered ? '#22c99f' : 'black',
        transition: '0.3s ease-in-out', // Add transition for font size change
    };

    const backgroundStyle = {
        backgroundImage: `url('pics/${bookDetails?.image}.jpg')`,
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: hovered ? 0.52 : 0.20,
        transition: 'opacity 0.3s ease-in-out', // Add transition for background opacity change
    };

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
        <div
            className='book'
            style={bookStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={backgroundStyle}></div>
            <div className='book-title'>
                {bookDetails?.name}
            </div>

            <div className='book-details'>
                <p>Title: {bookDetails?.title}</p>
                <p>Author: {bookDetails?.author}</p>
                <p>Genre: {bookDetails?.genre}</p>
                <p>Published Year: {bookDetails?.publishedYear}</p>
                <p>Price: ${bookDetails?.price}</p>
            </div>

            <button
                onClick={() => addBook(props.id)} // Pass bookDetails to onAdd
                className="add-button"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default Book;
