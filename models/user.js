const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')){
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})
userSchema.pre('updateOne', async function(next){

  const update = this.getUpdate();
  const password = update.password;

  if (!password) {
      next();
      return;
  }

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      this.setUpdate({ password: hashedPassword });
      next();
  } catch (error) {
      next(error);
  }
})

userSchema.methods.matchPasswords = async function(enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password)
}

const User = mongoose.model('User', userSchema);

module.exports = User;