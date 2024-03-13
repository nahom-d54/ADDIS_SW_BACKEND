const jwt = require('jsonwebtoken')
const User = require('../models/user')

const protect = async (req, res, next) => {
    try{
      let token;
  
      token = req.cookies.musicapptoken;
      
      if(token) {
        try {
          
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'unsecured')
                    
          req.user = await User.findOne({_id: decoded.userId}).select('-password')
          
          next()
        }catch(error) {
            console.log(error)
            res.clearCookie('musicapptoken');
            res.status(401).json({error: true, message: "User not authenticated"})
        }
      } else {
        // User is not authenticated or authorized, send an error response
        res.status(401).json({error: true, message: "User not authenticated"})
      }
    } catch( error ){
      console.log("Protect Error")
      console.log(error)
      res.send(error)
    }
  };
  
module.exports = protect;