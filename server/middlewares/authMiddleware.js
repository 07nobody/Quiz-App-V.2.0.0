const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    
    // Set userId in multiple places to ensure consistency
    req.body.userId = userId;
    req.userId = userId; // Also set directly on the request object
    
    next();
  } catch (error) {
    res.status(401).send({
      message: "You are not authenticated",
      data: error,
      success: false,
    });
  }
};

const validateAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    if (user.isAdmin) {
      next();
    } else {
      return res.status(403).send({
        message: "You are not authorized to perform this action",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
};

module.exports = authMiddleware;
module.exports.validateAdmin = validateAdmin;
