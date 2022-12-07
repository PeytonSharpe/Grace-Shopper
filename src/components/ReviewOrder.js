import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import { getMyCart, getGuestCart } from '../axios-services/cart';


const payments = [
  { name: 'Card type', detail: 'Visa' },
  { name: 'Card holder', detail: 'Ms Joan Smith' },
  { name: 'Card number', detail: 'xxxx-xxxx-xxxx-1234' },
  { name: 'Expiry date', detail: '04/2024' },
];

export default function ReviewOrder({ isLoggedIn, address, setAddress, myCart, setMyCart }) {

  const items = myCart.items
  const {
    city,
    country,
    firstName,
    lastName,
    line1,
    line2,
    state,
    zip
  } = address

  if (!items){
    return <div>No Items!</div>
  } else {
    
    let priceArray = []
    items.map(item => priceArray.push(item.priceAtPurchase))
    const initialValue = 0;
    const orderTotal = priceArray.reduce(
    (previousValue, currentValue) => Number(previousValue) + Number(currentValue),
    initialValue
    );

    return (
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        <List disablePadding>
          {items.map((item, idx) => (
            <ListItem key={idx} sx={{ py: 1, px: 0 }}>
              <ListItemText primary={item.product_name} />
              <Typography variant="body2">${item.priceAtPurchase}</Typography>
            </ListItem>
          ))}
  
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${Number(orderTotal).toFixed(2)}
            </Typography>
          </ListItem>
        </List>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Shipping
            </Typography>
            <Typography gutterBottom>{firstName} {lastName}</Typography>
            <Typography gutterBottom>{line1} {line2} {city}, {state}, {zip}, {country}</Typography>
          </Grid>
          <Grid item container direction="column" xs={12} sm={6}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Payment details
            </Typography>
            <Grid container>
              {payments.map((payment) => (
                <React.Fragment key={payment.name}>
                  <Grid item xs={6}>
                    <Typography gutterBottom>{payment.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom>{payment.detail}</Typography>
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}