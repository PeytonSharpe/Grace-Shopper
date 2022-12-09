import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ logout, token }) => {

    const linkStyle = {
        fontSize: '2rem',
        backgroundColor: '#b5b6e4',
        margin: '2rem',
        textDecoration: 'none',
        color: '#211a21',
      };



    return (
        <header>
            <h1 className='title'>Go Retro!</h1>
            <nav>
                <div className='nav-links'>
            <Link to='/' style={linkStyle}>HOME</Link>
            <Link to='/categories' style={linkStyle}>CATEGORIES</Link>
            <Link to='/products' style={linkStyle}>PRODUCTS</Link>
            <Link to='/cart' style={linkStyle}>CART</Link>
                {token ? (
                    <>
                        <Link to='/'
                            style={linkStyle}
                            onClick={() => logout()}>LOGOUT</Link>
                    </>
                ) : (
                    <>
                        <Link to='/register' style={linkStyle}>REGISTER</Link>
                        <Link to='/login' style={linkStyle}>LOGIN</Link>
                    </>
                )
                }
                </div>
            </nav>

        </header>
    )
}
export default Navbar;