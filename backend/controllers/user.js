const User = require("../models/user");

exports.signupPost = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    console.log(userExist);
    if (userExist) {
      res.status(409).json({
        responseMessage: "Email Already Exist",
      });
    } else {
      const userData = await User.create(req.body);
      if (userData) {
        res.status(201).json({
          responseMessage: "Users are created",
          userData: userData,
        });
      } else {
        res.status(500).json({
          responseMessage: "Something went wrong",
        });
      }
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
    console.log(emailExist);
    if(emailExist){
      if(emailExist.password === req.body.password){
        console.log("Password correct");
        return res.status(200).json({
          responseMessage: "Login Successful",
          userData: emailExist
        })
      }else{
        return res.status(401).json({
          responseMessage: "Password Incorrect"
        })
      }
    }else{
      return res.status(404).json({
        responseMessage: "Email Not Exist"
      })
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
      error: error,
    });
  }
};
