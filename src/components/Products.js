import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, TextField, Box } from '@mui/material';
import { Image } from 'mui-image';
import { deleteProduct, getAllReviewsForProduct } from '../api';
// import { DeleteIcon } from '@mui/icons-material';

const Products = ({ products, user, token, fetchProducts, fetchReviews, reviews }) => {

    // const boxStyle = {
    //     display: 'inline-flex',
    //     border: '1px solid black',
    //     margin: '0.2rem',
    //     width: '15rem',
    //     height: '15rem'

    // }

    // console.log(user, "User")
    // console.log(reviews, 'Reviews')
    console.log(products, "Products")
    const [searchTerm, setSearchTerm] = useState('');
    function productMatches(products, string) {
        console.log(products, string, "STRING")
        const {
            title,
            description,
        } = products;
        // console.log(products)
        if (title.toLowerCase().includes(string.toLowerCase()) || description.toLowerCase().includes(string.toLowerCase())) {
            return products;
        }
    }
    const filteredProducts = products.filter((product) => {
        console.log(product, "FILTERED")
        return productMatches(product, searchTerm)
    });
    console.log(searchTerm, 'Search')
    const productsToDisplay = searchTerm.length ? filteredProducts : products;
    // const productsToDisplay = products
    // console.log(filteredProducts,'PRODUCTS Filter')
    return (
        // <Card style={{
        //     padding: '.5rem',
        //     margin: '.5rem',
        //     background: '#247BA0'
        // }} elevation={6} >
        <>
            <form className='search-bar' onSubmit={(event) => {
                event.preventDefault();
            }}>
                {/* <Card style={{
                        padding: '.5rem',
                        margin: '.5rem',
                        background: '#C3B299'
                    }} > */}
                <TextField 
                    variant='outlined'
                    label='Search'
                    onChange={(event) => setSearchTerm(event.target.value)}
                ></TextField>
                {/* </Card> */}
            </form>

            {user.isAdmin ? (
                <>
                    <Link style={{
                        textDecoration: 'none'
                    }} to='/products/add-product'><button>
                            + ADD Product
                        </button></Link><br></br>
                </>
            ) : (
                null
            )}

            {productsToDisplay.map((product) => {

                // console.log(product, "product map")
                console.log('product.id')
                // const reviewsToDisplay = await getAllReviewsForProduct( product.id )
                // console.log(reviewsToDisplay, 'Reviews get all')
                const {
                    id,
                    title,
                    description,
                    price,
                    count,
                    image
                } = product;

                return (
                    <>
                        <Card className='product-card' key={id}>
                            <Link style={{
                                textDecoration: 'none'
                            }} to={`/products/${id}`}>
                                <h3 className='product-title'>{title}</h3>
                            </Link>
                            <Image title={title} src={image} style={{
                                height: '200px',
                                width: '200px'
                            }} />
                            {/* <p>Description: {description}</p>
                            <p>Price: ${price}</p>
                            <p>Count: {count}</p> */}
                            {/* <Card className='review-card-main' style={{
                                padding: '.5rem',
                                margin: '.5rem',
                                backgroundColor: '#040F16',
                                color: 'whitesmoke'
                            }} elevation={2}> */}

                                {/* <h1>Review on Product:</h1>

                                {product.reviews && product.reviews.map((review) => {

                                    console.log("PROD Reviews")

                                    return (
                                        <Card style={{
                                            padding: '.5rem',
                                            margin: '.5rem',
                                            backgroundColor: 'blue',
                                            color: 'FFFFF'
                                        }} elevation={6}
                                            key={review.id}>
                                            <p>From User:{review.username}</p>
                                            <p>Review: {review.review}</p>

                                        </Card>
                                    )

                                }) */}

                                {/* } */}
                            {/* </Card> */}

                            {user.isAdmin ?
                                <>
                                    <Link key={id}
                                        to={`/products/edit-products/${id}`}
                                    ><Button
                                        style={{
                                            height: '3rem',
                                            margin: '.25rem',
                                            width: '100%',
                                            borderRadius: 15
                                        }}
                                        variant='contained'
                                        type='submit'>

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
                                </> :
                                null}
                        </Card>
                    </>
                )
            })
            }
        </>
        // </Card>
    )
}

export default Products;