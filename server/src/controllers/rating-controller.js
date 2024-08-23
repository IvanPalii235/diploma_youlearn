const prisma = require("../utils/prisma"); // Assuming prisma client is set up in utils/prisma

// Create a rating
async function createRating(req, reply) {
  try {
    const { userId } = req.user;
    const { rating, courseId } = req.body;

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
        .send("You must be enrolled in the course to rate it.");
    }

    // Check if the user has already rated this course
    const existingRating = await prisma.rating.findFirst({
      where: {
        enrollmentId: enrollment.id,
        courseId,
      },
    });

    if (existingRating) {
      return reply.status(400).send("You have already rated this course.");
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        enrollment: {
          connect: {
            id: enrollment.id,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
      },
    });

    reply.send(newRating);
  } catch (error) {
    console.error("Error creating rating:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Get a rating
async function getRating(req, reply) {
  try {
    const { courseId } = req.params;
    const ratings = await prisma.rating.findMany({
      where: { courseId },
      include: {
        enrollment: {
          include: {
            user: true, // Include user information
          },
        },
      },
    });

    console.log(ratings);
    reply.send(ratings);
  } catch (error) {
    reply.status(500).send(error);
  }
}

// Update a rating
async function updateRating(req, reply) {
  const { id } = req.params;
  const { rating } = req.body;
  const { userId } = req.user;

  try {
    // Ensure the rating belongs to the user
    const ratingRecord = await prisma.rating.findUnique({
      where: { id },
      include: { enrollment: true },
    });

    if (ratingRecord.enrollment.userId !== userId) {
      return reply.status(403).send("You can only update your own ratings.");
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating },
    });

    reply.send(updatedRating);
  } catch (error) {
    console.error("Error updating rating:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

// Delete a rating
async function deleteRating(req, reply) {
  const { id } = req.params;

  try {
    await prisma.rating.delete({
      where: { id },
    });
    reply.send({ message: "Rating deleted" });
  } catch (error) {
    reply.status(500).send(error);
  }
}

module.exports = {
  createRating,
  getRating,
  updateRating,
  deleteRating,
};
