const path = require("node:path");
require("dotenv").config();

const fastify = require("fastify")({
  logger: require("pino")({
    transport: {
      target: "pino-pretty",
    },
  }),
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET,
});

fastify.register(require("@fastify/cookie"), {
  secret: process.env.COOKIES_SECRET,
});

fastify.register(require('@fastify/multipart'), {
  attachFieldsToBody: true,
});

fastify.register(require("@fastify/cors"), {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

fastify.register(require("./routes/courses"));
fastify.register(require("./routes/user"));
fastify.register(require("./routes/teacher"));
fastify.register(require("./routes/lesson"));
fastify.register(require("./routes/comment"));
fastify.register(require("./routes/rating"));
fastify.register(require("./routes/checkout"));
fastify.register(require("./routes/auth"));
fastify.register(require("./routes/statistics"));

fastify.listen({ port: process.env.PORT || 4000 }, async (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on ${address}`);
});

module.exports = fastify;
