import React, { useState } from 'react';
import '../css/Book.css';

// Firebase
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { auth, firestore } from '../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function AddBook() {
    const booksRef = firestore.collection('books');

    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookImage, setBookImage] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [bookPages, setBookPages] = useState(0);
    const [bookPrice, setBookPrice] = useState(0);

    function generateCustomBookId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000); // Adjust the range as needed

        return `${timestamp}-${random}`;
    }

    const addBook = async (e) => {
        e.preventDefault();

        await booksRef.add({
            id: generateCustomBookId(),
            title: bookTitle,
            author: bookAuthor,
            image: bookImage,
            description: bookDescription,
            pages: bookPages,
            price: bookPrice, // Added the price field
        });

        // Reset the input fields
        setBookTitle('');
        setBookAuthor('');
        setBookImage('');
        setBookDescription('');
        setBookPages(0);
        setBookPrice(0); // Reset the price field
    }

    return (
        <div>
            <div className='add-book-container'>
                <div className='book-input book-name'>
                    <div className='prompt'>Title</div>
                    <input
                        className='add-book input-book-name'
                        value={bookTitle}
                        onChange={(e) => setBookTitle(e.target.value)}
                        placeholder='Title'
                    />
                </div>
                <div className='book-input book-author'>
                    <div className='prompt'>Author</div>
                    <input
                        className='add-book input-book-author'
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        placeholder='Author'
                    />
                </div>
                <div className='book-input book-image'>
                    <div className='prompt'>Image URL</div>
                    <input
                        className='add-book input-book-image'
                        value={bookImage}
                        onChange={(e) => setBookImage(e.target.value)}
                        placeholder='Image URL'
                    />
                </div>
                <div className='book-input book-description'>
                    <div className='prompt'>Description</div>
                    <textarea
                        className='add-book input-book-description'
                        value={bookDescription}
                        onChange={(e) => setBookDescription(e.target.value)}
                        placeholder='Description'
                    />
                </div>
                <div className='book-input book-pages'>
                    <div className='prompt'>Number of Pages</div>
                    <input
                        className='add-book input-book-pages'
                        type='number'
                        value={bookPages}
                        onChange={(e) => setBookPages(parseInt(e.target.value, 10))}
                        placeholder='Number of Pages'
                    />
                </div>
                <div className='book-input book-price'>
                    <div className='prompt'>Price</div>
                    <input
                        className='add-book input-book-price'
                        type='number'
                        value={bookPrice}
                        onChange={(e) => setBookPrice(parseFloat(e.target.value))}
                        placeholder='Price'
                    />
                </div>
                <button className='add-book-button' onClick={(e) => addBook(e)}>
                    Add
                </button>
            </div>
        </div>
    );
}

export default AddBook;
