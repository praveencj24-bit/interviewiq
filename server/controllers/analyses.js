import Analysis from '../models/Analysis.js';
import { HttpError } from '../middleware/error.js';
import { askJson, checkAnalysis } from '../config/ai.js';
import { analysisPrompt, analysisSchema } from '../prompts.js';

export async function addAnalysis(req, res) {
  if (!req.resumeData) {
    throw new HttpError(400, 'Please upload your resume as a PDF');
  }
  const { jobDescription } = req.body;

  const result = await askJson(
    analysisPrompt({ resume: req.resumeData.text, jobDescription }),
    analysisSchema,
    checkAnalysis
  );

  const analysis = await Analysis.create({
    user: req.userId,
    resumeName: req.resumeData.name,
    resumeText: req.resumeData.text,
    jobDescription,
    ...result,
  });
  res.status(201).json(analysis);
}

export async function getAnalysis(req, res) {
  const analysis = await Analysis.findOne({ _id: req.params.id, user: req.userId });
  if (!analysis) {
    throw new HttpError(404, 'Analysis not found');
  }
  res.json(analysis);
}
