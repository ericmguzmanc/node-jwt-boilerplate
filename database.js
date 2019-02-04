const mongoose = require('mongoose')
const config = require('./config')


mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to '+ config.database)
})

mongoose.connection.on('error', (err) => {
  console.log(dbURI)
  console.log('Mongoose default connection error: ', err);
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose default connection disconnected')
})

const initializeDatabase = async () => {
  await mongoose.connect(config.database, { useNewUrlParser: true })
}

module.exports = initializeDatabase