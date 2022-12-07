import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Paper, TextField } from '@mui/material';


const Categories = ({ categories, user, token, fetchCategories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    console.log(categories)
    function categoryMatches(categories, string) {
        const { 
            id,
            name,
            description
             } = categories;
            
        if (name.toLowerCase().includes(string.toLowerCase()) || description.toLowerCase().includes(string.toLowerCase())) {
            return categories;
        }
    }
    // const categories = await fetchCategories();
    const filteredCategories = categories.filter(category => categoryMatches(category, searchTerm));
    const categoriesToDisplay = searchTerm.length ? filteredCategories : categories;

    
    return (
        <Card style={{
            padding: '.5rem',
            margin: '.5rem',
            background: '#247BA0'
                }} elevation={6} >
            <div className="main-category-div">
                <div >
                    <form onSubmit={(event) => {
                        event.preventDefault();
                    }}>
                        <Card style={{ 
                            padding: '.5rem',
                             margin: '.5rem',
                              background: '#C3B299'
                               }} >
                            <TextField style={{ 
                                width: '100%',
                                 background: '#FFFCFF'
                                 }}
                                type='text'
                                label='Search'
                                onChange={(event) => setSearchTerm(event.target.value)}
                            ></TextField>
                        </Card>
                    </form>

                </div>
                <div>
                    {user.isAdmin ? (
<div>
                        <Link style={{
                             textDecoration: 'none'
                             }} to='/categories/create-category'><Button
                            style={{
                             height: '4rem',
                             width: '100%',
                             borderRadius: 15,
                             background: '#001242'
                             }}
                            variant='contained'
                            type='submit'>
                            Create Category
                        </Button></Link>


</div>
                    ) : (
                        null
                    )}
                    {
                        categoriesToDisplay.map((category) => {
                            const { 
                                id, 
                                name,
                                description,
                                    } = category;

                            return (
                                <Card key={id} style={{
                                    padding: '.5rem',
                                    margin: '.5rem',
                                    background: '#FFFCFF'
                                    }}>
                                    <div  >
                                        <Link  style={{
                                                textDecoration: 'none'
                                                        }}
                                                        to={`/categories/${id}`}>
                                                        <h3>{name}</h3></Link>
                                                        <p>Description: {description}</p>
                                                        
                                    </div>
                                    {user.isAdmin ?
                                    <div>
                                    <Link key={id}
                                    style={{
                                        textDecoration: 'none'
                                    }}
                                    to={`/categories/edit-category/${id}`}
                                ><Button
                                    style={{
                                        height: '3rem',
                                        margin: '.25rem',
                                        width: '100%',
                                        borderRadius: 15,
                                        backgroundColor: ' #50514F'
                                    }}
                                    variant='contained'
                                    type='submit'>Edit Category
                                    </Button> </Link>
                                    </div>:
                                    null}
                                </Card>
                            )
                        })
                    }
                </div>
            </div>
        </Card>
    )



}


export default Categories;