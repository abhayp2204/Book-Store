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



    return (
        <div className="home">
            <div className='intro'>
                <div className='header'>Campus Bookstore</div>
                <div className='intro-desc'>
                    "Introducing the ultimate solution for all your campus book needs - our Campus Bookstore App. Streamline your academic life with this user-friendly, one-stop digital bookstore. Browse, search, and purchase your required textbooks and study materials hassle-free. Enjoy convenient digital access to your course materials, with options to buy or rent, saving you time and money. The app also offers real-time inventory updates, allowing you to check book availability instantly. Additionally, you can sell your used books through the app and connect with fellow students. With a clean interface and intuitive features, our Campus Bookstore App is your go-to academic companion for stress-free book shopping and enhanced learning."
                </div>
            </div>
            <div className='books-display-full'>
                
                {loading ? (
                <p>Loading books...</p>
                ):
                (
                    books.map((book, key) => (
                        <Book key={book.id} id={book.id} />
                    ))
                )}
            </div>
        </div>
    );
}

export default Books;