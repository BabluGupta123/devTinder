const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Login Please!");
    }

    const decoded = jwt.verify(token, process.env.secretKey);

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).send("Invalid Token!");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Auth Error: " + err.message);
  }
};

module.exports = { userAuth };
