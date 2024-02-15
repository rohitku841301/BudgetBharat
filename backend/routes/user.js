const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

router.post('/signup', userController.signupPost);
router.post('/signin', userController.signinPost);


module.exports = router