import React, { useState, useEffect } from 'react';
import '../css/Book.css';

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useSendSignInLinkToEmail } from 'react-firebase-hooks/auth'

function Book(props) {
    console.log("Book")
    const [hovered, setHovered] = useState(false);
    const [bookDetails, setBookDetails] = useState(null);


    const fetchBookDetails = (bookId) => {
        // Use Firebase to fetch book details based on the book ID
        const bookRef = firestore.collection('books').doc(bookId);

        bookRef.get()
            .then((doc) => {
                if (doc.exists) {
                    setBookDetails(doc.data());
                } else {
                    console.log('Book not found');
                }
            })
            .catch((error) => {
                console.error('Error fetching book details:', error);
            });
    };


    const bookStyle = {
        position: 'relative',
        width: '400px',
        height: '400px',
        color: 'white',
        fontWeight: 'bolder',
        fontSize: hovered ? '40px' : '35px',
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
    console.log("hello")

    return (
        <div
            className='book'
            style={bookStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {console.log(props)}
            {console.log("book details = ", bookDetails)}
            {/* <div style={backgroundStyle}></div>
            <div className='book-title'>
                {bookDetails?.name}
            </div>

            <div className='book-details'>
                <p>Author: {bookDetails?.author}</p>
                <p>Genre: {bookDetails?.genre}</p>
                <p>Published Year: {bookDetails?.publishedYear}</p>
                <p>Price: ${bookDetails?.price}</p>
            </div>

            <button
                onClick={() => props.onAdd(bookDetails)} // Pass bookDetails to onAdd
                className="add-button"
            >
                Add to Cart
            </button> */}
        </div>
    );
}

export default Book;
