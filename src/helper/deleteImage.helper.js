const fs = require("fs").promises;

exports.deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log(`user image was deleted`);
  } catch (error) {
    console.log(`user image does not exist`);
  }
};
