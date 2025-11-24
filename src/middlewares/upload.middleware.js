const multer = require('multer');

const MAX_SIZE = (Number(process.env.MAX_UPLOAD_FILE_SIZE_MB) || 10) * 1024 * 1024;

const allowedMime = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

const uploadSingleImage = (field) => upload.single(field);

module.exports = {
  uploadSingleImage,
};

