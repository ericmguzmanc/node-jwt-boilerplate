const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')
const SALT_WORK_FACTOR = 10

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true}
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  }
});

UserSchema.pre('validate', function(next) {
  const user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) { 
    return next()
  }

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err)
    }
    
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err)
      }

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  const compare = new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err)
      }
      resolve(isMatch)
    })
  })
  return compare
}

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password)
}

module.exports = mongoose.model('User', UserSchema)