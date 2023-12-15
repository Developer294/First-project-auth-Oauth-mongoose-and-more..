const passport = require('passport');
const { User } = require('./schema');
const bcrypt = require('bcrypt');
const router = require('express').Router();

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  failureFlash: true
}), (req, res) => {
  res.redirect('/userpage');
});

router.get('/userpage', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).render('userpage.pug');
  } else {
    return res.status(404).json({ not_found: 'You have to be authenticated' });
  }
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/welcome' }),
  (req, res) => {
    return res.render('userpage.pug');
  });
// Delete Users
router.delete('/login/userpage/delete', async(req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) return res.status(404).json({ message: 'Invalid username or password' });
    // Check hashed password
    const hashPassword = bcrypt.compare(req.body.passwordToDelete, user.password);
    if (!hashPassword) return res.status(404).json({ message: 'Invalid password' });
    // Delete document
    await User.findOneAndDelete({ username: req.body.username }).exec();
    res.status(200).json({ message: 'User deleted successfully' });
  }
  catch (err) {
    res.status(500).json({ error: 'Internal server error' });
    console.error('Error deleting user', err);
  }
});

router.post('/signup', async(req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (user) {
      res.status(409).json({ error: 'The username already exists' });
      return;
    }
    const email = await User.findOne({email: req.body.email}).exec()
    if (email){
      res.status(409).json({error:'The email already exists in our database'})
      return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    });
    await newUser.save();
    res.status(200).json({ message: 'Usuario registrado exitosamente, inicia sesion para continuar' });
  }
  catch (error) {
    console.error('A new user attempted to log in, and an error occurred', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/userpage/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      next(err);
    }
    else {
      console.log('Sesion cerrada exitosamente');
      res.redirect('/');
      return;
    }
  });
});

router.get('/', (req, res) => {
  res.render('index.pug');
});

module.exports = { router };
