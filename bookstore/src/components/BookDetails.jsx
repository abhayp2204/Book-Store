import React, { useState, useEffect } from 'react';
import '../css/Book.css';

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"

function BookDetails({ bookDetails, updateCartCount }) {
    if(!bookDetails) return;
    const usersRef = firestore.collection('users');
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const fetchCartCount = async () => {
            const count = await getCartCountForBook(bookDetails.id);
            setCartCount(count);
        };

        fetchCartCount();
    }, [bookDetails.id]);

    const getCartCountForBook = async (bookId) => {
        const user = auth.currentUser;
        if (user) {
            const userRefQuery = usersRef.where('uid', '==', user.uid);
    
            // Fetch the user data based on the query
            try {
                const querySnapshot = await userRefQuery.get();
    
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = userDoc.data();
                    const currentCart = userData.cart || [];
                    
                    // Find the book in the cart by bookId
                    const bookInCart = currentCart.find(item => item.bookId === bookId);
    
                    // If the book is in the cart, return its count; otherwise, return 0.
                    return bookInCart ? bookInCart.count : 0;
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
        return 0; // Default to 0 if user is not authenticated or book is not found in the cart.
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
                        const currentCart = userData.cart || [];
    
                        currentCart.push({ bookId, count: 1 });
                        setCartCount(1)
    
                        // Update the user's document with the new cart array
                        userDoc.ref.update({ cart: currentCart })
                            .then(() => {
                                console.log(`Book ${bookId} added to the cart for user ${user.uid}`);
                            })
                            .catch((error) => {
                                console.error('Error updating user document:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    };
    

    const handleIncrement = () => {
        updateCartCount(cartCount + 1);
        setCartCount(cartCount + 1)
    };

    const handleDecrement = () => {
        if (cartCount > 0) {
            updateCartCount(cartCount - 1);
            setCartCount(cartCount - 1)
        }
    };

    return (
        <div className='book-details'>
            <p className='book-title'>{bookDetails?.title}</p>
            {bookDetails?.image && (
                <img className='book-image' src={bookDetails.image} alt={bookDetails.title} />
            )}
            <p className='book-author'>by {bookDetails?.author}</p>
            <p className='book-genre'>{bookDetails?.genre}</p>
            <p className='book-desc'>{bookDetails?.description}</p>
            <p className='book-year'>{bookDetails?.publishedYear}</p>
            <p className='book-price'>${bookDetails?.price}</p>
            {cartCount > 0 ? (
                <div className="cart-counter2">
                    <button className='counter-button2' onClick={handleDecrement}>-</button>
                    <div className='counter-count'>{cartCount}</div>
                    <button className='counter-button2' onClick={handleIncrement}>+</button>
                </div>
            ) : (
                <button onClick={() => addBook(bookDetails.id)} className="add-book-button">
                    Add to Cart
                </button>
            )}
        </div>
    );
}

export default BookDetails;
