import { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard.jsx';
import { fetchCourses } from '../services/api.js';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses({ isPublished: true });
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <header className="hero">
        <h1>Level up your learning</h1>
        <p>Browse curated courses from world-class instructors.</p>
      </header>
      <div className="cards">
        {courses.length ? courses.map((course) => <CourseCard key={course._id} course={course} />) : <p>No courses yet.</p>}
      </div>
    </section>
  );
};

export default Home;

