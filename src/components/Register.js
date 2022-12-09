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
  Alert
} from "@mui/material";


const Register = ({ setToken, navigate }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  // const [active, setActive] = useState('');
  // const [isAdmin, setIsAdmin] = useState('');


  const handleSubmit = async () => {
    console.log(username, password, 'testing UN/PW')
    if (password.search(/[A-Z]/) === -1) {
      alert('Please add an uppercase character to your password.')
      return null
    }
    if (password !== confirmPassword) {
      alert('Password Don\'t Match')
      return null
    }
    const results = await registerUser(username, password, email, name);

    if (results.token) {
      console.log('Token acquired')
      setToken(results.token)
      window.localStorage.setItem('token', results.token)
      alert('Register successful.')
      navigate('/')
      console.log(results, 'Register user')
    } else {
      alert('Register unsuccessful, please try again.')
      console.log(results)
    }
  }
  return (
    <>
      <Card className='card-main' elevation={6} style={{
        background: '#cec9cc'
      }}>

        <h3>REGISTER</h3>
        <form onSubmit={(event) => {
          event.preventDefault();
          handleSubmit(username, password, email);
          

        }}>

          <TextField style={{
            flexWrap: 'center',
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF',

          }}
            type='text'
            label='Enter Username'
            required={{ minLength: 3, maxLength: 13 }}
            onChange={(event) => { console.log(event.target.value), setUsername(event.target.value), 'Username' }}
          />

          <TextField style={{
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='password'
            required={{ minLength: 8, maxLength: 20 }}
            label='Enter Password'
            onChange={(event) => setPassword(event.target.value)} />

          <TextField style={{
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='password'
            required={{ minLength: 8, maxLength: 20 }}
            label='Confirm Password'
            onChange={(event) => setConfirmPassword(event.target.value)} />

          <TextField style={{
            flexWrap: 'center',
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='text'
            label='Email Address'
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField style={{
            flexWrap: 'center',
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='text'
            placeholder='Name'
            onChange={(event) => setName(event.target.value)}
          />

          <input className='active' style={{
            flexWrap: 'center',
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='checkbox'
            label='Enter Active'
            onChange={(event) => setActive(event.target.value)}
          />

          <input className='admin' style={{
            flexWrap: 'center',
            margin: '.25rem',
            width: '90%',
            backgroundColor: '#FFFCFF'
          }}
            type='checkbox'
            label='Enter isAdmin'
            onChange={(event) => setIsAdmin(event.target.value)}
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
            type='submit'>Register</Button>
        </form>
            <p>Already have an account? <a href='/login'>Login</a></p>
      </Card>
    </>
  )
}
export default Register;