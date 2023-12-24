const passport = require('passport');

//Local Auth controller
const loginUser = (req, res) => {
  passport.authenticate('local', { failureRedirect: '/'})
  (req, res, () => {
    res.status(200).redirect('/login/userpage?username=' + req.user.username);
  });
};

//Git Hub OAuth controller
const loginGitHub = (req,res) => {
  passport.authenticate('github', { failureRedirect: '/' })
  (req, res, () => {
    res.status(200).redirect('/login/userpage?username=' + req.user.username);
  });
};

//Google OAuth controller
const loginGoogle = (req,res) => { 
  passport.authenticate('google', { failureRedirect: '/' })
  (req, res, () =>{
    // Successful authentication, redirect home.
    res.status(200).redirect('/login/userpage?username=' + req.user.username)
  })
};

module.exports = {
  loginUser,
  loginGitHub,
  loginGoogle
};




