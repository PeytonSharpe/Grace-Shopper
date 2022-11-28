const baseURL = 'http://localhost:3001/api';

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
    }
  }

export const registerUser = async (username, password) => {
    try {
      const response = await fetch(`${baseURL}/users/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  
          username: username,
          password: password
  
        })
      })
      const result = await response.json();
  
      return result;
    } catch (error) {
      console.log('error registering user')
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
                user: {
                    username,
                    password
                }
            })
        })
        console.log(response)
        const result = await response.json();
        return result;
      } catch (error) {
        console.log('Error logging in user');
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
    }
  }
  export const createProduct = async (isAdmin, { name, description }) => {
    try {
      const response = await fetch(`${baseURL}/products`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer isAdmin`
        },
        body: JSON.stringify({
  
          name,
          description,
  
        })
      })
      const results = await response.json();
      return (results)
    } catch (error) {
      console.log('error creating a new product')
    }
  }
  
  export const updateProduct = async ({ name, description,id }, isAdmin) => {
    try {
      const response = await fetch(`${baseURL}/products/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer isAdmin`
        },
        body: JSON.stringify({
  
          name,
          description,
  
        })
      })
      const results = await response.json();
      console.log(results)
      return (results)
  
    } catch (ex) {
      console.log('error updating product')
    }
  }
  export const deleteProduct = async(isAdmin, id) => {
    try {
      const response = await fetch(`${baseURL}/products/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer isAdmin`
        }
      })
      const result = await response.json();
      return result
    } catch (error) {
      console.log(`error deleting product`)
    }
  }