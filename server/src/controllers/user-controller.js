const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { jwtSign } = require("../utils/jwt");

// Registration
const userRegistration = async (req, reply) => {
  try {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existedUser) {
      return reply.send("User with this email already exists");
    }

    if (password !== confirmPassword) {
      return reply
        .status(401)
        .send("Password are different! Please try again!");
    }

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    return reply.send(user);
  } catch (err) {
    return reply.send(err);
  }
};

// Log in
const userLogIn = async (req, reply) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return reply.status(401).send("Invalid email or password! Try again!");
    }

    const unhashedPassword = await bcrypt.compare(password, user.password);

    if (!unhashedPassword) {
      return reply.status(401).send("Invalid email or password! Try again!");
    }

    const token = await jwtSign({ userId: user.id, role: user.role });
    reply.setCookie("token", token, { path: "/" });

    return reply.send({ token, user });
  } catch (error) {
    return reply.status(500).send(error);
  }
};

// Log out
const userLogOut = async (req, reply) => {
  reply.clearCookie("token", { path: "/" });
  return reply.send({ message: "Logout successful" });
};

const getUser = async (req, reply) => {
  try {
    const { userId } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Enrollment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!user) {
      return reply.send("No user found!");
    }

    return reply.send(user);
  } catch (err) {
    return reply.send(err);
  }
};

const getUsers = async (req, reply) => {
  const users = await prisma.user.findMany();

  if (req.cookies) {
    console.log("Cookies: " + req.cookies.access_token);
  } else if (!req.cookies) {
    console.log("NO cookies found");
  }

  return reply.send(users);
};

const updateUser = async (req, reply) => {
  try {
    const { email, firstName, lastName } = req.body;

    const { userId } = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return reply.send("No user found!");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { email, firstName, lastName },
    });

    return reply.send(updatedUser);
  } catch (err) {
    return reply.send(err);
  }
};

const getUserPayments = async (req, reply) => {
  const userId = req.user.userId;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId,
      },
    });

    reply.send(payments);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const getUserComments = async (req, reply) => {
  try {
    const { userId } = req.user;

    const comments = await prisma.comment.findMany({
      where: { userId },
      include: { course: true },
    });

    reply.send(comments);
  } catch (error) {
    console.error("Error fetching user's comments:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

// Get user's ratings
const getUserRatings = async (req, reply) => {
  try {
    const { userId } = req.user;

    const ratings = await prisma.rating.findMany({
      where: {
        enrollment: {
          userId: userId,
        },
      },
      include: {
        course: true,
        enrollment: {
          include: {
            user: true,
          },
        },
      },
    });

    reply.send(ratings);
  } catch (error) {
    console.error("Error fetching user's ratings:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  userRegistration,
  userLogIn,
  userLogOut,
  getUser,
  getUsers,
  updateUser,
  getUserPayments,
  getUserComments,
  getUserRatings,
};
