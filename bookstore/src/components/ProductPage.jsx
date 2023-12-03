// ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import QRCode from 'react-qr-code'
import '../css/ProductPage.css';

function ProductPage() {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [userCart, setUserCart] = useState({});
    const userId = auth.currentUser.uid;

    useEffect(() => {
        // Fetch product details from Firestore based on productId
        const fetchProductDetails = async () => {
            try {
                const productsRef = firestore.collection('products');
                const querySnapshot = await productsRef.where('id', '==', productId).get();

                if (!querySnapshot.empty) {
                    // Get the data from the first document in the result
                    const productData = querySnapshot.docs[0].data();
                    setProductDetails(productData);
                } else {
                    console.log('Product not found');
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
        fetchUserCart();
    }, [productId]);

    const fetchUserCart = async () => {
        try {
            const userDoc = await firestore.collection('users').where('uid', '==', userId).get();

            if (!userDoc.empty) {
                const userData = userDoc.docs[0].data();
                const userCart = userData.cart || {};
                setUserCart(userCart);
            }
        } catch (error) {
            console.error('Error fetching user cart:', error);
        }
    };

    const handleAddToCart = async () => {
        try {
            const userDocRef = firestore.collection('users').where('uid', '==', userId);
            const userQuerySnapshot = await userDocRef.get();

            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userCart = userDoc.data().cart || [];

                const existingProductIndex = userCart.findIndex((item) => item.productId === productId);

                if (existingProductIndex !== -1) {
                    userCart[existingProductIndex].count += 1;
                } else {
                    userCart.push({ productId, count: 1 });
                }

                await userDoc.ref.update({
                    cart: userCart,
                });

                setUserCart((prevCart) => ({
                    ...prevCart,
                    [productId]: (prevCart[productId] || 0) + 1,
                }));
            }
        } catch (error) {
            console.error('Error updating user cart:', error);
        }

        fetchUserCart();
    };

    const handleRemoveFromCart = async () => {
        try {
            const userDocRef = firestore.collection('users').where('uid', '==', userId);
            const userQuerySnapshot = await userDocRef.get();

            if (!userQuerySnapshot.empty) {
                const userDoc = userQuerySnapshot.docs[0];
                const userCart = userDoc.data().cart || [];

                const existingProductIndex = userCart.findIndex((item) => item.productId === productId);

                if (existingProductIndex !== -1) {
                    if (userCart[existingProductIndex].count > 0) {
                        userCart[existingProductIndex].count -= 1;

                        // Remove the item's object entirely if count becomes 0
                        if (userCart[existingProductIndex].count === 0) {
                            userCart.splice(existingProductIndex, 1);
                        }

                        await userDoc.ref.update({
                            cart: userCart,
                        });

                        setUserCart((prevCart) => ({
                            ...prevCart,
                            [productId]: (prevCart[productId] || 0) - 1,
                        }));
                    }
                }
            }
        } catch (error) {
            console.error('Error updating user cart:', error);
        }

        fetchUserCart();
    };

    const getItemCount = () => {
        const cartItems = Object.values(userCart);

        for (const item of cartItems) {
            if (item.productId === productId) {
                return item.count || 0;
            }
        }

        return 0;
    };

    return (
        <div className='product-page-container'>
            {productDetails ? (
                <div className='product-details-container'>
                    <div className='product-details-left'>
                        <h1 className='product-name-pp'>{productDetails.name}</h1>
                        <p className='product-price-pp'>Price: ${productDetails.price}</p>
                        <img className='product-image-pp' src={productDetails.imageURL} alt={productDetails.name} />
                        <button onClick={handleAddToCart} className='add-to-cart-btn-pp pop'>
                            Add to Cart
                        </button>
                        {getItemCount() > 0 && (
                            <div className='quantity-controls-pp'>
                                <button onClick={handleRemoveFromCart} className='quantity-btn-pp'>
                                    -
                                </button>
                                <span className='quantity-pp'>{getItemCount()}</span>
                                <button onClick={handleAddToCart} className='quantity-btn-pp'>
                                    +
                                </button>
                            </div>
                        )}
                    </div>


                    <div className='product-details-right'>
                        <p className='product-description-pp'>{productDetails.description}</p>
                        <div className='product-ingredients-pp'>
                            <h3>Ingredients:</h3>
                            <ul>
                                {productDetails.ingredients &&
                                    productDetails.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                            </ul>
                        </div>
                    </div>

                    <div className='product-details-qr'>
                        <h1 className='qr-title'>Scan here...</h1>
                        <QRCode value={JSON.stringify(productDetails)} />
                    </div>


                </div>
            ) : (
                <p className='loading-message'>Loading product details...</p>
            )}
        </div>
    );
}

export default ProductPage;
