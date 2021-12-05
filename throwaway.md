remaining lines of User model register function

        const isAdmin = (username == 'michael')? true : false

        const result = await db.query(`
            INSERT INTO users
            VALUES ($1, $2, $3, $4)
            RETURNING username, email,isAdmin`,[username, hashed_pwd, email, isAdmin]
        )

remaining lines of User model find user function

        const user = result.rows[0]    

        const result = await db.query(`
        SELECT username,firstname,lastname,email,isAdmin
        FROM users
        WHERE username = $1`, [username])

        const user = result.rows[0]    


remaining lines of User model login function

        const result = await db.query(`
        SELECT *
        FROM users
        <!-- WHERE username = $1`, '[username]') -->

        const user = result.rows[0]

        if(user){
        }

        throw new BadRequestError('Invalid Username/Password')




USER MODEL:


const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')
const { BadRequestError, NotFoundError } = require('../expressError')
const MongoUser = require("../MongoSchemas/MongoUser")
const jwt = require('jsonwebtoken')

class User {
    static async test() {
        const users = await MongoUser.find()

        return users
    }

    static async find(username){
        const user = MongoUser.findOne({username})

        if(!user) throw new NotFoundError(`User: ${username} Not Found`)

        return user
    }

    static async register({ username, password, email }) {
        const newUser = new MongoUser({
            username,
            email,
            password: await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        })
        try {
            const savedUser = await newUser.save()
            const newUserToken = jwt.sign({username:savedUser.username, isAdmin:savedUser.isAdmin}, SECRET_KEY)
            return {username: savedUser.username, token: newUserToken, isAdmin:sv.isAdmin}
        } catch (err) {
            console.log(err)  
        }
    }

    static async login({ username, password }) {
        //see if user exists
        const user = await MongoUser.findOne({username})
        if(!user) throw new NotFoundError(`User: ${username} Not Found`)

        //check if password matches user
        const isvalid = await bcrypt.compare(password, user.password)
        if(isvalid){
            const loggedInToken = jwt.sign({username:user.username, isAdmin: user.isAdmin}, SECRET_KEY)
            return {username: user.username, isAdmin: user.isAdmin, token: loggedInToken}
        }else{
            throw new BadRequestError(`Invalid Password`)
        } 
    }

    static async update(username, request){
        const newUser = await MongoUser.findOneAndUpdate(
            username,
            {
               $set: request 
            },
            {new: true}
        )

        return newUser
    }

    static async remove(username){
        const deleted = await MongoUser.findOneAndDelete(username)

        return deleted
    }

}

module.exports = {User }


USER ROUTES:

"use strict"
const router = require('express').Router();
const { User } = require('../models/User');
const { Sale } = require('../models/Sale')
const { BadRequestError, NotFoundError } = require('../expressError')

const jsonschema = require('jsonschema');
const register = require('../FormSchemas/register.json')
const login = require('../FormSchemas/login.json');
const updateUser = require('../FormSchemas/updateUser.json')
const { isAdmin, isAdminOrCorrectUser } = require('../middleware/auth');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { BCRYPT_WORK_FACTOR } = require('../config')
const MongoUser = require('../MongoSchemas/MongoUser')

router.get('/', isAdmin, async function (req, res, next) {
    try {
        const users = await MongoUser.find()

        return res.json(users)
    } catch (err) {
        return next(err)
    }
})

router.get('/:username', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const user = await MongoUser.findOne({ username: req.params.username })

        if (!user) throw new NotFoundError(`User: ${req.params.username} Not Found`)

        return res.json(user)
    } catch (err) {
        return next(err)
    }
})

router.post('/register', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, register);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const { username, email, password } = req.body

        const newUser = new MongoUser({
            username,
            email,
            password: await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        })
        const savedUser = await newUser.save()
        const newUserToken = jwt.sign({ username: savedUser.username, isAdmin: savedUser.isAdmin }, SECRET_KEY)
        return res.json({ username: savedUser.username, token: newUserToken, isAdmin: savedUser.isAdmin })
    } catch (err) {
        return next(err)
    }
})

router.post('/login', async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, login);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs)
        }

        const loggedIn = await User.login(req.body)

        return res.json(loggedIn);
    } catch (err) {
        return next(err);
    }
})

router.put('/:username/update', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, updateUser)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs)
        }

        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, BCRYPT_WORK_FACTOR)
        }

        const updated = await User.update(req.params.username, req.body)

        return res.json(updated)
    } catch (err) {
        return next(err)
    }
})

router.delete('/:username', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username)
        return res.json(`${req.params.username} has been deleted`)
    } catch (err) {
        return next(err)
    }
})

router.get('/:username/purchases', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        let purchases = await Sale.findAllPurchased(req.params.username)
        return res.send(purchases)
    } catch (err) {
        return next(err)
    }
})
module.exports = router


LISTING MODEL


const db = require('../db')
const { NotFoundError } = require('../expressError')
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY)

class Listing {

    static async allListings() {
        const result = await db.query(`
        SELECT * FROM listings
        WHERE sold = $1`, [false])

        return result.rows
    }

    static async markSold(id) {
        const result = await db.query(`
        UPDATE listings
        SET sold = $1
        WHERE id =$2
        RETURNING *`, [true, id])

        return result.rows[0]
    }

    static async return(id){
        const result = await db.query(`
        UPDATE listings
        SET sold = $1
        WHERE id =$2
        RETURNING *`, [false, id])

        return result.rows[0]
    }

