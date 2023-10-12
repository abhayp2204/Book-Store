import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Books from './Books';
import Days from './Days';

function Home() {
    const [tab, setTab] = useState('View Books');
    const [date, setDate] = useState(new Date());


    return (
        <div className="home">
            <div className="books">
                <Books type={tab} date={date} />
            </div>
        </div>
    );
}

export default Home;
