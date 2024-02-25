require("dotenv").config();
const Razorpay = require("razorpay");
const Order = require("../models/order");


exports.razorPayServices = async(req,res,next)=>{
    try {
        // console.log(req.existingUser);
        console.log("sdjhb");
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
              userId: req.existingUser.id,
            });
            if (orderData) {
              res.status(201).json({
                orderId: order.id,
                key_id: process.env.KEY_ID,
              });
            }
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            responseMessage: "something went wrong"
        })
    }
}