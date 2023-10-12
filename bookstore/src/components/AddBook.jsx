import React, { useState } from 'react'
import '../css/Book.css'

// Firebase
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"

function AddBook() {
    const booksRef = firestore.collection('books')

    const [bookTitle, setBookTitle] = useState("")
    const [bookAuthor, setBookAuthor] = useState("")
    const [bookImage, setBookImage] = useState("")
    const [bookDescription, setBookDescription] = useState("")
    const [bookPages, setBookPages] = useState(0)

    const query = booksRef.orderBy('createdAt').limit(25)
    const [books] = useCollectionData(query, { idField: 'id' })

    function generateCustomBookId() {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000); // Adjust the range as needed
    
        return `${timestamp}-${random}`;
    }

    const addBook = async (e) => {
        e.preventDefault()

        await booksRef.add({
            id: generateCustomBookId(),
            title: bookTitle,
            author: bookAuthor,
            image: bookImage,
            description: bookDescription,
            pages: bookPages
        })

        // Reset the input fields
        setBookTitle('')
        setBookAuthor('')
        setBookImage('')
        setBookDescription('')
        setBookPages(0)
    }

    return (
        <div>
            <div className='add-book-container'>
                <input
                    className='add-book input-book-name'
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder='Title'
                />
                <input
                    className='add-book input-book-author'
                    value={bookAuthor}
                    onChange={(e) => setBookAuthor(e.target.value)}
                    placeholder='Author'
                />
                <input
                    className='add-book input-book-image'
                    value={bookImage}
                    onChange={(e) => setBookImage(e.target.value)}
                    placeholder='Image URL'
                />
                <textarea
                    className='add-book input-book-description'
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    placeholder='Description'
                />
                <input
                    className='add-book input-book-pages'
                    type='number'
                    value={bookPages}
                    onChange={(e) => setBookPages(parseInt(e.target.value, 10))}
                    placeholder='Number of Pages'
                />
                <button
                    className='add-book-button'
                    onClick={(e) => addBook(e)}
                >
                    Add
                </button>
            </div>
        </div>
    )
}

export default AddBook
