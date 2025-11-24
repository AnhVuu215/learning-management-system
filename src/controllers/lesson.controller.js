const ApiResponse = require('../utils/ApiResponse');
const lessonService = require('../services/lesson.service');
const asyncHandler = require('../middlewares/asyncHandler');

const addLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.addLesson(req.body);
  return res.status(201).json(new ApiResponse(201, 'Lesson created', lesson));
});

const listLessons = asyncHandler(async (req, res) => {
  const lessons = await lessonService.listLessons({
    courseId: req.params.courseId,
    chapterId: req.query.chapterId,
  });
  return res.status(200).json(new ApiResponse(200, 'Lessons fetched', lessons));
});

const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await lessonService.updateLesson(req.params.id, req.body);
  return res.status(200).json(new ApiResponse(200, 'Lesson updated', lesson));
});

const deleteLesson = asyncHandler(async (req, res) => {
  await lessonService.deleteLesson(req.params.id);
  return res.status(204).send();
});

module.exports = {
  addLesson,
  listLessons,
  updateLesson,
  deleteLesson,
};

