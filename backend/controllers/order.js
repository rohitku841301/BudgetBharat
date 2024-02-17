require("dotenv").config();

const Order = require("../models/order");
const Razorpay = require("razorpay");

exports.getPremium = async (req, res, next) => {

  const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const amount = 100; 
  const currency = "INR";
  instance.orders.create({ amount, currency }, async (err, order) => {
    if (err) {
      res.status(500).json({
        reponseMessage: "Something went wrong",
      });
    }
    console.log("Razorpay Order:", order);
    const orderData = await Order.create({
      orderId: order.id,
      status: "PENDING",
      userId: req.user,
    });
    if (orderData) {
      res.status(201).json({
        orderId: order.id,
        key_id: process.env.KEY_ID,
      });
    }
  });
};

exports.updateTransaction = async (req, res, next) => {
  try {
    const updateStatus = await Order.update(
      { status: "SUCCESS", paymentId: req.body.payment_id },
      { where: { orderId: req.body.orderId } }
    );
    if (updateStatus[0] > 0) {
      res.status(200).json({
        responseMessage: "update successfully",
      });
    } else {
      res.status(500).json({
        responseMessage: "something went wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "something went wrong",
    });
  }
};
