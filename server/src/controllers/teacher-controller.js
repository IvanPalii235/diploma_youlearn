const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { jwtSign } = require("../utils/jwt");

const teacherRegistration = async (req, reply) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      role,
      description,
    } = req.body;

    const existedTeacher = await prisma.teacher.findUnique({
      where: {
        email,
      },
    });
    const existedUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existedTeacher) {
      return reply.send(
        "Teacher with this email already exists. Use another email!"
      );
    }
    if (existedUser) {
      return reply.send(
        "User with this email already exicts! Please, use different email from user's one!"
      );
    }

    if (password !== confirmPassword) {
      return reply
        .status(401)
        .send("Password are different! Please try again!");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newTeacher = await prisma.teacher.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        description,
      },
    });

    return reply.send(newTeacher);
  } catch (err) {
    console.log(err);
    reply.status(401).send("Some error with registration! Try again!");
  }
};

const teacherLogIn = async (req, reply) => {
  try {
    const { email, password } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { email },
    });

    if (!teacher) {
      return reply.status(401).send("Invalid email or password! Try again!");
    }

    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      return reply.status(401).send("Invalid email or password! Try again!");
    }

    const token = await reply.jwtSign(
      {
        data: {
          teacherId: teacher.id,
          teacherName: teacher.firstName,
          teacherLName: teacher.lastName,
          role: teacher.role,
        },
      },
      { expiresIn: "12h" }
    );
    reply.setCookie("token", token, { path: "/", httpOnly: true });

    return reply.send({ token, teacher });
  } catch (error) {
    console.error("Teacher login error:", error);
    return reply.status(500).send("Internal server error");
  }
};

const teacherLogOut = async (req, reply) => {
  reply.clearCookie("token");

  return reply.send({ message: "Logout successful" });
};

const getTeacher = async (req, reply) => {
  try {
    const teacherId = req.params.id;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return reply.send("No teacher found!");
    }

    return reply.send(teacher);
  } catch (err) {
    return reply.send(err);
  }
};

const getTeachers = async (req, reply) => {
  const teachers = await prisma.teacher.findMany();
  console.log(req.user);
  return reply.send(teachers);
};

const updateTeacher = async (req, reply) => {
  try {
    const { email, firstName, lastName, description } = req.body;

    const teacherId = req.params.id;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId,
      },
    });

    if (!teacher) {
      return reply.send("No teacher found!");
    }

    const updatedTeacher = await prisma.teacher.update({
      where: {
        id: teacherId,
      },
      data: { email, firstName, lastName, description },
    });

    return reply.send(updatedTeacher);
  } catch (err) {
    return reply.send(err);
  }
};

const getTeacherCourses = async (req, reply) => {
  try {
    const { teacherId } = req.user;

    const courses = await prisma.course.findMany({
      where: { teacherId },
    });

    return reply.send(courses);
  } catch (err) {
    console.error("Error fetching teacher courses:", err);
    return reply.status(500).send(err);
  }
};

module.exports = {
  teacherRegistration,
  teacherLogIn,
  teacherLogOut,
  getTeacher,
  getTeachers,
  updateTeacher,
  getTeacherCourses,
};
