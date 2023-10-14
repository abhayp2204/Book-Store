import React from 'react';
import '../css/Book.css';

function BookDetails({ bookDetails, addBook }) {
    return (
        <div className='book-details'>
            {console.log(bookDetails)}
            <p className='book-title'>{bookDetails?.title}</p>
            {bookDetails?.image && (
                <img className='book-image' src={bookDetails.image} alt={bookDetails.title} className='book-image' />
            )}
            <p className='book-author'>by {bookDetails?.author}</p>
            <p className='book-genre'>{bookDetails?.genre}</p>
            <p className='book-desc'>{bookDetails?.description}</p>
            <p className='book-year'>{bookDetails?.publishedYear}</p>
            <p className='book-price'>${bookDetails?.price}</p>
            <button
                onClick={() => addBook(bookDetails.id)} // Pass bookDetails.id to onAdd
                className="add-book-button"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default BookDetails;
