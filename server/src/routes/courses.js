const {
  createCourse,
  getCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  activateCourse,
  deactivateCourse,
  enrollInCourse,
  checkEnrollment,
  getUserEnrolledCourses,
  leaveCourse,
} = require("../controllers/course-controller");
const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/course",
    {
      preValidation: authRole("TEACHER"),
    },
    createCourse
  );

  fastify.get("/course/:courseId", getCourse);
  fastify.get("/course", getCourses);
  fastify.delete(
    "/course/:id",
    { preValidation: authRole("TEACHER") },
    deleteCourse
  );
  fastify.put(
    "/course/:id",
    {
      preValidation: authRole("TEACHER"),
    },
    updateCourse
  );
  fastify.put(
    "/course/:id/activate",
    { preValidation: authRole("TEACHER") },
    activateCourse
  );

  fastify.put(
    "/course/:id/deactivate",
    { preValidation: authRole("TEACHER") },
    deactivateCourse
  );

  fastify.get(
    "/course/:courseId/enrollment",
    { preValidation: [authRole("USER")] },
    checkEnrollment
  );
  fastify.post(
    "/course/:courseId/enroll",
    { preValidation: [authRole("USER")] },
    enrollInCourse
  );
  fastify.post(
    "/course/:courseId/leave",
    { preValidation: [authRole("USER")] },
    leaveCourse
  );
  fastify.get(
    "/course/enrolled",
    { preValidation: [authRole("USER")] },
    getUserEnrolledCourses
  );
  done();
};
