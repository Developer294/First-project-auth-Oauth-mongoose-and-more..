const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const debug = require('debug')('debug:auth');
require('dotenv').config();

  function auth(User,GithubUser) {
  passport.serializeUser((user, done) => {
    debug('Serialize User:', user._id);
    done(null, user._id);
    return;
  });
// Deserialización del usuario
  passport.deserializeUser(async(id, done) => {
    debug('Deserialize User ID:', id);
    try {
      // Use await to wait for the query to execute and get the user object
      const user = await User.findById(id).exec();
      if (user) {
        debug('Deserializacion exitosa');
        done(null, user);
        return;
      } else {
        const Github = await GithubUser.findById(id).exec()
        if(Github){
          debug('Deserializacion usuario github exitosa');
          done(null,Github)
          return;
        }
        else{
        debug('Usuario no encontrado en la deserialización');
        done(new Error('Usuario no encontrado'));
        return;
        }
      }
    } catch(err) {
      console.error('Error durante la deserialización:', err);
      done(err);
      return;
    }
  });

  passport.use('local', new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    console.log('Attempting local authentication for username:', username);
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        debug('User not found:', username);
        req.flash('error', 'Invalid user or password');
        return done(null, false);
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        debug('Incorrect password for user:', username);
        req.flash('error', 'Invalid user or password');
        return done(null, false);
      }
  
      debug('User authenticated successfully:', username);
      return done(null, user);
    } catch (err) {
      console.error('Error user authentication local strategy', err);
      req.flash('error', 'An error occurred during authentication');
      return done(err, null);
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
    cb(null,user);
    return;
   }
   else{
   const newUser = new GithubUser({
    githubId : profile.id
   })
   await newUser.save()
   cb(null,newUser)
   return;
  }
}
  catch(err){
    debug('Hubo un error al autenticar con gitHub', err)
    cb(err,null)
    return;
  }
  }
));
};

module.exports = auth;
