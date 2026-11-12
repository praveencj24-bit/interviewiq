import { useState } from 'react';
import { useNavigate } from 'react-router';
import { analyzeResume } from '../api/index.js';
import { Working } from '../components/Status.jsx';
import ResumeInput from '../components/ResumeInput.jsx';

const MAX_JD = 8000;

export default function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return setError('Please choose your resume PDF.');
    if (jobDescription.trim().length < 50) return setError('Paste the full job description (at least 50 characters).');

    const form = new FormData();
    form.append('resume', file);
    form.append('jobDescription', jobDescription);

    setBusy(true);
    setError('');
    try {
      const analysis = await analyzeResume(form);
      navigate(`/analyses/${analysis._id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="stack narrow">
      <div>
        <h1>Analyze your resume</h1>
        <p className="muted">Upload your resume and paste a job ad. You get a match score, your strengths, the skills you are missing and 5 changes to make.</p>
      </div>

      <form className="panel form" onSubmit={handleSubmit}>
        <ResumeInput onChange={setFile} disabled={busy} />
        <label>
          Job description
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            maxLength={MAX_JD}
            disabled={busy}
            required
          />
          <span className="muted small counter">
            {jobDescription.length} / {MAX_JD}
          </span>
        </label>
        {error && <p className="form-error">{error}</p>}
        {busy ? (
          <Working
            title="Analyzing your resume"
            text="Reading your PDF and comparing it with the job. This usually takes 10 to 30 seconds."
          />
        ) : (
          <div className="form-actions">
            <button className="btn btn-primary">Analyze resume</button>
          </div>
        )}
      </form>
    </div>
  );
}
