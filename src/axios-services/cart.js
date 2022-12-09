import axios from "axios";

const baseURL = 'http://localhost:3001/api' || 'https://graceshopper-rwb0.onrender.com';

export async function getMyCart() {
  try {
    if (localStorage.token){
      const { data } = await axios.get(`${baseURL}/cart/mycart`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      return data;
    }
  } catch (error) {
    console.error(error);
  } 
}

export async function createUserCart({ user_id, order_status }){
  try {
    const { data } = await axios.post(`${baseURL}/cart/newUserCart`, {
      user_id,
      order_status
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

// export async function getGuestCart(){
//   try {
//     const { data } = await axios.get('/api/cart/guestCart')

//     return data;
//   } catch (error) {
//     console.log("Error getting guestCartIn Session")
//     console.error(error)
//   }
// }

export async function addItemToCart ({productId, product_name, priceAtPurchase}) {

  try {
    const { data } = await axios.post(`${baseURL}/cart/myCart`, {
      "productId": productId,
      // "product_name": product_name,
      // "priceAtPurchase": priceAtPurchase
    })

    return data;
  } catch (error) {
    console.log("Error adding item to guestCart")
    console.error(error)
  }
}

// export async function removeItemFromGuestCart(idx) {

//   try{
//     const { data } = await axios.delete('/api/cart/guestCart',  {
//       data: {
//         idx: idx
//       }

//     }) 

//     return data;
//   } catch(error) {
//     console.log("Error removing item from session storage")
//     console.error(error)
//   }
// }

// export async function createGuestCart({ session_id, order_status}){
//   try {
//     const { data } = await axios.post('/api/cart/newGuestCart', {
//       session_id,
//       order_status
//     })

//     return data
//   } catch (error) {
//     console.log("Error creating guest cart");
//     console.error(error)
//   }
// }

export async function addCartItem({ productId }, token) {
console.log("AXIOS", token)
  try {
    const { data } = await axios.post(`${baseURL}/cart/`, {
      productId,

      // priceAtPurchase,
      // cart_id,
    },
    {headers: { Authorization: `Bearer ${token}` }}
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCartItem(cartedItemId) {
  try {
    const { data } = await axios.delete(`${baseURL}/cart/`, {
      data: {
        cartedItemId: cartedItemId
      }
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function checkOutCart(cart_id){
  try {
    const { data } = await axios.patch(`${baseURL}/cart/checkout`, {
      cart_id
    });

    return data;
  } catch (error) {
    console.error(error)
  }
}

// export async function checkOutGuestCart(){
//   try {
//     const { data } = await axios.post('/api/cart/guestCart/checkout')
//     return data
//   } catch (error) {
//     console.error(error)
//   }
// }

