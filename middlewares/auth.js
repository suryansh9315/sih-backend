const { verify_jwt } = require("../utils/jwt_helpers");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(400).json({
      status: "error",
      message: "A token is required for authentication.",
    });
  }
  try {
    const decoded = verify_jwt(token);
    req.userId = decoded.id;
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Invalid Token.",
    });
  }
  return next();
};

module.exports = { verifyToken };
