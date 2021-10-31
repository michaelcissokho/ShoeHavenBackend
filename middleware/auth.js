const jwt = require('jsonwebtoken')

const { SECRET_KEY } = require('../config')
const { BadRequestError } = require('../expressError');

function authenticateJWT(req, res, next) {
    try {
        const tokenFromHeader = req.headers && req.headers.authorization;
        if(tokenFromHeader){
            const token = tokenFromHeader.split(" ")[1]
            req.user = jwt.verify(token, SECRET_KEY)
        }
        return next()
    } catch (err) {
        return next()
    }
}

function isLoggedIn(req, res, next) {
    if (!req.user) {
        return next(new BadRequestError('Please Log In'))
    } else {
        return next()
    }
}

function isAdminOrCorrectUser(req,res,next){
    if(req.user.username === req.params.username || req.user.isAdmin){
        return next()
    }else{
        return next(new BadRequestError('Unauthorized Access'))
    }
}


module.exports = { authenticateJWT, isLoggedIn, isAdminOrCorrectUser }