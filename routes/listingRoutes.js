"use strict"

const jsonschema = require('jsonschema')
const express = require('express')

const router = express.Router()
const { Listing } = require('../models/Listing')

const { BadRequestError } = require('../expressError')
const createListingSchema = require('../schemas/listingSchemas/createListingSchema.json')
const { isLoggedIn, isAdmin } = require('../middleware/auth')


router.get('/',isLoggedIn, async function (req, res, next) {
    try {
        let listings = await Listing.allListings()
        return res.json(listings)
    } catch (err) {
        next(err)
    }
})

//needs isAdmin middleware
router.post('/new',isAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, createListingSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack)
            throw new BadRequestError(errs)
        }

        let response = await Listing.create(req.body)

        return res.json(response)

    } catch (err) {
        next(err)
    }
})

router.get('/:listing',isLoggedIn, async function (req, res, next) {
    try {
        let response = await Listing.find(req.params.listing)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

//TODO:Needs an isAdmin middleware
router.delete('/:listingId',isAdmin, async function (req, res, next) {
    try {
        //check if listing exists
        await Listing.find(req.params.listingId)

        let response = await Listing.remove(req.params.listingId)

        return res.json(response)
    } catch (err) {
        next(err)
    }
})

module.exports = router