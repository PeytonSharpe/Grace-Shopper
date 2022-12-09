import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, TextField } from '@mui/material';
import { Image } from 'mui-image';
import { productsByCategory, deleteProduct, getAllReviewsForProduct } from '../api';




const Category = ({ user, token }) => {
    const { category } = useParams();

    const [categoryProductList, setCategoryProductList] = useState([]);

    async function categoryProducts() {
        const results = await productsByCategory(category)
        setCategoryProductList(results)
        console.log(category, results)
    } 
    useEffect(() => {
        categoryProducts() 

    }, [])

    
    
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
    const filteredProducts = categoryProductList.filter((product) => {

        return productMatches(product, searchTerm)
    });

    const productsToDisplay = searchTerm.length ? filteredProducts : categoryProductList;

    return (
        
            <>
                <form onSubmit={(event) => {
                    event.preventDefault();
                }}>
                    
                        <TextField style={{
                            width: '100%',
                            background: '#FFFCFF'
                        }}
                            type='text'
                            label='Search'
                            onChange={(event) => setSearchTerm(event.target.value)}
                        ></TextField>
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
                {productsToDisplay.map( (product) => {

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

                                {product.reviews && product.reviews.map((review) => {
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
                                            const results = await deleteProduct(token, id)
                                            console.log(results)
                                            categoryProducts()
                                        }}>Delete Product
                                        <DeleteIcon />
                                    </Button>
                                </> :
                                null}
                        </Card>
                    )
                })
                }
            </>

    )
}

export default Category;