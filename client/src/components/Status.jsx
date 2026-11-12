export function Loading({ text = 'Loading...' }) {
  return (
    <p className="status" role="status">
      {text}
    </p>
  );
}

// shown while waiting for Gemini, which can take several seconds
export function Working({ title, text }) {
  return (
    <div className="working" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        <p className="muted small">{text}</p>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="status status-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="status status-empty">{children}</div>;
}
