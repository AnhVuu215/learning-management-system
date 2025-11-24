import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { enrollCourse, fetchCourseDetail } from '../services/api.js';
import useAuth from '../hooks/useAuth.js';

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [courseBundle, setCourseBundle] = useState(null);
  const [status, setStatus] = useState({ loading: true, message: '' });

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await fetchCourseDetail(id);
        setCourseBundle(data);
      } catch (error) {
        setStatus((prev) => ({ ...prev, message: error.message }));
      } finally {
        setStatus((prev) => ({ ...prev, loading: false }));
      }
    };
    loadCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      setStatus({ loading: false, message: 'Please log in to enroll.' });
      return;
    }
    try {
      await enrollCourse(id);
      setStatus({ loading: false, message: 'Enrollment successful!' });
    } catch (error) {
      setStatus({ loading: false, message: error.message });
    }
  };

  if (status.loading) return <p>Loading course...</p>;
  if (!courseBundle) return <p className="error">{status.message || 'Course not found'}</p>;

  const { course, lessons = [] } = courseBundle;

  return (
    <section>
      <header className="hero">
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <button className="btn btn--primary" type="button" onClick={handleEnroll}>
          Enroll now
        </button>
        {status.message && <p className="muted">{status.message}</p>}
      </header>
      <div>
        <h2>Lessons</h2>
        {lessons.length ? (
          <ol className="lessons">
            {lessons.map((lesson) => (
              <li key={lesson._id}>
                <strong>{lesson.title}</strong>
                <p className="muted">{lesson.content.slice(0, 140)}...</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="muted">No lessons published yet.</p>
        )}
      </div>
    </section>
  );
};

export default CourseDetail;

