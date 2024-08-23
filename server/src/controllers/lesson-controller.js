const prisma = require("../utils/prisma");
const { authRole } = require("../middleware/authMiddleware");

const createLesson = async (req, reply) => {
  try {
    const { courseId } = req.params;
    const { title, contentType, content } = req.body;

    let newLesson;
    if (contentType === "TEXT") {
      newLesson = await prisma.lesson.create({
        data: {
          title,
          contentType,
          courseId,
          TextContent: {
            create: { content },
          },
        },
        include: {
          TextContent: true,
        },
      });
    } else if (contentType === "TEST") {
      newLesson = await prisma.lesson.create({
        data: {
          title,
          contentType,
          courseId,
          TestContent: {
            create: content,
          },
        },
        include: {
          TestContent: true,
        },
      });
    } else if (contentType === "VIDEO") {
      newLesson = await prisma.lesson.create({
        data: {
          title,
          contentType,
          courseId,
          VideoContent: {
            create: {
              videoTitle: content.videoTitle,
              url: content.url,
            },
          },
        },
        include: {
          VideoContent: true,
        },
      });
    } else {
      return reply.status(400).send({ error: "Invalid content type!" });
    }

    reply.status(201).send(newLesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    reply.status(500).send("Internal server error");
  }
};

const getLesson = async (req, reply) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        TextContent: true,
        TestContent: true,
        VideoContent: true,
      },
    });

    if (!lesson) {
      return reply.status(404).send({ error: "Lesson not found" });
    }

    return reply.send(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return reply.status(500).send("Internal server error");
  }
};

const getCourseLessons = async (req, reply) => {
  try {
    const { courseId } = req.params;
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
    });
    reply.send(lessons);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const deleteLesson = async (req, reply) => {
  try {
    const { lessonId } = req.params;

    if (!lessonId) {
      return reply.status(400).send({ error: "Lesson ID is required!" });
    }

    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return reply.send({ message: `Lesson with ID ${lessonId} was removed!` });
  } catch (err) {
    console.log(err);
    return reply
      .status(500)
      .send({ error: "An error occurred while deleting the lesson." });
  }
};

const updateLesson = async (req, reply) => {
  try {
    const { lessonId } = req.params;
    const { title, textContents, testContents, videoContents } = req.body;

    if (!lessonId) {
      return reply.status(400).send({ error: "Lesson ID is required!" });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        TextContent: true,
        TestContent: true,
        VideoContent: true,
      },
    });

    if (!lesson) {
      return reply.status(404).send("No lesson found!");
    }

    const updateData = {
      title,
      TextContent: {
        deleteMany: { lessonId },
        create:
          textContents?.map((content) => ({ content: content.content })) || [],
      },
      TestContent: {
        deleteMany: { lessonId },
        create:
          testContents?.map((content) => ({
            question: content.question,
            options: content.options,
            correctAnswer: parseInt(content.correctAnswer, 10),
          })) || [],
      },
      VideoContent: {
        deleteMany: { lessonId },
        create:
          videoContents?.map((content) => ({
            videoTitle: content.videoTitle,
            url: content.url,
          })) || [],
      },
    };

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return reply.send(updatedLesson);
  } catch (err) {
    console.error("Error updating lesson:", err);
    return reply.status(500).send(err);
  }
};

const updateTask = async (req, reply) => {
  try {
    const { lessonId, contentId } = req.params;
    const data = req.body;

    if (!lessonId) {
      return reply.status(400).send({ error: "Lesson ID is required!" });
    }
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        TextContent: true,
        TestContent: true,
        VideoContent: true,
      },
    });

    if (!lesson) {
      return reply.status(404).send("No lesson found!");
    }

    let updateData = { title: lesson.title };

    if (lesson.contentType === "TEXT") {
      if (contentId) {
        updateData.TextContent = {
          update: {
            where: { id: contentId },
            data: { content: data.content },
          },
        };
      } else {
        updateData.TextContent = {
          create: {
            content: data.content,
          },
        };
      }
    } else if (lesson.contentType === "TEST") {
      if (contentId) {
        updateData.TestContent = {
          update: {
            where: { id: contentId },
            data: {
              question: data.question,
              options: data.options,
              correctAnswer: parseInt(data.correctAnswer, 10),
            },
          },
        };
      } else {
        updateData.TestContent = {
          create: {
            question: data.question,
            options: data.options,
            correctAnswer: parseInt(data.correctAnswer, 10),
          },
        };
      }
    } else if (lesson.contentType === "VIDEO") {
      if (contentId) {
        updateData.VideoContent = {
          update: {
            where: { id: contentId },
            data: {
              videoTitle: data.videoTitle,
              url: data.url,
            },
          },
        };
      } else {
        updateData.VideoContent = {
          create: {
            videoTitle: data.videoTitle,
            url: data.url,
          },
        };
      }
    }

    const updatedTask = await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    });

    return reply.send(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    return reply.status(500).send(err);
  }
};

const deleteTask = async (req, reply) => {
  try {
    const { lessonId, contentId } = req.params;

    if (!lessonId) {
      return reply.status(400).send({ error: "Lesson ID is required!" });
    }
    if (!contentId) {
      return reply.status(400).send({ error: "Content ID is required!" });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        TextContent: true,
        TestContent: true,
        VideoContent: true,
      },
    });

    if (!lesson) {
      return reply.status(404).send("No lesson found!");
    }

    if (lesson.contentType === "TEXT") {
      await prisma.textContent.delete({
        where: { id: contentId },
      });
      return reply.send({ success: true });
    } else if (lesson.contentType === "TEST") {
      await prisma.testContent.delete({
        where: { id: contentId },
      });
      return reply.send({ success: true });
    } else if (lesson.contentType === "VIDEO") {
      await prisma.videoContent.delete({
        where: { id: contentId },
      });
      return reply.send({ success: true });
    }

    return reply.status(400).send({ error: "Invalid content type!" });
  } catch (err) {
    return reply.status(500).send(err);
  }
};

const getTextTask = async (req, reply) => {
  try {
    const { lessonId } = req.params;
    const task = await prisma.textContent.findFirst({
      where: { lessonId },
    });
    if (!task) {
      return reply.status(404).send({ error: "Task not found" });
    }
    reply.send(task);
  } catch (error) {
    console.error("Error fetching text task:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

const getTestTask = async (req, reply) => {
  try {
    const { lessonId } = req.params;
    const task = await prisma.testContent.findFirst({
      where: { lessonId },
    });
    if (!task) {
      return reply.status(404).send({ error: "Task not found" });
    }
    reply.send(task);
  } catch (error) {
    console.error("Error fetching test task:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

const getVideoTask = async (req, reply) => {
  try {
    const { lessonId } = req.params;
    const task = await prisma.videoContent.findFirst({
      where: { lessonId },
    });
    if (!task) {
      return reply.status(404).send({ error: "Task not found" });
    }
    reply.send(task);
  } catch (error) {
    console.error("Error fetching video task:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

const checkTestAnswer = async (req, reply) => {
  try {
    const { lessonId, taskId } = req.params;
    const { selectedOption } = req.body;

    const testContent = await prisma.testContent.findUnique({
      where: { id: taskId },
    });

    if (!testContent) {
      return reply.status(404).send({ error: "Test content not found" });
    }

    const isCorrect = testContent.correctAnswer === selectedOption;
    reply.send({ isCorrect });
  } catch (error) {
    console.error("Error checking test answer:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
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
};
