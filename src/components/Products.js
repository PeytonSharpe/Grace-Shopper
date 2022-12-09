import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, TextField, Box } from '@mui/material';
import { Image } from 'mui-image';

import { deleteProduct } from '../api';


const Products = ({ products, user, token, fetchProducts }) => { 
    
    const [searchTerm, setSearchTerm] = useState('');
    function productMatches(products, string) {
        console.log(products, string, "STRING")

        const {
            title,
            description,
        } = products;

        if (title.toLowerCase().includes(string.toLowerCase()) || description.toLowerCase().includes(string.toLowerCase())) {
            return products;
        }
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

    const filteredProducts = products.filter((product) => {

        console.log(product, "FILTERED")
        return productMatches(product, searchTerm)
    });
  
    const productsToDisplay = searchTerm.length ? filteredProducts : products;
    

    return (
        
        <>
            <form className='search-bar' onSubmit={(event) => {
                event.preventDefault();
            }}>
                
                <TextField 
                    variant='outlined'
                    label='Search'
                    onChange={(event) => setSearchTerm(event.target.value)}
                ></TextField>
                
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
                            <p>Count: {count}</p><br/> */}

                                {/* <h2>Review on Product:</h2> */}

                                {product.reviews && product.reviews.map((review) => {

                                    console.log("PROD Reviews")


                                    // return (
                                        // <>  
                                        //     <p>From User:{review.username}</p>
                                        //     <p>Review: {review.review}</p>
                                        // </>
                                    // )

                                })


                                } 
                                    <Button style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '30%',
                                        borderRadius: 15,
                                        backgroundColor: '#4f43ae'
                                    }}
                                        variant='contained' onClick={() => handleAdd(token, id)}>Add To Cart
                                    </Button>



                            {user.isAdmin ?
                                <><br/>
                                    <Link key={id}
                                        to={`/products/edit-products/${id}`}
                                        ><Button
                                        style={{
                                            
                                            height: '3rem',
                                            margin: '0.5rem',
                                            width: '20%',
                                            borderRadius: 15,
                                            backgroundColor: '#4f43ae'
                                        }}
                                        variant='contained'
                                        type='submit'>Edit Product
                                        </Button></Link>

                                    <br/>
                                    <Button
                                        style={{
                                            height: '3rem',
                                            margin: '0.5rem',
                                            width: '20%',
                                            borderRadius: 15,
                                            backgroundColor: '#4f43ae'
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
    )
}

export default Products;