import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import { HttpError } from './error.js';

const MAX_RESUME_CHARS = 12000;
const MIN_RESUME_CHARS = 100;

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new HttpError(400, 'Only PDF files are allowed'));
    }
    cb(null, true);
  },
}).single('resume');

// Turns an uploaded PDF into req.resumeData = { name, text }. Does nothing when no file was sent.
export async function readResume(req, res, next) {
  if (!req.file) return next();

  // the mimetype comes from the browser, so also check the file really starts like a PDF
  if (req.file.buffer.subarray(0, 5).toString() !== '%PDF-') {
    throw new HttpError(400, 'That file is not a valid PDF');
  }

  const parser = new PDFParse({ data: req.file.buffer });
  let raw;
  try {
    raw = (await parser.getText()).text;
  } catch {
    throw new HttpError(400, 'Could not read this PDF. Try saving it again as a PDF and re-uploading.');
  } finally {
    await parser.destroy();
  }

  // pdf-parse adds "-- 1 of 2 --" between pages, which is noise for the AI
  const text = raw
    .replace(/-- \d+ of \d+ --/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();

  if (text.length < MIN_RESUME_CHARS) {
    throw new HttpError(
      400,
      'We could not find enough text in this PDF. If it is a scanned image, export your resume from Word or Google Docs instead.'
    );
  }

  req.resumeData = {
    name: req.file.originalname.slice(0, 120),
    // long resumes are cut so the prompt stays a sensible size
    text: text.slice(0, MAX_RESUME_CHARS),
  };
  next();
}
