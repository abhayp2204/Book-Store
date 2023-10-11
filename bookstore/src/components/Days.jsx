import React from 'react';
import '../css/Days.css';

function Days({ date, setDate }) {
    // Get the total number of days in the current month
    const getLastDayOfMonth = () => {
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return lastDay.getDate();
    }

    const daysInMonth = Array.from({ length: getLastDayOfMonth() }, (_, i) => i + 1);

    return (
        <div className="days-list">
            {daysInMonth.map(day => (
                <div
                    key={day}
                    className={`day-item ${date.getDate() === day ? 'day-active' : ''}`} // Apply "active" class conditionally
                    onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), day))}
                >
                    {day}
                </div>
            ))}
        </div>
    );
}

export default Days;
