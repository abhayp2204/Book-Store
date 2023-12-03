import '../css/Home.css';

import Products from '../assets/foodPics/products.png'
import Merch from '../assets/Cards/merch.png'
import Shop from '../assets/Cards/cart.png'

import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="home">
            <div className="header">
                <h1 className="title">IIITH Campus Store</h1>
                <p className="subtitle">Your Ultimate Destination for Campus Essentials and More</p>
            </div>
            <div className="main">
                <p className="intro-text">
                    Welcome to the Campus Store, where convenience meets quality in your pursuit of academic and lifestyle necessities. As your dedicated hub for all things campus-related, we strive to enhance your university experience by providing a diverse range of products tailored to students' needs.
                </p>
            </div>
            <div className='features'>
                
                <Link to='/products' className='linkstyle'>
                    <div className='features-card'>
                        <div className='features-card-title'>Items</div>
                        <img src={Products} alt="Products" />
                    </div>
                </Link>

                <Link to='/merch' className='linkstyle'>
                    <div className='features-card'>
                        <div className='features-card-title'>Merch</div>
                        <img src={Merch} alt="Merch" />
                    </div>
                </Link>
                
                <Link to='/shop' className='linkstyle'>
                    <div className='features-card'>
                        <div className='features-card-title'>Shop</div>
                        <img src={Shop} alt="Shop" />
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Home;
