"use strict"
const jsonschema = require('jsonschema');
const express = require('express');

const router = express.Router();

const { User } = require('../models/User');

const { BadRequestError } = require('../expressError')

const signupSchema = require('../schemas/userSchemas/signupSchema.json')
const authenticateSchema = require('../schemas/userSchemas/authenticateSchema.json');
const updateUserSchema = require('../schemas/userSchemas/updateUserSchema.json');
const { isLoggedIn, isAdminOrCorrectUser } = require('../middleware/auth');

router.get('/',isLoggedIn, async function (req, res, next) {
    try {
        let response = await User.test();
        return res.json(response);
    } catch (err) {
        return next(err)
    }
})

router.get('/:username',isAdminOrCorrectUser, async function (req, res, next) {
    try {
        let response = await User.find(req.params.username);
        return res.json(response);
    } catch (err) {
        return next(err)
    }
})

router.post('/signup', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, signupSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const signedUp = await User.signup(req.body)

        return res.json(signedUp)
    } catch (err) {
        return next(err)
    }
})

router.post('/login', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, authenticateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs)
        }

        const loggedIn = await User.authenticate(req.body)

        return res.json(loggedIn);
    } catch (err) {
        return next(err);
    }
})

router.patch('/:username/update', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateUserSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs)
        }
    
        const updated = await User.update(req.params.username,req.body)

        return res.json(updated)
    } catch (err) {
        return next(err)
    }
})

router.delete('/:username', isAdminOrCorrectUser, async function (req, res, next) {
    try {
            await User.remove(req.params.username)
            return res.json(`${req.params.username} has been deleted`)
    } catch (err) {
        return next(err)
    }
})
module.exports = router