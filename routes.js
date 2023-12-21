const passport = require('passport');
const { User } = require('./schema');
const bcrypt = require('bcrypt');
const router = require('express').Router();

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
}), (req, res) => {
  res.status(200).redirect('/login/userpage?username=' + req.user.username);
});

router.get('/login/userpage', (req, res) => {
  const username = req.query.username;
  if (req.isAuthenticated()) {
    return res.status(200).render('userpage.pug',{username:username});
  } else {
    return res.status(404).json({ not_found: 'You have to be authenticated' });
  }
});

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    return res.status(200).redirect('/login/userpage?username=' + req.user.username);
  });

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) =>{
    // Successful authentication, redirect home.
    res.status(200).redirect('/login/userpage?username=' + req.user.username)
  });

//Update password
router.put('/login/userpage/updatepw', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) return res.status(404).json({ error: 'Profile not found' });

    const oldPasswordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
    if (!oldPasswordMatch) return res.status(401).json({ error: 'Invalid credentials' });

    if (req.body.oldPassword === req.body.newPassword) {
      return res.status(409).json({ error: 'Passwords are equal' });
    }
   // Validar la longitud de la nueva contraseña aquí si es necesario
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await User.findOneAndUpdate(
      { email: req.body.email },
      { $set: { password: newPassword } },
      { new: true }
    ).exec();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error during password update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Users
router.delete('/login/userpage/delete', async(req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) return res.status(404).json({ message: 'Invalid username or password' });
    // Check hashed password
    const hashPassword = await bcrypt.compare(req.body.password, user.password);
    if (!hashPassword) return res.status(404).json({ message: 'Invalid password' });
    // Delete document
    await User.findByIdAndDelete({ _id: user._id }).exec();
    res.status(200).json({ message: 'User deleted successfully' });
  }
  catch(err) {
    res.status(500).json({ error: 'Internal server error' });
    console.error('Error deleting user', err);
  }
});

router.post('/signup', async(req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (user) {
      return res.status(409).json({ error: 'The username already exists' });
    }
    const email = await User.findOne({email: req.body.email}).exec()
    if (email){
      return res.status(409).json({error:'The email already exists in our database'})
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email
    });
    await newUser.save();
    res.status(200).json({ message: 'User registered succesfully, login to continue' });
  }
  catch (error) {
    console.error('A new user attempted to log in, and an error occurred', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/login/userpage/logout', (req, res, next) => {
  req.logout(err => {
    if (err) {
      next(err);
    }
    else {
      console.log('Sesion cerrada exitosamente');
      return res.status(200).redirect('/');
    }
  });
});

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = { router };
