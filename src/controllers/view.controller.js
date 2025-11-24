const courseService = require('../services/course.service');
const enrollmentService = require('../services/enrollment.service');
const ApiError = require('../utils/ApiError');
const roles = require('../constants/roles');

const renderHome = async (req, res, next) => {
  try {
    const courses = await courseService.listCourses({ isPublished: true });
    return res.render('pages/home', {
      title: 'LMS Home',
      user: req.user,
      courses,
    });
  } catch (error) {
    return next(error);
  }
};

const renderDashboard = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Please log in to access your dashboard');
    }
    const filter =
      req.user.role === roles.STUDENT ? { student: req.user.id } : { course: req.query.courseId };
    const enrollments = await enrollmentService.listEnrollments(filter);
    return res.render('pages/dashboard', {
      title: 'Dashboard',
      user: req.user,
      enrollments,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  renderHome,
  renderDashboard,
};

