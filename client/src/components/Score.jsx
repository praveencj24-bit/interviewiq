export default function Score({ value, max, large = false }) {
  const ratio = value / max;
  const level = ratio >= 0.7 ? 'good' : ratio >= 0.5 ? 'ok' : 'low';
  return (
    <span className={`score score-${level}${large ? ' score-large' : ''}`}>
      {value}
      <span className="score-max">/{max}</span>
    </span>
  );
}
