"use strict"
const express = require('express')
const router = express.Router()
const Product = require('../models/Product')
const { NotFoundError } = require('../expressError')
const { isAdmin } = require('../middleware')

//get all products
router.get('/', async function (req, res, next) {
    try {
        const qNew = req.query.new;
        const qCategory = req.query.category;

        let products

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(1)
        }else if(qCategory){
            products = await Product.find({
                categories:{
                    $in:[qCategory]
                }
            })
        }else{
            products = await Product.find()
        }

        return res.json(products)
    } catch (err) {
        next(err)
    }
})

//create a product
router.post('/',isAdmin, async function (req, res, next) {
    try {
        const product = new Product(req.body)
        const newProduct = await product.save()

        return res.json(newProduct)
    } catch (err) {
        next(err)
    }
})

//update a product
router.put('/:id', isAdmin, async (req,res,next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            {new: true}
        )

        return res.json(updatedProduct)
    } catch (err) {
        next(err)
    }
})

//get single product
router.get('/:id', async function (req, res, next) {
    try {
        const foundProduct = await Product.findById(req.params.id)
        if(!foundProduct) throw new NotFoundError(`Product: ${req.params.id} not found`)

        return res.json(foundProduct)
    } catch (err) {
        next(err)
    }
})

//delete a product
router.delete('/:id',isAdmin, async function (req, res, next) {
    try {
        await Product.findByIdAndDelete(req.params.id)

        return res.json(`Product: ${req.params.id} has been deleted`)
    } catch (err) {
        next(err)
    }
})

module.exports = router