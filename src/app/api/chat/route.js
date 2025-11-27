import { createCohere } from '@ai-sdk/cohere';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req) {
    const { prompt } = await req.json();

    const cohere = createCohere({
        apiKey: process.env.COHERE_API_KEY,
    });

    const result = await streamText({
        model: cohere('command-nightly'),
        prompt,
        maxTokens: 1000,
        temperature: 1.2,
    });

    return result.toTextStreamResponse();
}