const express = require('express')
const router = express.Router()
const Order = require('../models/Order')
const { isLoggedIn, isAdmin, isAdminOrCorrectUser } = require('../middleware')

//create an order
router.post('/', isLoggedIn, async function (req, res, next) {
    try {
        const order = new Order(req.body)
        const newOrder = await order.save()

        return res.json(newOrder)
    } catch (err) {
        next(err)
    }
})

//get single order 
router.get('/find/:id', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const order = await Order.findById(req.params.id)

        return res.json(order)
    } catch (err) {
        next(err)
    }
})

//get orders from a single user
router.get('/users/:id', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const order = await Order.find({userId: req.params.id})

        return res.json(order)
    } catch (err) {
        next(err)
    }
})

//refund an order
router.post('/return/:id', isAdminOrCorrectUser, async function (req, res, next) {
    console.log(req.body)
    try {
        const returned = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new:true}
        )
        return res.json(returned)
    } catch (err) {
        next(err)
    }
})


//get all orders
router.get('/', isLoggedIn, async function (req, res, next) {
    try {
        const orders = await Order.find()

        return res.json(orders)
    } catch (err) {
        next(err)
    }
})
module.exports = router