    static async find(listingId) {
        const result = await db.query(`
        SELECT * FROM listings
        WHERE id = $1`, [listingId])

        if (result.rows) {
            return result.rows[0]
        } else {
            throw new NotFoundError('Listing Not Found')
        }
    }

    static async create({ title, picture, price, details, sold }) {
        const stripe_product = await stripe.products.create({
            name: title
        })

        const stripe_price = await stripe.prices.create({
            unit_amount: price * 100,
            currency: 'usd',
            product: stripe_product.id
        })

        const result = await db.query(`
        INSERT INTO listings
        (title, picture, price, details, sold, stripe_product_id, stripe_price_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`, [title, picture, price, details, sold, stripe_product.id, stripe_price.id])

        return result.rows[0]
    }

    static async remove(id) {
        let listingId = parseInt(id)
        const result = await db.query(`
        DELETE FROM listings
        WHERE id = $1
        RETURNING id`, [listingId])

        return result.rows[0]

    }
}

module.exports = { Listing }



const db = require('../db')
const { BadRequestError, NotFoundError } = require('../expressError')
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY)

class Sale{
    static async test(){
        const result = await db.query(`SELECT * FROM sales`)

        return result.rows
    }

    static async create(listingId, buyer, payment_intent, returned){
        console.log('CreatingSale',listingId,buyer,payment_intent,returned);
        
        const alreadySold = await db.query(`
        SELECT id
        FROM sales
        WHERE listing = $1`, [listingId])

        if(alreadySold.rows[0]) throw new BadRequestError(`Item Already Sold: ${listingId}`)

        const result = await db.query(`
        INSERT INTO sales
        (listing,
        buyer,
        stripe_payment_intent_id,
        returned)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [listingId, buyer, payment_intent, returned])

        const transaction = result.rows[0]

        return transaction
    }

    static async find(transactionId){
        const result = await db.query(`
        SELECT *
        FROM sales
        WHERE id = $1`, [transactionId])

        const transaction = result.rows[0]

        if(transaction) return transaction

        throw new NotFoundError(`Transaction Not Found: ${transactionId}`)
    }

    static async findAllPurchased(username){
        const result = await db.query(`
        SELECT *
        FROM sales
        WHERE buyer = $1`, [username])

        const purchases = result.rows

        if(purchases){
            return purchases
        }else{
            return "No Purchases Yet!"
        }
    }

    static async return(saleId){        
        const result = await db.query(`
        SELECT returned
        FROM sales
        WHERE id=$1`, [saleId])

        if(result.rows[0] === true){
            throw BadRequestError('Item Already Returned')
        }else{
            const markReturned = await db.query(`
            UPDATE sales
            SET returned = $1
            WHERE id = $2
            RETURNING *`, [true, saleId])
            
            const stripeRefund = await stripe.refunds.create({
                payment_intent: markReturned.rows[0].stripe_payment_intent_id,
                amount: 1000,
              });


            return {internal:markReturned.rows[0], fromstripe:stripeRefund.id}
        }
    }
}

module.exports = {Sale}


COMMENT MODEL:

const db = require('../db')
const { NotFoundError } = require('../expressError')

class Comment{
    static async test(){
        const result = await db.query(`SELECT * FROM comments`)

        return result.rows
    }

    static async find(commentId){
        const result = await db.query(`
        SELECT * FROM comments
        WHERE id = $1`, [commentId])

        const comment = result.rows[0]

        if(comment){
            return comment
        }else{
            throw new NotFoundError('Comment Not Found')
        }
    }

    static async create(username, {body}){
        const timestamp = new Date(Date.now())

        const result = await db.query(`
        INSERT INTO comments
        (commentor,
        body,
        timeSubmitted)
        VALUES ($1, $2, $3)
        RETURNING *`, [username, body, timestamp])

        const comment = result.rows[0]

        return comment
    }
}

module.exports ={Comment}


//checking out items
// router.post('/checkout', isLoggedIn, async function (req, res, next) {
//     try {
//         let iDs = []

//         for (let item of req.body.cart) {
//             iDs.push(item.id)
//         }
//         req.body.cart.forEach((item) => {
//             delete item.id;
//         })

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ['card'],
//             line_items: req.body.cart,
//             mode: 'payment',
//             success_url: `http://localhost:3000/orderPlaced/{CHECKOUT_SESSION_ID}`,
//             cancel_url: 'http://localhost:3000/orderCancel',
//             metadata: {
//                 iDs: JSON.stringify(iDs)
//             }
//         })

//         return res.json({ redirect: session.url })
//     } catch (err) {
//         next(err)
//     }
// })


//get all orders from a user
router.get('/fromUser/:userId', isAdminOrCorrectUser, async function (req, res, next) {
    try {
        const orders = await Order.find({ userId: req.params.userId })

        return res.send(orders)
    } catch (err) {
        return next(err)
    }
})

//need to ensure this is the buyer
router.post('/:saleId/return', isLoggedIn, async function (req, res, next) {
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

//get income info
router.get('/income', isAdmin, async function (req, res, next) {
    try {
        const date = new Date()
        const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
        const twoMonthsAgo = new Date(new Date().setMonth(lastMonth.getMonth - 1))

        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: twoMonthsAgo } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                }
            },
            {      
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])

        return res.json(income)
    } catch (err) {
        next(err)
    }
})