import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, TextField, Box } from '@mui/material';
import { Image } from 'mui-image';

import { deleteProduct } from '../api';
import DeleteIcon from '@mui/icons-material/Delete';


// import { DeleteIcon } from '@mui/icons-material';


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
        <Card style={{
            padding: '.5rem',
            margin: '.5rem',
            background: '#247BA0'
        }} elevation={6} >
        <>
            <form className='search-bar' onSubmit={(event) => {
                event.preventDefault();
            }}>
                <Card style={{
                        padding: '.5rem',
                        margin: '.5rem',
                        background: '#C3B299'
                    }} >
                <TextField 
                    variant='outlined'
                    label='Search'
                    onChange={(event) => setSearchTerm(event.target.value)}
                ></TextField>
                </Card>
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
                            <p>Description: {description}</p>
                            <p>Price: ${price}</p>
                            <p>Count: {count}</p>
                            <Card className='review-card-main' style={{
                                padding: '.5rem',
                                margin: '.5rem',
                                backgroundColor: '#040F16',
                                color: 'whitesmoke'

                            }} elevation={2}>

                                <h1>Review on Product:</h1>

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

                                })


                                } 
                             </Card> 
                            

                                    <Button style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '100%',
                                        borderRadius: 15
                                    }}
                                        variant='contained' onClick={() => handleAdd(token, id)}>Add To Cart
                                    </Button>


                                
                            </Card>


                            {user.isAdmin ?
                                <>
                                    <Link key={id}
                                        to={`/products/edit-products/${id}`}
                                    ><Button
                                        style={{

                                            height: '3rem',
                                            margin: '0.5rem',
                                            width: '100%',
                                            borderRadius: 15,
                                            backgroundColor: '#4f43ae'
                                        }}
                                        variant='contained'
                                        type='submit'>Edit Product
                                        </Button></Link>


                                    <Button
                                        style={{
                                            height: '3rem',
                                            margin: '0.5rem',
                                            width: '38%',
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
                        
                    </>
                )
            })
            }
        </>
     </Card>
    )
}

export default Products;