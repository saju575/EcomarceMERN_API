const multer = require("multer");

const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config/index.config");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, UPLOAD_USER_IMAGE_DIRECTORY);
//   },
//   filename: function (req, file, cb) {
//     const extname = path.extname(file.originalname);
//     cb(
//       null,
//       Date.now() + "-" + file.originalname.replace(extname, "") + extname
//     );
//   },
// });

const storage = multer.memoryStorage();

// file filtering
// const fileFilter = (req, file, cb) => {
//   const extname = path.extname(file.originalname);
//   if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
//     return cb(new Error("File type is not allowed"), false);
//   }
//   cb(null, true);
// };

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error("File is too large.Don't exceeds over 2MB"), false);
  }
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not allowewd"), false);
  }
  cb(null, true);
};

exports.upload = multer({
  storage,
  fileFilter,
});
