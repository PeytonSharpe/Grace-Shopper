import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, TextField } from '@mui/material';
import { Image } from 'mui-image';
import { deleteProduct, getAllReviewsForProduct } from '../api';

const Products = ({ products, user, token, fetchProducts }) => {
    console.log(user, "user")
    console.log(products, 'products')
    const userID = user._id;

    const [searchTerm, setSearchTerm] = useState('');
    function productMatches(products, string) {
        const {

            title,
            description,

        } = products;

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
                    {user.isAdmin ? (
                        <div>
                            <Link style={{
                                textDecoration: 'none'
                            }} to='/products/add-product'><Button
                                style={{
                                    height: '4rem',
                                    width: '100%',
                                    borderRadius: 15,
                                    background: '#001242'
                                }}
                                variant='contained'
                                type='submit'>
                                    + ADD Product
                                </Button></Link>


                        </div>
                    ) : (
                        null
                    )}
                    {
                        productsToDisplay.map(async (product) => {

                            console.log(product)

                            //    const reviews = await getAllReviewsForProduct({productId:product.id})
                            //    console.log(reviews,'Reviews')
                            const {
                                id,
                                title,
                                description,
                                price,
                                count,
                                image } = product;

                            return (
                                <Card key={id} style={{
                                    padding: '.5rem',
                                    margin: '.5rem',
                                    background: '#FFFCFF'
                                }}>
                                    <div  >
                                        <Link style={{
                                            textDecoration: 'none'
                                        }}
                                            to={`/products/${id}`}><h3>{title}</h3></Link>
                                        <Image src={image} style={{
                                            height: '20%',
                                            width: '20%'
                                        }} />

                                        <p>Description: {description}</p>
                                        <p>Price: ${price}</p>
                                        <p>Count: {count}</p>
                                    </div>
                                    <Card style={{ padding: '.5rem', margin: '.5rem', backgroundColor: '#040F16', color: 'whitesmoke' }} elevation={2}>
                                        <h1>Review on Products:</h1>
                                        {
                                            reviews && reviews.map(review => {
                                                const fromUserID = review.fromUser._id;
                                                const { username } = review.fromUser;
                                                const { title } = review.product;

                                                if (userID !== fromUserID) {
                                                    return (
                                                        <Card style={{ padding: '.5rem', margin: '.5rem', backgroundColor: 'blue', color: 'FFFFF' }} elevation={6} key={message._id}>
                                                            <p>From User:{username}</p>
                                                            <p>Review: {review.content}</p>
                                                            <p>Product Reference: {title}</p>
                                                        </Card>
                                                    )
                                                }
                                            })

                                        }
                                    </Card>
                                    {user.isAdmin ?
                                        <div>
                                            <Link key={id}
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

                                            <Button
                                                style={{
                                                    height: '3rem',
                                                    margin: '.25rem',
                                                    width: '100%',
                                                    borderRadius: 15,
                                                    backgroundColor: ' #50514F'
                                                }}
                                                variant='contained'
                                                type='submit' onClick={async () => {
                                                    await deleteProduct(token, id)
                                                    fetchProducts()
                                                }}>Delete Product
                                            </Button>
                                        </div> :
                                        null}

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