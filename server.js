require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const initializeDatabase = require('./database')

const config = require('./config')

const userRoutes = require('./app/routes/user.routes')
const authenticateRoutes = require('./app/auth/authenticate')

app.set('superSecret', config.secret) // Secret variable

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// log requests to the console
app.use(morgan('dev'))


// Routes
app.use('/api', authenticateRoutes);
app.use('/api', userRoutes);


const startServer = async () => {
  await initializeDatabase(app)
  const port = process.env.PORT || 3008
  app.listen(port, console.log('\x1b[33m%s\x1b[0m', `Listening at http://localhost:${port}`))
}

startServer()

module.exports = app