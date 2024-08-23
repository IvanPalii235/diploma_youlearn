const prisma = require("../utils/prisma");

const getStatistics = async (req, reply) => {
  try {
    const teacherId = req.user.id;

    const courses = await prisma.course.findMany({
      where: { teacherId },
      include: {
        _count: {
          select: {
            Lesson: true,
            Enrollment: true,
            Comment: true,
            Rating: true,
          },
        },
        Enrollment: true,
        Rating: true,
        Payment: true, // Include payments
      },
    });

    let totalEnrollments = 0;
    let totalRatings = 0;
    let totalComments = 0;
    let totalLessons = 0;
    let averageRating = 0;
    let totalEarnings = 0;

    const payments = [];

    courses.forEach((course) => {
      totalEnrollments += course._count.Enrollment;
      totalRatings += course._count.Rating;
      totalComments += course._count.Comment;
      totalLessons += course._count.Lesson;
      averageRating +=
        course.Rating.reduce((acc, rating) => acc + rating.rating, 0) /
          course._count.Rating || 0;
      totalEarnings += course.Payment.reduce(
        (acc, payment) => acc + payment.amount / 100, // Convert cents to dollars
        0
      );

      course.Payment.forEach((payment) => {
        payments.push({
          id: payment.id,
          courseTitle: course.title,
          amount: (payment.amount / 100).toFixed(2), // Convert cents to dollars
          createdAt: payment.createdAt,
          status: payment.status,
        });
      });
    });

    averageRating = totalRatings ? averageRating / courses.length : 0;

    const statistics = {
      totalCourses: courses.length,
      totalEnrollments,
      totalRatings,
      totalComments,
      totalLessons,
      averageRating: averageRating.toFixed(1),
      totalEarnings: totalEarnings.toFixed(2),
      payments,
    };

    return reply.send(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return reply.status(500).send("Internal server error");
  }
};

module.exports = {
  getStatistics,
};
