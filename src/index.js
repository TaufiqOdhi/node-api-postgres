const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const jwtModule = require('./jwtModule')
const loginModule = require('./loginModule')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/getProfil', jwtModule.authenticateToken)
app.get('/login', loginModule.login)
// app.get('/getUsers', db)
app.post('/createUser', db.createUser)
// app.put('/users', db.updateUser)
// app.delete('/users', db.deleteUser)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})