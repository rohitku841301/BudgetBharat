require("dotenv").config();
const { Op } = require('sequelize');
const sequelize = require("../database/db");
const Expense = require("../models/expense");
const User = require("../models/user");
const File = require("../models/file");
const path = require("path");
const s3 = require("../services/s3services");

exports.addExpense = async (req, res, next) => {
  // console.log(req.existingUser);
  let t;
  try {
    t = await sequelize.transaction();
    const responseData = await Expense.create(
      {
        ...req.body,
        userId: req.existingUser.id,
      },
      { transaction: t }
    );
    const totalAmount = await Expense.sum("amount", {
      where: { userId: req.existingUser.id },
      transaction: t,
    });

    await User.update(
      { totalAmount: totalAmount },
      { where: { id: req.existingUser.id }, transaction: t }
    );
    await t.commit();
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
    await t.rollback();
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.rows);
    const currentPage = parseInt(req.params.currentPage);
    console.log("arrow--", limit, currentPage);
    const count = await Expense.count({
      where: { userId: req.existingUser.id },
    });
    const totalPages = Math.ceil(count / limit);

    const offset = limit * (currentPage - 1);
    const expenses = await Expense.findAll({
      where: { userId: req.existingUser.id },
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
    });

    if (expenses) {
      const pageDetail = {
        currentPage: currentPage,
        totalPages: totalPages,
      };
      return res.status(200).json({
        success: true,
        message: "Get All Data",
        responseData: expenses,
        pageDetail: pageDetail,
      });
    } else {
      res.status(404).json({
        responseMessage: "data not found",
      });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(500).json({
      responseMessage: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.deleteExpense = async (req, res, next) => {
  let t;
  try {
    t = await sequelize.transaction();
    const id = req.params.id;
    const deletedExpenseData = await Expense.destroy({
      where: { id: id },
      transaction: t,
    });
    console.log("dnsj", deletedExpenseData);

    const totalAmount = await Expense.sum("amount", {
      where: { userId: req.existingUser.id },
      transaction: t,
    });

    await User.update(
      { totalAmount: totalAmount },
      { where: { id: req.existingUser.id }, transaction: t }
    );
    await t.commit();
    if (deletedExpenseData > 0) {
      return res.status(200).json({
        responseMessage: "Expense deleted successfully",
        deletedExpenseData: deletedExpenseData,
      });
    } else {
      return res.status(500).json({ responseMessage: "Something Went Wrong" });
    }
  } catch (error) {
    if (t) await t.rollback();
    console.error("Error:", error);
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};

exports.showLeaderboard = async (req, res, next) => {
  try {
    const result = await User.findAll({
      attributes: ["id", "name", "totalAmount"],
      order: [["totalAmount", "DESC"]],
      limit: 5,
    });
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
    // console.log(result);
    if (result) {
      res.status(200).json({
        responseMessage: "get all data",
        responseData: result,
      });
    } else {
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

exports.monthlyExpense = async (req, res, next) => {
  try {
    console.log("aaraha hai");
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    // Fetch total amount per category for the entire month
    const totalAmountPerCategory = await Expense.findAll({
      where: {
        userId: 2,
        createdAt: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "expenseDate"],
        "category",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmount"],
      ],
      group: ["expenseDate", "category"],
    });

    // Fetch total amount per day for the entire month
    const totalAmountPerDay = await Expense.findAll({
      where: {
        userId: 2,
        createdAt: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth],
        },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "expenseDate"],
        [sequelize.fn("SUM", sequelize.col("amount")), "totalAmountPerDay"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
    });

    // Calculate overall total money spent in the month
    const overallTotalAmount = totalAmountPerDay.reduce(
      (total, day) => total + day.totalAmountPerDay,
      0
    );

    const chartData = {
      totalAmountPerCategory,
      totalAmountPerDay,
      overallTotalAmount,
    };
    // console.log(expenseData);
    res.status(200).json({
      responseMessage: "Get all data",
      success: true,
      responseData: chartData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.downloadFile = async (req, res, next) => {
  try {
    const expenseData = await Expense.findAll({
      where: { userId: req.existingUser.id },
    });

    const data = JSON.stringify(expenseData);
    const filename = `expenseUser${req.existingUser.id}/${new Date()}.txt`;
    const fileURL = await s3.uploadToS3(filename, data);
    await File.create({
      fileURL: fileURL,
      userId: req.existingUser.id,
    });
    console.log(fileURL);
    return res.status(200).json({
      responseMessage: "true",
      fileURL: fileURL,
    });
  } catch (error) {
    console.log("sdkj");
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
    });
  }
};

exports.showDownloadedFile = async (req,res,next) =>{
  try {
    console.log(req.existingUser);
    console.log("sdsdsdfsfsfd");
    const allFile = await File.findAll({
      where:{userId:req.existingUser.id}
    })
    console.log(allFile);
    if(allFile){
      res.status(200).json({
        responseMessage:"get all file",
        success:true,
        allFile:allFile
      })
    }else{
      res.status(404).json({
        responseMessage:"files are not found",
        success:false
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
    });
  }
}
