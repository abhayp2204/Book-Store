import React, { useState } from 'react';
import '../css/Book.css';

function Book(props) {
    const [hovered, setHovered] = useState(false);

    const bookStyle = {
        position: 'relative',
        width: '400px',
        height: '400px',
        color: 'white',
        fontWeight: 'bolder',
        fontSize: hovered? '40px' : '35px',
        margin: '20px',
        backgroundColor: hovered? '#95C623': 'transparent',
        backgroundColor: hovered? '#22c99f': 'transparent',
        transition: '0.3s ease-in-out', // Add transition for font size change
    };
    
    const backgroundStyle = {
        backgroundImage: `url('pics/${props.image}.jpg')`,
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: hovered ? 0.52 : 0.20,
        transition: 'opacity 0.3s ease-in-out', // Add transition for background opacity change
    };

    return (
        <div
            className='book'
            style={bookStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={backgroundStyle}></div>
            <div className='book-title'>
                {props.book.name}
            </div>
            
            <button
                onClick={() => props.onDelete()} 
                className="delete-button"
            >
                X
            </button>
            <button
                onClick={() => props.onComplete()} 
                className="complete-button"
            >
                ✔
            </button>
        </div>
    );
}

export default Book;
