"use strict"
const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const { NotFoundError } = require('../expressError')
const { isAdmin, isLoggedIn } = require('../middleware')

//create a cart
router.post('/', async function (req, res, next) {
    try {
        const cart = new Cart(req.body)
        const newCart = await cart.save()

        return res.json(newCart)
    } catch (err) {
        next(err)
    }
})

//get single user cart
// router.get('/:userId', isLoggedIn, async function (req, res, next) {
//     try {
//         const cart = await Cart.findOne({userId:req.params.userId})
//         if(!cart) throw new NotFoundError(`Cart for ${req.params.userId} not found`)

//         return res.json(cart)
//     } catch (err) {
//         next(err)
//     }
// })

//get single user cart
router.get('/:id', isLoggedIn, async function (req, res, next) {
    try {
        const cart = await Cart.findOne({_id:req.params.id})
        if(!cart) throw new NotFoundError(`Cart${req.params.id} not found`)

        return res.json(cart)
    } catch (err) {
        next(err)
    }
})

//get all carts
router.get('/',isAdmin, async function (req, res, next) {
    try {
        const carts = await Cart.find()

        return res.json(carts)
    } catch (err) {
        next(err)
    }
})

//update a cart
router.put('/:id', isLoggedIn, async (req,res,next) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        )

        return res.json(updatedCart)
    } catch (err) {
        next(err)
    }
})

//delete a cart
router.delete('/:id',isLoggedIn, async function (req, res, next) {
    try {
        await Cart.findByIdAndDelete(req.params.id)

        return res.json(`Cart: ${req.params.id} has been deleted`)
    } catch (err) {
        next(err)
    }
})

module.exports = router