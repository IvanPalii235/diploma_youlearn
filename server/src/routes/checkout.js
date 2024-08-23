const { handlePayment } = require("../controllers/checkout-controller");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/payment",
    { preValidation: [authRole("USER")] },
    handlePayment
  );

  done();
};
