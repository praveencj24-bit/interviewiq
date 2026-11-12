import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getInterview, sendAnswer } from '../api/index.js';
import { Loading, ErrorMessage, Working } from '../components/Status.jsx';
import QuestionFeedback from '../components/QuestionFeedback.jsx';
import InterviewReport from '../components/InterviewReport.jsx';

const MAX_ANSWER = 3000;

function Progress({ interview, index }) {
  const total = interview.questions.length;
  return (
    <div className="progress">
      <div className="progress-text">
        <span>
          {interview.role}, {interview.difficulty}
        </span>
        <span className="muted">
          Question {index + 1} of {total}
        </span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>
    </div>
  );
}

export default function InterviewPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [error, setError] = useState('');
  // index of the question whose feedback is on screen, between answering and moving on
  const [reviewIndex, setReviewIndex] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [sendError, setSendError] = useState('');

  const load = useCallback(() => {
    setInterview(null);
    setError('');
    getInterview(id)
      .then(setInterview)
      .catch((err) => setError(err.message));
  }, [id]);

  useEffect(load, [load]);

  if (error) {
    return (
      <div className="stack">
        <ErrorMessage message={error} onRetry={load} />
        <Link to="/">Back to history</Link>
      </div>
    );
  }
  if (!interview) return <Loading text="Loading interview..." />;

  if (reviewIndex !== null) {
    const item = interview.questions[reviewIndex];
    const finished = interview.status === 'completed';
    return (
      <div className="stack narrow">
        <Progress interview={interview} index={reviewIndex} />
        <section className="panel">
          <p className="muted small">{item.topic}</p>
          <h1 className="question">{item.question}</h1>
          <QuestionFeedback item={item} />
        </section>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={() => setReviewIndex(null)}>
            {finished ? 'See final report' : 'Next question'}
          </button>
        </div>
      </div>
    );
  }

  if (interview.status === 'completed') return <InterviewReport interview={interview} />;

  const current = interview.questions.findIndex((q) => q.score === null);
  const question = interview.questions[current];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!answer.trim()) return setSendError('Write an answer before submitting.');
    setBusy(true);
    setSendError('');
    try {
      const updated = await sendAnswer(id, current, answer);
      setInterview(updated);
      setReviewIndex(current);
      setAnswer('');
      window.scrollTo(0, 0);
    } catch (err) {
      // keep the typed answer so nothing is lost
      setSendError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="stack narrow">
      <Progress interview={interview} index={current} />
      <form className="panel form" onSubmit={handleSubmit}>
        <p className="muted small">{question.topic}</p>
        <h1 className="question">{question.question}</h1>
        <label>
          Your answer
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={9}
            maxLength={MAX_ANSWER}
            disabled={busy}
            required
          />
          <span className="muted small counter">
            {answer.length} / {MAX_ANSWER}
          </span>
        </label>
        {sendError && <p className="form-error">{sendError}</p>}
        {busy ? (
          <Working title="Scoring your answer" text="The AI is reading your answer. This usually takes 5 to 15 seconds." />
        ) : (
          <div className="form-actions">
            <button className="btn btn-primary">Submit answer</button>
          </div>
        )}
      </form>
    </div>
  );
}
