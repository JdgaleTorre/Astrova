import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();



const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NASA_API_KEY: z.string().min(1, 'NASA_API_KEY is required'),
  NASA_BASE_URL: z.string().url().default('https://api.nasa.gov/'),
  EPIC_BASE_URL: z.string().url().default('https://epic.gsfc.nasa.gov/'),
  IMAGES_BASE_URL: z.string().url().default('https://images-api.nasa.gov/'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
});

// validate on startup — crashes immediately with a clear message if anything is missing
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  process.stdout.write('❌ Invalid environment variables:\n');
  parsed.error.issues.forEach(err => {
    process.stdout.write(`   ${err.path.join('.')}: ${err.message}\n`);
  });
  process.exit(1);  // ← stop the server immediately
}

export const config = parsed.data;