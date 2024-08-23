const prisma = require("../utils/prisma");

// Create a comment
async function createComment(req, reply) {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;

    // Check if the user is enrolled in the course
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return reply
        .status(403)
        .send("You must be enrolled in the course to comment.");
    }

    // Check if the user has already commented on this course
    const existingComment = await prisma.comment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingComment) {
      return reply
        .status(400)
        .send("You have already commented on this course.");
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        courseId,
        userId,
      },
    });

    reply.send(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Get comments
async function getComments(req, reply) {
  try {
    const { courseId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { courseId },
      include: { user: true },
    });

    reply.send(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Update a comment
async function updateComment(req, reply) {
  const { id } = req.params;
  const { content } = req.body;
  const { userId } = req.user;

  try {
    // Ensure the comment belongs to the user
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (comment.userId !== userId) {
      return reply.status(403).send("You can only update your own comments.");
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    reply.send(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Delete a comment
async function deleteComment(req, reply) {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id },
    });

    reply.send({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
