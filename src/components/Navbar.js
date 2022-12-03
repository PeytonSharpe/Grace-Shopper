import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ logout, token }) => {

    return (
        <header>
            <nav className='Navbar'>
            <h1 >Grace Shopper</h1>
            <Link style={{ textDecoration: 'none' }} to='/'><button
          style={{
            borderColor: '#CBD4C2',
            backgroundColor: '#247BA0', color: '#FFFCFF', width: '100%', borderRadius: 15
          }}>HOME</button></Link>
          <Link style={{ textDecoration: 'none' }} to='/categories'><button style={{
            borderColor: '#CBD4C2',
            backgroundColor: '#247BA0', color: '#FFFCFF', width: '100%', borderRadius: 15}}>CATEGORIES</button></Link>
               <Link style={{ textDecoration: 'none' }} to='/products'><button style={{
            borderColor: '#CBD4C2',
            backgroundColor: '#247BA0', color: '#FFFCFF', width: '100%', borderRadius: 15}}>PRODUCTS</button></Link>
               <Link style={{ textDecoration: 'none' }}  to='/cart'><button style={{
            borderColor: '#CBD4C2',
            backgroundColor: '#247BA0', color: '#FFFCFF', width: '100%', borderRadius: 15}}>CART</button></Link>
                {token ? (
                    <>
                        <Link style={{ textDecoration: 'none' }} to='/' onClick={() => logout()}><button style={{
            borderColor: '#247BA0',
            backgroundColor: '#C3B299', color: '#000000', width: '100%', borderRadius: 15}}>LOGOUT</button></Link>
                    </>
                ) : (
                    <>
                        <Link style={{ textDecoration: 'none' }} to='/register'><button style={{
            borderColor: '#247BA0',
            backgroundColor: '#CBD4C2', color: '#000000', width: '100%', borderRadius: 15}}>REGISTER</button></Link>
                        <Link style={{ textDecoration: 'none' }} to='/login'><button style={{
            borderColor: '#247BA0',
            backgroundColor: '#CBD4C2', color: '#000000', width: '100%', borderRadius: 15}}>LOGIN</button></Link>
                    </>
                )
                }
            </nav>

        </header>
    )
}
export default Navbar;