import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter, Routes, useNavigate } from 'react-router-dom'
import { CssBaseline, Paper } from '@mui/material';
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
    Review,
    SingleProductView
} from './components'

import {
    getProducts,
    getUserDetails,
    createProduct,
    updateProduct,
    deleteProduct
} from './api';

const App = () => {

    const [products, setProducts] = useState([]);
    const [isAdmin, setIsAdmin] = useState('');
    const [token, setToken] = useState('');
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    function logout() {
        window.localStorage.removeItem('token');
        setToken('')
        setUser({})
    }
    async function fetchProducts() {
        const results = await getProducts()
        setProducts(results);

    }

    async function getMe() {
        const storedToken = window.localStorage.getItem('token');

        if (!token) {
            if (storedToken) {
                setToken(storedToken);
            }
            return;
        }

        const results = await getUserDetails(token);
        console.log(results, 'USER RESULTS')
        if (results) {
            setUser(results);
        } else {
            console.log('failed to get user details', results);
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        getMe();
    }, [token])

    return (
        <React.Fragment>
        <CssBaseline />
        <Paper  elevation={16} 
        style={{
          background:'#CBD4C2',
          width:'100%',
          height: '100%'
           }}>
        <header>
        <nav id='main-nav'>
            <Navbar  logout={logout} token={token}/>
            <Routes>
                <Route
                    path='/'
                    element={<Home />}
                />
                <Route
                    path='/products'
                    element={<Products
                        user={user}
                navigate={navigate}
                products={products} 
                isAdmin={isAdmin}
                token={token} />}
                />
                 <Route
              path='/products/create-product'
              element={<CreateProduct
                fetchProducts={fetchProducts}
                isAdmin={isAdmin}
                token={token}
                navigate={navigate} />}
            />
            <Route
              path='/activities/edit-activity/:activityID'
              element={<EditProduct
                navigate={navigate}
                products={products}
                isAdmin={isAdmin}
                token={token}
              />}
            />
                <Route
                    path='/cart'
                    element={<Cart />}
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
        </nav>
        </header>
        </Paper>
    </React.Fragment>
    )
}


const container = document.querySelector('#container');
const root = ReactDOM.createRoot(container)

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)