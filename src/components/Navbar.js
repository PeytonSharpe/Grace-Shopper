import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ logout, token }) => {

    return (
        <header>
            <nav>
                <Link to='/'>HOME</Link>
                <Link to='/products'>PRODUCTS</Link>
                <Link to='/cart'>CART</Link>
                <Link to='/register'>REGISTER</Link>
                <Link to='/login'>LOGIN</Link>

            </nav>

        </header>
    )
}
export default Navbar;