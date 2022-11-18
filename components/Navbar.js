import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../App';

const Navbar = ({ logout, token }) => {

    return (
        <header>
            <nav>
                <Link to='/'>HOME</Link>
                <Link to='/profile'>PRODUCTS</Link>
                <Link to='/posts'>CART</Link>
                <Link to='/register' style={linkStyle}>REGISTER</Link>
                <Link to='/login' style={linkStyle}>LOGIN</Link>

            </nav>

        </header>
    )
}
export default Navbar;