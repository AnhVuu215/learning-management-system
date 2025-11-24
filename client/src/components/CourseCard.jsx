import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => (
  <article className="card">
    <div className="card__content">
      <div className="card__header">
        <h3>{course.title}</h3>
        <span className="badge">{course.level}</span>
      </div>
      <p>{course.description?.slice(0, 120)}...</p>
      <div className="card__footer">
        <span className="muted">Instructor: {course.instructor?.fullName || 'TBD'}</span>
        <Link className="btn btn--primary" to={`/courses/${course._id}`}>
          View
        </Link>
      </div>
    </div>
  </article>
);

export default CourseCard;

