const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;

const authenticateToken = (request, response) => {
  // Gather the jwt access token from the request header
  const authHeader = request.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return response.sendStatus(401) // if there isn't any token

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err){
      console.log(err)
      return response.sendStatus(403)
    } 
    request.user = user
    console.log(request.user)
    response.status(200).json(request.user)
  })
}

// username is in the form { username: "my cool username" }
// ^^the above object structure is completely arbitrary
const generateAccessToken = (jsonData) => {
  return jwt.sign(jsonData[0], process.env.TOKEN_SECRET, { expiresIn: '24h' });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
}