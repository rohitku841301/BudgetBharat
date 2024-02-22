require("dotenv").config();

const sequelize = require("../database/db");
const Expense = require("../models/expense");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");

exports.addExpense = async (req, res, next) => {
  console.log(req.existingUser);
  let t;
  try {
    t = await sequelize.transaction();
    console.log("djs");
    const responseData = await Expense.create(
      {
        ...req.body,
        userId: req.existingUser.id,
      },
      { transaction: t }
    );
    console.log("skjbj");
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
    console.log(result);
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

async function uploadToS3(filename, data) {
  try {
    console.log("skdjn");
    const BUCKET_NAME = "budgetbharat";
    const ACCESS_KEY = process.env.ACCESS_KEY;
    const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

    const s3bucket = new AWS.S3({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_ACCESS_KEY,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };

    const s3response = await s3bucket.upload(params).promise();

    console.log(s3response.Location);
    return s3response.Location;
  } catch (error) {
    console.log("sdkjns");
    throw error; 
  }
}

exports.downloadFile = async (req, res, next) => {
  try {
    const expenseData = await Expense.findAll({
      where: { userId: req.existingUser.id },
    });

    const data = JSON.stringify(expenseData);
    const filename = `expenseUser${req.existingUser.id}/${new Date()}.txt`;
    const fileURL = await uploadToS3(filename, data);

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
