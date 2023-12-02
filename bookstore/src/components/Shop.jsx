import React, { useState, useEffect } from 'react';
import { auth, firestore, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../css/Shop.css';

function generateItemId() {
    return 'item-' + Math.random().toString(36).substr(2, 6);
}

function Shop() {
    const user = auth.currentUser;
    const curUid = user.uid;

    const [vendorDetails, setVendorDetails] = useState({
        shopName: '',
        timings: '',
        description: '',
    });
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isAddItemPopupOpen, setIsAddItemPopupOpen] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const usersRef = firestore.collection('users');
    const productsRef = firestore.collection('products');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userQuery = await usersRef.where('uid', '==', curUid).get();
                if (!userQuery.empty) {
                    const userDoc = userQuery.docs[0];
                    const userData = userDoc.data();

                    setVendorDetails({
                        shopName: userData.shopName || '',
                        timings: userData.timings || '',
                        description: userData.description || '',
                    });
                    setItems(userData.items || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [curUid]);

    useEffect(() => {
        // Filter items based on the search term
        const filtered = items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredItems(filtered);
    }, [items, searchTerm]);

    const handleAddItemClick = () => {
        setIsAddItemPopupOpen(true);
    };

    const handleAddItemSubmit = async () => {
        const newItem = {
            id: generateItemId(),
            name: newItemName,
            price: newItemPrice,
        };

        if (imageFile) {
            const storageRef = ref(storage, `/items/${imageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            try {
                await uploadTask;
                console.log('Image uploaded successfully.');

                const downloadURL = await getDownloadURL(storageRef);

                newItem.imageURL = downloadURL;

            } catch (error) {
                console.error('Error uploading image: ', error);
            }
        }

        try {
            const userQuery = await usersRef.where('uid', '==', curUid).get();

            if (!userQuery.empty) {
                const userDoc = userQuery.docs[0];
                const userData = userDoc.data();
                const currentItems = userData.items || [];

                // Add the new item to the "products" collection
                const productsRef = firestore.collection('products');
                await productsRef.add({
                    id: newItem.id,
                    name: newItem.name,
                    price: newItem.price,
                    imageURL: newItem.imageURL || '',
                });

                await userDoc.ref.update({
                    items: [...currentItems, newItem],
                });

                setItems([...currentItems, newItem]);

                setIsAddItemPopupOpen(false);

                setNewItemName('');
                setNewItemPrice('');

                alert("Item added successfully");
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };


    return (
        <div className='shop-container'>
            <div className={`shop-details ${isAddItemPopupOpen ? 'popup-open' : ''}`}>
                <h1>{vendorDetails.shopName}</h1>
                <div className='vendor-desc'>{vendorDetails.description}</div>
                <p>Timings: {vendorDetails.timings}</p>
            </div>

            <div className={`items-list ${isAddItemPopupOpen ? 'popup-open' : ''}`}>
                <div className='your-items'>
                    Your Items:
                    <input
                        type='text'
                        placeholder='Search items...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='shop-item-container'>
                    {filteredItems.map((item, index) => (
                        <div className='item-details' key={index}>
                            <div className='item-name'>{item.name}</div>
                            <div className='item-price'>${item.price}</div>
                            {item.imageURL && <img src={item.imageURL} alt={item.name} />}
                        </div>
                    ))}
                </div>
                <button className='add-item-btn pop' onClick={handleAddItemClick}>
                    Add Item
                </button>
            </div>

            {isAddItemPopupOpen && (
                <div className='add-item-popup'>
                    <h3>Add New Item</h3>
                    <label>Name:</label>
                    <input
                        type='text'
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                    />
                    <input type='file' onChange={e => setImageFile(e.target.files[0])} />
                    <label>Price:</label>
                    <input
                        type='number'
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                    />
                    <button onClick={handleAddItemSubmit}>Add Item</button>
                    <button className='cancel' onClick={() => setIsAddItemPopupOpen(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default Shop;
