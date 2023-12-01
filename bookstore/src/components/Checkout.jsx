import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import emailjs from 'emailjs-com';
import { Link } from 'react-router-dom';
import '../css/Checkout.css'; // Add your CSS file for styling

function Checkout() {
    const userId = auth.currentUser.uid;
    const [cartDetails, setCartDetails] = useState([]);
    const [isItemsConfirmed, setItemsConfirmed] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isPlaceOrderDisabled, setPlaceOrderDisabled] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState(auth.currentUser.email);
    const [loadingCart, setLoadingCart] = useState(true);

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
            setLoadingCart(false); // Set loading to false when cart items are fetched
        };

        fetchUserCart();
    }, [userId]);

    useEffect(() => {
        setPlaceOrderDisabled(!isItemsConfirmed);
    }, [isItemsConfirmed]);

    const handleConfirmItems = () => {
        setItemsConfirmed(true);
    };








    const handlePlaceOrder = async () => {

        // Simulate order confirmation email
        const orderId = `order#${Math.floor(Math.random() * 10000)}`;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);

        // Send an email (Note: This is a simulation, do not expose email service credentials in the client-side code)
        try {
            const emailParams = {
                to_name: auth.currentUser.displayName,
                to_email: email,
                order_id: orderId,
                delivery_date: deliveryDate.toDateString(),
            };

            const result = await emailjs.send('service_rlwetfa', 'template_lb674x7', emailParams, '-mO2vciW8EwbzsaqF');
            console.log(result);
            alert("Your order has been confirmed!")
        } catch (error) {
            console.error('Error sending email:', error);
        }

        // Proceed with other order placement logic
        // ...
    };







    return (
        <div className="checkout-container">
            <div className="order-container">
                <h2 className="order-details-title">Order Details</h2>
                <form className="order-form">
                    <div className="form-group">
                        <label htmlFor="deliveryAddress" className="form-label">
                            Delivery Address:
                        </label>
                        <textarea id="deliveryAddress" name="deliveryAddress" className="form-textarea" required></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="form-label">
                            Phone Number:
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="form-input"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
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
                        type="button"
                        className={`${!isItemsConfirmed ? 'disabled' : 'order-submit-btn'}`}
                        disabled={!isItemsConfirmed}
                        onClick={handlePlaceOrder}
                    >
                        Place Order
                    </button>
                </form>
            </div>

            <div className="cart-container">
                <h2>Your Cart</h2>
                {loadingCart ? (
                    // <p>Fetching cart items...</p>
                    <div className="loading-spinner"></div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartDetails.map((cartItem, index) => (
                                <div key={index} className="cart-item">
                                    <span id="cart-item-name">
                                        {cartItem.details.name} (x{cartItem.count})
                                    </span>
                                    <span>${cartItem.details.price * cartItem.count}</span>
                                </div>
                            ))}
                        </div>
                        {!isItemsConfirmed && (
                            <button className="confirm-items" onClick={handleConfirmItems}>
                                Confirm your items
                            </button>
                        )}
                        {isItemsConfirmed && <div className="items-confirmedd">Confirmed</div>}
                    </>
                )}
            </div>
        </div>
    );
}

export default Checkout;
