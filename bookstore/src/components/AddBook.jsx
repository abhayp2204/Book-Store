import React, { useState } from 'react';
import '../css/AddBook.css';

// Firebase
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { storage, firestore } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

function AddBook() {
    const booksRef = firestore.collection('books');

    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookImage, setBookImage] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [bookPages, setBookPages] = useState(0);
    const [bookPrice, setBookPrice] = useState(0);
    const [bookGenre, setBookGenre] = useState('');
    const [bookYear, setBookYear] = useState('');

    const [imageFile, setImageFile] = useState(null);
    const [imageURL, setImageURL] = useState('');

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImageFile(selectedFile);
    };

    const handleImageUpload = () => {
        if (imageFile) {
            const storageRef = ref(storage, `/bookImages/${imageFile.name}`);
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
    };

    function generateCustomBookId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000);

        return `${timestamp}-${random}`;
    }

    const addBook = async (e) => {
        e.preventDefault();

        await booksRef.add({
            id: generateCustomBookId(),
            title: bookTitle,
            author: bookAuthor,
            image: imageURL,
            description: bookDescription,
            pages: bookPages,
            price: bookPrice,
            genre: bookGenre,
            year: bookYear
        });

        alert("Book has been added!")

        // Reset the input fields
        setBookTitle('');
        setBookAuthor('');
        setBookImage('');
        setBookDescription('');
        setBookPages(0);
        setBookPrice(0);
        setBookGenre('');
        setBookYear('');
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
                        placeholder='Harry Potter and the Chamber of Secrets'
                    />
                </div>
                <div className='book-input book-author-input'>
                    <div className='prompt'>Author</div>
                    <input
                        className='add-book input-book-author'
                        value={bookAuthor}
                        onChange={(e) => setBookAuthor(e.target.value)}
                        placeholder='JK Rowling'
                    />
                </div>
                <div className='book-input book-image-input'>
                    <div className='prompt'>Image Upload</div>
                    <input
                        type='file'
                        accept='image/*'
                        className='add-book input-book-image'
                        onChange={handleImageChange}
                    />
                    <button className='upload-book' onClick={handleImageUpload}>
                        Upload Image
                    </button>
                    {imageURL && (
                        <img src={imageURL} alt='Book Cover' className='uploaded-image' />
                    )}
                </div>

                <div className='book-input book-description'>
                    <div className='prompt'>Description</div>
                    <textarea
                        className='add-book input-book-description'
                        value={bookDescription}
                        onChange={(e) => setBookDescription(e.target.value)}
                        placeholder='A brief introduction to the book'
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
                <div className='book-input book-genre'>
                    <div className='prompt'>Genre</div>
                    <input
                        className='add-book input-book-genre'
                        value={bookGenre}
                        onChange={(e) => setBookGenre(e.target.value)}
                        placeholder='Fantasy, Science Fiction, etc.'
                    />
                </div>
                <div className='book-input book-year'>
                    <div className='prompt'>Year</div>
                    <input
                        className='add-book input-book-year'
                        value={bookYear}
                        onChange={(e) => setBookYear(e.target.value)}
                        placeholder='Publication year'
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
