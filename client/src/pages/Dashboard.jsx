import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth.js';
import { enrollCourse, fetchCourses, fetchEnrollments } from '../services/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [enrollmentData, courseData] = await Promise.all([fetchEnrollments(), fetchCourses()]);
        setEnrollments(enrollmentData);
        setCourses(courseData);
      } catch (error) {
        setActionMessage(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);
      setActionMessage('Enrolled successfully!');
      const updated = await fetchEnrollments();
      setEnrollments(updated);
    } catch (error) {
      setActionMessage(error.message);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <section>
      <header className="hero">
        <h1>Hello, {user?.fullName}</h1>
        <p>Your role: {user?.role}</p>
      </header>

      {actionMessage && <p className="muted">{actionMessage}</p>}

      <div className="dashboard-grid">
        <div>
          <h2>Your enrollments</h2>
          {enrollments.length === 0 && <p>No enrollments yet.</p>}
          <ul className="list">
            {enrollments.map((enrollment) => (
              <li key={enrollment._id} className="list-item">
                <div>
                  <strong>{enrollment.course?.title}</strong>
                  <p className="muted">Status: {enrollment.status}</p>
                </div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${enrollment.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Available courses</h2>
          <ul className="list">
            {courses.map((course) => (
              <li key={course._id} className="list-item list-item--row">
                <div>
                  <strong>{course.title}</strong>
                  <p className="muted">{course.description?.slice(0, 80)}...</p>
                </div>
                <button className="btn btn--secondary" type="button" onClick={() => handleEnroll(course._id)}>
                  Enroll
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;

