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