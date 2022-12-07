import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, TextField } from '@mui/material';
import { Image } from 'mui-image';
import { deleteProduct, getAllReviewsForProduct } from '../api';
import DeleteIcon from '@mui/icons-material/Delete';




const Products = ({ products, user, token, fetchProducts, fetchReviews, reviews }) => {
    
    // console.log(user, "User")
    // console.log(reviews, 'Reviews')
    console.log(products, "Products")
    const [searchTerm, setSearchTerm] = useState('');
    function productMatches(products, string) {
        const {

            title,
            description,

        } = products;
        // console.log(products)
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
            <>
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

                {user.isAdmin ? (

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

                ) : (
                    null
                )}
                {console.log("Products to Render",productsToDisplay.map( (product) => {
                    // console.log(product, "product map")
                    console.log(product.id, 'product.id')
                    const reviewsToDisplay =  getAllReviewsForProduct( product.id )
                    console.log(reviewsToDisplay, 'Reviews get all')
                    const {
                        id,
                        title,
                        description,
                        price,
                        count,
                        image
                    } = product;

                    return (
                        <Card key={id} style={{
                            padding: '.5rem',
                            margin: '.5rem',
                            background: '#FFFCFF'
                        }}>
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
                            <Card style={{
                                padding: '.5rem',
                                margin: '.5rem',
                                backgroundColor: '#040F16',
                                color: 'whitesmoke'
                            }} elevation={2}>          
                             
                            <h1>Review on Product:</h1>
                                
                                {reviews && reviewsToDisplay.map((review) => {
                                    
                                    console.log( "PROD Reviews")
                                    const fromUserId = review.fromUserId;
                                    const { username } = review.fromUser;
                                    const { title } = review.product;
return "Some Text"
                                    // if (userId !== fromUserId) {
                                        // return (
                                        //     <Card style={{
                                        //         padding: '.5rem',
                                        //         margin: '.5rem',
                                        //         backgroundColor: 'blue',
                                        //         color: 'FFFFF'
                                        //     }} elevation={6}
                                        //         key={message.id}>
                                        //         <p>From User:{username}</p>
                                        //         <p>Review: {review.content}</p>
                                        //         <p>Product Reference: {title}</p>
                                        //     </Card>
                                        // )
                                    // }
                                })

                                }
                            </Card> 

                            {user.isAdmin ?
                                <>
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
                                        <DeleteIcon/>
                                    </Button>
                                </> :
                                null}
                        </Card>
                    )
                })
                )}
            </>
        </Card>
    )
}

export default Products;