import Score from './Score.jsx';

export default function QuestionFeedback({ item }) {
  return (
    <div className="feedback">
      <div className="feedback-head">
        <span className="muted small">Your score</span>
        <Score value={item.score} max={10} />
      </div>
      <p>{item.feedback}</p>
      <details>
        <summary>Your answer</summary>
        <p className="pre">{item.answer}</p>
      </details>
      <details open>
        <summary>A stronger answer</summary>
        <p className="pre">{item.sampleAnswer}</p>
      </details>
    </div>
  );
}
