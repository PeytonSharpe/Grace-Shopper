import React, { useState } from 'react';
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
} from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import './Register';

const Login = ({ setToken, navigate }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState('');

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
      <button style={{ height: '3rem', margin: '.25rem', backgroundColor:'#247BA0',color:'#FFFCFF' }} variant='contained' type='submit'>
        Log In
      </button>
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