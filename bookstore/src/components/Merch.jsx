import React, { useState } from 'react';
import '../css/Merch.css'; // Assuming you have a corresponding CSS file

const designs = ['Design 1', 'Design 2', 'Design 3'];
const colors = [
    { value: '#ff6666', name: 'Red' },
    { value: '#6699ff', name: 'Blue' },
    { value: '#99cc99', name: 'Green' },
    { value: '#ffcc66', name: 'Yellow' },
]; // Common colors for clothes
const sizes = ['S', 'M', 'L', 'XL'];

const Merch = () => {
    const [hoodie, setHoodie] = useState({
        design: '',
        color: '',
        size: '',
    });

    const handleDesignChange = (e) => {
        setHoodie({ ...hoodie, design: e.target.value });
    };

    const handleColorChange = (color) => {
        setHoodie({ ...hoodie, color });
    };

    const handleSizeChange = (size) => {
        setHoodie({ ...hoodie, size });
    };

    return (
        <div className="merch-container">
            <h1 className="merch-title">Customize Your Hoodie</h1>
            <div className="merch-select">
                <label className="merch-label">Design:</label>
                <select
                    className="merch-dropdown"
                    value={hoodie.design}
                    onChange={handleDesignChange}
                >
                    <option value="">Select a Design</option>
                    {designs.map((design, index) => (
                        <option key={index} value={design}>
                            {design}
                        </option>
                    ))}
                </select>
            </div>
            <div className="merch-colors">
                <label className="merch-label">Color:</label>
                <div className="color-buttons">
                    {colors.map((color, index) => (
                        <button
                            key={index}
                            className="color-button"
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleColorChange(color.name)}
                        />
                    ))}
                </div>
                {/* <div className="color-preview" style={{ backgroundColor: hoodie.color }} /> */}
            </div>
            <div className="merch-sizes">
                <label className="merch-label">Size:</label>
                <div className="size-buttons">
                    {sizes.map((size, index) => (
                        <button
                            key={index}
                            className="size-button"
                            onClick={() => handleSizeChange(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>
            <div className="merch-summary">
                <h2 className="merch-subtitle">Your Customized Hoodie:</h2>
                <p className="merch-info">Design: {hoodie.design}</p>
                <p className="merch-info">Color: {hoodie.color}</p>
                <p className="merch-info">Size: {hoodie.size}</p>
            </div>
        </div>
    );
};

export default Merch;
