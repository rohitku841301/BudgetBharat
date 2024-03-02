const nodemailer = require("nodemailer");
require("dotenv").config();

const Sib = require("sib-api-v3-sdk");

const { v4: uuidv4 } = require("uuid");


const path = require("path");
const User = require("../models/user");
const Forget = require("../models/forget");
const bcrypt = require("bcrypt");

const jwtToken = require("../utils/generateToken");

exports.signupPost = async (req, res, next) => {
  try {
    console.log("arrow");
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
              const token = await jwtToken(
                emailExist.id,
                emailExist.email,
                emailExist.isPremium
              );
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

exports.getResetPassword = async (req, res, next) => {
  try {
    const filePath = path.join(__dirname, "../../frontend/resetPassword.html");
    res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
    });
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {

    const uuid = req.params.uuid;
  
    const user = await Forget.findOne({
      where: {
        id: uuid,
      },
    });
    if (user) {
      if (user.isActive === true) {
        const newPassword = req.body.newPassword;
        bcrypt.hash(newPassword, 5, async(err,hash)=>{
          if(err){
            res.status(500).json({
              responseMessage: "password didn't hash"
            })
          }else{
            await User.update({ password: hash }, { where: { id: user.userId } })
            await Forget.update({ isActive: false }, { where: { id: uuid } })
            res.status(200).status({
              responseMessage:"password has changed successfully"
            })
          }
        })
      } else {
        return res.status(400).json({
          responseMessage: "Reset record is not active (already used)",
        });
      }
    } else {
      return res.status(404).json({
        responseMessage: "Reset record not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
    });
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    console.log("dskjn");
    const forgetEmail = await User.findOne({
      where: { email: req.body.email },
    });
    if (forgetEmail) {
      const uuid = uuidv4();
      const url = `http://127.0.0.1:5500/frontend/resetPassword.html?uuid=${uuid}`;
      const resetData = await Forget.create({
        id: uuid,
        userId: forgetEmail.id,
        isActive: true,
      });

      if (resetData) {
        console.log(url);
        res.status(201).json({
          responseMessage: "Check your email",
          url: url,
        });
      }
    } else {
      return res.status(404).json({
        responseMessage: "Email not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      responseMessage: "Something Went Wrong",
    });
  }
};












// Sending email code

// const client = Sib.ApiClient.instance;
// const apiKey = client.authentications["api-key"];
// apiKey.apiKey = process.env.API_KEY;
// let transporter = new Sib.TransactionalEmailsApi();

// const sender = {
//   email: "rohitku841301@gmail.com",
//   name: "S***der",
// };
// const receivers = [
//   {
//     email: req.body.email,
//   },
// ];

// try {
//   let info = await transporter.sendTransacEmail({
//     sender: sender,
//     to: receivers,
//     subject: "Reset password OTP",
//     textContent: `Dear, Your OTP is: `,

//   });
//   console.log("result", info);

//   return res.status(200).json({
//     responseMessage: "email sent successfully",
//   });
// } catch (error) {
//   console.log("Error sending email:", error);

//   if (
//     error.response &&
//     error.response.body &&
//     error.response.body.code === "unauthorized"
//   ) {
//     return res.status(401).json({
//       responseMessage: "Unauthorized access to Sendinblue API",
//     });
//   }

//   return res.status(500).json({
//     responseMessage: "Error sending email",
//   });
// }
