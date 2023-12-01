import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import '../css/Cart.css'; // Add your CSS file for styling

function Cart() {
    const userId = auth.currentUser.uid;
    const [cartDetails, setCartDetails] = useState([]);

    useEffect(() => {
        const fetchUserCart = async () => {
            try {
                const userDoc = await firestore.collection('users').where('uid', '==', userId).get();

                if (!userDoc.empty) {
                    const userData = userDoc.docs[0].data()
                    const userCart = userData.cart || [];
                    fetchCartDetails(userCart);
                }
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        };

        const fetchCartDetails = async (cartItems) => {
            console.log("cart items = ", cartItems)
            const productsRef = firestore.collection('products');

            const cartItemDetails = [];

            for (let i = 0; i < cartItems.length; i++) {
                
                const cartItem = cartItems[i];
                console.log("Cart Item = ", cartItem)

                try {
                    const productQuery = await productsRef.where('id', '==', cartItem.productId).get();
                    if (!productQuery.empty) {
                        const productDoc = productQuery.docs[0];
                        const productData = productDoc.data();

                        const obj = { ...cartItem, details: productData }
                        // console.log(obj)
                        cartItemDetails.push({
                            ...cartItem,
                            details: productData,
                        });
                    }
                    else {
                        console.log("empty")
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }

            console.log("cid = ", cartItemDetails);
            setCartDetails(cartItemDetails);
        };



        fetchUserCart();
    }, [userId]);


    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            <div className="cart-items">
                {cartDetails.map((cartItem, index) => (
                    <div key={index} className="cart-item">
                        <span id='cart-item-name'>{cartItem.details.name} (x{cartItem.count})</span>
                        <span>${cartItem.details.price * cartItem.count}</span>
                        {/* {cartItem.details.imageURL && (
                            <img src={cartItem.details.imageURL} alt={cartItem.details.name} />
                        )} */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Cart;
