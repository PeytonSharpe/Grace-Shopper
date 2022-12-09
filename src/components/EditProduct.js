import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateProduct } from '../api';
import {
    Button,
    Typography,
    TextField,
    Card,
} from "@mui/material";


const EditProduct = ({ products, fetchProducts, navigate, token }) => {
    const { productId } = useParams();
    console.log(productId)
    if (products.length) {
        const currentProduct = products.filter(product => product.id === parseInt(productId));
console.log(currentProduct)
        console.log(products)
        const { title, description, price, count } = currentProduct[0];
console.log(title,description,price,count)
        const [newTitle, setNewTitle] = useState(title);
        const [newDescription, setNewDescription] = useState(description);
        const [newPrice, setNewPrice] = useState(price)
        const [newCount, setNewCount] = useState(count)

        async function EditProduct() {
            const updatedProduct = {
                title: newTitle,
                description: newDescription,
                id: productId,
                price: newPrice,
                count: newCount
            }

         const newProduct =   await updateProduct(updatedProduct, token)
         console.log(newProduct)
            navigate('/products')
            fetchProducts()
        }

        return (
            <Card className='card-main' elevation={6} style={{ 
                background: '#cec9cc'
                }}>
                <div className="edit-main-div" >
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        EditProduct();
                    }}>
                        <h3>EDIT PRODUCT</h3>

                        <TextField style={{
                            margin: '.25rem',
                            width: '90%',
                            backgroundColor: '#FFFCFF'
                        }}
                            type='text'
                            placeholder={title}
                            onChange={(event) => setNewTitle(event.target.value)}
                        />
                        <TextField style={{
                            margin: '.25rem',
                            width: '90%',
                            backgroundColor: '#FFFCFF'
                        }}
                            type='text'
                            placeholder={description}
                            onChange={(event) => setNewDescription(event.target.value)}
                        />
                        <TextField style={{
                           flexWrap: 'center',
                           margin: '.25rem',
                           width: '90%',
                           backgroundColor: '#FFFCFF'
                        }}
                            type='text'
                            placeholder={price}
                            onChange={(event) => setNewPrice(event.target.value)}
                        />
                        <TextField style={{
                           flexWrap: 'center',
                           margin: '.25rem',
                           width: '90%',
                           backgroundColor: '#FFFCFF'
                        }}
                            type='text'
                            placeholder={count}
                            onChange={(event) => setNewCount(event.target.value)}
                        />

                        <Button style={{
                            fontFamily: 'Lato',
                            fontSize: '1rem',
                            height: '3rem',
                            margin: '.25rem',
                            width: '15%',
                            backgroundColor: '#4f43ae'
                        }}
                            type="submit"
                            variant="contained"
                            onClick={() => {
                                EditProduct();
                            }}>Edit Product</Button>
                    </form>
                </div>
            </Card>
        )
    }
    return <h1>Products Loading</h1>
}
export default EditProduct;