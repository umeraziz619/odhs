const jwt = require("jsonwebtoken");

require("dotenv").config();

async function auth(req, res, next) {
  let token = req.header("authorization");
  // var localStorage = new LocalStorage('./scratch');
  console.log(req.header("authorization"));
  let bearerToken;
  if (!token) return res.status(401).send("Access denied. No token provided.");
  if (token) {
    bearerToken = token.split(" ")[1];
  }
  try {
    const decoded = jwt.verify(bearerToken, "my_temporary_secret");
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
}

module.exports = auth;
