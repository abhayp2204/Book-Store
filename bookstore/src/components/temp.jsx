import React from 'react';
import '../css/Book.css';

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"

function BookDetails({ bookDetails, cartCount, updateCartCount }) {
    const usersRef = firestore.collection('users');

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
    
                        // Update the user's document with the new cart array
                        userDoc.ref.update({ cart: currentCart })
                            .then(() => {
                                console.log(`Book ${bookId} added to the cart for user ${user.uid}`);
                                alert("Added to Cart");
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
    };

    const handleDecrement = () => {
        if (cartCount > 0) {
            updateCartCount(cartCount - 1);
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
                <div className="cart-controls">
                    <div className="cart-count">
                        <button onClick={handleDecrement}>-</button>
                        {cartCount}
                        <button onClick={handleIncrement}>+</button>
                    </div>
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
