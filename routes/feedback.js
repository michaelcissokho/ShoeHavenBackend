const express = require('express')
const router = express.Router()
const Feedback = require('../models/Feedback')
const { isLoggedIn, isAdmin } = require('../middleware')

router.get('/',isAdmin, async function(req, res, next){
    try {
        const comments = await Feedback.find()

        return res.json(comments)
    } catch (err) {
        next(err)
    }
})

router.post('/',isLoggedIn, async function(req, res, next){
    try {
        const comment = new Feedback(req.body)
        const newComment = await comment.save()

        return res.json(newComment)
    } catch (err) {
        next(err)
    }
})

module.exports = router