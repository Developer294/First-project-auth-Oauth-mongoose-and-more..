const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username:{ type: String, unique: true, required:true },
  email: {
    type: String,
    unique: true, // Si deseas que el correo electrónico sea único en la base de datos //
    trim: true, // Para eliminar espacios en blanco al principio y al final
    lowercase: true, // Para almacenar el correo electrónico en minúsculas
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Formato de correo electrónico no válido'], // Expresión regular para validar el formato del correo electrónico
  },
  password: {
    type: String,
    minlength:8,
    maxlength:200,
    required: true,
  },
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
