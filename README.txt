Comparacion controladores

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
}), (req, res) => {
  res.status(200).redirect('/login/userpage?username=' + req.user.username); 
});