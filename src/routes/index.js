const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const courseRoutes = require('./course.routes');
const lessonRoutes = require('./lesson.routes');
const enrollmentRoutes = require('./enrollment.routes');
const assignmentRoutes = require('./assignment.routes');
const chapterRoutes = require('./chapter.routes');
const quizRoutes = require('./quiz.routes');
const attemptRoutes = require('./attempt.routes');
const viewRoutes = require('./view.routes');

const apiRouter = express.Router();

apiRouter.use('/users', userRoutes);
apiRouter.use('/courses', courseRoutes);
apiRouter.use('/lessons', lessonRoutes);
apiRouter.use('/enrollments', enrollmentRoutes);
apiRouter.use('/assignments', assignmentRoutes);
apiRouter.use('/chapters', chapterRoutes);
apiRouter.use('/quizzes', quizRoutes);
apiRouter.use('/attempts', attemptRoutes);

module.exports = {
  apiRouter,
  authRouter: authRoutes,
  viewRouter: viewRoutes,
};

