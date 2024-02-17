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
          "qwerty",
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
      throw error; // You might want to handle or log the error accordingly
    }
  };

  module.exports = generateToken;
  