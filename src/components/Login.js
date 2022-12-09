import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../api';
import {
  Popover,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Snackbar,
  Alert
} from "@mui/material";
import './Register';


const Login = ({ setToken, navigate }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState('');
    const [open, setOpen] = useState(false)

    const handleClose = (event, reason) => {
      if ("clickaway" == reason) return;
      setOpen(false);
      };
      
      const handleClick = () => {
      setOpen(true);
      };

    const handleSubmit = async () => {
        try {
            const results = await loginUser(username, password)
            console.log(results)
            if (results.token) {
                setToken(results.token)
                window.localStorage.setItem('token', results.token)
                navigate('/products')
            }
        } catch (error) {
            console.log('Error logging in')
            console.log(error)
            throw error
        }

    }

  return (
    <>
    <Card className='register-main-card' elevation={6} style={{ 
      margin:'2rem 4rem ',
      background: '#50514F',
      color:'#FFFCFF',
      textAlign:'center',
      alignContent:'center'    
    
      }}>
    <form className='login'
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <h1>Log In</h1>
      <input style={{ margin: '.25rem', width: '100%', backgroundColor: 'whitesmoke' }}
        label='Enter Username'
        onChange={(event) => setUsername(event.target.value)}
      />
      <input style={{ margin: '.25rem', width: '100%', backgroundColor: 'whitesmoke' }}
        label='Enter Password'
        onChange={(event) => setPassword(event.target.value)}
      />
      <button style={{ height: '3rem', margin: '.25rem', backgroundColor:'#247BA0',color:'#FFFCFF' }} variant='contained' type='submit' onClick={handleClick}>
        Log In
      </button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
    This is a success message!
  </Alert>
  </Snackbar>
      <Link style={{ textDecoration: 'none' }} to='/register'>
        <button
          style={{
            height: '3rem',
            margin: '.25rem', backgroundColor:'#001242',color:'#FFFCFF'
          }}
          variant='contained'
          type='submit'>
          Don't have an account? Sign Up
        </button>
      </Link>
    </form>
    </Card>
    </>
  )
        }

export default Login;