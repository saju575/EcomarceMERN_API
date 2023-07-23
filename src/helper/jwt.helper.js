const jwt = require("jsonwebtoken");

// export a jwt method that creates a JWT token
exports.createJWTToken = (payload, secretKey, expiresIn) => {
  try {
    if (typeof payload !== "object" || !payload) {
      throw new Error("Payload must be object and non empty");
    }

    if (typeof secretKey !== "string" || secretKey === "") {
      throw new Error("Secret key must be a string and non empty");
    }

    const token = jwt.sign(payload, secretKey, {
      expiresIn,
    });
    return token;
  } catch (error) {
    throw error;
  }
};
