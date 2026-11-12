import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getHistory } from '../api/index.js';
import { useAuth } from '../components/AuthProvider.jsx';
import { Loading, ErrorMessage, Empty } from '../components/Status.jsx';
import Score from '../components/Score.jsx';

// recharts is large, so it is only downloaded when this page needs it
const ScoreChart = lazy(() => import('../components/ScoreChart.jsx'));

export default function History() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setData(null);
    setError('');
    getHistory()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!data) return <Loading text="Loading your history..." />;

  const { analyses, interviews } = data;

  if (analyses.length === 0 && interviews.length === 0) {
    return (
      <div className="stack">
        <h1>Hi, {user.name}</h1>
        <Empty>
          <p>You have not done anything yet. Start by checking how your resume matches a job.</p>
          <div className="empty-actions">
            <Link to="/analyze" className="btn btn-primary">
              Analyze my resume
            </Link>
            <Link to="/interview" className="btn">
              Start a mock interview
            </Link>
          </div>
        </Empty>
      </div>
    );
  }

  return (
    <div className="stack">
      <h1>Hi, {user.name}</h1>

      <section className="panel">
        <h2>Score progress</h2>
        <Suspense fallback={<Loading text="Loading chart..." />}>
          <ScoreChart analyses={analyses} interviews={interviews} />
        </Suspense>
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>Resume analyses</h2>
          {analyses.length === 0 ? (
            <p className="muted">
              None yet. <Link to="/analyze">Analyze your resume</Link>
            </p>
          ) : (
            <ul className="list">
              {analyses.map((a) => (
                <li key={a._id}>
                  <div>
                    <Link to={`/analyses/${a._id}`}>
                      <strong>{a.jobTitle}</strong>
                    </Link>
                    <div className="muted small">
                      {a.resumeName}, {new Date(a.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Score value={a.matchScore} max={100} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>Mock interviews</h2>
          {interviews.length === 0 ? (
            <p className="muted">
              None yet. <Link to="/interview">Start a mock interview</Link>
            </p>
          ) : (
            <ul className="list">
              {interviews.map((i) => (
                <li key={i._id}>
                  <div>
                    <Link to={`/interviews/${i._id}`}>
                      <strong>{i.role}</strong>
                    </Link>
                    <div className="muted small">
                      {i.difficulty}, {new Date(i.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {i.status === 'completed' ? (
                    <Score value={i.averageScore} max={10} />
                  ) : (
                    <Link to={`/interviews/${i._id}`} className="small">
                      Continue
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
