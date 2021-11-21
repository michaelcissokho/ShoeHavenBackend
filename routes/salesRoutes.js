const express = require('express')
const router = express.Router()

const { Sale } = require('../models/Sale')
const { Listing } = require('../models/Listing')
const { Refund } = require('../models/Refund')
const { BadRequestError } = require('../expressError')

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
        let iDs = []
        
        for(let item of req.body.cart){
            iDs.push(item.id)
        }        
        req.body.cart.forEach((item) => {
            delete item.id;
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: req.body.cart,
            mode: 'payment',
            success_url: `http://localhost:3000/orderPlaced/{CHECKOUT_SESSION_ID}`,
            cancel_url: 'http://localhost:3000/orderCancel',
            metadata:{
                iDs:JSON.stringify(iDs)
            }
        })

        return res.json({ redirect:session.url })
    } catch (err) {
        next(err)
    }
})

router.post('/new', isLoggedIn, async function (req, res, next) {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.body.session_id)
        const listings = JSON.parse(session.metadata.iDs)        
        
        let sales = []
        for (let item of listings) {
            //check if listing exists
            await Listing.find(item)
            const response = await Sale.create(item, req.user.username, session.payment_intent, false)
            sales.push(response)
            await Listing.markSold(item)
        }
        
        return res.json({sales})
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
        const sale = await Sale.find(req.params.saleId)        
        await Listing.return(sale.listing)
        const response = await Sale.return(req.params.saleId)
        await Refund.create(response.fromstripe, response.internal.id)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})
module.exports = router