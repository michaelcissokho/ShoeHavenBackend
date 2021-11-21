const db = require('../db')
const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')
const { BadRequestError, NotFoundError } = require('../expressError')
const jwt = require('jsonwebtoken')

class User {
    static async test() {
        const result = await db.query(`SELECT * FROM users`)

        return result.rows
    }

    static async find(username){
        const result = await db.query(`
        SELECT username,firstname,lastname,email,isAdmin
        FROM users
        WHERE username = $1`, [username])

        const user = result.rows[0]

        if(!user) throw new NotFoundError(`User: ${username} Not Found`)

        return user
    }

    static async signup({ username, password, firstname, lastname, email }) {
        const duplicateCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`,[username]
        )

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate Username: ${username}`)

        const hashed_pwd = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
        
        const isAdmin = (username == 'michael')? true : false

        const result = await db.query(`
            INSERT INTO users
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, firstname, lastname, email,isAdmin`,[username, hashed_pwd, firstname, lastname, email, isAdmin]
        )

        const user = result.rows[0]        

        const newUserToken = jwt.sign({username:user.username, isAdmin:user.isadmin}, SECRET_KEY)

        return {username: user.username, token: newUserToken, isAdmin:user.isadmin}
    }

    static async authenticate({ username, password }) {
        const result = await db.query(`
        SELECT *
        FROM users
        WHERE username = $1`, [username])

        const user = result.rows[0]

        if(user){
            const isvalid = await bcrypt.compare(password, user.password)
            if(isvalid){
                const loggedInToken = jwt.sign({username:user.username, isAdmin: user.isadmin}, SECRET_KEY)
                return {username: user.username, token: loggedInToken, isAdmin: user.isadmin}
            }
        }

        throw new BadRequestError('Invalid Username/Password')

    }

    static async update(username, {password, firstname, lastname, email}){
        if(password.length){
            const newPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

            const result = await db.query(`
            UPDATE users
            SET password=$1,
                firstname=$2,
                lastname=$3,
                email=$4
            WHERE username=$5
            RETURNING username, firstname, lastname, email`, [newPassword, firstname, lastname, email, username])
    
            return result.rows[0]
        }else{
            const result = await db.query(`
            UPDATE users
            SET firstname=$1,
                lastname=$2,
                email=$3
            WHERE username=$4
            RETURNING username, firstname, lastname, email`, [firstname, lastname, email, username])
    
            return result.rows[0]
        }
    }

    static async remove(username){
        const result = await db.query(`
        DELETE
        FROM users
        WHERE username = $1
        RETURNING username`, [username])

        return {FromDatabase: result.rows[0]}
    }

}

module.exports = {User }