const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

morgan.token('data', function getContent(req, res) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

//app.use(express.json())
app.use(bodyParser.json())

const requestLogger = (request, response, next) => {
  console.log('Method', request.method)
  console.log('Path: ', request.path)
  console.log('Body: ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

let users = [
  {
    id: 1,
    customerName: 'Laxman',
    phoneNumber: '789343',
    email: 'laxman@example.com',
    bikeBrand: 'yyy',
    typeOfService: 'chain replacement',
    dueDate: '2020-07-09',
  },
  {
    id: 2,
    customerName: 'hanuman',
    phoneNumber: '67654545',
    email: 'hanuman@example.com',
    bikeBrand: 'zzz',
    typeOfService: 'brake maintenance',
    dueDate: '2020-07-20',
  },
  {
    id: 3,
    customerName: 'das',
    phoneNumber: '7878787',
    email: 'das@klkll.gmail.com',
    bikeBrand: 'ffff',
    typeOfService: 'brake maintenance',
    dueDate: '2020-06-24',
  },
  {
    id: 4,
    customerName: 'kishore',
    phoneNumber: '90909090',
    email: 'kishore@gmail.com',
    bikeBrand: 'jkjkj',
    typeOfService: 'wheel adjustment',
    dueDate: '2020-06-25',
  },
]
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/users/:id', (request, response) => {
  const id = Number(request.params.id)
  const user = users.find((user) => user.id === id)
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/users/:id', (request, response) => {
  const id = Number(request.params.id)
  users = users.filter((user) => user.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = users.length > 0 ? Math.max(...users.map((n) => n.id)) : 0
  return maxId + 1
}

app.post('/api/users', (request, response) => {
  const body = request.body

  if (!body.customerName || !body.phoneNumber) {
    return response.status(400).json({
      error: 'content missing',
    })
  }
  const user = {
    customerName: body.customerName,
    phoneNumber: body.phoneNumber,
    email: body.email,
    bikeBrand: body.bikeBrand,
    typeOfService: body.typeOfService,
    dueDate: body.dueDate,
    id: generateId(),
  }
  users = users.concat(user)
  response.json(user)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
