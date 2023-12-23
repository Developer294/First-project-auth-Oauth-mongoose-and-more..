const router = require('express').Router();
const passport = require('passport');
const authControllers = require('../controllers/authControllers.js');

//Local authenticathion
router.post('/login', authControllers.loginUser)

//GitHub OAuth
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', authControllers.loginGitHub)

//Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/auth/google/callback', authControllers.loginGoogle)

module.exports = router;