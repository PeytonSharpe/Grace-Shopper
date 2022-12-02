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
      console.log(error)
      throw error
    }
  }

export const registerUser = async (username, password,email,name, active, isAdmin) => {
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
  export const createProduct = async (isAdmin, { name, description }) => {
    try {
      const response = await fetch(`${baseURL}/products`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAdmin}`
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
      console.log(error)
      throw error
    }
  }
  
  export const updateProduct = async ({ name, description,id }, isAdmin) => {
    try {
      const response = await fetch(`${baseURL}/products/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAdmin}`
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
      console.log(error)
      throw error
    }
  }
  export const deleteProduct = async(isAdmin, id) => {
    try {
      const response = await fetch(`${baseURL}/products/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${isAdmin}`
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