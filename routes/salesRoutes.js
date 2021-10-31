const express = require('express')
const router = express.Router()

const jsonschema = require('jsonschema')

const { Sale } = require('../models/Sale')
const { Listing } = require('../models/Listing'
)
const { isLoggedIn } = require('../middleware/auth')
const saleSchema = require('../schemas/saleSchemas/saleSchema.json')
const { BadRequestError } = require('../expressError')


router.get('/', isLoggedIn, async function (req, res, next) {

    try {
        const response = await Sale.test()

        return res.json(response)

    } catch (err) {
        next(err)
    }
})

router.post('/new', isLoggedIn, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body,saleSchema)
        if(!validator.valid){
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }
        
        //check if listing exists
        await Listing.find(req.body.Listing)

        const response = await Sale.create(req.body)

        await Listing.markSold(req.body.listingId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

//may need to ensure admin or seller/buyer to view this
router.get('/:saleId', isLoggedIn, async function (req, res, next) {
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
        const response = await Sale.return(req.params.saleId)

        return response
    } catch (err) {
        next(err)
    }
})
module.exports = router