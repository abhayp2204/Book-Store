import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Navbar.css'

function Navbar() {
    return (
        <div className='navbar'>
            <Link to='/view' className='nav-link'>View Books</Link>
            <Link to='/add' className='nav-link'>Add Books</Link>
            <Link to='/cart' className='nav-link'>Cart</Link>
            <Link to='/checkout' className='nav-link'>Checkout</Link>
        </div>
    )
}

export default Navbar