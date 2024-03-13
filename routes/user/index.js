const express = require("express")
const User = require("../../models/user")
const generateToken = require('../../utils/generateToken')
const protect = require("../../middlewares/protect")
const userRouter = express.Router()

userRouter.post('/login', async ( req, res ) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({$or: [{username}, {email: username}] })
                
        if( user && (await user.matchPasswords( password ))) {
            // login the user
            generateToken(res,user._id)
	    const { password, ...userWithoutPassword } = user.toObject();
            res.json(userWithoutPassword)
        }else {
        	res.json({error: true, message: "Invalid username or password"})
	}
    }catch ( e ) {
        res.send("error occured "+ e.message)
    }
})
userRouter.post('/signup', async( req, res ) => {
    const {username, email, password, firstName, lastName}  = req.body;
    const user = new User({username, email, password, firstName, lastName})
    try {

        const isInvalid = await user.validate()
        if( isInvalid ){
            throw new Error("Invalid form submitted")
        }
        const createUser = await user.save()
        
        res.json({message: "user created successfully"})
    }catch ( e ) {
        res.send(e)
    }
})

userRouter.post('/logout',protect, async ( req, res ) => {
    res.clearCookie('musicapptoken');
    res.json({message: 'logedout successfully'})
})
userRouter.post('/get',protect, async ( req, res ) => {
    res.json(req.user)
})

module.exports = userRouter