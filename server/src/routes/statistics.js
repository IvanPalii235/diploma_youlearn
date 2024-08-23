const { getStatistics } = require("../controllers/statistics-controller");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.get(
    "/teacher/statistics",
    { preValidation: [authRole("TEACHER")] },
    getStatistics
  );
  done();
};
