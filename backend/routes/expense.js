const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/expense')


router.post('/add-Expense', expenseController.addExpense);
router.get("/get-Expense", expenseController.getExpense)
router.delete("/delete-Expense/:id", expenseController.deleteExpense)

module.exports = router;