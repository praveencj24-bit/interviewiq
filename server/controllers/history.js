import Analysis from '../models/Analysis.js';
import Interview from '../models/Interview.js';

const MAX_ITEMS = 100;

export async function getHistory(req, res) {
  const [analyses, interviews] = await Promise.all([
    Analysis.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(MAX_ITEMS)
      .select('jobTitle matchScore resumeName createdAt'),
    Interview.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(MAX_ITEMS)
      .select('role difficulty status averageScore createdAt completedAt'),
  ]);
  res.json({ analyses, interviews });
}
