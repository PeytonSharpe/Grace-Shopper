const { client } = require('./client');
const bcrypt = require('bcrypt');

async function createUser({ username, password, email, name, active = true, isAdmin = false }) {
  const SALT_COUNT = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

    const { rows: [user] } = await client.query(`
      INSERT INTO users(username, password, email, name, active, "isAdmin") 
      VALUES($1, $2, $3, $4, $5, $6) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, hashedPassword, email, name, active, isAdmin]);

    if (!user) {
      throw new Error('User creation failed, username may already exist');
    }

    delete user.password;
    return user;
  } catch (err) {
    throw new Error(`createUser failed: ${err.message}`);
  }
}

async function updateUser(id, fields = {}) {
  if (!id) {
    throw new Error('updateUser requires a valid user id');
  }

  if (fields.password) {
    const SALT_COUNT = 10;
    fields.password = await bcrypt.hash(fields.password, SALT_COUNT);
  }

  const setString = Object.keys(fields)
    .map((key, idx) => `"${key}"=$${idx + 1}`)
    .join(', ');

  if (!setString) {
    throw new Error('updateUser requires at least one field to update');
  }

  try {
    const { rows: [user] } = await client.query(`
      UPDATE users
      SET ${setString}
      WHERE id=$${Object.keys(fields).length + 1}
      RETURNING *;
    `, [...Object.values(fields), id]);

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    delete user.password;
    return user;
  } catch (err) {
    throw new Error(`updateUser failed: ${err.message}`);
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      throw new Error('Invalid username or password');
    }

    delete user.password;
    return user;
  } catch (err) {
    throw new Error(`getUser failed: ${err.message}`);
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT id, username, email, name, active, "isAdmin", email_confirmed
      FROM users
      WHERE id=$1;
    `, [userId]);

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return user;
  } catch (err) {
    throw new Error(`getUserById failed: ${err.message}`);
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

    return user || null;
  } catch (err) {
    throw new Error(`getUserByUsername failed: ${err.message}`);
  }
}

module.exports = {
  createUser,
  updateUser,
  getUser,
  getUserById,
  getUserByUsername,
};
