const express = require('express')
const UserModel = require('../models/user.model')
const router = express.Router();
const { validateToken } = require('../util/tokenValidation')

router.use((req, res, next) => validateToken(req, res, next))

router.get('/', (req, res) => {
  res.send('Hello! The API is at http://localhost:' + process.env.PORT + '/api');
})

router.get('/setup', (req, res) => {

  // create a sample user
  const User = new UserModel({
    name: 'Juan Perez',
    password: 'password2',
    admin: true
  })

  // save the sample user
  User.save()
  .then(doc => {
    if (!doc || doc.length === 0) {
      return res.status(500).send(doc)
    }
    console.log('User saved successfully!')
    res.json({ success: true })
  })
  .catch(err => {
    console.log('err ', err)
    res.status(500).json(err)
  })
})

router.get('/users', (req, res) => {
  UserModel.find()
  .then(doc => {
    res.json(doc)
  })
  .catch(err => {
    res.status(500).json(err)
  })
})

module.exports = router;