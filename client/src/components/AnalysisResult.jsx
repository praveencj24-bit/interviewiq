import { Link } from 'react-router';
import Score from './Score.jsx';

export default function AnalysisResult({ analysis }) {
  return (
    <div className="stack">
      <section className="panel result-head">
        <div>
          <p className="muted small">
            {analysis.resumeName}, {new Date(analysis.createdAt).toLocaleString()}
          </p>
          <h1>{analysis.jobTitle}</h1>
          <p>{analysis.summary}</p>
        </div>
        <div className="result-score">
          <Score value={analysis.matchScore} max={100} large />
          <span className="muted small">Match score</span>
        </div>
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>Strengths</h2>
          <ul className="bullets">
            {analysis.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h2>Missing skills</h2>
          {analysis.missingSkills.length === 0 ? (
            <p className="muted">Nothing important is missing for this job.</p>
          ) : (
            <ul className="tags">
              {analysis.missingSkills.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>5 ways to improve your resume</h2>
        <ol className="numbered">
          {analysis.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </section>

      <details className="panel">
        <summary>Job description you used</summary>
        <p className="pre">{analysis.jobDescription}</p>
      </details>

      <div className="form-actions">
        <Link to="/analyze" className="btn">
          Analyze another
        </Link>
        <Link to="/interview" state={{ role: analysis.jobTitle }} className="btn btn-primary">
          Practice an interview for this role
        </Link>
      </div>
    </div>
  );
}
