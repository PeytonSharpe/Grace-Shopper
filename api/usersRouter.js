const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { requireUser } = require('./utils');
const {
  getAllUsers,
  getUserByUsername,
  createUser
} = require('../db')

// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password, "API LOGIN")
  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  async function comparePassword(plaintextPassword, hash) {
    console.log(process.env.JWT_SECRET, "JWT")
    console.log(plaintextPassword, hash, "Passwords")
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
  }

  try {
    const user = await getUserByUsername(username);
    if (user && comparePassword(password, user.password)) {
      const id = user.id
      console.log(id,"IDcheck")
      // create token & return to user
      const token = jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, { expiresIn: '1w' })

      res.send({ message: "you're logged in!", token, user });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or password is incorrect'
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
  const { username, password, email, name, active, isAdmin } = req.body;
  console.log(req.body)
  try {
    console.log("above54", username)
    const _user = await getUserByUsername(username);
    console.log("Something", _user)
    if (_user) {
      next({
        error: `api error`,
        name: 'UserExistsError',
        message: `User ${username} is already taken.`
      });
    }

    if (password.length < 8) {
      next({
        error: `api error`,
        name: 'PasswordLengthError',
        message: 'Password Too Short!'
      })
    }

    const user = await createUser({
      username,
      password,
      email,
      name,
      active,
      isAdmin
    });
    console.log('created user', user)
    const token = jwt.sign({
      id: user.id,
      username
    }, process.env.JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({
      message: "thank you for signing up",
      token: token,
      user: user
    });
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// GET /api/users/me
usersRouter.get('/me', requireUser, async (req, res, next) => {
  const user = req.user;

  res.send(user)
})

usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

// GET /api/users/:username/cart
usersRouter.get(`/:username/cart`, async (req, res, next) => {
  const { username } = req.params

  // try {

  // } catch ({ name, message }) {
  //   next({ name, message })
  // }
})
module.exports = usersRouter;