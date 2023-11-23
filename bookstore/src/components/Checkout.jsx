import React, { useState, useEffect } from 'react';
import '../css/Checkout.css';

// Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore } from '../firebase';

import Payment from './Payment';

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
        <div className='checkout'>
            <div className='checkout-title'>Checkout</div>
            {/* <div className='line' /> */}
            <div className='checkout-content'>
                <div className='checkout-details'>
                    <form className='checkout-form'>
                        <div className='checkout-input'>
                            <label className='checkout-prompt' htmlFor='country'>Country  </label>
                            <input className='checkout-input' type='text' id='country' name='country' />
                        </div>
                        <div className='checkout-input'>
                            <label className='checkout-prompt' htmlFor='state'>State  </label>
                            <input className='checkout-input' type='text' id='state' name='state' />
                        </div>
                        <div className='checkout-input'>
                            <label className='checkout-prompt' htmlFor='address'>Address  </label>
                            <input className='checkout-input' type='text' id='address' name='address' />
                        </div>
                    </form>
                    <Payment /> 
                </div>
                {/* <div className='checkout-items'>
                    {cart &&
                        cart.map((bookId, index) => (
                            <CheckoutItem index={index} books={books} key={bookId} />
                        ))}
                </div> */}
            </div>
        </div>
    );
}

function CheckoutItem(props) {
    const book = props.books[props.index];
    if (!book) return null;
    return (
        <div className='checkout-item'>
            <div className='checkout-book-title'>{book.title}</div>
            <div className='checkout-book-author'>by {book.author}</div>
            <img className='checkout-book-image' src={book.image} alt='book' />
        </div>
    );
}

export default Checkout;
