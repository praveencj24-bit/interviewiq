import Interview from '../models/Interview.js';
import Analysis from '../models/Analysis.js';
import { HttpError } from '../middleware/error.js';
import { askJson, checkQuestions, checkFeedback } from '../config/ai.js';
import { questionsPrompt, questionsSchema, answerPrompt, answerSchema } from '../prompts.js';

const WEAK_SCORE = 6;

export async function addInterview(req, res) {
  const { role, difficulty } = req.body;
  let resume = req.resumeData;

  // no upload means: reuse the resume from the latest analysis
  if (!resume) {
    const latest = await Analysis.findOne({ user: req.userId })
      .sort({ createdAt: -1 })
      .select('resumeName +resumeText');
    if (!latest) {
      throw new HttpError(400, 'Please upload your resume as a PDF');
    }
    resume = { name: latest.resumeName, text: latest.resumeText };
  }

  const questions = await askJson(
    questionsPrompt({ role, difficulty, resume: resume.text }),
    questionsSchema,
    checkQuestions
  );

  const interview = await Interview.create({
    user: req.userId,
    role,
    difficulty,
    resumeName: resume.name,
    questions,
  });
  res.status(201).json(interview);
}

export async function getInterview(req, res) {
  const interview = await Interview.findOne({ _id: req.params.id, user: req.userId });
  if (!interview) {
    throw new HttpError(404, 'Interview not found');
  }
  res.json(interview);
}

export async function addAnswer(req, res) {
  const { questionIndex, answer } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, user: req.userId });
  if (!interview) {
    throw new HttpError(404, 'Interview not found');
  }
  if (interview.status === 'completed') {
    throw new HttpError(409, 'This interview is already finished');
  }

  const current = interview.questions.findIndex((q) => q.score === null);
  if (questionIndex !== current) {
    throw new HttpError(409, 'That question has already been answered. Reload the page to continue.');
  }

  const result = await askJson(
    answerPrompt({
      role: interview.role,
      difficulty: interview.difficulty,
      question: interview.questions[current].question,
      answer,
    }),
    answerSchema,
    checkFeedback
  );

  // The AI call takes a few seconds, so only save if this question is still unanswered.
  // That stops a double submit from scoring the same question twice.
  const path = `questions.${current}`;
  const updated = await Interview.findOneAndUpdate(
    { _id: interview._id, [`${path}.score`]: null },
    {
      $set: {
        [`${path}.answer`]: answer,
        [`${path}.score`]: result.score,
        [`${path}.feedback`]: result.feedback,
        [`${path}.sampleAnswer`]: result.sampleAnswer,
        [`${path}.answeredAt`]: new Date(),
      },
    },
    { returnDocument: 'after' }
  );
  if (!updated) {
    throw new HttpError(409, 'That question has already been answered. Reload the page to continue.');
  }

  if (updated.questions.every((q) => q.score !== null)) {
    const scores = updated.questions.map((q) => q.score);
    updated.averageScore = Math.round((scores.reduce((sum, s) => sum + s, 0) / scores.length) * 10) / 10;
    // lowest scores first, one entry per topic
    const weak = updated.questions
      .filter((q) => q.score <= WEAK_SCORE)
      .sort((a, b) => a.score - b.score)
      .map((q) => q.topic);
    updated.weakAreas = [...new Set(weak)];
    updated.status = 'completed';
    updated.completedAt = new Date();
    await updated.save();
  }

  res.json(updated);
}
