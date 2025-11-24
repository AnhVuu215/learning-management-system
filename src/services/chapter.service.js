const Chapter = require('../models/Chapter');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const ApiError = require('../utils/ApiError');

const ensureCourse = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

const createChapter = async (payload) => {
  await ensureCourse(payload.course);
  const count = await Chapter.countDocuments({ course: payload.course });
  const chapter = await Chapter.create({
    ...payload,
    order: payload.order ?? count + 1,
  });

  await Course.findByIdAndUpdate(payload.course, { $inc: { totalChapters: 1 } });
  return chapter;
};

const listChapters = async (courseId) => {
  await ensureCourse(courseId);
  return Chapter.find({ course: courseId }).sort({ order: 1 });
};

const updateChapter = async (id, payload) => {
  const chapter = await Chapter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }
  return chapter;
};

const deleteChapter = async (id) => {
  const chapter = await Chapter.findById(id);
  if (!chapter) {
    throw new ApiError(404, 'Chapter not found');
  }

  const lessonCount = await Lesson.countDocuments({ chapter: chapter._id });
  await Lesson.deleteMany({ chapter: chapter._id });
  await chapter.deleteOne();
  await Course.findByIdAndUpdate(chapter.course, { $inc: { totalChapters: -1, totalLessons: -lessonCount } });
};

module.exports = {
  createChapter,
  listChapters,
  updateChapter,
  deleteChapter,
};

