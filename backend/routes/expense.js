const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense')
const middlewear = require('../middlewear/auth');


router.post('/add-Expense', middlewear.authentication, expenseController.addExpense);
router.get("/get-Expense/:currentPage", middlewear.authentication, expenseController.getExpense)
router.delete("/delete-Expense/:id", middlewear.authentication, expenseController.deleteExpense)

router.get('/premium/leaderboard', middlewear.authentication, expenseController.showLeaderboard);
router.get("/premium/monthly-Expense", middlewear.authentication, expenseController.monthlyExpense);

module.exports = router;