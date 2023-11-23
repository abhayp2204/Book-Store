import React, { useState, useEffect } from 'react';
import '../css/AddProduct.css';

// Firebase
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore, storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function AddProduct() {
    const adminsRef = firestore.collection('admin')
    const productsRef = firestore.collection('products');

    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productPrice, setProductPrice] = useState(0);

    const [customAttributes, setCustomAttributes] = useState([]);

    const [imageFile, setImageFile] = useState(null);
    const [imageURL, setImageURL] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if the user's uid is in the admin collection
        const user = auth.currentUser
        const curUid = user.uid
        console.log(curUid)
        if (user) {
            adminsRef.where('uid', '==', curUid).get()
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        setIsAdmin(true); // User is an admin
                    } else {
                        setIsAdmin(false); // User is not an admin
                    }
                })
                .catch((error) => {
                    console.error('Error checking admin status: ', error);
                });
        }
    }, []);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageFile(selectedFile);
    };

    const handleImageUpload = () => {
        if (imageFile) {
            const storageRef = ref(storage, `/productImages/${imageFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);

            uploadTask.then((snapshot) => {
                console.log('Image uploaded successfully.');
                getDownloadURL(storageRef).then((downloadURL) => {
                    setImageURL(downloadURL);
                });
            }).catch((error) => {
                console.error('Error uploading image: ', error);
            });
        } else {
            console.error('No image file selected.');
        }
    }

    const addAttribute = () => {
        setCustomAttributes([...customAttributes, { name: '', value: '' }]);
    }

    const removeAttribute = (index) => {
        const updatedAttributes = [...customAttributes];
        updatedAttributes.splice(index, 1);
        setCustomAttributes(updatedAttributes);
    }

    const handleAttributeChange = (index, attributeName, attributeValue) => {
        const updatedAttributes = [...customAttributes];
        updatedAttributes[index] = { name: attributeName, value: attributeValue };
        setCustomAttributes(updatedAttributes);
    }

    const addProduct = async (e) => {
        e.preventDefault();

        const attributesObject = {};
        customAttributes.forEach((attr) => {
            if (attr.name && attr.value) {
                attributesObject[attr.name] = attr.value;
            }
        });

        const newProduct = {
            title: productName,
            image: imageURL,
            price: productPrice,
            customAttributes: attributesObject,
        };

        await productsRef.add(newProduct);

        setProductName('');
        setProductImage('');
        setProductPrice(0);
        setCustomAttributes([]);
    }

    return (
        <div className='add-product'>
            {isAdmin && (
                <div className='add-product-container'>
                    <div className='product-input product-name'>
                        <div className='prompt'>Title</div>
                        <input
                            className='add-product input-product-name'
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder='Product Name'
                        />
                    </div>
                    <div className='product-input product-image-input'>
                        <div className='prompt'>Image Upload</div>
                        <input
                            type='file'
                            accept='image/*'
                            className='add-product input-product-image'
                            onChange={handleImageChange}
                        />
                        <button className='upload-product' onClick={handleImageUpload}>
                            Upload Image
                        </button>
                        {imageURL && (
                            <img src={imageURL} alt='Product Image' className='uploaded-image' />
                        )}
                    </div>
                    <div className='product-input product-price'>
                        <div className='prompt'>Price</div>
                        <input
                            className='add-product input-product-price'
                            type='number'
                            value={productPrice}
                            onChange={(e) => setProductPrice(parseFloat(e.target.value))}
                            placeholder='Price'
                        />
                    </div>
                    <div className='product-input product-custom'>
                        <div className='prompt'>Custom Attributes</div>
                        {customAttributes.map((attr, index) => (
                            <div key={index} className='attribute-input'>
                                <input
                                    className='add-product input-custom-name'
                                    value={attr.name}
                                    onChange={(e) => handleAttributeChange(index, e.target.value, attr.value)}
                                    placeholder='Attribute Name'
                                />
                                <input
                                    className='add-product input-custom-value'
                                    value={attr.value}
                                    onChange={(e) => handleAttributeChange(index, attr.name, e.target.value)}
                                    placeholder='Attribute Value'
                                />
                                <button className='remove-attribute-button' onClick={() => removeAttribute(index)}>Remove</button>
                            </div>
                        ))}
                        <button className='add-attribute-button' onClick={addAttribute}>Add Attribute</button>
                    </div>
                    <button className='add-product-button' onClick={(e) => addProduct(e)}>
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

export default AddProduct;
