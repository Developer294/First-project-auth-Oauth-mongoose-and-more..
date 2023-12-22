const passport = require('passport');
// Login local user
const loginUser = (req, res) => {
  passport.authenticate('local', {
    failureRedirect: '/',
  })(req, res, () => {
    res.status(200).redirect('/login/userpage?username=' + req.user.username);
  });
};


module.exports = {
  loginUser,
};




