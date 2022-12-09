const baseURL = 'http://localhost:3001/api' || 'https://graceshopper-rwb0.onrender.com';

export const getAllUsers = async () => {
  try{
    const response = await fetch(`${baseURL}/users`, {
      headers: {
        'Content-Type': 'application/json'
      },
    })
    const result = await response.json();
    return result
  } catch (error) {
    console.log('error getting users')
    console.log(error)
    throw error
  }
}

export const getUserDetails = async (token) => {
  try {
    const response = await fetch(`${baseURL}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    const result = await response.json();
    return result
  } catch (error) {
    console.log('error getting users details')
    console.log(error)
    throw error
  }
}

export const registerUser = async (username, password, email, name, active, isAdmin) => {
  try {
    const response = await fetch(`${baseURL}/users/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

        username: username,
        password: password,
        email: email,
        name: name,
        active: active,
        isAdmin: isAdmin

      })
    })
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error registering user')
    console.log(error)
    throw error
  }
}

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${baseURL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        username,
        password

      })
    })
    console.log(response)
    const result = await response.json();
    return result;
  } catch (error) {
    console.log('Error logging in user');
    console.log(error)
    throw error
  }
}



export const getProducts = async () => {
  try {
    const response = await fetch(`${baseURL}/products`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const results = await response.json();
    return results;
  } catch (error) {
    console.log('error getting all products')
    console.log(error)
    throw error
  }
}


export const createProduct = async (token, { title, description, price, count, image }) => {
  try {
    console.log(title)
    const response = await fetch(`${baseURL}/products/create-product`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({

        title,
        description,
        price,
        count,
        image
      })
    })
    const results = await response.json();
    return (results)
  } catch (error) {
    console.log('error creating a new product')
    console.log(error)
    throw error
  }
}

export const updateProduct = async ({ title, description, price, count, image, id }, token) => {
  try {

    const response = await fetch(`${baseURL}/products/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({

        title,
        description,
        price,
        count,
        image

      })
    })
    const results = await response.json();
    console.log(results, "updating Product")
    return (results)

  } catch (ex) {
    console.log('error updating product')
    console.log(ex)
    throw ex
  }
}
export const deleteProduct = async (token, id) => {
  try {
    const response = await fetch(`${baseURL}/products/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const result = await response.json();
    return result
  } catch (error) {
    console.log(`error deleting product`)
    console.log(error)
    throw error
  }
}

export const getAllReviewsForProduct = async (productId) => {
  try{
    console.log(productId,"GETALL_1")
    const response = await fetch(`${baseURL}/reviews/product/${productId}`)
    const result = await response.json();
    console.log(result,'Result')
    return result
  } catch(error){
    console.log('error getting reviews for products')
    console.log(error)
    throw error
  }
}

export const getAllReviews = async () => {
  try{
    const response = await fetch(`${baseURL}/reviews/products/${productId}/reviews`)
    const result = await response.json();
    return result
  } catch(error){
    console.log('error getting reviews for products')
    console.log(error)
    throw error
  }
}

export const createReview = async ({ productId, token, review, stars }) => {
  try {
    console.log('stars',stars)
    const response = await fetch(`${baseURL}/reviews/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        review,
        stars,
        productId
      })
    })
    const results = await response.json();
    console.log(results)
  } catch (error) {
    console.log('error creating review')
    console.log(error)
    throw error
  }
};
export const getCategories = async () => {
  try {
    const response = await fetch(`${baseURL}/categories`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const results = await response.json();
    return results;
  } catch (error) {
    console.log('error getting all categories')
    console.log(error)
    throw error
  }
}
export const updateCategory = async ({id, name, description}, token) => {
  try {
    const response = await fetch (`${baseURL}/categories/${id}`, {
      method:"PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        description
      })
    })
    const results = await response.json();
    console.log("Updating Category", results)
    return(results)
  } catch (ex) {
    console.log('error updating Category', ex)
    throw ex
  }
}

export const deleteCategory = async (token, id) => {
  try {
    const response = await fetch(`${baseURL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const result = await response.json();
    return result
  } catch (error) {
    console.log(`error deleting Category`, error)
    throw error
  }
}

export const createCategory = async ({name, description }, token) => {
  try {
    const response = await fetch(`${baseURL}/categories/create-category`, {
      method:"POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({

        name,
        description
      })
    })
    const results = await response.json();
    return (results)
  } catch (error) {
    console.log('error creating new category', error)
    throw error
  }
}  

export const productsByCategory = async (categoryName) => {
  try{
    const response = await fetch(`${baseURL}/categories/${categoryName}`)
    const result = await response.json();
    return result
  } catch(error){
    console.log('error getting category products', error)
    throw error
  }
}

export const getMyCart = async (token) => {
  console.log(token)
  try{
    const response = await fetch(`${baseURL}/cart/myCart`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    const result = await response.json();
    return result
  } catch (error) {
    console.log('error getting cart')
    console.log(error)
    throw error
  }
}