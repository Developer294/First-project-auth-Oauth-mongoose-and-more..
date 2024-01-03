const fs = require('fs');
const crypto = require('crypto');

// Genera un secreto aleatorio de 256 bits (32 bytes)
const secret = crypto.randomBytes(32).toString('hex');

// Crea el contenido que se guardará en el archivo .env
const envContent = `JWT_SECRET=${secret}`;

// Guarda el contenido en el archivo .env
fs.writeFileSync('.env', envContent);

console.log('Secret generated succesfully and saved on the enviroment folder');
