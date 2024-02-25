require("dotenv").config();

const User = require("../models/user");
const jwtToken = require("../utils/generateToken");
const Order = require("../models/order");
const razorPay = require("../services/razorpayService");

exports.getPremium = async (req, res, next) => {
  console.log("sdj", req.existingUser);
  await razorPay.razorPayServices(req, res, next);
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const updateStatus = Order.update(
      { status: "SUCCESS", paymentId: req.body.payment_id },
      { where: { orderId: req.body.orderId } }
    );
    const userData = User.update(
      { isPremium: true },
      { where: { id: req.user } }
    );
    const token = jwtToken(req.existingUser.id, req.existingUser.email, true);
    Promise.all([updateStatus, userData, token]).then((results) => {
      const [updateStatusResult, userDataResult, tokenResult] = results;
      if (updateStatusResult[0] > 0) {
        return res.status(200).json({
          responseMessage: "update successfully",
          token: tokenResult,
        });
      } else {
        return res.status(500).json({
          responseMessage: "something went wrong",
        });
      }
    })
    .catch(err=>{
      console.log(err);
    })
  } catch (error) {
    res.status(500).json({
      responseMessage: "something went wrong",
    });
  }
};
