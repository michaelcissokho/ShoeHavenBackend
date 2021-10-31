const db = require('../db')
const { NotFoundError, UnauthorizedError } = require('../expressError')

class Post{
    static async allPosts(){
        const result = await db.query(`SELECT * FROM posts`)

        return result.rows
    }

    static async find(postId){
        const result = await db.query(`
        SELECT * FROM posts
        WHERE id = $1`, [postId])

        const post = result.rows[0]

        if(!post) throw new NotFoundError(`Post ID ${postId} Not Found`)

        return post
    }

    static async allowedToChange(requestor, postId){
        const originalPoster = await db.query(`
        SELECT username
        FROM posts
        WHERE id = $1
        `, [postId])

        if(requestor != originalPoster.rows[0].username){
            throw new UnauthorizedError('You are not the original poster')
        }else{
            return
        }
    }

    static async create(username, { title, body, picture}){
        const timestamp = new Date(Date.now())

        const result = await db.query(`
        INSERT INTO posts
        (username,
        title,
        body,
        picture,
        timePosted)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`, [username, title, body, picture, timestamp])

        const post = result.rows[0]

        return post
    }

    static async delete(postId){        
        const result = await db.query(`
        DELETE FROM posts
        WHERE id = $1
        RETURNING *`, [postId])

        return result.rows[0]
    }


}

module.exports ={Post}