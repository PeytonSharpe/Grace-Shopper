const baseURL = 'http://localhost:3001';

const loginUser = async (username, password) => {
    try {
        const response = await fetch(`${baseURL}/api/users/login`, {
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

module.exports = {
    loginUser
}