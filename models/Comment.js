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