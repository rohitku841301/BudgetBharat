require("dotenv").config();
const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {
    console.log("sdjbn");
    const tokenHeader = req.headers.authorization;
    console.log(tokenHeader);
    jwt.verify(tokenHeader, process.env.JWT_SIGNATURE, (err, decode) => {
        if (err) {
            res.status(401).json({
                responseMessage: "Token verification failed"
            });
        } else {
            console.log(decode);
            req.existingUser = decode;
            req.user = decode.id;
            next();
        }
    });
};
