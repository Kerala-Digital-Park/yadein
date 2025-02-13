const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); // Files will be stored in "uploads" directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
    },
  });

  const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image.jpg') {
        cb(null, true)
    }
    else {
        cb(null, false)
        return cb(new ErrorEvent("only png, jpeg, jpg files are allowed"))
    }
}
  
  const upload = multer({ storage: storage, fileFilter: imageFilter });

  module.exports = upload