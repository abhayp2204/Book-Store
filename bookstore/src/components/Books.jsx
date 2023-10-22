import React, { useState, useEffect } from 'react';
import Book from './Book';
import '../css/Book.css';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function Books(props) {
    const booksRef = firestore.collection('books');
    const usersRef = firestore.collection('users');

    const [books, setBooks] = useState([]); // State to store books
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch books when the component mounts
        const fetchData = async () => {
            try {
                const query = booksRef.orderBy('id');
                const data = await query.get();
                const bookList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setBooks(bookList);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false); // Set loading to false when done
            }
        };

        fetchData();
    }, []);


    const addBook = async (bookId) => {
        const user = auth.currentUser;
        console.log("user = ", user)
        if (user) {
            console.log("Added book " + bookId + " to " + user)
            const userRef = usersRef.doc(user.uid);
            userRef.update({
                cart: firebase.firestore.FieldValue.arrayUnion(bookId)
            });
        }
    };

    const deleteBook = async (bookTitle) => {
        const bookToDelete = books.find((book) => book.title === bookTitle);
        if (bookToDelete) {
            booksRef.doc(bookToDelete.id).delete();
        }
    };

    return (
        <div className="books-display">
            {loading ? (
                <p>Loading books...</p>
            ):
            (
                books.map((book, key) => (
                    <Book key={book.id} id={book.id} />
                ))
            )}
        </div>
    );
}

export default Books;