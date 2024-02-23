const jwt = require('jsonwebtoken');

exports.authentication = async (req, res, next) => {
    console.log("sdkjn");
    const tokenHeader = req.headers.authorization;
    
    jwt.verify(tokenHeader, "qwerty", (err, decode) => {
        if (err) {
            console.log("failed");
            res.status(401).json({
                responseMessage: "Token verification failed"
            });
        } else {
            console.log(decode);
            console.log("pass");
            req.existingUser = decode;
            req.user = decode.id;
            next();
        }
    });
};
