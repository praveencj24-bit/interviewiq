import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import analysisRoutes from './routes/analyses.js';
import interviewRoutes from './routes/interviews.js';
import historyRoutes from './routes/history.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(cors({ origin: env.clientUrls }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/history', historyRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(env.port, () => {
  console.log(`Server running on http://localhost:${env.port}`);
});
