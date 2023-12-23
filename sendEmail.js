const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  },
});

const mailOptions = {
  from: process.env.GMAIL_USER,
  to: 'destinatario@otradireccion.com',
  subject: 'Retrieve your password',
  text: 'To retrieve your password follow the instructions below',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error(error);
  } else {
    console.log('Correo enviado: ' + info.response);
  }
});

