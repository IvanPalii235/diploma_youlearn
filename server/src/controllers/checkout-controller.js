const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const prisma = require("../utils/prisma");

const handlePayment = async (req, reply) => {
  const { courseId } = req.body;
  const userId = req.user.userId; 

  try {
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return reply.status(404).send("Course not found");
    }

    const amountInCents = Math.round(course.price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
    });

    await prisma.payment.create({
      data: {
        userId,
        courseId,
        amount: amountInCents,
        currency: "usd",
        status: "successful",
      },
    });

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    reply.status(200).send({
      message: "Payment successful, enrollment created",
      paymentIntent,
      enrollment,
    });
  } catch (error) {
    console.error("Error handling payment:", error);
    return reply.status(500).send(error);
  }
};

module.exports = {
  handlePayment,
};
