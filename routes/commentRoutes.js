const express = require('express')

const router = express.Router()

const jsonschema = require('jsonschema')

const {Comment} = require('../models/Comment')
const { isLoggedIn } = require('../middleware/auth')
const commentSchema = require('../schemas/commentSchemas/commentSchema.json')
const { BadRequestError } = require('../expressError')

router.get('/',isLoggedIn, async function(req, res, next){
    try {
        const response = await Comment.test()

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

router.post('/new',isLoggedIn, async function(req, res, next){
    try {
        const validator = jsonschema.validate(req.body, commentSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e=> e.stack)
            throw new BadRequestError(errs)
        }
        const response = await Comment.create(req.user.username, req.body)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

router.delete('/:commentId', async function(req, res, next){
    try {
        //checking if requestor is allowed to delete this comment
        await Comment.allowedToChange(req.user.username, req.params.commentId)

        const response = await Comment.delete(req.params.commentId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})


module.exports = router