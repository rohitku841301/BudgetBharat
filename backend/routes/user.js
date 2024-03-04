const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')
const middlewear = require('../middlewear/auth');
const expenseController = require('../controllers/expense')


console.log("sdjhb");
router.post('/signup', userController.signupPost);
router.post('/signin', userController.signinPost);
router.post('/password/forget-password', userController.forgetPassword);
// router.get('/password/reset-password', userController.getResetPassword);
router.post('/password/reset-password/:uuid', userController.postResetPassword);

router.get('/downloadFile', middlewear.authentication, expenseController.downloadFile)
router.get('/showDownloadedFile', middlewear.authentication, expenseController.showDownloadedFile)


module.exports = router