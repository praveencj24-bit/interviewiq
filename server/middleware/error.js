import multer from 'multer';

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express 5 forwards errors from async handlers here, so controllers do not need try/catch
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'The PDF must be 2 MB or smaller' });
    }
    return res.status(400).json({ message: 'Upload one PDF file in the "resume" field' });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: err.path === '_id' ? 'Invalid id' : `Invalid ${err.path}` });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0].message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'That record already exists' });
  }
  // body parser errors such as broken JSON or a body that is too large
  if (err.status && err.expose) {
    return res.status(err.status).json({ message: err.message });
  }

  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
}
