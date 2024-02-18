const sequelize = require("../database/db");
const Expense = require("../models/expense");
const User = require("../models/user");

exports.addExpense = async (req, res, next) => {
  try {
    console.log("djs");
    const responseData = await Expense.create({
      ...req.body,
      userId: req.existingUser.id,
    });
    console.log("skjbj");
    const totalAmount = await Expense.sum('amount', {
      where: { userId: req.existingUser.id }
    });

    await User.update({ totalAmount:totalAmount }, { where: { id: req.existingUser.id } });
    console.log(responseData);
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
    const expenseData = await Expense.findAll({
      where: { userId: req.existingUser.id },
    });
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
        id: id,
      },
    });
    if (deletedExpenseData > 0) {
      return res
        .status(200)
        .json({
          responseMessage: "Expense deleted successfully",
          deletedExpenseData: deletedExpenseData,
        });
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

exports.showLeaderboard = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: ["id","name","totalAmount"],
      order: [["totalAmount", "DESC"]]
    })
    // const result = await User.findAll({
    //   attributes: [
    //     "id",
    //     "name",
    //     [sequelize.fn("sum", sequelize.col("Expenses.amount")), "total_amount"],
    //   ],
    //   include: [
    //     {
    //       model: Expense,
    //       attributes: [],
    //       where: sequelize.literal("`User`.`id` = `Expenses`.`userId`"),
    //       required: false,
    //     },
    //   ],
    //   group: ["User.id"],
    //   having: sequelize.literal("`total_amount` > 0"),
    // });
    console.log(result);
    if (result) {
      res.status(200).json({
        responseMessage: "get all data",
        responseData: result,
      });
    }else{
      res.status(500).json({
        responseMessage: "something went wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal Server Error",
    });
  }
};
