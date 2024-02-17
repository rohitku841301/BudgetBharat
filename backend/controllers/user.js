const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwtToken = require('../utils/generateToken')


exports.signupPost = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    console.log(userExist);
    if (userExist) {
      res.status(409).json({
        responseMessage: "Email Already Exist",
      });
    } else {
      bcrypt.hash(req.body.password, 5, async (err, hash) => {
        try {
          console.log(hash);
          const userData = await User.create({
            ...req.body,
            password: hash,
            isPremium: false,
          });
          if (userData) {
            res.status(201).json({
              responseMessage: "Users are created",
              userData: userData,
            });
            console.log("sdj");
          } else {
            res.status(500).json({
              responseMessage: "Something went wrong",
            });
          }
        } catch (error) {
          res.status(500).json({
            responseMessage: "Something went wrong",
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Something went wrong",
      error: error,
    });
  }
};

exports.signinPost = async (req, res, next) => {
  try {
    const emailExist = await User.findOne({ where: { email: req.body.email } });
    // console.log(emailExist);
    if (emailExist) {
      bcrypt.compare(
        req.body.password,
        emailExist.password,
        async (err, result) => {
          if (err) {
            return res.status(500).json({
              responseMessage: "Something Went Wrong",
              error: err,
            });
          } else {
            console.log(result);
            if (result) {
              const token = await jwtToken(emailExist.id, emailExist.email, emailExist.isPremium);
              return res.status(200).json({
                responseMessage: "Login Successful",
                token: token,
              });
            } else {
              return res.status(401).json({
                responseMessage: "Password Incorrect",
              });
            }
          }
        }
      );
    } else {
      return res.status(404).json({
        responseMessage: "Email Not Exist",
      });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};
