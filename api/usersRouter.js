const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requireUser } = require('./utils');
const {
  getAllUsers,
  getUserByUsername,
  createUser
} = require('../db');

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1w' }
    );

    delete user.password;
    res.send({
      message: "You're logged in!",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
});

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
  const { username, password, email, name, active = true, isAdmin = false } = req.body;

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return next({
        name: 'UserExistsError',
        message: `User '${username}' is already taken.`
      });
    }

    if (!password || password.length < 8) {
      return next({
        name: 'PasswordLengthError',
        message: 'Password too short! Must be at least 8 characters.'
      });
    }

    // Create user (make sure your db.createUser hashes password)
    const user = await createUser({
      username,
      password,
      email,
      name,
      active,
      isAdmin
    });

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1w' }
    );

    delete user.password;
    res.send({
      message: "Thank you for signing up!",
      token,
      user
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/users/me
usersRouter.get('/me', requireUser, async (req, res, next) => {
  res.send(req.user);
});

// GET /api/users
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send({ users
