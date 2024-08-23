const jwt = require("jsonwebtoken");

const jwtSign = async (encode) => {
  try {
    const token = await jwt.sign({ data: encode }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    return token;
  } catch (err) {
    console.error("Error signing token:", err);
    throw new Error("Token signing failed");
  }
};

const jwtVerify = async (token) => {
  try {
    const valid = await jwt.verify(token, process.env.JWT_SECRET);
    return valid;
  } catch (err) {
    console.error("Error verifying token:", err);
    throw new Error("Token verification failed");
  }
};

const jwtDecode = async (token) => {
  try {
    const valid = await jwtVerify(token);
    const decoded = jwt.decode(token);
    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    throw new Error("Token decoding failed");
  }
};

module.exports = { jwtSign, jwtVerify, jwtDecode };
