import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Books from './Books';

function Home() {
    return (
        <div className="home">
            <Books />
        </div>
    );
}

export default Home;
