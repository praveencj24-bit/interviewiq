const required = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL', 'GEMINI_API_KEY'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing ${key}. Copy .env.example to .env and fill it in.`);
  }
}

const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrls: process.env.CLIENT_URL.split(',').map((url) => url.trim()),
  geminiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
  aiTimeoutMs: Number(process.env.AI_TIMEOUT_MS) || 30000,
};

export default env;
