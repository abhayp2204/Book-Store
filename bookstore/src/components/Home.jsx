import React, { useState } from 'react';
import '../css/Home.css';
import Books from './Books';
import SearchBar from './SearchBar'
import SearchResultsList from './SearchResultsList'

function Home() {
    const [results, setResults] = useState([])

    return (
        <div className="home">
            <SearchBar setResults={setResults} />
            <SearchResultsList results={results} />
            <Books />
        </div>
    );
}

export default Home;
