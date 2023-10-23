import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Cart.css';

// Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { auth, firestore } from "../firebase";

function Cart(props) {
    const usersRef = firestore.collection('users');
    const booksRef = firestore.collection('books');
    const [cartItems, setCartItems] = useState([]); // State to store cart items
    const [booksData, setBooksData] = useState([]); // State to store book data
    const [loading, setLoading] = useState(true); // State to track loading status

    // First useEffect to initialize data
    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        const userRef = usersRef.where('uid', '==', user.uid);

        userRef.get()
            .then((snapshot) => {
                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userData = userDoc.data();
                    const userCart = userData.cart || [];

                    // Set the user's cart items in the state
                    setCartItems(userCart);
                    setLoading(false); // Set loading to false once the data is fetched
                } else {
                    // Handle the case where the user document doesn't exist
                    console.log("User document doesn't exist.");
                    setLoading(false); // Set loading to false if the user document doesn't exist
                }
            })
            .catch((error) => {
                console.error('Error fetching user cart:', error);
            });
    }, []);

    // Second useEffect to update book counts when userCart changes
    useEffect(() => {
        if (cartItems.length === 0) return;

        // Fetch book details for the items in the cart
        const bookPromises = cartItems.map(cartItem => {
            return booksRef.where('id', '==', cartItem.bookId).get();
        });

        Promise.all(bookPromises)
            .then(bookSnapshots => {
                const booksData = bookSnapshots.map(bookSnapshot => {
                    const matchingBook = bookSnapshot.docs[0];
                    return {
                        id: matchingBook.id,
                        ...matchingBook.data(),
                        count: cartItems.find(item => {
                            return item.bookId === matchingBook.data().id
                        })?.count || 1,
                    };
                });
                setBooksData(booksData);
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    }, [cartItems]);

    // Calculate the total price
    const totalPrice = booksData.reduce((total, book) => total + (book.price || 0) * book.count, 0);

    return (
        <div className="cart">
            <p className='cart-title'>Your Cart</p>
            <p className='cart-price'>Total Price = ${totalPrice}</p> {/* Display the total price */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='cart-container'>
                    <div className='cart-books'>
                        {booksData.map((book, index) => (
                            <div className='book-details-cart' key={index}>
                                <p className='book-title'>{book?.title}</p>
                                {book?.image && (
                                    <img className='book-image' src={book.image} alt={book.title} />
                                )}
                                <p className='book-author'>by {book?.author}</p>
                                <p className='book-genre'>{book?.genre}</p>
                                {/* <p className='book-desc'>{book?.description}</p> */}
                                <p className='book-year'>{book?.publishedYear}</p>
                                <p className='book-price'>${book?.price} (x{book.count})</p>
                                <button className='remove-button' onClick={() => removeFromCart(book.id)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    {booksData.length === 0 && <p>Your cart is empty.</p>}
                    <Link className='checkout-link pop' to='/checkout'>Checkout</Link>
                </div>
            )}
        </div>
    );
}

export default Cart;
