const localStrategy = require('./localStrategy.js');
const githubStrategy = require('./githubStrategy.js');
const googleStrategy = require('./googleStrategy.js');

function configurePassport(User, GithubUser, GoogleUser) {
  localStrategy(User);
  githubStrategy(GithubUser);
  googleStrategy(GoogleUser);
}

module.exports = configurePassport;