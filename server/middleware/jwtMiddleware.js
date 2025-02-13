const jwt = require('jsonwebtoken')
const dotenv = require("dotenv");

dotenv.config(); 

const jwtMiddleware = async(req, res, next) => {
    console.log("inside jwt middleware");
    const token = req.headers['authorization'].split(' ')[1];
    console.log(token);
    try{
        const jwtResponse = await jwt.verify(token,process.env.SECRET_KEY)
        console.log('===jwt response===');
        console.log(jwtResponse);
        req.payload = jwtResponse.userId
        next();
    }catch(err){
        res.status(401).json("Authorization failed, Please Login")
    }
    
}
module.exports = jwtMiddleware;