import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { getAnalysis } from '../api/index.js';
import { Loading, ErrorMessage } from '../components/Status.jsx';
import AnalysisResult from '../components/AnalysisResult.jsx';

export default function AnalysisPage() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setAnalysis(null);
    setError('');
    getAnalysis(id)
      .then(setAnalysis)
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
  if (!analysis) return <Loading text="Loading analysis..." />;
  return <AnalysisResult analysis={analysis} />;
}
