const {
  teacherRegistration,
  teacherLogIn,
  teacherLogOut,
  getTeacher,
  getTeachers,
  updateTeacher,
  getTeacherCourses,
} = require("../controllers/teacher-controller");

const { authRole } = require("../middleware/authMiddleware");

module.exports = function (fastify, opts, done) {
  fastify.post("/teacher", teacherRegistration);
  fastify.post("/teacher/login", teacherLogIn);
  fastify.delete(
    "/teacher/logout",
    { preValidation: authRole(["TEACHER"]) },
    teacherLogOut
  );
  fastify.get(
    "/teacher/:id",
    { preValidation: authRole(["TEACHER", "ADMIN"]) },
    getTeacher
  );
  fastify.get(
    "/teacher/teachers",
    { preValidation: authRole(["ADMIN"]) },
    getTeachers
  );
  fastify.put(
    "/teacher/:id",
    { preValidation: authRole(["TEACHER", "ADMIN"]) },
    updateTeacher
  );
  fastify.get(
    "/teacher/courses",
    { preValidation: authRole(["TEACHER"]) },
    getTeacherCourses
  );

  done();
};
