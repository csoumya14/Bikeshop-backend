const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userLoginRouter = require('express').Router()
const Login = require('../models/login')

userLoginRouter.post('/', async (request, response) => {
  const body = request.body
  const login = await Login.findOne({ username: body.username })
  const passwordCorrect =
    login === null ? false : await bcrypt.compare(body.password, login.passwordHash)

  if (!(login && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: login.username,
    id: login._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response.status(200).send({ token, username: login.username, name: login.name })
})

module.exports = userLoginRouter
