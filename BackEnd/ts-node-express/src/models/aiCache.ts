import mongoose from 'mongoose';

const aiCacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // hash of the prompt
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' }, // auto-delete after 7 days
});

export const AiCache = mongoose.model('AiCache', aiCacheSchema);
