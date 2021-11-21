const db = require('../db')

class Refund{
    static async test(){
        const result = await db.query(`SELECT * FROM refunds`)

        return result.rows
    }

    static async create(stripe_refund_id,saleId){
        const result = await db.query(`
        INSERT INTO refunds
        (stripe_refund_id,
        sale)
        VALUES($1,$2)`,[stripe_refund_id, saleId])

        return result.rows[0]
    }

}

module.exports = {Refund}