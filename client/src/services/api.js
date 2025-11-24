import http from '../api/http.js';

const unwrap = (response) => response.data.data;

export const loginRequest = async (payload) => unwrap(await http.post('/auth/login', payload));
export const registerRequest = async (payload) => unwrap(await http.post('/auth/register', payload));
export const logoutRequest = async (refreshToken) => unwrap(await http.post('/auth/logout', { refreshToken }));
export const meRequest = async () => unwrap(await http.get('/auth/me'));

export const fetchCourses = async (params = {}) => unwrap(await http.get('/courses', { params }));
export const fetchCourseDetail = async (id) => unwrap(await http.get(`/courses/${id}`));

export const fetchEnrollments = async () => unwrap(await http.get('/enrollments'));
export const enrollCourse = async (courseId) => unwrap(await http.post('/enrollments', { course: courseId }));

