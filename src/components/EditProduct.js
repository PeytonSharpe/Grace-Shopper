import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateProduct } from '../api';
import {
    Button,
    Typography,
    TextField,
    Card,
} from "@mui/material";


const EditProduct = ({ products, fetchProducts, navigate, user }) => {
    const { productId } = useParams();
    if (products.length) {
        const currentProduct = products.filter(product => product.id === parseInt(productId));

        console.log(products)
        const { name, description, price, count } = currentProduct;

        const [newName, setNewName] = useState(name);
        const [newDescription, setNewDescription] = useState(description);
        const [newPrice, setNewPrice] = useState(price)
        const [newCount, setNewCount] = useState(count)

        async function EditProduct() {
            const updatedProduct = {
                name: newName,
                description: newDescription,
                id: productId,
                price: newPrice,
                count: newCount
            }

            await updateProduct(updatedproduct, user.isAdmin)
            navigate('/products')
            fetchProducts()
        }

        return (
            <Card elevation={6} style={{
                background: '#50514F',
                margin: '2rem 4rem 6rem 2rem',
                padding: '2rem',
                color: '#FFFCFF',
                textAlign: 'center',
                alignContent: 'center'

            }}>
                <div className="edit-main-div" >
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        EditProduct();


                    }}>
                        <h1>Edit Product</h1>

                        <TextField style={{
                            flexWrap: 'center',
                            margin: '.25rem',
                            width: '100%',
                            backgroundColor: '#FFFCFF',

                        }}
                            type='text'
                            placeholder={name}
                            onChange={(event) => setNewName(event.target.value)}
                        />
                        <TextField style={{
                            flexWrap: 'center',
                            margin: '.25rem',
                            width: '100%',
                            backgroundColor: '#FFFCFF',

                        }}
                            type='text'
                            placeholder={description}
                            onChange={(event) => setNewDescription(event.target.value)}
                        />
                        <TextField style={{
                            flexWrap: 'center',
                            margin: '.25rem',
                            width: '100%',
                            backgroundColor: '#FFFCFF',

                        }}
                            type='text'
                            placeholder={price}
                            onChange={(event) => setNewPrice(event.target.value)}
                        />
                        <TextField style={{
                            flexWrap: 'center',
                            margin: '.25rem',
                            width: '100%',
                            backgroundColor: '#FFFCFF',

                        }}
                            type='text'
                            placeholder={count}
                            onChange={(event) => setNewCount(event.target.value)}
                        />

                        <Button style={{
                            marginTop: "2%",
                            width: "100%",
                            borderRadius: 35,
                            background: "#001242",
                            opacity: "70%",
                            color: "#FFFCFF",
                            borderColor: "#24A6D1",
                        }}
                            type="submit"
                            variant="outlined"
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