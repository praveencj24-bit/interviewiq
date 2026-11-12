import { Link } from 'react-router';
import Score from './Score.jsx';
import QuestionFeedback from './QuestionFeedback.jsx';

export default function InterviewReport({ interview }) {
  return (
    <div className="stack">
      <section className="panel result-head">
        <div>
          <p className="muted small">
            {interview.difficulty} difficulty, finished {new Date(interview.completedAt).toLocaleString()}
          </p>
          <h1>{interview.role}: final report</h1>
          <div className="weak">
            <h2>Weak areas</h2>
            {interview.weakAreas.length === 0 ? (
              <p className="muted">None. Every answer scored 7 or more.</p>
            ) : (
              <ul className="tags">
                {interview.weakAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="result-score">
          <Score value={interview.averageScore} max={10} large />
          <span className="muted small">Average score</span>
        </div>
      </section>

      {interview.questions.map((q, i) => (
        <section key={i} className="panel">
          <p className="muted small">
            Question {i + 1}, {q.topic}
          </p>
          <h2>{q.question}</h2>
          <QuestionFeedback item={q} />
        </section>
      ))}

      <div className="form-actions">
        <Link to="/" className="btn">
          Back to history
        </Link>
        <Link to="/interview" state={{ role: interview.role }} className="btn btn-primary">
          Try another interview
        </Link>
      </div>
    </div>
  );
}
