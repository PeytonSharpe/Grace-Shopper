import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/system";
import { Button } from "@mui/material";

import { getMyCart } from "../axios-services/cart";

export default function AddressForm(props) {
  const { address, setAddress, isLoggedIn } = props;

  const [myCart, setMyCart] = React.useState({});

  React.useEffect(() => {
    // getMyCart().then((myCart) => {
    //   setMyCart(myCart)
    // })
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? (
        <>
          <Typography variant="h6" gutterBottom>
            Email address
          </Typography>
          <TextField
            required
            id="email"
            name="email"
            label="Email address"
            fullWidth
            variant="standard"
          />{" "}
          <br></br>
        </>
      ) : null}

      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                firstName: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                lastName: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                line1: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                line2: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                city: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                state: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                zip: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
            onChange={(event) =>
              setAddress({
                ...address,
                country: event.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" name="saveAddress" value="yes" />
            }
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}