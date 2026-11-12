import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export const DIFFICULTIES = ['easy', 'medium', 'hard'];

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    topic: { type: String, required: true },
    // these stay null until the question is answered
    answer: { type: String, default: null },
    score: { type: Number, default: null, min: 1, max: 10 },
    feedback: { type: String, default: null },
    sampleAnswer: { type: String, default: null },
    answeredAt: { type: Date, default: null },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    role: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    resumeName: { type: String, required: true },
    questions: [questionSchema],
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
    averageScore: { type: Number, default: null },
    weakAreas: [String],
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

interviewSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Interview', interviewSchema);
