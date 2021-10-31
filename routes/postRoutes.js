const express = require('express')

const router = express.Router()

const jsonschema = require('jsonschema')

const { Post } = require('../models/Post')
const { Comment } = require('../models/Comment')
const { isLoggedIn, isAdminOrCorrectUser } = require('../middleware/auth')
const postSchema = require('../schemas/postSchemas/postSchema.json')
const { BadRequestError } = require('../expressError')

router.get('/',isLoggedIn, async function (req, res, next) {
    try {
        const response = await Post.allPosts()

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

router.get('/:postId',isLoggedIn, async function (req, res, next) {
    try {
        const response = await Post.find(req.params.postId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

router.post('/new',isLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, postSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        const response = await Post.create(req.user.username, req.body)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

router.delete('/:postId',isLoggedIn, async function (req, res, next) {
    try {
        //check if post exists
        await Post.find(req.params.postId)
        //check if requestor allowed to delete post
        await Post.allowedToChange(req.user.username, req.params.postId)

        const response = await Post.delete(req.params.postId)

        return res.json(`Post: ${response} was deleted`)

    } catch (err) {
        next(err)
    }
})

router.get('/:postId/comments', async function (req, res, next) {
    try {
        //check if post exists
        await Post.find(req.params.postId)

        const response = await Comment.allFromPost(req.params.postId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})


module.exports = router