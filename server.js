'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const dbConnect = require('./config/database.js');
const {Server} = require('socket.io');
const {createServer} = require('node:http');
const server = createServer(app);
const io = new Server(server);
const passport = require('passport');
const localStrategy = require('./auth/localStrategy.js');
const googleStrategy = require('./auth/googleStrategy.js');
const gitHubStrategy = require('./auth/githubStrategy.js');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const port = process.env.PORT;

//Express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // "true" is used for Https protocol
}));

//Passport 
app.use(passport.initialize());
app.use(passport.session());

// Socket config 
io.on('connection', (socket) =>{
  console.log('a user has connected');
  // Manejar eventos específicos para este socket
  socket.on('chat message', (message) => {
    console.log(`Message from ${socket.id}: ${message}`);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('chat message', message);
  });
  // Manejar eventos de desconexión
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Static Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Morgan Logger
app.use(logger('dev'));

//Pug config
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Db connect
dbConnect();

//Auth Strategies 
localStrategy()
googleStrategy()
gitHubStrategy()

// Routes
app.use('/',userRoutes);
app.use('/',authRoutes)


// Err Handler
app.use((err, req, res, next)=> {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});

// Listener
server.listen(port ,(req,res)=> {
  console.log(`El servidor está escuchando en el puerto ${port}...`)
});

