import React, { useState, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter, Routes, useNavigate } from 'react-router-dom'
import { CssBaseline, Paper } from '@mui/material';
import {
    Cart,
    Categories,
    Category,
    Checkout,
    AddProduct,
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
    getCategories,
    getAllReviewsForProduct,
    getMyCart

} from './api';

import './style.css'
import EditCategory from './components/EditCategory';

const App = () => {

    const [products, setProducts] = useState([]);
    const [isAdmin, setIsAdmin] = useState('');
    const [reviews, setReviews] = useState([]);
    const [token, setToken] = useState('');
    const [user, setUser] = useState({})
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);

    function logout() {
        window.localStorage.removeItem('token');
        setToken('')
        setUser({})
    }
    async function fetchProducts() {
        const results = await getProducts()
        setProducts(results);

    }
   
    async function fetchCategories() {
        const results = await getCategories()
        setCategories(results);
    }

    async function fetchCart() {
        console.log("ABOVE")
        const results = await getMyCart(token)
        console.log("BELOW")
        setCart(results);
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
        fetchCategories()

    }, [])

    useEffect(() => {
        getMe();
        fetchCart()
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
                token={token}
                fetchProducts={fetchProducts} />}
                />
                 <Route
              path='/products/add-product'
              element={<AddProduct
                fetchProducts={fetchProducts}
                user={user}
                token={token}
                navigate={navigate} />}
            />
            <Route
              path='/products/edit-products/:productId'
              element={<EditProduct
                navigate={navigate}
                products={products}
                fetchProducts={fetchProducts}
                user={user}
                token={token}
              />}
            />
            <Route
                path='/products/:productId'
                element={<SingleProductView
                  products={products}
                  fetchProducts={fetchProducts}
                  user={user}
                  token={token}
                  navigate={navigate}
                />}
            />
            <Route
                path='/categories'
                element={<Categories
                    user={user}
            navigate={navigate}
            categories={categories} 
            isAdmin={isAdmin}
            token={token}
            fetchCategories={fetchCategories} />}
            />
            <Route
                path='/categories/:category'
                element={<Category
                    user={user}
                    token={token}
                    products={products}
                    navigate={navigate} />}
            />
            <Route
                path='/categories/edit-category/:categoryId'
                element={<EditCategory
                navigate={navigate}
                categories={categories}
                token={token}
                fetchCategories={fetchCategories} />}
            />
             <Route
                path='/profile'
                element={<Profile
                  user={user}
                  navigate={navigate} />}
              />
                <Route
                    path='/cart'
                    element={<Cart
                        cart={cart}
                        token={token}
                        />}
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