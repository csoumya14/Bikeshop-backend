const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  name: String,
  passwordHash: String,
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
})

loginSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

loginSchema.plugin(uniqueValidator)

const Login = mongoose.model('Login', loginSchema)

module.exports = Login
