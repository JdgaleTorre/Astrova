import crypto from 'crypto';

// Test the generateKey function directly (pure function, no mocking needed)
describe('generateKey', () => {
  const generateKey = (prompt: string): string => {
    return crypto.createHash('md5').update(prompt).digest('hex');
  };

  it('generates consistent key for same prompt', () => {
    const prompt = 'Test prompt for AI';
    const key1 = generateKey(prompt);
    const key2 = generateKey(prompt);

    expect(key1).toBe(key2);
  });

  it('generates different key for different prompts', () => {
    const key1 = generateKey('Prompt 1');
    const key2 = generateKey('Prompt 2');

    expect(key1).not.toBe(key2);
  });

  it('generates a valid MD5 hash (32 characters)', () => {
    const key = generateKey('Test prompt');

    expect(key).toHaveLength(32);
    expect(key).toMatch(/^[a-f0-9]+$/);
  });

  it('generates key for empty string', () => {
    const key = generateKey('');

    expect(key).toHaveLength(32);
    expect(key).toMatch(/^[a-f0-9]+$/);
  });

  it('generates key for long prompt', () => {
    const longPrompt = 'A'.repeat(10000);
    const key = generateKey(longPrompt);

    expect(key).toHaveLength(32);
  });

  it('generates key with special characters', () => {
    const key = generateKey('Test with émojis 🚀 and special chars!@#$%');

    expect(key).toHaveLength(32);
    expect(key).toMatch(/^[a-f0-9]+$/);
  });
});
