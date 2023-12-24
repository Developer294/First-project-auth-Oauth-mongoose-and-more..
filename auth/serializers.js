 const passport = require('passport');
 const {User,GithubUser,GoogleUser} = require('../models/usermodels');

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
// Deserialización del usuario
  passport.deserializeUser(async(id, done) => {
    try {
      const Google = await GoogleUser.findById(id).exec()
      if(Google){
        return done(null,Google);
      }
      const user = await User.findById(id).exec();
      if (user) {
        return done(null, user);
      }
      const Github = await GithubUser.findById(id).exec()
      if(Github){
        return done(null,Github);
      }
      console.log('Deserialization : User not found');
      return done(new Error('Deserialization failed'),null);
      
    } catch(err) {
      console.error('Deserilization error', err);
      return done(err);
    }
  });


  module.exports = passport; 