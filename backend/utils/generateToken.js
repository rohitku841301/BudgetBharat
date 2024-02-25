require("dotenv").config();
const jwt = require("jsonwebtoken");


const generateToken = async (id, email, isPremium) => {
    try {
      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          {
            id: id,
            email: email,
            isPremium: isPremium,
          },
          process.env.JWT_SIGNATURE,
          (err, token) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          }
        );
      });
  
      console.log("Token generated:", token);
      return token;
    } catch (error) {
      console.error("Error generating token:", error);
      throw error; 
    }
  };

  module.exports = generateToken;
  