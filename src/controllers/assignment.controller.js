const ApiResponse = require('../utils/ApiResponse');
const assignmentService = require('../services/assignment.service');
const asyncHandler = require('../middlewares/asyncHandler');

const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.createAssignment(req.body);
  return res.status(201).json(new ApiResponse(201, 'Assignment created', assignment));
});

const listAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.listAssignments(req.query);
  return res.status(200).json(new ApiResponse(200, 'Assignments fetched', assignments));
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await assignmentService.updateAssignment(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Assignment updated', assignment));
});

const deleteAssignment = asyncHandler(async (req, res) => {
  await assignmentService.deleteAssignment(req.params.id);
  return res.status(204).send();
});

const submitWork = asyncHandler(async (req, res) => {
  const submission = await assignmentService.submitWork({
    ...req.body,
    student: req.user.id,
  });
  return res.status(201).json(new ApiResponse(201, 'Submission created', submission));
});

const listSubmissions = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'student' ? { student: req.user.id } : req.query;
  const submissions = await assignmentService.listSubmissions(filter);
  return res.status(200).json(new ApiResponse(200, 'Submissions fetched', submissions));
});

const gradeSubmission = asyncHandler(async (req, res) => {
  const submission = await assignmentService.gradeSubmission(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Submission graded', submission));
});

module.exports = {
  createAssignment,
  listAssignments,
  updateAssignment,
  deleteAssignment,
  submitWork,
  listSubmissions,
  gradeSubmission,
};

