"use strict"

const express = require('express')
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected To MongoDB!"))
.catch((err) => {console.log(err)});

const cors = require('cors')

const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const feedbackRoutes = require('./routes/feedback')
const cartRoutes = require('./routes/cart')
const stripeRoutes = require('./routes/stripe')

const { authenticateJWT } = require('./middleware')


//cors used to enable cross origin requests which allows to build app with front end locally making calls to local backend
app.use(cors())
//built in body parser for express that recognizes incoming request data as json (needed for POST and PUT not GET/DELETE requests)
app.use(express.json())

app.use(authenticateJWT)
app.use('/auth', authRoutes)
app.use('/checkout', stripeRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/carts', cartRoutes)
app.use('/orders', orderRoutes)
app.use('/feedback', feedbackRoutes)
app.use(express.static(path.join(__dirname, "/client/build")))

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'))
})


/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app