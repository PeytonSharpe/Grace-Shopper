import React, { useState } from 'react';
import { registerUser } from '../api';
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


const Register = ({ setToken, navigate }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [active, setActive] = useState('');
  const [isAdmin, setIsAdmin] = useState('');


  const handleSubmit = async ({id}) => {
    console.log(username, password, 'testing UN/PW')
    if (password.search(/[A-Z]/) === -1) {
      alert('Need UpperCase')
      return null
    }
    if (password !== confirmPassword) {
      alert('Password Don\'t Match')
      return null
    }
    const results = await registerUser(username, password, email,{id});

    if (results.success) {
      console.log('token acquired')
      setToken(results.data.token)
      window.localStorage.setItem('token', results.data.token)
      navigate('/');
      console.log(results,'RegisterUSER')
    } else {
      console.log(results)
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
        
      <h1>REGISTER</h1>
      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit(username, password, email);
      }}>
        
        <TextField style={{ 
          flexWrap:'center',
          margin: '.25rem',         
           width: '100%', 
           backgroundColor: '#FFFCFF',
           
           }}
        type='text'
        label='Enter Username'
        required={{minLength: 3,maxLength:13}}
        onChange={(event) => {console.log(event.target.value),setUsername(event.target.value),'Username'}}
      />
        <TextField style={{ margin: '.25rem', width: '100%', backgroundColor: '#FFFCFF' }}
          type='password'
         required={{minLength: 8, maxLength:20}}        
          label='Enter Password *'
          onChange={(event) => setPassword(event.target.value)} />
        <TextField style={{ margin: '.25rem', width: '100%', backgroundColor: '#FFFCFF' }}
          type='password'
          required={{minLength: 8, maxLength:20}}
          label='Confirm Password *'
          onChange={(event) => setConfirmPassword(event.target.value)} />
           <TextField style={{ 
          flexWrap:'center',
          margin: '.25rem',         
           width: '100%', 
           backgroundColor: '#FFFCFF',
           
           }}
        type='text'
        label='Enter Email *'        
        onChange={(event) => setEmail(event.target.value)}
      />

        <TextField style={{ 
          flexWrap:'center',
          margin: '.25rem',         
           width: '100%', 
           backgroundColor: '#FFFCFF',
           
           }}
        type='text'
        label='Enter Name *'        
        onChange={(event) => setName(event.target.value)}
      />  
      <TextField style={{ 
        flexWrap:'center',
        margin: '.25rem',         
         width: '100%', 
         backgroundColor: '#FFFCFF',
         
         }}
      type='text'
      label='Enter Active *'        
      onChange={(event) => setActive(event.target.value)}
    />
    <TextField style={{ 
        flexWrap:'center',
        margin: '.25rem',         
         width: '100%', 
         backgroundColor: '#FFFCFF',
         
         }}
      type='text'
      label='Enter isAdmin *'        
      onChange={(event) => setIsAdmin(event.target.value)}
    />
        <Button 
        style={{ 
          height: '3rem',
           margin: '.25rem',
            backgroundColor:'#247BA0' }} 
            variant='contained' 
            type='submit'>Register</Button>
      </form>
      
      </Card>
    </>
  )
}
export default Register;