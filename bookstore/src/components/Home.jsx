import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Books from './Books';
import Calendar from './Calendar';
import Days from './Days';

function Home() {
    const [tab, setTab] = useState('View Books');
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState(new Date());


    return (
        <div className="home">
            <div className="dmy-tab-container">
                <Link
                    className={`dmy ${tab === 'view' ? 'active' : ''}`}
                    to='/view'
                    onClick={() => setTab('view')}
                >
                    View Books
                </Link>
                <div
                    className={`dmy ${tab === 'add' ? 'active' : ''}`}
                    onClick={() => setTab('add')}
                >
                    Add Book
                </div>
                <div
                    className={`dmy ${tab === 'cart' ? 'active' : ''}`}
                    onClick={() => setTab('cart')}
                >
                    Cart
                </div>
                <div
                    className={`dmy ${tab === 'orders' ? 'active' : ''}`}
                    onClick={() => setTab('orders')}
                >
                    Orders
                </div>
            </div>


            <div className="books">
                <Books type={tab} date={date} />
            </div>
        </div>
    );
}

export default Home;
