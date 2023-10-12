import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Books from './Books';
import Days from './Days';

function Home() {
    return (
        <div className="home">
            <div className="books">
                <Books />
            </div>
        </div>
    );
}

export default Home;
