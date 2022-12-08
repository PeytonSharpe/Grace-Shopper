import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createReview, deleteProduct } from "../api";
import { Button, TextField, Card, Paper } from '@mui/material';
import { Image } from 'mui-image';

// const SendReview = ({ productId, token, navigate }) => {
//     const [review, setReview] = useState('')


//     async function addReview() {
//         console.log('in add Review')
//         await createReview({ productId, review, token, stars:5 })
//     }

//     return (
//         <Card style={{
//             padding: '.5rem',
//             margin: '.5rem',
//             background: '#001242',
//         }} elevation={6}>
//             <form onSubmit={(ev) => {
//                 ev.preventDefault();
//                 addReview();
//                 navigate('/product')
//             }}>
//                 <TextField
//                     style={{ borderColor: 'Gray',
//                      backgroundColor: 'whitesmoke',
//                     }}
//                     type='text'
//                     label="Enter Review2"
//                     onChange={(ev) => setReview({ content: ev.target.value })}
//                 />
//                 <Button style={{
//                     marginTop: "2%",
//                     width: "50%",
//                     borderRadius: 35,
//                     background: "#55586F",
//                     opacity: "70%",
//                     color: "#24A6D1",
//                     borderColor: "#55586F",
//                 }} type='submit' onClick={() => {
//                     addReview();
//                     navigate('/products')
//                 }}>Send Review </Button>
//             </form>
//         </Card>
//     )
// }

const SingleProductView = ({ products, fetchProducts, user, navigate, getMe, token }) => {
    const [review, setReview] = useState('')


    async function addReview() {
        console.error('in Single product view')
        await createReview({ productId, review, token,stars:5 })
    }
    const [activeReview, setActiveReview] = useState(false);
    const { productId } = useParams();
    // console.error('ProductID',productId)
    if (products.length) {
       
        const [currentProduct] = products.filter(products => products.id === parseInt(productId));
       
        const {
            title,
            description,
            price,
            count,
            image
        } = currentProduct;

        return (
            
                <Card style={{
                    textAlign: 'center',
                    padding: '1.5rem',
                    margin: '1.5rem',
                    background: 'B4D2E7',
                }} elevation={6}>
                    <Image title={title} src={image} style={{
                        height: '25%',
                        width: '25%'
                    }} />
                    <h3>{title}</h3>
                    <p className="price">${price}</p>
                    <p className="count">{count} in stock</p>

                    <p className="prod-desc">{description}</p>

                    <h1>Review on Product:</h1>
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

                {/* </Card> */}
                <Card style={{
                    padding: '.5rem',
                    margin: '.5rem',
                    background: '#001242',
                }} elevation={6}>
                    <form onSubmit={(ev) => {
                        ev.preventDefault();
                        addReview();
                        navigate('/products')
                    }}>
                        <TextField
                            style={{
                                borderColor: 'Gray',
                                backgroundColor: 'whitesmoke'
                            }}
                            type='text'
                            label="Enter Review1"
                            onChange={(ev) => setReview(ev.target.value)}
                        />
                        <Button style={{
                            marginTop: "2%",
                            width: "100%",
                            borderRadius: 35,
                            background: "#55586F",
                            opacity: "70%",
                            color: "#24A6D1",
                            borderColor: "#55586F",
                        }} type='submit'>Send Review </Button>
                    </form>
                </Card>
                {
                    user.isAdmin ? (
                        <>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}>
                                <Button style={{
                                    height: '3rem',
                                    margin: '.25rem',
                                    width: '100%',
                                    borderRadius: 15
                                }}
                                    variant='contained' >View All</Button></Link>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}>
                                <Button style={{
                                    height: '3rem',
                                    margin: '.25rem',
                                    width: '100%',
                                    borderRadius: 15
                                }}
                                    variant='contained' onClick={() => deleteProduct(token, productId)}>Delete
                                </Button></Link>
                        </>
                    ) : (

                        <>
                            <Link style={{ textDecoration: 'none' }} to={`/products`}>
                                <Button style={{
                                    height: '3rem',
                                    margin: '.25rem',
                                    width: '100%',
                                    borderRadius: 15,
                                    backgroundColor: '#55586F'
                                }}
                                    variant='contained'>View All</Button></Link>
                            {token &&
                                <>

                                    <Button style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '100%',
                                        borderRadius: 15
                                    }}
                                        variant='contained' onClick={() => setActiveReview(!activeReview)}>Review this product</Button>

                                    {
                                        activeReview && <SendReview token={token} productId={productId} navigate={navigate} getMe={getMe} />
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