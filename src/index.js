import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter, Routes, useNavigate } from 'react-router-dom'

import {
    Cart,
    Category,
    Checkout,
    CreateProduct,
    EditCart,
    EditProduct,
    Home,
    Login,
    Navbar,
    Products,
    Profile,
    Register,
    Review
} from '../components'

const App = () => {

    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState({})
    const navigate = useNavigate;

    function logout() {
        window.localStorage.removeItem('token');
        setToken('')
        setUser({})
    }

    return (
        <div id='main-nav'>
            <Navbar />
            <Routes>
                <Route
                path='/'
                element={<Home />}
                />
                <Route
                path='/products'
                element={<Products />}
                />
                <Route
                path='/login'
                element={<Login
                setToken={setToken}
                navigate={navigate}
            />}
            />
                <Route
                path='/register'
                element={<Register
                setToken={setToken}
                token={token}
                navigate={navigate}
                />}
                />
            </Routes>
        </div>
    )
}


const container = document.querySelector('#container');
const root = ReactDOM.createRoot(container)

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)