import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import '../css/Products.css';

function Products() {
    const [allItems, setAllItems] = useState([]);
    const [vendors, setVendors] = useState([]);
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

        // Fetch vendors from Firestore
        const fetchVendors = async () => {
            try {
                const vendorsRef = firestore.collection('users');
                const vendorsData = await vendorsRef.where('accountType', '==', 'vendor').get();

                const vendorsArray = vendorsData.docs.map((doc) => {
                    const vendorData = doc.data();
                    return {
                        shopName: vendorData.shopName || "Unknown Shop",
                        description: vendorData.description || "No description available",
                        timings: vendorData.timings || "No timings available",
                    };
                });

                setVendors(vendorsArray);
            } catch (error) {
                console.error('Error fetching vendors:', error);
            }
        };

        fetchAllItems();
        fetchVendors();
    }, []);

    const handleVendorSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredVendors = vendors.filter((vendor) =>
        vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="products-container">
            <div className="vendors-list">
                <div className="vendor-search-bar">
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchQuery}
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
            <div className="products-list">
                <h1>All Products</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleVendorSearchChange} // Using the same search handler for products
                    />
                </div>
                {allItems.map((item, index) => (
                    <div key={index} className="product-details">
                        <div className="product-name">{item.name}</div>
                        <div className="product-price">${item.price}</div>
                        <div className="vendor-name">{item.vendorName}</div>
                        {item.imageURL && <img src={item.imageURL} alt={item.name} />}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Products;
