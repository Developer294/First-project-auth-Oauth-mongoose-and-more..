const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username:{ type: String, unique: true },
  password:{ type: String, required: true, minLength: 6 },
  date :{type: Date, default: new Date()}
});

const githubUserSchema = new mongoose.Schema({
  githubId: { type: String, required: true , unique:true},
  // Otros campos para la autenticación de GitHub
});

const GithubUser = mongoose.model('GithubUser', githubUserSchema);

// Use a regular function, not an arrow function, for avoid the "this" bug.
userSchema.pre('save', function(next) {
  console.log('Middleware pre-save triggered');
  console.log('Original password:', this.password);

  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = bcrypt.hashSync(this.password, saltRounds);

  console.log('Hashed password:', this.password);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports ={
  User,
  GithubUser,
}
