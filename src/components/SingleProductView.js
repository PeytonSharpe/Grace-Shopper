import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { createReview, deleteProduct } from "../api";
import { Button, TextField, Card, Tabs, Tab, Box } from '@mui/material';
import { Image } from 'mui-image';

const SingleProductView = ({ products, user, navigate, getMe, token }) => {
    const [review, setReview] = useState('')
    const [tabIndex, setTabIndex] = useState(0);


    const handleTabChange = (event, newTabIndex) => {
        setTabIndex(newTabIndex);
    };

    async function addReview() {
        console.error('in Single product view')
        await createReview({ product_id, review, token, stars: 5 })
    }

    const handleAdd = async (event) => {
        event.preventDefault();
    
        const { product_id, price, cart_id, product_name } = event.target.dataset;
        if (isLoggedIn){
          const addedItem = await addCartItem({
            product_id: product_id,
            priceAtPurchase: price,
            cart_id: cart_id,
          });
          getMyCart().then((myCart) => setMyCart(myCart));
          return addedItem;
        } else {
        //   const guestCartItem = {
        //     product_id: Number(product_id),
        //     product_name: product_name,
        //     priceAtPurchase: Number(price),
        //   };
          // const sessionCart = await addItemToGuestCart(guestCartItem);
          // getGuestCart().then((myCart) => setMyCart(myCart))
        }
      };

    const [activeReview, setActiveReview] = useState(false);
    const { product_id } = useParams();

    if (products.length) {

        const [currentProduct] = products.filter(products => products.id === parseInt(product_id));

        const {
            title,
            description,
            price,
            count,
            image
        } = currentProduct;

        return (
            <>

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

                    <Box>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab style={{
                                fontSize: '1rem',
                                fontFamily: 'Lato',
                            }} 
                            label="Description" />
                            <Tab style={{
                                fontSize: '1rem',
                                fontFamily: 'Lato',
                            }} label="Reviews" />
                        </Tabs>
                    </Box>
                    {tabIndex === 0 && (
                        <Box>
                            <p className="prod-desc">{description}</p>
                        </Box>
                    )}
                    {tabIndex === 1 && (
                        <Box>
                            <h2>Reviews:</h2>
                        <p>User: {review.username}</p>
                        <p>Review: {review.review}</p>
                        </Box>
                    )}
                                    <Button style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '100%',
                                        borderRadius: 15
                                    }}
                                        variant='contained' onClick={() => handleAdd(token, product_id)}>Add To Cart
                                    </Button>


                        {/* <form onSubmit={(ev) => {
                            ev.preventDefault();
                            addReview();
                            navigate('/products')
                        }}>
                            <TextField
                                style={{
                                    width: '50%',
                                    borderColor: 'Gray',
                                    backgroundColor: 'whitesmoke'
                                }}
                                type='text'
                                label="Enter Review1"
                                onChange={(ev) => setReview(ev.target.value)}
                            /><br />
                            <Button style={{
                                marginTop: "2%",
                                width: '30%',
                                borderRadius: 35,
                                opacity: "70%",
                            }} type='submit'>Send Review </Button>
                        </form> */}

                    {/* <h1>Review on Product:</h1>
                    <Card style={{
                        padding: '.5rem',
                        margin: '.5rem',
                        backgroundColor: 'blue',
                        color: 'FFFFF'
                    }} elevation={6}
                        key={review.id}>
                        <p>From User:{review.username}</p>
                        <p>Review: {review.review}</p>

                    </Card> */}

                    {/* <Card style={{
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
                    </Card> */}
                    {
                        user.isAdmin ? (
                            <>
                                {/* <Link style={{ textDecoration: 'none' }} to={`/products`}>
                                    <Button style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '100%',
                                        borderRadius: 15
                                    }}
                                        variant='contained' onClick={() => deleteProduct(token, product_id)}>Delete
                                    </Button></Link> */}
                                <Link style={{ textDecoration: 'none' }} to={`/products`}>
                                    <Button style={{
                                            height: '3rem',
                                            margin: '0.5rem',
                                            width: '30%',
                                            borderRadius: 15,
                                            backgroundColor: '#4f43ae'
                                        }}
                                        variant='contained'>Back</Button></Link>
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
                                        variant='contained'>Back</Button></Link>
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
                                            activeReview && <singleProductView token={token} product_id={product_id} navigate={navigate} getMe={getMe} />
                                        }
                                    </>
                                }
                            </>
                        )
                    }

                </Card>
            </>
        )
    } else {
        return (
            <h1>Waiting for Products...</h1>
        )
    }
}

export default SingleProductView;