import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { getHistory, startInterview } from '../api/index.js';
import { Loading, ErrorMessage, Working } from '../components/Status.jsx';
import ResumeInput from '../components/ResumeInput.jsx';

const LEVELS = [
  { value: 'easy', label: 'Easy', hint: 'Fundamentals' },
  { value: 'medium', label: 'Medium', hint: 'Practical experience' },
  { value: 'hard', label: 'Hard', hint: 'Depth and trade-offs' },
];

export default function InterviewSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  // undefined while loading, null when the user has no saved resume yet
  const [latest, setLatest] = useState(undefined);
  const [loadError, setLoadError] = useState('');
  const [role, setRole] = useState(location.state?.role ?? '');
  const [difficulty, setDifficulty] = useState('medium');
  const [useSaved, setUseSaved] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLatest(undefined);
    setLoadError('');
    getHistory()
      .then((data) => {
        const analysis = data.analyses[0] ?? null;
        setLatest(analysis);
        if (analysis) setRole((current) => current || analysis.jobTitle);
      })
      .catch((err) => setLoadError(err.message));
  }, []);

  useEffect(load, [load]);

  if (loadError) return <ErrorMessage message={loadError} onRetry={load} />;
  if (latest === undefined) return <Loading />;

  const needsFile = !latest || !useSaved;

  async function handleSubmit(e) {
    e.preventDefault();
    if (role.trim().length < 2) return setError('Enter the role you are practising for.');
    if (needsFile && !file) return setError('Please choose your resume PDF.');

    const form = new FormData();
    form.append('role', role);
    form.append('difficulty', difficulty);
    if (needsFile) form.append('resume', file);

    setBusy(true);
    setError('');
    try {
      const interview = await startInterview(form);
      navigate(`/interviews/${interview._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="stack narrow">
      <div>
        <h1>Mock interview</h1>
        <p className="muted">You get 5 questions based on the role and your resume. Answer them one at a time and get a score and feedback after each one.</p>
      </div>

      <form className="panel form" onSubmit={handleSubmit}>
        <label>
          Role
          <input value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} disabled={busy} required />
        </label>

        <fieldset className="choice" disabled={busy}>
          <legend>Difficulty</legend>
          {LEVELS.map((level) => (
            <label key={level.value} className={difficulty === level.value ? 'choice-item selected' : 'choice-item'}>
              <input
                type="radio"
                name="difficulty"
                value={level.value}
                checked={difficulty === level.value}
                onChange={() => setDifficulty(level.value)}
              />
              <strong>{level.label}</strong>
              <span className="muted small">{level.hint}</span>
            </label>
          ))}
        </fieldset>

        {latest && (
          <fieldset className="radio-list" disabled={busy}>
            <legend>Resume</legend>
            <label>
              <input type="radio" name="source" checked={useSaved} onChange={() => setUseSaved(true)} />
              Use {latest.resumeName} from my last analysis
            </label>
            <label>
              <input type="radio" name="source" checked={!useSaved} onChange={() => setUseSaved(false)} />
              Upload a different resume
            </label>
          </fieldset>
        )}
        {needsFile && <ResumeInput onChange={setFile} disabled={busy} />}

        {error && <p className="form-error">{error}</p>}
        {busy ? (
          <Working title="Preparing your interview" text="Writing 5 questions for this role. This usually takes 10 to 20 seconds." />
        ) : (
          <div className="form-actions">
            <button className="btn btn-primary">Start interview</button>
          </div>
        )}
      </form>
    </div>
  );
}
