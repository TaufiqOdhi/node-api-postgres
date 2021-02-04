const crypto = require('crypto')
const db = require('./queries')
const jwtModule = require('./jwtModule')

// const checkPassword = (request, response) => {
//     let passwordFields = request.query.password.split('$')
//     console.log(passwordFields)
//     let salt = passwordFields[0];
//     let hash = crypto.createHmac('sha512', salt).update(request.query.password).digest("base64");
//     console.log(hash)
//     if (hash === passwordFields[1]) {
//         response.status(200).send('ok')
//     } else {
//         response.status(200).send('Tidak OK')
//     }
// }

const login = (request, response) => {
    // var results

    // queries.getUserByEmail(request, (results) =>(
    //     response.status(200).json(results)
    // ))
    
    // console.log(results)
    // if(results.password === request.body.password){
    //     response.status(200).send('ok')
    // } else{
    //     response.status(201).send('tidak ok')
    // }

    const email = request.query.email

    db.pool.query('SELECT * FROM users WHERE email = $1', [email], (error, results) => {
        if (error) {
          throw error
        }

        if(results.rows[0].password === request.body.password){
            const token = jwtModule.generateAccessToken([results.rows[0]])
            response.status(200).json({
                status: `success`,
                tokenJwt: token
            })        
        }else{
            response.status(200).json({
                status: `false`,
                tokenJwt: undefined
            })
        }
        // response.status(200).json(results.rows[0])
      })

}

module.exports = {
    login,
}