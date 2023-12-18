'use strict';
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const dbConnect = require('./dbconnect.js');
const {User,GithubUser} = require('./schema.js');
const auth = require('./auth.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const {router} = require('./routes.js');
const debug = require('debug')('debug:server');
require('dotenv').config();
const port = process.env.PORT;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // "true" is used for Https protocol
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


dbConnect();
app.use('/',router)
auth(User,GithubUser);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((err, req, res, next)=> {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});

app.listen(port ,(req,res)=> {
  debug(`El servidor está escuchando en el puerto ${port}...`)
});

