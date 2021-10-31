"use strict"

const express = require('express')

const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const listingRoutes = require('./routes/listingRoutes')
const salesRoutes = require('./routes/salesRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')

const { authenticateJWT } = require('./middleware/auth')

const app = express()

//cors used to enable cross origin requests which allows to build app with front end locally making calls to local backend
app.use(cors())
//built in body parser for express that recognizes incoming request data as json (needed for POST and PUT not GET/DELETE requests)
app.use(express.json())

app.use(authenticateJWT)
app.use('/users', userRoutes)
app.use('/listings', listingRoutes)
app.use('/sales', salesRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)


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