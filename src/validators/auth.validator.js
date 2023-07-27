const { checkSchema } = require("express-validator");
const { errorResponse } = require("../controllers/response.controllers");

const userRegistrationSchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Name should be between 3 and 32 characters",
    },
  },
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
    customSanitizer: {
      options: (value) => value.toLowerCase(),
    },
    isEmail: {
      errorMessage: "Invalid email address",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Password must be at least 3 characters",
    },
  },
  image: {
    optional: true,
    customSanitizer: {
      options: (value, { req }) => {
        if (!req.file || !req.file.buffer) {
          throw new Error("User image is required");
        }
        return true;
      },
    },
  },
  gender: {
    notEmpty: {
      errorMessage: "Gender is required",
    },
    isIn: {
      options: ["male", "female", "others"],
      errorMessage: "Invalid gender",
    },
  },
  address: {
    notEmpty: {
      errorMessage: "address is required",
    },
    isString: {
      errorMessage: "address must be a string",
    },
  },
  phone: {
    notEmpty: {
      errorMessage: "Phone no is required",
    },
    isString: {
      errorMessage: "Phone no must be a string",
    },
  },
  isAdmin: {
    optional: true,
    isBoolean: {
      errorMessage: "Admin must be true or false",
    },
  },
  isBanned: {
    optional: true,
    isBoolean: { errorMessage: "Banned must be true or false" },
  },
};

const userRegistrationValidation = checkSchema(userRegistrationSchema);

const handleUnknownFields = (schema) => (req, res, next) => {
  const allowedFields = Object.keys(schema).map((field) => field);

  const unknownField = Object.keys(req.body).filter(
    (field) => !allowedFields.includes(field)
  );
  if (unknownField.length > 0) {
    return errorResponse(res, { statusCode: 422, message: "unknown field" });
  }
  next();
};
const handleUnknownFieldsOfUserResgistration = handleUnknownFields(
  userRegistrationSchema
);
// for user update case

const userUpdationSchema = {
  name: {
    optional: true,
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
    isLength: {
      options: { min: 3, max: 32 },
      errorMessage: "Name should be between 3 and 32 characters",
    },
  },

  password: {
    optional: true,
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Password must be at least 3 characters",
    },
  },
  image: {
    optional: true,
    customSanitizer: {
      options: (value, { req }) => {
        if (!req.file || !req.file.buffer) {
          throw new Error("User image is required");
        }
        return true;
      },
    },
  },
  gender: {
    optional: true,
    notEmpty: {
      errorMessage: "Gender is required",
    },
    isIn: {
      options: ["male", "female", "others"],
      errorMessage: "Invalid gender",
    },
  },
  address: {
    optional: true,
    notEmpty: {
      errorMessage: "address is required",
    },
    isString: {
      errorMessage: "address must be a string",
    },
  },
  phone: {
    optional: true,
    notEmpty: {
      errorMessage: "Phone no is required",
    },
    isString: {
      errorMessage: "Phone no must be a string",
    },
  },
  isAdmin: {
    optional: true,
    isBoolean: {
      errorMessage: "Admin must be true or false",
    },
  },
  isBanned: {
    optional: true,
    isBoolean: { errorMessage: "Banned must be true or false" },
  },
};

const userUpdationValidation = checkSchema(userUpdationSchema);

const handleUnknownFieldsOfUserUpdation =
  handleUnknownFields(userUpdationSchema);

module.exports = {
  userRegistrationValidation,
  handleUnknownFieldsOfUserResgistration,
  userUpdationValidation,
  handleUnknownFieldsOfUserUpdation,
};
