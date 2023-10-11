import React, { useState, useEffect } from 'react';
import '../css/Calendar.css'

const CalendarPopup = ({ selectedDate, setSelectedDate, closeCalendar }) => {
    const getYears = () => {
        const currentYear = new Date().getFullYear()
        const years = []
        for (let i = currentYear - 10; i <= currentYear + 10; i++) {
            years.push(i)
        }
        return years
    };

    const getMonths = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return months
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const [day, setDay] = useState(selectedDate.getDate());
    const [month, setMonth] = useState(selectedDate.getMonth());
    const [year, setYear] = useState(selectedDate.getFullYear());

    const handleDateChange = () => {
        const newDate = new Date(year, month, day);
        setSelectedDate(newDate);
        closeCalendar();
    };

    // Update days when month or year changes
    useEffect(() => {
        const daysInMonth = getDaysInMonth(year, month);
        if (day > daysInMonth) {
            setDay(daysInMonth);
        }
    }, [year, month, day]);

    return (
        <div className="calendar-popup">
            <div className='calendar-title'>Calendar</div>

            <div className='calendar-date'>
                <div className='scrollable-list'>
                    <label>Day</label>
                    <input
                        type="number"
                        min="1"
                        max={getDaysInMonth(year, month)}
                        value={day}
                        onChange={(e) => setDay(parseInt(e.target.value))}
                    />
                </div>

                <div className='scrollable-list'>
                    <label>Month</label>
                    <select
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                    >
                        {getMonths().map((month, index) => (
                            <option key={index} value={index}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='scrollable-list'>
                    <label>Year</label>
                    <input
                        type="number"
                        min={getYears()[0]}
                        max={getYears()[getYears().length - 1]}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                    />
                </div>
            </div>

            <button className='calendar-select' onClick={handleDateChange}>Select</button>
        </div>
    );
};

export default CalendarPopup;
