const path = require("path");
const prisma = require("../utils/prisma");
const { jwtVerify, jwtDecode } = require("../utils/jwt");
const fs = require("fs");
const util = require("util");
const { pipeline } = require("stream");
const pump = util.promisify(pipeline);

const createCourse = async (req, reply) => {
  try {

    const { teacherId, teacherName, teacherLName } = req.user;

    if (!teacherId) {
      return reply.status(400).send({ message: "Teacher ID is required" });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      return reply.status(404).send({ message: "Teacher not found" });
    }

    let previewImagePath = null;

    if (req.body.previewImage) {
      const data = await req.body.previewImage.toBuffer();
      const uploadPath = path.join(
        __dirname,
        "../uploads",
        req.body.previewImage.filename
      );
      await fs.promises.writeFile(uploadPath, data);
      previewImagePath = req.body.previewImage.filename;
    }

    const course = await prisma.course.create({
      data: {
        title: req.body.title.value,
        description: req.body.description.value,
        category: req.body.category.value,
        price: parseFloat(req.body.price.value),
        teacherId: teacher.id,
        teacherName,
        teacherLName,
        previewImage: previewImagePath,
      },
    });

    return reply.status(201).send(course);
  } catch (error) {
    console.error("Error creating course:", error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const getCourse = async (req, reply) => {
  try {
    const { courseId } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        Lesson: {
          include: {
            TextContent: true,
            TestContent: true,
            VideoContent: true,
          },
        },
        Comment: {
          include: {
            user: true,
          },
        },
        Rating: true,
        Enrollment: true,
        Payment: true,
        teacher: true,
      },
    });

    if (!course) {
      return reply.status(404).send("Course not found");
    }

    const averageRating =
      course.Rating.reduce((sum, rating) => sum + rating.rating, 0) /
      course.Rating.length;

    return reply.send({ ...course, averageRating });
  } catch (error) {
    console.error("Error fetching course:", error);
    return reply.status(500).send("Internal server error");
  }
};

const getCourses = async (req, reply) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
    });
    reply.send(courses);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const deleteCourse = async (req, reply) => {
  try {
    const {id} = req.params;
    console.log(id)
    if (!id) {
      return reply.status(400).send({ error: "Course ID is required!" });
    }

    const lessons = await prisma.lesson.findMany({
      where: { id },
    });

    for (const lesson of lessons) {
      await prisma.lesson.delete({
        where: { id: lesson.id },
      });
    }

    await prisma.course.delete({
      where: { id },
    });

    return reply.send({ message: `Course with ID ${id} was removed!` });
  } catch (err) {
    console.error(`Failed to delete course with id :`, err);
    return reply
      .status(500)
      .send({ error: "An error occurred while deleting the course." });
  }
};

const updateCourse = async (req, reply) => {
  try {
    const { id } = req.params;
    const { title, description, category, price } = req.body;
    const { teacherId } = req.user;
    console.log(req.body);
    
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return reply.status(404).send({ message: "Course not found" });
    }
    console.log(price);
    if (course.teacherId !== teacherId) {
      return reply
        .status(403)
        .send({ message: "You are not authorized to update this course" });
    }

    // Update the preview image if provided
    let previewImagePath = course.previewImage;

    if (req.body.previewImage) {
      const data = await req.body.previewImage.toBuffer();
      const uploadPath = path.join(
        __dirname,
        "../uploads",
        req.body.previewImage.filename
      );
      await fs.promises.writeFile(uploadPath, data);
      previewImagePath = req.body.previewImage.filename;
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: title.value,
        description: description.value,
        category: category.value,
        price: parseFloat(price.value),
        previewImage: previewImagePath,
      },
    });

    return reply.status(200).send(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return reply.status(500).send({ message: "Internal Server Error" });
  }
};

const activateCourse = async (req, reply) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.update({
      where: { id },
      data: { isPublished: true },
    });
    return reply.send(course);
  } catch (err) {
    return reply.status(500).send(err);
  }
};

const deactivateCourse = async (req, reply) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.update({
      where: { id },
      data: { isPublished: false },
    });
    return reply.send(course);
  } catch (err) {
    return reply.status(500).send(err);
  }
};

const checkEnrollment = async (req, reply) => {
  try {
    const { courseId } = req.params;
    const { id: userId } = req.user;

    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId, userId },
    });

    reply.send({ enrolled: !!enrollment });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};


const enrollInCourse = async (req, reply) => {
  try {

    console.log(req.user)
    const { courseId } = req.params;
    const id = req.user.userId;

    const enrollment = await prisma.enrollment.create({
      data: { courseId, userId: id },
    });

    reply.send(enrollment);
  } catch (error) {
    console.error("Error enrolling in course:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};


const leaveCourse = async (req, reply) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;

    await prisma.enrollment.deleteMany({
      where: { courseId, userId },
    });

    reply.send({ message: "Course left successfully" });
  } catch (error) {
    console.error("Error leaving course:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

const getUserEnrolledCourses = async (req, reply) => {
  try {
    const { userId } = req.user;
    const courses = await prisma.enrollment.findMany({
      where: { userId },
      include: { course: true },
    });
    reply.send(courses);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
  createCourse,
  getCourse,
  getCourses,
  deleteCourse,
  updateCourse,
  activateCourse,
  deactivateCourse,
  enrollInCourse,
  getUserEnrolledCourses,
  leaveCourse,
  checkEnrollment,
};
