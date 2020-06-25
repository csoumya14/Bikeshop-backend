const usersRouter = require('express').Router()
const User = require('../models/user')
const Login = require('../models/login')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('login', { username: 1, name: 1 })
  response.json(users.map((user) => user.toJSON()))
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id)
  if (user) {
    response.json(user.toJSON())
  } else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const login = await Login.findById(decodedToken.id)
  console.log('login:', login)

  const user = new User({
    customerName: body.customerName,
    phoneNumber: body.phoneNumber,
    email: body.email,
    bikeBrand: body.bikeBrand,
    typeOfService: body.typeOfService,
    dueDate: body.dueDate,
    login: login._id,
  })

  const savedUser = await user.save()
  login.user = login.user.concat(savedUser._id)
  await login.save()

  response.json(savedUser.toJSON())
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

usersRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = {
    phoneNumber: body.phoneNumber,
    email: body.email,
    bikeBrand: body.bikeBrand,
    typeOfService: body.typeOfService,
    dueDate: body.dueDate,
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, { new: true })
  response.json(updatedUser.toJSON())
})

module.exports = usersRouter
