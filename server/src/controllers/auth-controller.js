const jwt = require("jsonwebtoken");

const validateToken = (req, reply) => {
  try {
    // Check if Authorization header exists and is formatted correctly
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")
    ) {
      return reply
        .status(401)
        .send({ valid: false, message: "Token not found or malformed" });
    }

    const token = req.headers.authorization.split(" ")[1];

    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return reply
          .status(401)
          .send({ valid: false, message: "Token invalid or expired" });
      }

      // Token is valid, extract user information
      const { userId, firstName, lastName, role } = decoded.data;

      return reply.send({
        valid: true,
        user: { userId, firstName, lastName, role },
      });
    });
  } catch (error) {
    console.error("Error validating token:", error);
    reply.status(500).send({ valid: false, message: "Internal server error" });
  }
};

module.exports = { validateToken };
