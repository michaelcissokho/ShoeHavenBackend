const db = require('../db')
const { UnauthorizedError, NotFoundError } = require('../expressError')

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

    static async allowedToChange(requestor, commentId){
        const originalCommentor = await db.query(`
        SELECT username
        FROM comments
        WHERE id = $1
        `, [commentId])

        if(requestor != originalCommentor.rows[0].username){
            throw new UnauthorizedError('You are not the original commentor')
        }else{
            return
        }
    }

    static async create(username, {postId, body}){
        const timestamp = new Date(Date.now())

        const result = await db.query(`
        INSERT INTO comments
        (username,
        postId,
        body,
        timeCommented)
        VALUES ($1, $2, $3, $4)
        RETURNING *`, [username, postId, body, timestamp])

        const comment = result.rows[0]

        return comment
    }

    static async delete(commentId){
        const result = await db.query(`
        DELETE FROM comments
        WHERE id = $1
        RETURNING *`, [commentId])

        return result.rows[0]
    }

    static async allFromPost(postId){
        const result = await db.query(`
        SELECT * FROM comments
        WHERE postId = $1`, [postId])

        return result.rows
    }
}

module.exports ={Comment}