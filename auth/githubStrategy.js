const passport = require('./serializers');
const GitHubStrategy = require('passport-github').Strategy;
const {GithubUser} = require('../models/usermodels');
require('dotenv').config();

function gitHubStrategy(){
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
))};

module.exports = gitHubStrategy;