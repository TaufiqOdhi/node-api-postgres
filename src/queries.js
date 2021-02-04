const Pool = require('pg').Pool
const crypto = require('crypto')
const jwtModule = require('./jwtModule')
const pool = new Pool({
  user: 'root',
  host: 'localhost',
  database: 'api',
  password: 'root',
  port: 5432,
})

const getUsers = (request, response) => {
    console.log(request.query.id)
    if(request.query.id){
        getUserByEmail(request, response)
    }else{
        pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).json(results.rows)
        })
    }
  }

const getUserByEmail = (request, response) => {
    const email = request.query.email

    pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results)
    })
}

const createUser = (request, response) => {
    // let salt = crypto.randomBytes(16).toString('base64');
    // let hash = crypto.createHmac('sha512',salt).update(request.body.password).digest("base64");
    // request.body.password = salt + "$" + hash;
    const { username, email, jenis_kelamin, password } = request.body
  
    pool.query('INSERT INTO users (username, email, jenis_kelamin, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, jenis_kelamin, password], (error, results) => {
      if (error) {
        throw error
      }
      const token = jwtModule.generateAccessToken([request.body])
      console.log(request.body)
      console.log(token)
      response.status(200).json({
        info: `User added with ID: ${results.rows[0].id}`,
        tokenJwt: token
      })
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.query.id)
    const { name, email, jenis_kelamin } = request.body
  
    pool.query(
      'UPDATE users SET username = $1, email = $2, jenis_kelamin = $3 WHERE id = $4',
      [name, email, jenis_kelamin, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.query.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser,
    pool,
}