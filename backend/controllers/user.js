const User = require("../models/user");

exports.postUserData = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ where: { email: req.body.email } });
    if (userExist) {
      res.status(401).json({
        responseMessage: "Users are all ready exist.",
      });
    } else {
      const userData = await User.create(req.body);
      if (userData) {
        res.status(201).json({
          responseMessage: "Users are created",
          userData: userData,
        });
      } else {
        res.status(401).json({
          responseMessage: "Users are not created",
        });
      }
    }

  } catch (error) {
    res.status(501).json({
      responseMessage: "Something went wrong",
      error: error,
    });
  }
};
