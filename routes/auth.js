const router = require('express').Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config')
const User = require('../models/User');


//register a user
router.post('/register', async function (req, res, next) {
    try {
        const { username, email, password } = req.body

        const newUser = new User({
            username,
            email,
            password: await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        })
        const savedUser = await newUser.save()
        const newUserToken = jwt.sign({ username: savedUser.username, isAdmin: savedUser.isAdmin }, SECRET_KEY)
        return res.json({ username: savedUser.username, token: newUserToken, isAdmin: savedUser.isAdmin, id: savedUser._id })
    } catch (err) {
        return next(err)
    }
})

//login a user
router.post('/login', async function (req, res, next) {
    try {
        const { username, password } = req.body

        //see if user exists
        const user = await User.findOne({ username })
        if (!user) throw new NotFoundError(`User: ${username} Not Found`)

        //check if password matches user
        const isvalid = await bcrypt.compare(password, user.password)
        if (isvalid) {
            const loggedInToken = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, SECRET_KEY)
            return res.json({ username: user.username, isAdmin: user.isAdmin, id: user._id, token: loggedInToken })
        } else {
            throw new BadRequestError(`Invalid Password`)
        }
    } catch (err) {
        return next(err);
    }
})

module.exports = router