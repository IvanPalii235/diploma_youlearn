const { validateToken } = require("../controllers/auth-controller");

module.exports = function (fastify, opts, done) {
  fastify.get("/auth/verify-token", validateToken);
  done();
};
