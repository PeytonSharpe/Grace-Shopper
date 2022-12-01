import React, { useState } from 'react';
import { createProduct } from '../api';
import { Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  CardActionArea,
  CardActions,
  Button,
  Popover
} from '@mui/material'

const CreateProduct = ({  user, fetchProducts, navigate }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [count, setCount] = useState('')
  
  const newProduct = {
     
    title,
    description,
    price,
    count,
    
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [error, setError] = useState('')

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    const results = await createProduct(isAdmin, newProduct);
    console.log(results, "TEST")
    if ("error" in results) {

      setError(results.error);

    } else {

      setError('new!');
      fetchProducts();
      navigate('/products')

    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Card elevation={6} style={{ background: '#50514F',margin:'2rem' }}>
      <form onSubmit={(event) => {
        event.preventDefault();      
      }}>

        <CardContent>
        <CardMedia>
          {/* <img style={{
            backgroundImage: `url(${navPIC})`, height: '25rem', width: '100%',
            backgroundPosition: 'top',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }} src={navPIC} /> */}
        </CardMedia>
          <Typography variant='h1' component='h3' style={{ color: '#C3B299' }}>
             Add Product
          </Typography>
          <TextField style={{ background: '#FFFCFF', color: '#000000'}}
            type='text'
            label="Title*"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField style={{ background: '#FFFCFF', color: '#000000'}}
            type='text'
            label="Description*"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
             <TextField style={{ background: '#FFFCFF', color: '#000000'}}
            type='text'
            label="Price*"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
             <TextField style={{ background: '#FFFCFF', color: '#000000'}}
            type='text'
            label="Count*"
            value={count}
            onChange={(event) => setCount(event.target.value)}
          />
        </CardContent>

        <CardActionArea>
          <CardActions>
            <Button style={{ height: '3rem', margin: '.25rem' }} aria-describedby={id} variant="contained" onClick={handleClick}>
             + ADD Product
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }}>{error}</Typography>
            </Popover>
          </CardActions>
        </CardActionArea>

      </form>
    </Card>
  )


}

export default CreateProduct;