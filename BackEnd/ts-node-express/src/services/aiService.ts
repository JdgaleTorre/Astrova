import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateAsteroidSummary = async (asteroidData: any): Promise<any> => {
    const prompt = `Analyze this Near-Earth Object (NEO) data and provide an informative summary:

Asteroid Data:
${JSON.stringify(asteroidData, null, 2)}

Provide a concise summary in JSON format with:
- "title": A descriptive title about these asteroids
- "summary": An informative 2-3 paragraph summary explaining the data
- "keyInsights": Array of 3-5 key insights from the data
- "threatAssessment": Assessment of any potentially hazardous asteroids`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: "You are a knowledgeable astronomy expert providing clear, informative summaries about near-Earth objects."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return content ? JSON.parse(content) : null;
};
