const path = require('path');
const fs = require('fs/promises');
const { cloudinary, isConfigured } = require('../config/cloudinary');

const UPLOAD_ROOT = path.join(__dirname, '..', '..', 'public', 'uploads');

const ensureDir = async () => {
  await fs.mkdir(UPLOAD_ROOT, { recursive: true });
};

const uploadToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'lms/courses',
        public_id: filename,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    stream.end(buffer);
  });

const uploadToLocal = async (buffer, filename) => {
  await ensureDir();
  const filePath = path.join(UPLOAD_ROOT, filename);
  await fs.writeFile(filePath, buffer);
  return {
    url: `/uploads/${filename}`,
    publicId: filename,
  };
};

const uploadImage = async (file) => {
  if (!file) {
    return null;
  }

  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
  if (isConfigured) {
    return uploadToCloudinary(file.buffer, uniqueName);
  }

  return uploadToLocal(file.buffer, `${uniqueName}-${file.originalname}`);
};

const deleteImage = async (asset) => {
  if (!asset?.publicId) return;

  if (isConfigured) {
    await cloudinary.uploader.destroy(asset.publicId, { resource_type: 'image' });
  } else {
    const filePath = path.join(UPLOAD_ROOT, asset.publicId);
    await fs.rm(filePath, { force: true });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};

