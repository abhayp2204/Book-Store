import React, { useState, useEffect } from 'react';
import '../css/Cart.css'; // Create a CSS file for your Cart component

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"

function Cart(props) {
    const usersRef = firestore.collection('users');
    const booksRef = firestore.collection('books');
    const [cartItems, setCartItems] = useState([]); // State to store cart items
    const [booksData, setBooksData] = useState([]); // State to store book data
    const [loading, setLoading] = useState(true); // State to track loading status

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

                    // Fetch book details for the items in the cart
                    const bookPromises = userCart.map(bookId => {
                        return booksRef.where('id', '==', bookId).get();
                    });

                    Promise.all(bookPromises)
                        .then(bookSnapshots => {
                            const booksData = bookSnapshots.map(bookSnapshot => {
                                const matchingBook = bookSnapshot.docs[0];
                                return {
                                    id: matchingBook.id,
                                    ...matchingBook.data(),
                                };
                            });
                            setBooksData(booksData);
                        })
                        .catch(error => {
                            console.error('Error fetching book data:', error);
                        })
                        .finally(() => {
                            setLoading(false); // Set loading to false once the data is fetched
                        });
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

    // Ensure this dependency array matches your data-fetching logic

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <ul>
                        {booksData.map((book, index) => (
                            <li key={index}>
                                <h3>{book.title}</h3>
                                <p>Author: {book.author}</p>
                                <img src={book.image} alt={book.title} />
                                <p>{book.description}</p>
                            </li>
                        ))}
                    </ul>
                    {booksData.length === 0 && <p>Your cart is empty.</p>}
                </>
            )}
        </div>
    );
}

export default Cart;
