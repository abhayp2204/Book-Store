import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import '../css/Products.css';

function Products() {
    const [allItems, setAllItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

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
                    const vendorName = userData.shopName || "Unknown Shop"; // Default value if shopName is not present
                    vendorItems.forEach((item) => {
                        itemsArray.push({ ...item, vendorName });
                    });
                });

                setAllItems(itemsArray);
            } catch (error) {
                console.error('Error fetching all items:', error);
            }
        };

        fetchAllItems();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredItems = allItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="products-container">
            <h1>All Products</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <ul className="products-list">
                {filteredItems.map((item, index) => (
                    <li key={index}>
                        <div className="product-details">
                            <span className="product-name">{item.name}</span>
                            <span className="product-price">${item.price}</span>
                            <span className="vendor-name">Vendor: {item.vendorName}</span>
                            {item.imageURL && <img src={item.imageURL} alt={item.name} />}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Products;
