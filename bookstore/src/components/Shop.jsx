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
    const [newItemDescription, setNewItemDescription] = useState('');
    const [newItemIngredients, setNewItemIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState('');
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

    const handleAddIngredient = () => {
        if (newIngredient.trim() !== '') {
            setNewItemIngredients(prevIngredients => [...prevIngredients, newIngredient.trim()]);
            setNewIngredient('');
        }
    };

    const handleRemoveIngredient = (index) => {
        setNewItemIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index));
    };

    const handleAddItemSubmit = async () => {
        const newItem = {
            id: generateItemId(),
            name: newItemName,
            description: newItemDescription,
            ingredients: newItemIngredients,
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
            // Add the new item to the "products" collection
            const productsRef = firestore.collection('products');
            await productsRef.add({
                id: newItem.id,
                name: newItem.name,
                description: newItem.description,
                ingredients: newItem.ingredients,
                price: newItem.price,
                imageURL: newItem.imageURL || '',
            });

            // Generate a QR code for the new item
            const qrCodeData = {
                id: newItem.id,
                name: newItem.name,
                description: newItem.description,
                ingredients: newItem.ingredients,
                price: newItem.price,
                imageURL: newItem.imageURL || '',
            };
            const qrCodeJSON = JSON.stringify(qrCodeData);
            newItem.qrCode = qrCodeJSON;

            const userQuery = await usersRef.where('uid', '==', curUid).get();
            if (!userQuery.empty) {
                const userDoc = userQuery.docs[0];
                const userData = userDoc.data();
                const currentItems = userData.items || [];

                await userDoc.ref.update({
                    items: [...currentItems, newItem],
                });

                setItems([...currentItems, newItem]);

                setIsAddItemPopupOpen(false);

                setNewItemName('');
                setNewItemDescription('');
                setNewItemIngredients([]);
                setNewItemPrice('');
                setNewIngredient('');

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
                <button className='add-item-btn pop' onClick={handleAddItemClick}>
                    Add Item
                </button>
            </div>

            <div className={`items-list ${isAddItemPopupOpen ? 'popup-open' : ''}`}>
                <div className='your-items'>
                    Your Items:
                    <input
                        className='search-bar'
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
                    <label>Description:</label>
                    <textarea
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                    />




                    <label>Ingredients:</label>
                    <div className='ingredients-input'>


                        {newItemIngredients && newItemIngredients.map((ingredient, i) => (
                            <div key={i} className='ingredient-item'>
                                <span>{ingredient}</span>
                                <button onClick={() => handleRemoveIngredient(i)} className='remove-ingredient-btn'>X</button>
                            </div>
                        ))}


                        <div className='add-ingredient-input'>
                            <input
                                type='text'
                                className='add-ingredient-input-field'
                                value={newIngredient}
                                onChange={(e) => setNewIngredient(e.target.value)}
                                placeholder='Add ingredient...'
                            />
                            <button onClick={handleAddIngredient} className='add-ingredient-btn'>Add</button>
                        </div>
                    </div>





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
