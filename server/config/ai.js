import { GoogleGenAI, ApiError } from '@google/genai';
import env from './env.js';
import { HttpError } from '../middleware/error.js';

const client = new GoogleGenAI({ apiKey: env.geminiKey });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(prompt, schema) {
  // the second model is only used when the first one keeps failing
  const models = [env.geminiModel, process.env.GEMINI_FALLBACK_MODEL].filter(Boolean);
  let lastError;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const signal = AbortSignal.timeout(env.aiTimeoutMs);
      try {
        const response = await client.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseJsonSchema: schema,
            temperature: 0.4,
            abortSignal: signal,
          },
        });
        return response.text;
      } catch (err) {
        if (signal.aborted) {
          throw new HttpError(504, 'The AI took too long to respond. Please try again.');
        }
        lastError = err;
        console.error(`Gemini request failed (${model}, attempt ${attempt}): ${err.message}`);
        const busy = err instanceof ApiError && (err.status === 503 || err.status === 429);
        if (!busy) break;
        await wait(2000);
      }
    }
  }

  if (lastError instanceof ApiError && (lastError.status === 503 || lastError.status === 429)) {
    throw new HttpError(503, 'The AI service is busy right now. Please wait a minute and try again.');
  }
  throw new HttpError(502, 'The AI service is not available right now. Please try again later.');
}

// The schema makes Gemini answer in JSON, but the values still have to be checked here.
// A reply that does not parse or fails the check gets one retry before the user sees an error.
export async function askJson(prompt, schema, check) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const text = await callModel(prompt, schema);
    try {
      return check(JSON.parse(text));
    } catch (err) {
      console.warn(`AI reply was not valid (attempt ${attempt}): ${err.message}`);
    }
  }
  throw new HttpError(502, 'The AI gave a reply we could not read. Please try again.');
}

function text(value, field, max) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is missing`);
  }
  return value.trim().slice(0, max);
}

function list(value, field, min, max) {
  if (!Array.isArray(value) || value.length < min) {
    throw new Error(`${field} needs at least ${min} items`);
  }
  return value.slice(0, max).map((item, i) => text(item, `${field}[${i}]`, 400));
}

function wholeNumber(value, field, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${field} must be a whole number from ${min} to ${max}`);
  }
  return value;
}

function object(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('reply is not a JSON object');
  }
  return data;
}

export function checkAnalysis(data) {
  object(data);
  return {
    jobTitle: text(data.jobTitle, 'jobTitle', 100),
    matchScore: wholeNumber(data.matchScore, 'matchScore', 0, 100),
    summary: text(data.summary, 'summary', 600),
    strengths: list(data.strengths, 'strengths', 1, 6),
    missingSkills: list(data.missingSkills, 'missingSkills', 0, 10),
    suggestions: list(data.suggestions, 'suggestions', 5, 5),
  };
}

export function checkQuestions(data) {
  object(data);
  if (!Array.isArray(data.questions) || data.questions.length < 5) {
    throw new Error('questions needs 5 items');
  }
  return data.questions.slice(0, 5).map((q, i) => {
    object(q);
    return {
      question: text(q.question, `questions[${i}].question`, 600),
      topic: text(q.topic, `questions[${i}].topic`, 60),
    };
  });
}

export function checkFeedback(data) {
  object(data);
  return {
    score: wholeNumber(data.score, 'score', 1, 10),
    feedback: text(data.feedback, 'feedback', 1000),
    sampleAnswer: text(data.sampleAnswer, 'sampleAnswer', 2000),
  };
}