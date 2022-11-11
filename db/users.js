const client = require("./client");
const bcrypt = require('bcrypt');

// database functions
// user functions
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password) 
    VALUES($1, $2) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
  `, [username, hashedPassword]);
  if (hashedPassword) {
    delete user.password
    return user;
  }
  return user;
}

async function getUser({ username, password }) {

  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);

  if (passwordsMatch) {
    // return the user object (without the password)
    delete user.password
    return user
  }
}

async function getUserById(userId) {

  const { rows: [user] } = await client.query(`
      SELECT id, username
      FROM users
      WHERE id=${userId}
    `);

  if (!user) {
    return null
  }

  return user;

}

async function getUserByUsername(userName) {

  const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [userName]);

  return user;
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
