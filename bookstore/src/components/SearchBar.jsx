import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "../css/SearchBar.css";

function SearchBar({ setResults }) {
    const [input, setInput] = useState("");
    // const url = "https://jsonplaceholder.typicode.com/users"
    const url = "https://fakestoreapi.com/products/"

    const fetchData = (value) => {
        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                const results = json.filter((product) => {
                    return (
                        value &&
                        product &&
                        product.title &&
                        product.title.toLowerCase().includes(value)
                    );
                });
                setResults(results);
            });
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    };

    return (
        <div className="input-wrapper"  >
            <FaSearch id="search-icon" />
            <input
                placeholder="Type to search..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;