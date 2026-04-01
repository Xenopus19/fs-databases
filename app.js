const express = require('express')
const blogsRouter  = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const testRouter = require('./controllers/test')
const app = express()
app.use(express.json())

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log("Error handler: ")
  console.log(error)

  if (error.name === 'SequelizeValidationError') {
    if(error.errors[0].message === 'Validation isEmail on username failed') {
      return response.status(400).send({ error: 'Username must be a valid email address.'})
    }
    else if(error.errors[0].message === 'users.username cannot be null') {
      return response.status(400).send({ error: 'Username is absent.'})
    }
    else{
      return response.status(400).send({ error: 'Some values are malformatted or missing.'})
    }
  }
  else if (error.name === 'SequelizeUniqueConstraintError') {
    if(error.errors[0].message === 'username must be unique') {
      return response.status(400).send({ error: 'This username is already taken.'})
    }
    else{
      return response.status(400).send({ error: 'Some values are already taken.'})
    }
  } 
  else if(error.name === 'BlogNotFound'){
    return response.status(400).send({ error: 'Requested blog does not exist.'})
  }

  next(error)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/', testRouter)

app.use(errorHandler)

module.exports = app