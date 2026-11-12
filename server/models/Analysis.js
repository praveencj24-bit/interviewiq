import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const analysisSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    resumeName: { type: String, required: true },
    // kept so a mock interview can reuse the last resume, but never sent to the client
    resumeText: { type: String, required: true, select: false },
    jobDescription: { type: String, required: true },
    jobTitle: { type: String, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, required: true },
    strengths: [String],
    missingSkills: [String],
    suggestions: [String],
  },
  { timestamps: true, versionKey: false }
);

analysisSchema.index({ user: 1, createdAt: -1 });

analysisSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.resumeText;
    return ret;
  },
});

export default mongoose.model('Analysis', analysisSchema);
