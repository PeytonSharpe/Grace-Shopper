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
    <Card className='card-main' elevation={6} style={{ 
      background: '#cec9cc'
      }}>
    <form className='login'
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
    >
      <h3>LOGIN</h3>
      <TextField style={{
         margin: '.25rem',
         width: '90%',
         backgroundColor: '#FFFCFF',
      }}
        placeholder='Enter Username'
        onChange={(event) => setUsername(event.target.value)}
      />
      <TextField style={{
         margin: '.25rem',
         width: '90%',
         backgroundColor: '#FFFCFF',
      }}
        placeholder='Enter Password'
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
            style={{
              fontFamily: 'Lato',
              fontSize: '1.5rem',
              height: '3rem',
              margin: '.25rem',
              width: '15%',
              backgroundColor: '#4f43ae'
            }}
            variant='contained'
            type='submit'>Login</Button>
    
    </form>
      <p>Don't have an account? <a href='/register'>Sign up</a></p>
    </Card>
    </>
  )
        }

export default Login;