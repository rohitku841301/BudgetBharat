const jwt = require('jsonwebtoken');

exports.authentication = async(req,res,next)=>{
    console.log("sdkjn");
    const token = req.headers.authorization;
    console.log(token);
    jwt.verify(token, "qwerty", (err,decode)=>{
        if(err){
            res.status(401).json({
                responseMessage: "token verification failed"
            })
        }else{
            console.log(decode);
            console.log("pass");
            req.existingUser = decode;
            req.user = decode.id;
            next();
        }
    })
    
}
