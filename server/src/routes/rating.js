const {
  createRating,
  getRating,
  updateRating,
  deleteRating,
} = require("../controllers/rating-controller");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/courses/:courseId/ratings",
    { preValidation: [authRole("USER")] },
    createRating
  );
  fastify.get("/courses/:courseId/ratings", getRating);
  fastify.put(
    "/user/ratings/:id",
    { preValidation: [authRole("USER")] },
    updateRating
  );
  fastify.delete(
    "/user/ratings/:id",
    { preValidation: [authRole("USER")] },
    deleteRating
  );
  done();
};
