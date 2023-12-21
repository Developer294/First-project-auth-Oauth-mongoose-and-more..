const mongoose = require('mongoose');
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
    maxlength:300,
    required: true,
  },
  date :{type: Date, default: new Date()}
});

const githubUserSchema = new mongoose.Schema({
  githubId: { type: String, required: true , unique:true},
  username: {type:String, required:true, unique:true},
  date : {type: Date, default: new Date()}
  // Otros campos para la autenticación de GitHub
});

const googleUserSchema = new mongoose.Schema({
  googleId:{type:String,unique:true,required:true},
  username:{type:String,unique:true,required:true},
  date:{type:Date, default:new Date()}
})

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema)
const GithubUser = mongoose.model('GithubUser', githubUserSchema);
const User = mongoose.model('User', userSchema);

module.exports ={
  User,
  GithubUser,
  GoogleUser
}
