const jwt = require("jsonwebtoken");

const authRole = (allowedRoles) => {
  return async (req, reply) => {
    try {
      // Check if Authorization header exists and is formatted correctly
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer ")
      ) {
        return reply.code(401).send("Token not found");
      }

      const token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return reply.code(401).send("Token not found");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!allowedRoles.includes(decoded.data.role)) {
        return reply.code(403).send("Insufficient permissions");
      }

      req.user = decoded.data;
    } catch (err) {
      console.error("JWT verification error:", err);
      return reply.code(401).send("Unauthorized");
    }
  };
};

module.exports = { authRole };
