const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const mongo = require("mongoose");
const userModel = mongo.model("userModel");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Unauthorized Access not Allowed" });
  }
  try {
    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    const userInDb = await userModel.findById(decoded._id);
    if (!userInDb) {
      return res.status(401).json({ error: "Unauthorized Access not Allowed" });
    }
    req.user = userInDb;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized Access not Allowed" });
  }
};

module.exports = authMiddleware;
