const db = require('../db')
const { UnauthorizedError, NotFoundError } = require('../expressError')
const axios = require('axios')

class Listing{

    static async allListings(){
        const result = await db.query(`
        SELECT * FROM listings
        WHERE sold = $1`, [false])

        return result.rows
    }

    static async markSold(id){
        const result = await db.query(`
        UPDATE listings
        SET sold = $1
        WHERE id =$2
        RETURNING *`, [true, id])

        return result.rows[0]
    }

    static async find(listingId){
        const result = await db.query(`
        SELECT * FROM listings
        WHERE id = $1`, [listingId])

        if(result.rows){
            return result.rows[0]
        }else{
            throw new NotFoundError('Listing Not Found')
        }
    }

    static async allowedToChange(requestor, listingId){
        const originalLister = await db.query(`
        SELECT username
        FROM listings
        WHERE id = $1
        `, [listingId])

        if(requestor != originalLister.rows[0].username){
            throw new UnauthorizedError('You are not the original lister')
        }else{
            return
        }
    }

    static async create(username,{title, picture, price, details, sold}){
        const result = await db.query(`
        INSERT INTO listings
        (username, title, picture, price, details, sold)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`, [username, title, picture, price, details, sold])

        return result.rows[0]
    }

    static async remove(id){
        let listingId = parseInt(id)
        const result = await db.query(`
        DELETE FROM listings
        WHERE id = $1
        RETURNING id`, [listingId])

        return result.rows[0]
        
    }
}

module.exports = {Listing}