<<<<<<< HEAD
'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const dbConnect = require('./config/database.js');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const server = createServer(app);
const helmet = require('helmet');
const io = new Server(server);
const passport = require('passport');
const localStrategy = require('./auth/localStrategy.js');
const googleStrategy = require('./auth/googleStrategy.js');
const gitHubStrategy = require('./auth/githubStrategy.js');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const port = process.env.PORT;

// X-XSS Protection
app.use((req, res, next) => {
  res.header('X-XSS-Protection', '1; mode=block');
  next();//cha
});

// Helmet Security 
app.disable('x-powered-by')
app.use(
  helmet({
    xPoweredBy: false,
    xFrameOptions: { action: "deny" },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://cdn.socket.io"],
      },
    },
    nosniff: true, // Config "nosniff"
    strictTransportSecurity: false, // HSTS disabled only for work with localhost
    xDnsPrefetchControl: { allow: false } // Disabled DNS prefetching
  })
);


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
io.on('connection', (socket) => {
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
app.use('/', userRoutes);
app.use('/', authRoutes)


// Err Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).send('Page not found');
});

// Listener
server.listen(port, (req, res) => {
  console.log(`Server is listening on port : ${port}...`)
});

=======
'use strict';
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const logger = require('morgan');
const dbConnect = require('./config/database.js');
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const server = createServer(app);
const helmet = require('helmet');
const io = new Server(server);
const passport = require('passport');
const localStrategy = require('./auth/localStrategy.js');
const googleStrategy = require('./auth/googleStrategy.js');
const gitHubStrategy = require('./auth/githubStrategy.js');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const port = process.env.PORT;

// X-XSS Protection
app.use((_req, res, next) => {
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Helmet Security 
app.disable('x-powered-by')
app.use(
  helmet({
    xPoweredBy: false,
    xFrameOptions: { action: "deny" },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "https://cdn.socket.io"],
      },
    },
    nosniff: true, // Config "nosniff"
    strictTransportSecurity: false, // HSTS disabled only for work with localhost
    xDnsPrefetchControl: { allow: false } // Disabled DNS prefetching
  })
);


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
io.on('connection', (socket) => {
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

// Mo;rgan Logger
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
app.use('/', userRoutes);
app.use('/', authRoutes)


// Err Handler
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Not found handler
app.use((_req, res, _next) => {
  res.status(404).send('Page not found');
});

// Listener
server.listen(port, (req, res) => {
  console.log(`Server is listening on port : ${port}...`)
});

>>>>>>> master
