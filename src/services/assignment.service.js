const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const ApiError = require('../utils/ApiError');

const createAssignment = async (payload) => Assignment.create(payload);

const listAssignments = async (filter = {}) =>
  Assignment.find(filter).populate('course', 'title instructor');

const getAssignment = async (id) => {
  const assignment = await Assignment.findById(id).populate('course', 'title');
  if (!assignment) throw new ApiError(404, 'Assignment not found');
  return assignment;
};

const updateAssignment = async (id, payload) => {
  const assignment = await Assignment.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!assignment) throw new ApiError(404, 'Assignment not found');
  return assignment;
};

const deleteAssignment = async (id) => {
  const assignment = await Assignment.findByIdAndDelete(id);
  if (!assignment) throw new ApiError(404, 'Assignment not found');
  return true;
};

const submitWork = async (payload) => {
  try {
    return await Submission.create(payload);
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, 'You already submitted this assignment');
    }
    throw error;
  }
};

const gradeSubmission = async (id, payload) => {
  const submission = await Submission.findByIdAndUpdate(id, payload, { new: true });
  if (!submission) throw new ApiError(404, 'Submission not found');
  return submission;
};

const listSubmissions = async (filter = {}) =>
  Submission.find(filter).populate('assignment', 'title').populate('student', 'fullName email');

module.exports = {
  createAssignment,
  listAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
  submitWork,
  gradeSubmission,
  listSubmissions,
};

