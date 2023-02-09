DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    "isAdmin" BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS products;
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

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description VARCHAR(255),
    "isPublic" BOOLEAN DEFAULT true
);

DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
    review VARCHAR(500),
    "userId" INTEGER REFERENCES users(id),
    "productId" INTEGER REFERENCES products(id),
    stars INTEGER 
);

DROP TABLE IF EXISTS prod_categories;
CREATE TABLE prod_categories (
    "productId" INTEGER REFERENCES products(id),
    "categoryId" INTEGER REFERENCES categories(id)
);

DROP TABLE IF EXISTS wishlist;
CREATE TABLE wishlist (
    "userId" INTEGER REFERENCES users(id),
    "productId" INTEGER REFERENCES products(id)
);

DROP TABLE IF EXISTS addresses;
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    label VARCHAR(255) NOT NULL,
    street1 VARCHAR(255) NOT NULL,
    street2 VARCHAR(255),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zipcode VARCHAR(8) NOT NULL,
    phone_number CHAR(10)
);

DROP TABLE IF EXISTS purchases;
CREATE TABLE purchases (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "cartId" INTEGER, 
    date TIMESTAMP,
    price NUMERIC(10,2)
);

DROP TABLE IF EXISTS cart;
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER REFERENCES users(id),
    "productId" INTEGER REFERENCES products(id)
);