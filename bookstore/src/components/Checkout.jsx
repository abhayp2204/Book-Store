import React, { useState, useEffect } from 'react';
import '../css/Checkout.css';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore } from '../firebase';

function Checkout(props) {
    const usersRef = firestore.collection('users');
    const booksRef = firestore.collection('books');
    const [cart, setCart] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        // Get the user data
        const userRef = usersRef.where('uid', '==', user.uid);
        userRef.get()
            .then((snapshot) => {
                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userData = userDoc.data();
                    const userCart = userData.cart || [];
                    setCart(userCart);
                }
            })
            .catch((error) => {
                console.log('Error fetching user data: ', error);
            });

        // Get the book data
        const fetchData = async () => {
            try {
                const query = booksRef.orderBy('id');
                const data = await query.get();
                const bookList = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setBooks(bookList);
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="checkout">
            <h2>Checkout</h2>
            {cart && cart.map((bookId, index) => {
                // Find the book in the books array by matching the bookId
                const book = books.find((book) => book.id === bookId);

                return (
                    <div className="cart-item" key={index}>
                        <div className='checkout-msg'>Your Items</div>
                        <div className='line' />
                        {book ? (
                            <div className='checkout-book-details'>
                                <div className='checkout-book-title'>{book.title}</div>
                                <div className='checkout-book-author'>Author: {book.author}</div>
                                <img className='checkout-book-image' src={book.image} alt={book.title} />
                            </div>
                        ) : (
                            'Book not found'
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Checkout;
