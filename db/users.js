const { client } = require('./client');
const bcrypt = require('bcrypt');

// database functions
// user functions
async function createUser({ username, password, email, name, active, isAdmin }) { // isAdmin might need later
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users(username, password, email, name, active, "isAdmin") 
    VALUES($1, $2, $3, $4, $5, $6) 
    ON CONFLICT (username) DO NOTHING 
    RETURNING *;
  `, [username, hashedPassword, email, name, active, isAdmin]);
    if (hashedPassword) {
      delete user.password
      return user;
    }
    return user;
  } catch (err) {
    console.log('createUser-users.js FAILED', err)
  }
}

async function updateUser(id, fields = {}) {
  // build the set string
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `, Object.values(fields));

    return user;
  } catch (err) {
    console.log('updateUser-users.js FAILED', err)
  }
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

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, username, password, email, name
      FROM users;
    `);

    return rows;
  } catch (err) {
    console.log('getAllUsers-users.js FAILED', err)
  }
}

async function getUserById(userId) {

  const { rows: [user] } = await client.query(`
      SELECT id, username, "isAdmin"
      FROM users
      WHERE id=${userId}
    `);

  if (!user) {
    return null
  }

  return user;

}

async function getUserByUsername(username) {
  console.log("inside username", username)
  const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);
  console.log("after query", user)
  return user;
}

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers
}
