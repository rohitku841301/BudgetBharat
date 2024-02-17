const express = require("express");
const router = express();
const orderRouter = require("../controllers/order");
const middlewear = require('../middlewear/auth');


router.get('/buy-premium', middlewear.authentication, orderRouter.getPremium);
router.post('/buy-premium/update-transaction', middlewear.authentication, orderRouter.updateTransaction);

module.exports = router;