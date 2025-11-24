const ApiResponse = require('../utils/ApiResponse');
const courseService = require('../services/course.service');
const lessonService = require('../services/lesson.service');
const chapterService = require('../services/chapter.service');
const { uploadImage } = require('../services/file.service');
const asyncHandler = require('../middlewares/asyncHandler');

const createCourse = asyncHandler(async (req, res) => {
  const thumbnail = await uploadImage(req.file);
  const course = await courseService.createCourse({
    ...req.body,
    instructor: req.user.id,
    ...(thumbnail ? { thumbnail } : {}),
  });
  return res.status(201).json(new ApiResponse(201, 'Course created', course));
});

const listCourses = asyncHandler(async (req, res) => {
  const courses = await courseService.listCourses(req.query);
  return res.status(200).json(new ApiResponse(200, 'Courses fetched', courses));
});

const getCourse = asyncHandler(async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  const chapters = await chapterService.listChapters(req.params.id);
  const lessons = await lessonService.listLessons({ courseId: req.params.id });
  return res.status(200).json(new ApiResponse(200, 'Course fetched', { course, chapters, lessons }));
});

const updateCourse = asyncHandler(async (req, res) => {
  const thumbnail = await uploadImage(req.file);
  const course = await courseService.updateCourse(req.params.id, {
    ...req.body,
    ...(thumbnail ? { thumbnail } : {}),
  });
  return res.status(200).json(new ApiResponse(200, 'Course updated', course));
});

const deleteCourse = asyncHandler(async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  return res.status(204).send();
});

module.exports = {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
};

