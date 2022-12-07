import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import ReviewOrder from './ReviewOrder';
import { getMyCart, getGuestCart, checkOutCart, createUserCart, checkOutGuestCart } from '../axios-services/cart';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const theme = createTheme({
  palette: {
    primary: {
      main: '#AE69FF'
    }
  }
});

export default function Checkout(props) {
  const { isLoggedIn, user, guestCart, setGuestCart } = props
  const [activeStep, setActiveStep] = React.useState(0);
  const [myCart, setMyCart] = React.useState({})
  const [address, setAddress] = React.useState({
    firstName: '',
    lastName: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  })


  React.useEffect(() => {
    if (isLoggedIn){
      getMyCart().then((myCart) => {
      setMyCart(myCart);
      })
    } else {
      getGuestCart().then((myCart) => {
        setMyCart(myCart)
      })
    };
  }, []);

  const items = myCart.items

  const handleCheckout = async () => {
    const cart_id = myCart.id
    if (isLoggedIn){
      const completedOrder = await checkOutCart(cart_id)
      const newCart = await createUserCart({
        user_id: user.id,
        order_status: 'active'
      })
      return completedOrder, newCart
    } else {
      // sessionStorage.removeItem(guestCart)
      await checkOutGuestCart();
      getGuestCart().then((myCart) => {
        setMyCart(myCart)
      })
    }
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressForm 
        address={address}
        setAddress={setAddress}
        isLoggedIn={isLoggedIn}
        />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <ReviewOrder 
          isLoggedIn={isLoggedIn}
          user={user}
          myCart={myCart}
          setMyCart={setMyCart}
          address={address}
          setAddress={setAddress}
              />;

      default:
        throw new Error('Unknown step');
    }
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        // color="default"
        fontFamily='inherit'
        elevation={0}
        sx={{
          position: 'relative',
          // borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
      </AppBar>
      <Container component="main" theme={theme} 
        
        sx={{ mb: 4}}
        maxWidth="sm" >
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
      <Typography 
        component="h1" 
        variant="h4" 
        align="center"
        className='font-effect-shadow-multiple' 
        theme={theme}
        sx={{ 
          variant: 'h1',
          // marginTop: '8px',
          fontFamily: 'Sofia',
          fontSize: '48px',
          fontWeight: '900'
          }}>
          Checkout
        </Typography>
        
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  {
                    isLoggedIn ? `Your order number is ${myCart.id}! We have emailed your order
                    confirmation, and will send you an update when your order has
                    shipped.` : 'Your order has been placed! We have emailed your order confirmation, and will send you an update when your order has been shipped'
                  }
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {activeStep === steps.length - 1 ? (
                    <Button
                    variant="contained"
                    onClick={() => {
                      handleCheckout();
                      handleNext();
                    }}
                    sx={{ mt: 3, ml: 1 }}
                  >
                   Place order
                  </Button>
                  ) : (
                    <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    Next
                  </Button>
                  )}
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}