//ExpressError class allows us to add status code unlike the basic Error class
class ExpressError extends Error{
    constructor(message, status){
        super(),
        this.message = message,
        this.status = status
    }
}

// 400 bad request error
class BadRequestError extends ExpressError{
    constructor(message="Bad Request"){
        super(message, 400)
    }
}

//404 not found error
class NotFoundError extends ExpressError{
    constructor(message="User Not Found"){
        super(message, 404)
    }
}

class UnauthorizedError extends ExpressError{
    constructor(message="Unauthorized Request"){
        super(message, 401)
    }
}

module.exports = {BadRequestError, NotFoundError, UnauthorizedError}