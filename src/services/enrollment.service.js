const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');

const enrollStudent = async (payload) => {
  try {
    return await Enrollment.create(payload);
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'Student already enrolled');
    }
    throw error;
  }
};

const listEnrollments = async (filter = {}) =>
  Enrollment.find(filter).populate('course', 'title').populate('student', 'fullName email');

const updateProgress = async (id, progress) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    id,
    { progress, status: progress >= 100 ? 'completed' : 'active' },
    { new: true }
  );
  if (!enrollment) {
    throw new ApiError(404, 'Enrollment not found');
  }
  return enrollment;
};

module.exports = {
  enrollStudent,
  listEnrollments,
  updateProgress,
};

