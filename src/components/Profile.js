import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Card, Paper } from '@mui/material';

const Profile = ({ user }) => {
  const reviews = user.reviews;
  const userID = user._id;

  return (
    <Card style={{ padding: '.5rem', margin: '.5rem', backgroundColor:'#55586F', color: 'whitesmoke' }} elevation={6}>
      <h1>PROFILE</h1>
      <Card style={{ padding: '.5rem', margin: '.5rem', background: '#040F16', color: 'whitesmoke' }} elevation={2}>
        <h1>Review on Products:</h1>
        {
         reviews && reviews.map(review => {
            const fromUserID = review.fromUser._id;
            const { username } = review.fromUser;
            const { title } = review.product;

            if (userID !== fromUserID) {
              return (
                <Card style={{ padding: '.5rem', margin: '.5rem', background: 'B4D2E7', }} elevation={6} key={message._id}>
                  <p>From User:{username}</p>
                  <p>Review: {review.content}</p>
                  <p>Product Reference: {title}</p>
                </Card>
              )
            }
          })

        }
      </Card>
      <Card style={{ padding: '.5rem', margin: '.5rem', background: '#0094C6', }} elevation={6}>
        <h1>Reviews from ME:</h1>
        {
          reviews && reviews.map(review => {
            const fromUserID = review.fromUser._id;
            if (userID === fromUserID) {
              return (
                <Card style=
                  {{
                    padding: '.5rem',
                    margin: '.5rem',
                    background: 'whitesmoke',
                  }}
                  elevation={6}
                  key={review._id}>
                  {review.content}
                </Card>
              )
            }
          })
        }
      </Card>
    </Card>
  )
}

export default Profile;