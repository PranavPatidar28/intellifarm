import { NextRequest } from 'next/server';

// Types for the request body
interface ChatRequest {
    message: string;
    history?: Array<{
        role: 'user' | 'assistant';
        content: string;
    }>;
}

// Agricultural expert system prompt
const SYSTEM_PROMPT = `You are IntelliFarm AI, an expert agricultural assistant designed specifically for Indian farmers. You have deep knowledge in:

1. **Crop Cultivation**: Best practices for growing crops like wheat, rice, maize, cotton, sugarcane, pulses, vegetables, and fruits in Indian conditions.

2. **Soil Management**: Understanding soil types (loamy, clay, sandy, alluvial), pH levels, nutrient content (NPK), and soil health improvement.

3. **Weather & Seasons**: Indian agricultural seasons (Kharif, Rabi, Zaid), monsoon patterns, and climate-smart farming practices.

4. **Pest & Disease Management**: Identification and organic/chemical treatment of common crop diseases and pest infestations.

5. **Water Management**: Irrigation techniques, water conservation, and drought management strategies.

6. **Market Information**: Understanding mandi prices, MSP (Minimum Support Price), and best selling practices.

7. **Government Schemes**: Knowledge of PM-KISAN, crop insurance, subsidies, and other farmer welfare programs.

8. **Modern Farming**: Precision agriculture, organic farming certification, and sustainable practices.

Guidelines:
- Be friendly, supportive, and encouraging to farmers
- Provide practical, actionable advice
- Use simple language that's easy to understand
- Include specific measurements, timings, and quantities when relevant
- Mention local/traditional practices when applicable
- Be concise but thorough - farmers are busy people
- If you're unsure about something specific to their region, ask for more details
- Support both Hindi and English queries

Remember: Your advice can significantly impact a farmer's livelihood, so be accurate and helpful.`;

export async function POST(request: NextRequest) {
    try {
        const body: ChatRequest = await request.json();
        const { message, history = [] } = body;

        if (!message?.trim()) {
            return new Response(
                JSON.stringify({ error: 'Message is required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
        const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

        // Build conversation context
        const conversationContext = history
            .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
            .join('\n');

        const fullPrompt = conversationContext
            ? `${conversationContext}\nUser: ${message}\nAssistant:`
            : `User: ${message}\nAssistant:`;

        // Call Ollama with streaming
        const ollamaResponse = await fetch(`${ollamaBaseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: ollamaModel,
                prompt: fullPrompt,
                system: SYSTEM_PROMPT,
                stream: true,
            }),
        });

        if (!ollamaResponse.ok) {
            console.error('Ollama API error:', ollamaResponse.statusText);
            return new Response(
                JSON.stringify({
                    error: 'AI service is currently unavailable. Please try again later.',
                    fallback: true
                }),
                { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create a TransformStream to process Ollama's NDJSON stream
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const transformStream = new TransformStream({
            async transform(chunk, controller) {
                const text = decoder.decode(chunk, { stream: true });
                const lines = text.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const json = JSON.parse(line);
                        if (json.response) {
                            controller.enqueue(encoder.encode(json.response));
                        }
                    } catch {
                        // Skip invalid JSON lines
                    }
                }
            },
        });

        // Pipe Ollama response through our transform stream
        const responseStream = ollamaResponse.body?.pipeThrough(transformStream);

        return new Response(responseStream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : 'Internal Server Error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
