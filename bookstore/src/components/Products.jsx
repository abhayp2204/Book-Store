import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';
import { Link } from 'react-router-dom'
import '../css/Products.css';

function Products() {
    const userId = auth.currentUser.uid;
    const [allItems, setAllItems] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [searchQueryVendor, setSearchQueryVendor] = useState('');
    const [searchQueryItem, setSearchQueryItem] = useState('');
    const [userCart, setUserCart] = useState({})

    useEffect(() => {
        // Fetch all items from Firestore
        const fetchAllItems = async () => {
            try {
                const allItemsRef = firestore.collection('users');
                const allItemsData = await allItemsRef.get();

                const itemsArray = [];

                allItemsData.forEach((doc) => {
                    const userData = doc.data();
                    const vendorItems = userData.items || [];
                    const vendorName = userData.shopName || 'Unknown Shop';

                    vendorItems.forEach((item) => {
                        // Filter items based on searchQueryItem
                        if (
                            item.name.toLowerCase().includes(searchQueryItem.toLowerCase()) ||
                            item.vendorName.toLowerCase().includes(searchQueryVendor.toLowerCase())
                        ) {
                            itemsArray.push({ ...item, vendorName });
                        }
                    });
                });

                setAllItems(itemsArray);
            } catch (error) {
                console.error('Error fetching all items:', error);
            }
        };

        

        // Fetch vendors from Firestore
        const fetchVendors = async () => {
            try {
                const vendorsRef = firestore.collection('users');
                const vendorsData = await vendorsRef.where('accountType', '==', 'vendor').get();

                const vendorsArray = vendorsData.docs.map((doc) => {
                    const vendorData = doc.data();
                    return {
                        shopName: vendorData.shopName || 'Unknown Shop',
                        description: vendorData.description || 'No description available',
                        timings: vendorData.timings || 'No timings available',
                    };
                });

                setVendors(vendorsArray);
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        
        fetchUserCart()
        fetchAllItems()
        fetchVendors()
    }, [searchQueryItem, searchQueryVendor]); // Include searchQueryItem and searchQueryVendor as dependencies

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
    }

    const handleVendorSearchChange = (e) => {
        setSearchQueryVendor(e.target.value);
    };

    const handleItemSearchChange = (e) => {
        setSearchQueryItem(e.target.value);
    };

    const filteredVendors = vendors.filter((vendor) =>
        vendor.shopName.toLowerCase().includes(searchQueryVendor.toLowerCase())
    );

    const filteredItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQueryItem.toLowerCase())
    );

    console.log(userCart)
    

    const handleAddToCart = async (productId) => {
        try {
            const userDocRef = firestore.collection('users').where('uid', '==', userId);
            const userQuerySnapshot = await userDocRef.get();

            if (!userQuerySnapshot.empty) {
                // Get the first user document (assuming there's only one matching user)
                const userDoc = userQuerySnapshot.docs[0];

                // Get the user's cart from the document
                const userCart = userDoc.data().cart || [];

                // Check if the product is already in the cart
                const existingProductIndex = userCart.findIndex((item) => item.productId === productId);

                if (existingProductIndex !== -1) {
                    userCart[existingProductIndex].count += 1;
                } else {
                    userCart.push({ productId, count: 1 });
                }

                console.log(userCart)

                // Update the user's document in Firestore
                await userDoc.ref.update({
                    cart: userCart,
                });

                // Update the local state
                setUserCart((prevCart) => ({
                    ...prevCart,
                    [productId]: (prevCart[productId] || 0) + 1,
                }));
            }
        } catch (error) {
            console.error('Error updating user cart:', error);
        }
        fetchUserCart()

    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const userDocRef = firestore.collection('users').where('uid', '==', userId);
            const userQuerySnapshot = await userDocRef.get();

            if (!userQuerySnapshot.empty) {
                // Get the first user document (assuming there's only one matching user)
                const userDoc = userQuerySnapshot.docs[0];

                // Get the user's cart from the document
                const userCart = userDoc.data().cart || [];

                // Check if the product is already in the cart
                const existingProductIndex = userCart.findIndex((item) => item.productId === productId);

                if (existingProductIndex !== -1) {
                    // If the product exists in the cart
                    const updatedCart = [...userCart];

                    // Decrease the count
                    if (updatedCart[existingProductIndex].count > 0) {
                        updatedCart[existingProductIndex].count -= 1;

                        // Remove the item's object entirely if count becomes 0
                        if (updatedCart[existingProductIndex].count === 0) {
                            updatedCart.splice(existingProductIndex, 1);
                        }

                        // Update the user's document in Firestore
                        await userDoc.ref.update({
                            cart: updatedCart,
                        });

                        // Update the local state
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






    const getItemCount = (productId) => {
        const cartItems = Object.values(userCart);

        for (const item of cartItems) {
            if (item.productId === productId) {
                return item.count || 0;
            }
        }

        return 0;
    };



    return (
        <div className="products-container">
            <div className="vendors-list">
                <div className="vendor-search-bar">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchQueryVendor}
                        onChange={handleVendorSearchChange}
                    />
                </div>
                {filteredVendors.map((vendor, index) => (
                    <div key={index} className="vendor-info">
                        <div className="vendor-name">{vendor.shopName}</div>
                        <div className="vendor-description">{vendor.description}</div>
                        <div className="vendor-timings">{vendor.timings}</div>
                    </div>
                ))}
            </div>

            <div className="products-view">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQueryItem}
                        onChange={handleItemSearchChange}
                    />
                </div>

                <div className="items">
                    {filteredItems.map((item, index) => (
                        <Link key={index} to={`/product/${item.id}`} className="product-link linkstyle">
                            <div className="product-details">
                                <div className='product-details-upper'>
                                    <span className="product-name">{item.name} - ${item.price}</span>
                                    <div className="product-vendor">{item.vendorName}</div>
                                    {item.imageURL && <img src={item.imageURL} alt={item.name} />}
                                    <button onClick={() => handleAddToCart(item.id)} className="add-to-cart-btn">
                                        Add to Cart
                                    </button>
                                </div>

                                <div className='product-details-lower'>
                                    {getItemCount(item.id) > 0 && (
                                        <div className="quantity-controls">
                                            <button onClick={() => handleRemoveFromCart(item.id)} className="quantity-btn">
                                                -
                                            </button>
                                            <span className="quantity">{getItemCount(item.id)}</span>
                                            <button onClick={() => handleAddToCart(item.id)} className="quantity-btn">
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}

                </div>
            </div>

        </div>
    );

}

export default Products;
