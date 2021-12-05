"use strict"
const router = require('express').Router();
const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR } = require('../config')
const User = require('../models/User');
const { NotFoundError } = require('../expressError')
const { isAdmin, isAdminOrCorrectUser } = require('../middleware');


//get single user
router.get('/:id', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.id)        
        
        if (!user) throw new NotFoundError(`User: ${req.params.id} Not Found`)

        return res.json(user)
    } catch (err) {
        return next(err)
    }
})

//get all users
router.get('/', isAdmin, async function (req, res, next) {
    try {
        const users = await User.find()
        console.log(users);
        
        return res.json(users)
    } catch (err) {
        return next(err)
    }
})

//update a user
router.put('/:username/update', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR)
        }

        const newUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        )

        return res.json(newUser)
    } catch (err) {
        return next(err)
    }
})

//delete a user
router.delete('/:id', isAdminOrCorrectUser, async function (req, res, next) {
    try {

        await User.findByIdAndDelete(req.params.id)

        return res.json(`${req.params.id} has been deleted`)
    } catch (err) {
        return next(err)
    }
})

module.exports = router