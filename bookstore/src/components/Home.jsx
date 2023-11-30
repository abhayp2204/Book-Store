import React, { useState } from 'react';
import '../css/Home.css';
import SearchBar from './SearchBar'
import SearchResultsList from './SearchResultsList'

function Home() {
    const [results, setResults] = useState([])

    return (
        <div className="home">
            <SearchBar setResults={setResults} />
            <SearchResultsList results={results} />
        </div>
    );
}

export default Home;
