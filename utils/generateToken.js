const jwt = require('jsonwebtoken')

module.exports = function generateToken(res, userId){
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || 'unsecured', { expiresIn: '30d'})

    res.cookie('musicapptoken', token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT !== "DEV",
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

}