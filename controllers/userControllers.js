const bcrypt = require('bcrypt');
const {User} = require('../models/usermodels');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const homePage = (_req, res) => {
  res.render('index.pug');
};

const userpage = (req, res) => {
  const username = req.query.username;
  if (req.isAuthenticated()) {
    return res.status(200).render('userpage.pug',{username:username});
  } else {
    return res.status(404).json({ not_found: 'You have to be authenticated' });
  }
}
/*

*/

const retrieveLocalPw = async (req,res) => {
  try{
  const userEmail = await User.findOne({email: req.body.email}).exec()

  if(!userEmail){
    res.status(401).json({message: 'Invalid credentials'})
  }
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [userEmail.email],
    subject: "Retrieve your password",
    html: `<strong>For retrieve your password click on the link below</strong><a href="http://localhost:3000/retrievepw/confirm?email=${userEmail.email}>Click here</a>`
  });

  if (error) {
    return res.status(400).json({ error });
  }

  res.status(200).json({ data });
}
catch(err){
  console.error('Error retrieving user local password',err)
}
};

const retrievePwConfirm = (req,res) => {
  res.status(200).render('retrievepw.pug',{email : req.query.email});
}

const retrieveAndUpdatePw = async(req,res) => {
  try {
  if (req.body.newPassword !== req.body.confirmNewPassword){
    return res.status(401).json({message : 'Inputs are not equal'});
  } 
  
  const user = await User.findOne({ email: req.body.email}).exec();
  
  if(!user){
    return res.status(401).json({message:'Invalid credentials'})
  }
  
  // Hash pw
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
  // Update userPw
  const updateUser = await User.findOneAndUpdate({email:req.body.email},{$set:{ password: hashedPassword }},{new: true}).exec()

  if(!updateUser){
    throw new Error('Error mongo update query ')
  }
   
  res.status(200).json({message: 'Password updated succesfully'})
}
catch(err){
  console.error('Error on user controller named : update password local', err)
}
};

const updateLocalPw = async (req, res) => {
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
}

const deleteLocalPw = async(req, res) => {
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
}

const signUpLocal = async(req, res) => {
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
};

const userLogOut = (req, res, next) => {
  req.logout(err => {
    if (err) {
      next(err);
    }
    else {
      console.log('Sesion cerrada exitosamente');
      return res.status(200).redirect('/');
    }
  });
}

module.exports ={
  userpage,
  updateLocalPw,
  deleteLocalPw,
  signUpLocal,
  retrieveLocalPw,
  retrievePwConfirm,
  retrieveAndUpdatePw,
  userLogOut,
  homePage
}