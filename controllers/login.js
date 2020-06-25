const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const Login = require('../models/login')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const login = new Login({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedLogin = await login.save()
  response.json(savedLogin)
})

loginRouter.get('/', async (request, response) => {
  const logins = await Login.find({}).populate('user', { customerName: 1, phoneNumber: 1 })
  response.json(logins.map((l) => l.toJSON()))
})

module.exports = loginRouter
