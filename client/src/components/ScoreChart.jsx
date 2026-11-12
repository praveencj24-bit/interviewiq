import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatDay = (date) => date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

// Resume matches (0-100) and interview averages (1-10) share one timeline, each on its own axis.
export default function ScoreChart({ analyses, interviews }) {
  const points = [
    ...analyses.map((a) => ({ time: new Date(a.createdAt), match: a.matchScore })),
    ...interviews
      .filter((i) => i.status === 'completed')
      .map((i) => ({ time: new Date(i.completedAt), interview: i.averageScore })),
  ]
    .sort((a, b) => a.time - b.time)
    .map((p) => ({ ...p, label: formatDay(p.time) }));

  if (points.length < 2) {
    return <p className="muted small">Your progress chart appears after two finished attempts.</p>;
  }

  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#e3e7ec" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="match" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis yAxisId="interview" orientation="right" domain={[0, 10]} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="match"
            type="monotone"
            dataKey="match"
            name="Resume match (0-100)"
            stroke="#1f5fbf"
            strokeWidth={2}
            connectNulls
          />
          <Line
            yAxisId="interview"
            type="monotone"
            dataKey="interview"
            name="Interview average (1-10)"
            stroke="#c2410c"
            strokeWidth={2}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
