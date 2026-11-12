import { useState } from 'react';

const MAX_BYTES = 2 * 1024 * 1024;

// Checks type and size before upload so the user gets instant feedback. The server checks again.
export default function ResumeInput({ onChange, disabled }) {
  const [error, setError] = useState('');

  function handleChange(e) {
    const file = e.target.files[0];
    setError('');
    if (!file) return onChange(null);

    if (file.type !== 'application/pdf') {
      setError('Please choose a PDF file.');
    } else if (file.size > MAX_BYTES) {
      setError('The PDF must be 2 MB or smaller.');
    } else {
      return onChange(file);
    }
    e.target.value = '';
    onChange(null);
  }

  return (
    <label>
      Resume <span className="muted">(PDF, up to 2 MB)</span>
      <input type="file" accept="application/pdf" onChange={handleChange} disabled={disabled} />
      {error && <span className="form-error">{error}</span>}
    </label>
  );
}
