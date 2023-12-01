import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import '../css/Checkout.css'; // Add your CSS file for styling
import { Link } from 'react-router-dom';

function Checkout() {
    const userId = auth.currentUser.uid
    const [cartDetails, setCartDetails] = useState([])
    const [isItemsConfirmed, setItemsConfirmed] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const [isPlaceOrderDisabled, setPlaceOrderDisabled] = useState(true)

    useEffect(() => {
        const fetchUserCart = async () => {
            try {
                const userDoc = await firestore.collection('users').where('uid', '==', userId).get();

                if (!userDoc.empty) {
                    const userData = userDoc.docs[0].data();
                    const userCart = userData.cart || [];
                    fetchCartDetails(userCart);
                }
            } catch (error) {
                console.error('Error fetching user cart:', error);
            }
        };

        const fetchCartDetails = async (cartItems) => {
            const productsRef = firestore.collection('products');

            const cartItemDetails = [];

            for (let i = 0; i < cartItems.length; i++) {
                const cartItem = cartItems[i];

                try {
                    const productQuery = await productsRef.where('id', '==', cartItem.productId).get();
                    if (!productQuery.empty) {
                        const productDoc = productQuery.docs[0];
                        const productData = productDoc.data();

                        cartItemDetails.push({
                            ...cartItem,
                            details: productData,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching product details:', error);
                }
            }

            setCartDetails(cartItemDetails);
        };

        fetchUserCart();
    }, [userId]);

    useEffect(() => {
        setPlaceOrderDisabled(!isItemsConfirmed);
    }, [isItemsConfirmed]);

    const handleConfirmItems = () => {
        setItemsConfirmed(true);
    };

    return (
        <div className="checkout-container">
            <div className="order-container">
                <h2 className="order-details-title">Order Details</h2>
                <form className="order-form">
                    <div className="form-group">
                        <label htmlFor="deliveryAddress" className="form-label">Delivery Address:</label>
                        <textarea id="deliveryAddress" name="deliveryAddress" className="form-textarea" required></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input type="email" id="email" name="email" className="form-input" required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Payment Method:</label>
                        <div className="payment-method-options">
                            <button
                                type="button"
                                className={`payment-method-btn ${selectedPaymentMethod === 'creditCard' ? 'selected' : ''}`}
                                onClick={() => setSelectedPaymentMethod('creditCard')}
                            >
                                Credit Card
                            </button>

                            <button
                                type="button"
                                className={`payment-method-btn ${selectedPaymentMethod === 'paypal' ? 'selected' : ''}`}
                                onClick={() => setSelectedPaymentMethod('paypal')}
                            >
                                PayPal
                            </button>

                            {/* Add more buttons for other payment methods as needed */}
                        </div>
                    </div>


                    {/* Add more fields for other order details as needed */}

                    <button
                        type="submit"
                        className={`${!isItemsConfirmed ? 'disabled' : 'order-submit-btn'}`}
                        disabled={!isItemsConfirmed}
                    >
                        Place Order
                    </button>


                </form>
            </div>




            <div className="cart-container">
                
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cartDetails.map((cartItem, index) => (
                        <div key={index} className="cart-item">
                            <span id='cart-item-name'>{cartItem.details.name} (x{cartItem.count})</span>
                            <span>${cartItem.details.price * cartItem.count}</span>
                        </div>
                    ))}
                </div>
                {!isItemsConfirmed && (
                    <button className="confirm-items" onClick={handleConfirmItems}>
                        Confirm your items
                    </button>
                )}
                {isItemsConfirmed && (
                    <div className="items-confirmedd">
                        Items Confirmed
                    </div>
                )}
            </div>
            

        </div>
    );
}

export default Checkout;
