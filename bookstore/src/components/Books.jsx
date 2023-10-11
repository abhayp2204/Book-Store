import React, { useState } from 'react'
import Book from './Book'
import '../css/Book.css'

// Firebase
import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"
import { auth, firestore } from "../firebase"
import { useCollectionData } from "react-firebase-hooks/firestore"
import { useSendSignInLinkToEmail } from 'react-firebase-hooks/auth'

function Books(props) {
    const booksRef = firestore.collection('books')

    const [bookTitle, setBookTitle] = useState("")

    const query = booksRef.orderBy('createdAt').limit(25)
    const [books] = useCollectionData(query, { idField: 'id' })

    const addBook = async (e) => {
        e.preventDefault()

        await booksRef.add({
            title: bookTitle,
            image: Math.floor(Math.random() * 62) + 1,
            date: props.date,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })

        setBookTitle('')
    }


    const deleteBook = async (bookTitle) => {
        booksRef.where("name", "==", bookTitle).get()
            .then(snapshot => {
                snapshot.docs[0].ref.delete()
            })
    }

    return (
        <div className='books'>
            {/* <div className='add-book-container'>
                <input
                    className='input-book-name'
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder='Add a Book'
                />
                <button
                    className='add-book-button'
                    onClick={(e) => addBook(e)}
                >
                    Add
                </button>
            </div> */}

            <div className='books-display'>
                {books && books.map((book, key) =>
                    <Book
                        key={key}
                        book={book}
                        image={book.image}
                        onDelete={() => deleteBook(book.name)}
                        onComplete={() => completeBook(book.name)}
                    />
                )}
            </div>
        </div>
    )
}

export default Books
