const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mango.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://bikeshop:${password}@cluster0-s9l4w.mongodb.net/bike-shop?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const userSchema = new mongoose.Schema({
  customerName: String,
  phoneNumber: String,
  email: String,
  bikeBrand: String,
  typeOfService: String,
  dueDate: String,
})

const User = mongoose.model('User', userSchema)

const user = new User({
  customerName: 'savithri',
  phoneNumber: '65433987',
  email: 'cat@gmail.com',
  bikeBrand: 'ytlr',
  typeOfService: 'wheel adjustment',
  dueDate: '6/ 3 / 20',
})

user.save().then((result) => {
  console.log('user saved!')
  mongoose.connection.close()
})

/*
User.find({}).then((result) => {
  result.forEach((user) => {
    console.log(user)
  })
  mongoose.connection.close()
})
*/
