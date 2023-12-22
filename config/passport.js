const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

  function auth(User,GithubUser,GoogleUser) {
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
   if (user) return cb(null,user);
   
   const newUser = new GithubUser({
    githubId : profile.id,
    username : profile.username,
    date: new Date()
   })
   await newUser.save()
   return cb(null,newUser)
  }
  catch(err){
    console.log('An error was occurred on gitHub Oauth', err)
    return cb(err,null)
  }
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
async function(accessToken, refreshToken, profile, cb) {
  try{
    const user = await GoogleUser.findOne({googleId: profile.id}).exec()
    if(user) return cb(null,user)

    const newUser = new GoogleUser({
      googleId: profile.id,
      username: profile.displayName
    });
    await newUser.save()
    return cb(null,newUser)
  }
  catch(err){
    console.error('An error was occurred on google Oauth',err)
    return(err,null)
}
  }
));
};

module.exports = auth;
