const ApiResponse = require('../utils/ApiResponse');
const enrollmentService = require('../services/enrollment.service');
const asyncHandler = require('../middlewares/asyncHandler');

const enroll = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.enrollStudent({ ...req.body, student: req.user.id });
  return res.status(201).json(new ApiResponse(201, 'Enrollment successful', enrollment));
});

const listEnrollments = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'student' ? { student: req.user.id } : req.query;
  const enrollments = await enrollmentService.listEnrollments(filter);
  return res.status(200).json(new ApiResponse(200, 'Enrollments fetched', enrollments));
});

const updateProgress = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateProgress(req.params.id, req.body.progress);
  return res.status(200).json(new ApiResponse(200, 'Progress updated', enrollment));
});

module.exports = {
  enroll,
  listEnrollments,
  updateProgress,
};

