import React from 'react';
import '../css/Book.css';

function BookDetails({ bookDetails, addToCart }) {
    return (
        <div className='book-details'>
            <p className='book-title'>{bookDetails?.title}</p>
            {bookDetails?.image && (
                <img className='book-image' src={bookDetails.image} alt={bookDetails.title} />
            )}
            <p className='book-author'>by {bookDetails?.author}</p>
            <p className='book-genre'>{bookDetails?.genre}</p>
            <p className='book-desc'>{bookDetails?.description}</p>
            <p className='book-year'>{bookDetails?.publishedYear}</p>
            <p className='book-price'>${bookDetails?.price}</p>
            <button
                onClick={() => addToCart(bookDetails.id)} // Pass bookDetails.id to onAdd
                className="add-book-button"
            >
                Add to Cart
            </button>
        </div>
    );
}

export default BookDetails;
