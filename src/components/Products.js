import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Paper, TextField } from '@mui/material';

const Products = ({ products, isAdmin}) => {
    const [searchTerm, setSearchTerm] = useState('');
    function productMatches(products, string) {
        const { 
            id,
            title,
            description
             } = products;
            //  console.log(products)
        if (title.toLowerCase().includes(string.toLowerCase()) || description.toLowerCase().includes(string.toLowerCase())) {
            return products;
        }
    }
    const filteredProducts = products.filter(product => productMatches(product, searchTerm));
    const productsToDisplay = searchTerm.length ? filteredProducts : products;

    return (
        <Card style={{
            padding: '.5rem',
            margin: '.5rem',
            background: '#247BA0'
                }} elevation={6} >
            <div className="main-product-div">
                <div >
                    <form onSubmit={(event) => {
                        event.preventDefault();
                    }}>
                        <Card style={{ 
                            padding: '.5rem',
                             margin: '.5rem',
                              background: '#C3B299'
                               }} >
                            <TextField style={{ 
                                width: '100%',
                                 background: '#FFFCFF'
                                 }}
                                type='text'
                                label='Search'
                                onChange={(event) => setSearchTerm(event.target.value)}
                            ></TextField>
                        </Card>
                    </form>

                </div>
                <div>
                    {isAdmin ? (
<div>
                        <Link style={{
                             textDecoration: 'none'
                             }} to='/products/create-product'><Button
                            style={{
                             height: '4rem',
                             width: '100%',
                             borderRadius: 15,
                             background: '#001242'
                             }}
                            variant='contained'
                            type='submit'>
                            Create Product
                        </Button></Link>

                         <Link
                         style={{
                             textDecoration: 'none'
                         }}
                         to={`/products/edit-products/${id}`}
                     ><Button
                         style={{
                             height: '3rem',
                             margin: '.25rem',
                             width: '100%',
                             borderRadius: 15,
                             backgroundColor: ' #50514F'
                         }}
                         variant='contained'
                         type='submit'>Edit Product
                         </Button> </Link>
</div>
                    ) : (
                        null
                    )}
                    {
                        productsToDisplay.map((product) => {
                            const { 
                                id, 
                                title,
                                description,
                                price,
                                count } = product;

                            return (
                                <Card key={id} style={{
                                    padding: '.5rem',
                                    margin: '.5rem',
                                    background: '#FFFCFF'
                                    }}>
                                    <div  >
                                        <Link  style={{
                                                textDecoration: 'none'
                                                        }}
                                                        to={`/products/categories/${id}`}>
                                                        <h3>{title}</h3></Link>
                                                        <p>Description: {description}</p>
                                                        <p>Price: {price}</p>
                                                        <p>Count: {count}</p>
                                    </div>
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </Card>
    )



}

export default Products;