const userControllers = require('../controllers/userControllers');
const router = require('express').Router()

//Home page
router.get('/', userControllers.homePage);

// User home page
router.get('/login/userpage', userControllers.userpage);

//Update local password
router.put('/login/userpage/updatepw', userControllers.updateLocalPw);

// Delete local users
router.delete('/login/userpage/delete', userControllers.deleteLocalPw);

// Sign up local users
router.post('/signup', userControllers.signUpLocal);

// User log-out
router.get('/login/userpage/logout',userControllers.userLogOut)


module.exports = router;

