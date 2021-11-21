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