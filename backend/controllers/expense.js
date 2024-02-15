const Expense = require("../models/expense");

exports.addExpense = async (req, res, next) => {
  try {
    const responseData = await Expense.create(req.body);
    if (responseData) {
      expenseData = {
        id: responseData.id,
        amount: JSON.parse(responseData.amount),
        description: responseData.description,
        category: responseData.category,
      };
      return res.status(201).json({
        responseMessage: "Successfully Created",
        responseData: expenseData,
      });
    } else {
      return res.status(500).json({
        responseMessage: "Something Went Wrong",
        error: error,
      });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const expenseData = await Expense.findAll();
    if (expenseData) {
      const allExpenseData = expenseData.map((expenseData) => ({
        id: expenseData.id,
        amount: expenseData.amount,
        description: expenseData.description,
        category: expenseData.category,
      }));
      return res.status(200).json({
        responseMessage: "Get All Data",
        responseData: allExpenseData,
      });
    } else {
      return res.status(500).json({
        responseMessage: "Something Went Wrong",
        error: error,
      });
    }
    console.log(allExpenseData);
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedExpenseData = await Expense.destroy({
      where: {
        id: id
      }
    });
    if (deletedExpenseData > 0) {
      return res.status(200).json({ responseMessage: "Expense deleted successfully", deletedExpenseData:deletedExpenseData });
    } else {
      return res.status(500).json({ responseMessage: "Something Went Wrong" });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};
