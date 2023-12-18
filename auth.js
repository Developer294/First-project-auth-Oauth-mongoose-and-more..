const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

  function auth(User,GithubUser) {
  passport.serializeUser((user, done) => {
    console.log('Serialize User:', user._id);
    done(null, user._id);
  });
// Deserialización del usuario
  passport.deserializeUser(async(id, done) => {
    console.log('Deserialize User ID:', id);
    try {
      const user = await User.findById(id).exec();
      if (user) {
        console.log('Deserializacion exitosa');
        return done(null, user);
      } else {
        const Github = await GithubUser.findById(id).exec()
        if(Github){
         console.log('Deserializacion usuario github exitosa');
         return done(null,Github)
        }
        else{
        console.log('Usuario no encontrado en la deserialización');
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
        return done(null, false, {message:'Invalid user or password'});
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        console.log('Incorrect password for user:', username);
        return done(null, false,{message:'Invalid user or password'});
      }
  
      console.log('User authenticated successfully:', username);
      return done(null, user);
    } catch (err) {
      console.error('Error user authentication local strategy', err);
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
