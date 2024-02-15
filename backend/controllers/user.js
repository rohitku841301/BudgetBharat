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

exports.signinPost = async(req,res,next)=>{
  console.log(req.body);
}
