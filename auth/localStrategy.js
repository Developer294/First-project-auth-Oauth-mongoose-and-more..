const passport = require('./serializers');
const LocalStrategy = require('passport-local').Strategy;
const {User} = require('../models/usermodels');
const bcrypt = require('bcrypt');

function localStrategy(){ 
  passport.use('local', new LocalStrategy(async(username, password, done) => {
  try {
    console.log('Attempting local authentication for username:', username)
    const user = await User.findOne({username: username }).exec();
    if (!user) {
      console.log('User not found:', username);
      return done(null, false, {message:'Invalid credentials'});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Incorrect password for user:', username);
      return done(null, false,{message:'Invalid credentials'});
    }

    console.log('User authenticated successfully:', username);
    return done(null, user);
  } catch (err) {
    console.error('An error was occurred with the local-strategy', err);
    done(err, null,{error:'Internal server error'});
  }
}));
}

module.exports = localStrategy;