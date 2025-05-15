const { client } = require('./client');
const { createCategory } = require('./categories');

async function dropTables() {
  try {
    console.log('Dropping Tables');
    await client.query(`
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS prod_categories CASCADE;
      DROP TABLE IF EXISTS wishlist CASCADE;
      DROP TABLE IF EXISTS addresses CASCADE;
      DROP TABLE IF EXISTS purchases CASCADE;
      DROP TABLE IF EXISTS cart CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS user_verification_tokens CASCADE;
      DROP TABLE IF EXISTS password_reset_tokens CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('Finished Dropping Tables');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Creating Tables');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        email_confirmed BOOLEAN DEFAULT false,
        email_token TEXT,
        password_reset_token TEXT,
        password_reset_expiry TIMESTAMP,
        name VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true,
        "isAdmin" BOOLEAN DEFAULT false
      );

      CREATE TABLE user_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255),
        price DECIMAL(10,2) DEFAULT 999.99,
        count INTEGER,
        active BOOLEAN DEFAULT true,
        "isPublic" BOOLEAN DEFAULT true,
        image VARCHAR(255)
      );

      CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(255),
        "isPublic" BOOLEAN DEFAULT true
      );

      CREATE TABLE cart (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "productId" INTEGER REFERENCES products(id) ON DELETE CASCADE
      );

      CREATE TABLE purchases (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "cartId" INTEGER,
        date TIMESTAMP,
        price DECIMAL
