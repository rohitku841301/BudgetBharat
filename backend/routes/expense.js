const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense')
const middlewear = require('../middlewear/auth');


router.post('/add-Expense', middlewear.authentication, expenseController.addExpense);
router.get("/get-Expense", middlewear.authentication, expenseController.getExpense)
router.delete("/delete-Expense/:id", expenseController.deleteExpense)

router.get('/premium/leaderboard', expenseController.showLeaderboard);

module.exports = router;