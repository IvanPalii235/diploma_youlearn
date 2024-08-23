const {
  userRegistration,
  userLogIn,
  userLogOut,
  getUser,
  getUsers,
  updateUser,
  getUserPayments,
  getUserComments,
  getUserRatings,
} = require("../controllers/user-controller");

const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post("/user", userRegistration);
  fastify.post("/user/login", userLogIn);
  fastify.delete("/user/logout", userLogOut);
  fastify.get(
    "/user/profile",
    { preValidation: authRole(["USER", "ADMIN"]) },
    getUser
  );
  fastify.get("/user/users", { preValidation: authRole(["ADMIN"]) }, getUsers);
  fastify.put(
    "/user/update",
    { preValidation: authRole(["USER", "ADMIN"]) },
    updateUser
  );
  fastify.get(
    "/user/payments",
    { preValidation: authRole(["USER"]) },
    getUserPayments
  );

  fastify.get(
    "/user/comments",
    { preValidation: authRole(["USER"]) },
    getUserComments
  );
  fastify.get(
    "/user/ratings",
    { preValidation: authRole(["USER"]) },
    getUserRatings
  );

  done();
};
