const passport = require('./serializers');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {GoogleUser} = require('../models/usermodels');
require('dotenv').config();

function googleStrategy(){
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
))};

module.exports = googleStrategy;
