const {
  createComment,
  getComments, 
  updateComment,
  deleteComment,
} = require("../controllers/comment-course");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/course/:courseId/comment",
    { preValidation: [authRole("USER")] },
    createComment
  );

  fastify.get("/course/:courseId/comments", getComments); 

  fastify.put(
    "/course/comment/:id",
    { preValidation: [authRole("USER")] },
    updateComment
  );

  fastify.delete(
    "/course/comment/:id",
    { preValidation: [authRole("USER")] },
    deleteComment
  );

  done();
};
