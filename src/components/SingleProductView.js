import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createReview, deleteProduct } from "../api";
import { Button, TextField, Card, Paper } from '@mui/material';

const SendReview = ({ productId, token, navigate }) => {
    const [review, setReview] = useState({ content: '' })
    

    async function addReview() {
        await createReview({ productId, review, token })
    }

    return (
        <Card style={{ padding: '.5rem', margin: '.5rem', background: '#001242', }} elevation={6}>
        <form onSubmit={(ev) => {
            ev.preventDefault();
            addReview();
            navigate('/product')
        }}>
            <TextField
            style={{borderColor:'Gray', backgroundColor:'whitesmoke'}}
                type='text'
                label="Enter Review"
                onChange={(ev) => setReview({ content: ev.target.value })}
            />
            <Button style={{
              marginTop: "2%",
              width: "100%",
              borderRadius: 35,
              background: "#55586F",
              opacity: "70%",
              color: "#24A6D1",
              borderColor: "#55586F",
            }} type='submit'onClick={() =>{
                addReview();
                navigate('/products') 
            }}>Send Review </Button>
        </form>
        </Card>
    )
}

const SingleProductView = ({ products, fetchProducts, user, navigate, getMe }) => {
    const [activeReview, setActiveReview] = useState(false);
    const { productId } = useParams();
console.log(productId,"Prod ID")
    if (products.length) {
        console.log(products,"products")
        const [currentProduct] = products.filter(products => products.id ===parseInt (productId));
        console.log(currentProduct, 'Single Prod')
        const { title, description, price, count } = currentProduct;

        return (
            <Card style={{ padding: '.5rem', margin: '.5rem', background: 'B4D2E7', }} elevation={6}>
                <Card style={{ padding: '.5rem', margin: '.5rem', background: 'B4D2E7', }} elevation={6}>
                    <h3>{title}</h3>
                    <p>Description: {description}</p>
                    <p>Price: ${price}</p>
                    <p>Count: {count}</p>
                    
                </Card>
                {
                    user.isAdmin ? (
                        <>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}><Button  style={{
                                                    height: '3rem',
                                                    margin: '.25rem', width: '100%', borderRadius: 15
                                                }}
                                                variant='contained' >View All</Button></Link>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}><Button  style={{
                                                    height: '3rem',
                                                    margin: '.25rem', width: '100%', borderRadius: 15
                                                }}
                                                variant='contained' onClick={() => deleteProduct(token, productId)}>Delete</Button></Link>
                        </>
                    ) : (

                        <>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}><Button  style={{
                                                    height: '3rem',
                                                    margin: '.25rem', width: '100%', borderRadius: 15, backgroundColor:'#55586F'
                                                }}
                                                variant='contained' >View All</Button></Link>
                            {token &&
                                <>

                                    <Button  style={{
                                                    height: '3rem',
                                                    margin: '.25rem', width: '100%', borderRadius: 15
                                                }}
                                                variant='contained' onClick={() => setActiveReview(!activeReview)}>Review this product</Button>
                                    
                                    {
                                        activeReview && <SendReview  token={token} productId={productId} navigate={navigate} getMe={getMe} />
                                    }
                                </>
                            }
                        </>
                    )
                }
                
            </Card>
        )
    } else {
        return (
            <h1>Waiting for Products...</h1>
        )
    }
}

export default SingleProductView;