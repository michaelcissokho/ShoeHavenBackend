//loads .env contents into process.env
require("dotenv").config()

const PORT = +process.env.PORT || 5000

function getDatabaseLink() {
    return (process.env.NODE_ENV === 'test') ? "test_shoe_haven" : process.env.DATABASE_URL || "shoe_haven"
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12

const SECRET_KEY = process.env.SECRET_KEY || "HAVE A NICE DAY"

module.exports = { PORT, getDatabaseLink, BCRYPT_WORK_FACTOR, SECRET_KEY }