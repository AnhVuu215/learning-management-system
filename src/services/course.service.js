const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');
const { deleteImage } = require('./file.service');

const normalizeStatus = (course, status) => {
  if (!status) return course;
  course.status = status;
  course.isPublished = status === 'published';
  course.publishedAt = course.isPublished ? course.publishedAt || new Date() : undefined;
  return course;
};

const createCourse = async (payload) => {
  const course = await Course.create({
    ...payload,
    status: payload.status || 'draft',
    isPublished: payload.status === 'published',
    publishedAt: payload.status === 'published' ? new Date() : undefined,
  });
  return course;
};

const listCourses = async (query = {}) => {
  const filter = {};
  if (query.status) filter.status = query.status;
  if (query.instructor) filter.instructor = query.instructor;
  if (query.published) filter.isPublished = query.published === 'true';
  return Course.find(filter).populate('instructor', 'fullName email');
};

const getCourseById = async (id) => {
  const course = await Course.findById(id).populate('instructor', 'fullName email');
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  return course;
};

const updateCourse = async (id, payload) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }

  const fields = [
    'title',
    'description',
    'category',
    'level',
    'price',
    'tags',
    'requirements',
    'learningOutcomes',
  ];

  fields.forEach((field) => {
    if (payload[field] !== undefined) {
      course[field] = payload[field];
    }
  });

  if (payload.thumbnail) {
    if (course.thumbnail?.publicId) {
      await deleteImage(course.thumbnail);
    }
    course.thumbnail = payload.thumbnail;
  }

  if (payload.status) {
    normalizeStatus(course, payload.status);
  }

  await course.save();
  return course;
};

const deleteCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course) {
    throw new ApiError(404, 'Course not found');
  }
  if (course.thumbnail?.publicId) {
    await deleteImage(course.thumbnail);
  }
  await course.deleteOne();
};

module.exports = {
  createCourse,
  listCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};

