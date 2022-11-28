import React, { useState } from 'react';
// import { loginUser } from '../api';

const Login = ({ setToken, navigate }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const handleSubmit = async () => {
        try {

        const results = await loginUser(username, password)
            console.log(results)
            if (results.token) {
            setToken(results.token)
            window.localStorage.setItem('token', results.token)
            navigate('/')
        } 
    } catch (err) {
            console.log('Error logging in')
        }
    }

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            handleSubmit()
        }}>
            <h1>Login</h1>
            <input
            type='text'
            placeholder='Enter Username'
            onChange={(event) => setUsername(event.target.value)}
            />
            <input
            type='password'
            placeholder='Enter Password'
            onChange={(event) => setPassword(event.target.value)}
            />
            <button type='submit'>Login</button>
        </form>

    )
}

export default Login;