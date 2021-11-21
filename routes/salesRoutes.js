const express = require('express')
const router = express.Router()

const { Sale } = require('../Old-Files/Sale')
const { Listing } = require('../Old-Files/Listing')
const { Refund } = require('../models/Refund')
const { isLoggedIn, isAdmin } = require('../middleware/auth')

const stripeSecretTestKey = process.env.STRIPE_SECRET_TEST_KEY
const stripe = require('stripe')(stripeSecretTestKey)

router.get('/', isLoggedIn, async function (req, res, next) {

    try {
        const response = await Sale.test()

        return res.json(response)

    } catch (err) {
        next(err)
    }
})

router.post('/checkout', isLoggedIn, async function (req, res, next) {
    try {
        const fullcart = req.body.items

        req.body.items.forEach((item) => {
            delete item.id;
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.items,
            mode: 'payment',
            success_url: `/orderPlaced`,
            cancel_url: '/orderCancel'
        })

        res.redirect(303, session.url)

        return res.json({ fullcart, payment_intent: session.payment_intent })
    } catch (err) {
        next(err)
    }
})

router.post('/new', isLoggedIn, async function (req, res, next) {
    try {
        let salescreated = []

        for (let item of req.body.successfulcart.items) {
            //check if listing exists
            await Listing.find(item.id)
            const response = await Sale.create(item.id, req.user.username, req.body.successfulcart.payment_intent, false)
            salesCreated.push(response)
            await Listing.markSold(item.id)
        }

        return res.json(salescreated)
    } catch (err) {
        next(err)
    }
})

router.get('/:saleId', isAdmin, async function (req, res, next) {
    try {
        const response = await Sale.find(req.params.saleId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

//need to ensure this is the buyer
router.post('/return/:saleId', isLoggedIn, async function (req, res, next) {
    try {
        const ogListing = await Listing.return(req.params.saleId)
        const response = await Sale.return(req.params.saleId, ogListing.price)
        await Refund.create(response.internal.id, response.fromstripe)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})
module.exports = router