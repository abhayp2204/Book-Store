import React from 'react'
import '../css/Book.css';

function BookDetails({ bookDetails, addBook }) {
    return (
        <div className='book-details'>
            <p className='book-title'>{bookDetails?.title}</p>
            <p className='book-author'>by {bookDetails?.author}</p>
            <p className='book-genre'>{bookDetails?.genre}</p>
            <p className='book-desc'>{bookDetails?.description}</p>
            <p className='book-year'>{bookDetails?.publishedYear}</p>
            <p className='book-price'>${bookDetails?.price}</p>
            <button
                onClick={() => addBook(props.id)} // Pass bookDetails to onAdd
                className="add-book-button"
            >
                Add to Cart
            </button>
        </div>
    )
}

export default BookDetails