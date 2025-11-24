const Lesson = require('../models/Lesson');
const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');

const addLesson = async (payload) => {
  const chapter = await Chapter.findById(payload.chapter);
  if (!chapter) throw new ApiError(404, 'Chapter not found');
  const course = await Course.findById(chapter.course);
  if (!course) throw new ApiError(404, 'Course not found');

  const count = await Lesson.countDocuments({ chapter: chapter._id });
  const lesson = await Lesson.create({
    ...payload,
    course: course._id,
    order: payload.order ?? count + 1,
  });

  await Course.findByIdAndUpdate(course._id, { $inc: { totalLessons: 1 } });
  return lesson;
};

const listLessons = async ({ courseId, chapterId }) => {
  const filter = {};
  if (courseId) filter.course = courseId;
  if (chapterId) filter.chapter = chapterId;
  return Lesson.find(filter).sort({ order: 1 }).populate('chapter', 'title order');
};

const getLesson = async (id) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new ApiError(404, 'Lesson not found');
  }
  return lesson;
};

const updateLesson = async (id, payload) => {
  const lesson = await Lesson.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  return lesson;
};

const deleteLesson = async (id) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  await lesson.deleteOne();
  await Course.findByIdAndUpdate(lesson.course, { $inc: { totalLessons: -1 } });
  return true;
};

module.exports = {
  addLesson,
  listLessons,
  getLesson,
  updateLesson,
  deleteLesson,
};

