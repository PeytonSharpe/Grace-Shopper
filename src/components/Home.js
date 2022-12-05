import React from 'react';
import {
    Box,
    Card
} from '@mui/material'

const Home = () => {

    const boxStyle = {
        display: 'inline-flex',
        border: '1px solid black',
        margin: '0.2rem',
        width: '15rem',
        height: '15rem'

    }

    return (
        <>
        <h1 className='home-header'>Home</h1>
        <p className='about-site'>About site here</p>
        <h2 className='about-us-header'>About Us</h2>

        <Box style={boxStyle}>
        <h3>Brian</h3>
        <p className='about-desc'>Lorem ipsum</p>
        </Box>

        <Box style={boxStyle}>
        <h3>Adrienne</h3>
        <p className='about-desc'>Lorem ipsum</p>
        </Box>

        <Box style={boxStyle}>
        <h3>Peyton</h3>
        <p className='about-desc'>Lorem ipsum</p>
       </Box>

        <Box style={boxStyle}>
        <h3>Justin</h3>
        <p className='about-desc'>Lorem ipsum</p>
       </Box>

        <Box style={boxStyle}>
        <h3>Sam</h3>
        <p className='about-desc'>Lorem ipsum</p>
        </Box>
        </>
    )


}

export default Home;