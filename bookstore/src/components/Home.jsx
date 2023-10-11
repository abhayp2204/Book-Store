import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import Cards from './Cards';
import Calendar from './Calendar';
import Days from './Days';

function Home() {
    const [span, setSpan] = useState('day');
    const [showCalendar, setShowCalendar] = useState(false);
    const [date, setDate] = useState(new Date());

    const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
    }

    // Function to get the full month name
    const getFullMonthName = () => {
        const options = { month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div className="home">
            <div className="dmy-tab-container">
                <div
                    className={`dmy ${span === 'day' ? 'active' : ''}`}
                    onClick={() => setSpan('day')}
                >
                    Day
                </div>
                <div
                    className={`dmy ${span === 'month' ? 'active' : ''}`}
                    onClick={() => setSpan('month')}
                >
                    Month
                </div>
                <div
                    className={`dmy ${span === 'year' ? 'active' : ''}`}
                    onClick={() => setSpan('year')}
                >
                    Todo
                </div>
                <div
                    className="dmy"
                    onClick={toggleCalendar}
                >
                    Calendar
                </div>
            </div>

            <div className='date-display'>{date.getDate()} {getFullMonthName()}, {date.getFullYear()}</div>

            {showCalendar && (
                <Calendar
                    selectedDate={date}
                    setSelectedDate={setDate}
                    closeCalendar={toggleCalendar}
                />
            )}

            <Days date={date} setDate={setDate} />

            <div className="cards">
                <Cards type={span} date={date} />
            </div>
        </div>
    );
}

export default Home;
