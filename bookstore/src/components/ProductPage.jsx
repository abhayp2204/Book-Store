// ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import '../css/ProductPage.css';

function ProductPage() {
    const { productId } = useParams();
    const [productDetails, setProductDetails] = useState(null);

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
    }, [productId]);

    return (
        <div className='product-page-container'>
            {productDetails ? (
                <>
                    <h1 className='product-name'>{productDetails.name}</h1>
                    <p className='product-description'>Description: {productDetails.description}</p>
                    <p className='product-price'>Price: ${productDetails.price}</p>
                    {productDetails.imageURL && <img className='product-image' src={productDetails.imageURL} alt={productDetails.name} />}
                </>
            ) : (
                <p className='loading-message'>Loading product details...</p>
            )}
        </div>
    );
}

export default ProductPage;
