import OpenAI from 'openai';
import crypto from 'crypto';
import { AiCache } from '../models/aiCache.js';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// generate a unique key from the prompt
const generateKey = (prompt: string): string => {
  return crypto.createHash('md5').update(prompt).digest('hex');
};

export const getAiResponse = async (prompt: string): Promise<string> => {
  const key = generateKey(prompt);

  // ── Check cache first ─────────────────────────────────
  const cached = await AiCache.findOne({ key });
  if (cached) {
    console.log('✅ AI cache hit:', key);
    return cached.response;
  }

  // ── Call OpenAI if not cached ─────────────────────────
  console.log('🤖 Calling OpenAI for:', key);
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini', // cheap and fast
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const response = completion.choices[0].message.content || '';

  // ── Save to cache ─────────────────────────────────────
  await AiCache.create({ key, prompt, response });

  return response;
};
