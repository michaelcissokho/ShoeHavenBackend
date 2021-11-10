const db = require('../db')
const { BadRequestError, NotFoundError } = require('../expressError')

class Sale{
    static async test(){
        const result = await db.query(`SELECT * FROM sales`)

        return result.rows
    }

    static async create({listingId, seller, buyer, returned}){
        const alreadySold = await db.query(`
        SELECT returned
        FROM sales
        WHERE listing = $1`, [listingId])

        if(alreadySold.rows[0] === false) throw new BadRequestError(`Item Already Sold: ${listingId}`)

        const result = await db.query(`
        INSERT INTO sales
        (listing,
        seller,
        buyer,
        returned)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [listingId, seller, buyer, returned])

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

    static async findAllSold(username){
        const result = await db.query(`
        SELECT *
        FROM sales
        WHERE seller = $1`, [username])

        const sales = result.rows[0]

        if(sales){
            return sales
        }else{
            return "No Sales Yet!"
        }
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

    static async allowedToReturn(saleId, requestor){
        const result = await db.query(`
        SELECT buyer
        FROM sales
        WHERE id=$1`,[saleId])

        const buyer = result.rows[0]['buyer']

        if(buyer !== requestor){
            throw new BadRequestError('You Are Not The Buyer Of This Item')
        }else{
            return
        }
    }

    static async return(saleId){
        const result = await db.query(`
        SELECT returned
        FROM sales
        WHERE id=$1`, [saleId])

        if(result.rows[0] === true){
            throw new BadRequestError('Item Already Returned')
        }else{
            const markReturned = await db.query(`
            UPDATE sales
            SET returned = $1
            WHERE id = $2
            RETURNING id,listing`, [true, saleId])

            return markReturned.rows[0]
        }
    }
}

module.exports = {Sale}