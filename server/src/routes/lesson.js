const {
  createLesson,
  getLesson,
  getCourseLessons,
  deleteLesson,
  updateLesson,
  updateTask,
  deleteTask,
  getTextTask,
  getTestTask,
  getVideoTask,
  checkTestAnswer,
} = require("../controllers/lesson-controller");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  // Create a lesson
  fastify.post(
    "/course/:courseId/lesson",
    { preValidation: [authRole("TEACHER")] },
    createLesson
  );

  // Get a specific lesson
  fastify.get("/lesson/:lessonId", getLesson);

  // Delete a lesson
  fastify.delete(
    "/lesson/:lessonId",
    { preValidation: [authRole("TEACHER")] },
    deleteLesson
  );

  // Delete a specific task within a lesson
  fastify.delete(
    "/lesson/:lessonId/:contentType/:contentId",
    { preValidation: [authRole("TEACHER")] },
    deleteTask
  );

  // Get all lessons for a course
  fastify.get(
    "/courses/:courseId/lessons",
    { preValidation: [authRole("USER")] },
    getCourseLessons
  );

  // Update a lesson
  fastify.put(
    "/lesson/:lessonId",
    { preValidation: [authRole("TEACHER")] },
    updateLesson
  );

  // Update a specific task within a lesson
  fastify.put(
    "/course/:courseId/:lessonId/:contentId",
    { preValidation: [authRole("TEACHER")] },
    updateTask
  );

  // Create or update a task
  fastify.post(
    "/course/:courseId/:lessonId/:contentId",
    { preValidation: [authRole("TEACHER")] },
    updateTask 
  );

  // Get video task details
  fastify.get(
    "/lesson/:lessonId/video-task",
    { preValidation: [authRole("USER")] },
    getVideoTask
  );

  // Get test task details
  fastify.get(
    "/lesson/:lessonId/test-task",
    { preValidation: [authRole("USER")] },
    getTestTask
  );

  // Get text task details
  fastify.get(
    "/lesson/:lessonId/text-task",
    { preValidation: [authRole("USER")] },
    getTextTask
  );

  fastify.post(
    "/lessons/:lessonId/TEST/:taskId/check",
    { preValidation: [authRole("USER")] },
    checkTestAnswer
  );
  done();
};
