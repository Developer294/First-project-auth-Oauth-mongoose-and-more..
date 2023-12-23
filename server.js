'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const {Server} = require('socket.io');
const {createServer} = require('node:http');
const server = createServer(app);
const io = new Server(server);
const dbConnect = require('./config/database.js');
const {User,GithubUser,GoogleUser} = require('./models/usermodels.js');
const auth = require('./config/passport.js');
const passport = require('passport');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js')
const port = process.env.PORT;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false } // "true" is used for Https protocol
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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

dbConnect();

app.use('/',authRoutes)
app.use('/',userRoutes);
auth(User,GithubUser,GoogleUser);

app.use((err, req, res, next)=> {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

app.use((req, res, next) => {
  res.status(404).send('Página no encontrada');
});

server.listen(port ,(req,res)=> {
  console.log(`El servidor está escuchando en el puerto ${port}...`)
});

