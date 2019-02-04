const express = require('express')
const UserModel = require('../models/user.model')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../../config')

router.post('/authenticate', (req, res) => {
    
  if(!req.body.name) {
    return res.status(400).send('Missing URL parameter: name')
  }
  
  // find the user
  UserModel.findOne({
    name: req.body.name
  })
  .then(user => {
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' })
    } else if (user) {

      // check if password matches
      user.comparePassword(req.body.password)
        .then(isMatch => {
          if (!isMatch) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.'})
          } else {
          
            // if user is found and password is right
            // create a token with only our given payload
            // we don't want to pass in the entire user since that has the password
            const payload = { admin: user.admin }
            const token = jwt.sign(payload, config.secret, {
              expiresIn: "1 day" // expires in 24 hours
            })
            
            // return information including token as JSON
            res.json({
              success: true,
              message: 'Token created!',
              token: token
            })
          }
        })
    }
    
  })
  .catch(err => {
    res.status(500).json({'Error': err})
  })
})

module.exports = router
