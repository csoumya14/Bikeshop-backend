const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const userSchema = new mongoose.Schema({
  customerName: {
    type: String,
    minlength: 3,
    required: true,
  },
  phoneNumber: {
    type: String,
    minlength: 6,
    required: true,
  },
  email: {
    type: String,
    minlength: 8,
    required: true,
  },
  bikeBrand: String,
  typeOfService: {
    type: String,
    required: true,
  },
  dueDate: String,
  login: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Login',
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('User', userSchema)
