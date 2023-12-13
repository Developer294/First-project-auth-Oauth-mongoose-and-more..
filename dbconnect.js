const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conexión a la base de datos exitosa');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
};
module.exports = dbConnect;