import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { updateCategory, deleteCategory } from '../api';
import {
    Button,
    Typography,
    TextField,
    Card,
} from "@mui/material";


const EditCategory = ({ categories, fetchCategories, navigate, token }) => {
    const { categoryId } = useParams();
    console.log(categoryId)
    if (categories.length) {
        const currentCategory = categories.filter(category => category.id === parseInt(categoryId));
console.log(currentCategory)
        console.log(categories)
        const { name, description } = currentCategory[0];
console.log(name, description)
        const [newName, setNewName] = useState(name);
        const [newDescription, setNewDescription] = useState(description);

        async function EditCategory() {
            const updatedCategory = {
                name: newName,
                description: newDescription,
                id: categoryId
            }

         const newCategory =  await updateCategory(updatedCategory, token)
         console.log(newCategory)
            navigate('/categories')
            fetchCategories();
        }

        async function DeleteCategory () {
            const response = await deleteCategory (token, categoryId)
            navigate('/categories')
            fetchCategories();
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
                        // EditCategory();
                    }}>
                        <h1>Edit Category</h1>

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
                            value={newDescription}
                            label='description'
                            onChange={(event) => setNewDescription(event.target.value)}
                        />

                    </form>                        
                        <Button style={{
                            marginTop: "2%",
                            width: "100%",
                            borderRadius: 35,
                            background: "#001242",
                            opacity: "70%",
                            color: "#FFFCFF",
                            borderColor: "#24A6D1",
                        }}
                            
                            variant="outlined"
                            onClick={() => {
                                EditCategory();
                            }}>Edit Category</Button>
                        
                            <Button style={{
                            marginTop: "2%",
                            width: "100%",
                            borderRadius: 35,
                            background: "#001242",
                            opacity: "70%",
                            color: "#FFFCFF",
                            borderColor: "#24A6D1",
                        }}
                        
                            variant="outlined"
                            onClick={() => {
                                DeleteCategory();
                            }}>Delete Category</Button>

                </div>
            </Card>
        )
    }
    return <h1>Categories Loading</h1>
}
export default EditCategory;