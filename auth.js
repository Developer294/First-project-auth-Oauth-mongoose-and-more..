const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

  function auth(User,GithubUser) {
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
// Deserialización del usuario
  passport.deserializeUser(async(id, done) => {
    try {
      const user = await User.findById(id).exec();
      if (user) {
        return done(null, user);
      } else {
        const Github = await GithubUser.findById(id).exec()
        if(Github){
         return done(null,Github)
        }
        else{
        console.log('GitHub deserialization : User not found');
        return done(new Error('Usuario no encontrado'),null);
        }
      }
    } catch(err) {
      console.error('Error durante la deserialización:', err);
      return done(err);
    }
  });

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
  
  passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID_GITHUB,
    clientSecret: process.env.CLIENT_SECRET_GITHUB,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
   try{
   const user = await GithubUser.findOne({ githubId: profile.id })
   if (user){
    return cb(null,user);
   }
   else{
   const newUser = new GithubUser({
    githubId : profile.id,
    username : profile.username,
    date: new Date()
   })
   await newUser.save()
   return cb(null,newUser)
  }
}
  catch(err){
    console.log('An error was occurred with github auth', err)
    return cb(err,null)
  }
  }
));
};

module.exports = auth;
