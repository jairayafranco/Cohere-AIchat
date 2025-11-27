import { createCohere } from '@ai-sdk/cohere';
import { streamText } from 'ai';

export const runtime = 'edge';

// Configuración desde variables de entorno
const CONFIG = {
    model: process.env.COHERE_MODEL || 'command-nightly',
    maxTokens: parseInt(process.env.MAX_TOKENS || '500', 10), // Reducido de 1000 a 500
    temperature: parseFloat(process.env.TEMPERATURE || '0.7'),
    maxPromptLength: parseInt(process.env.MAX_PROMPT_LENGTH || '500', 10), // Reducido de 2000 a 500
};

/**
 * Valida el prompt recibido
 */
function validatePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        return { valid: false, error: 'El prompt debe ser un texto válido' };
    }

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length === 0) {
        return { valid: false, error: 'El prompt no puede estar vacío' };
    }

    if (trimmedPrompt.length > CONFIG.maxPromptLength) {
        return {
            valid: false,
            error: `El prompt no puede exceder ${CONFIG.maxPromptLength} caracteres`,
        };
    }

}

export async function POST(req) {
    try {
        // Verificar que existe la API key
        if (!process.env.COHERE_API_KEY) {
            console.error('COHERE_API_KEY no está configurada');
            return new Response(
                JSON.stringify({ error: 'Configuración del servidor incompleta' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Parsear y validar el body
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return new Response(
                JSON.stringify({ error: 'Formato de solicitud inválido' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { prompt } = body;

        // Validar el prompt
        const validation = validatePrompt(prompt);
        if (!validation.valid) {
            return new Response(
                JSON.stringify({ error: validation.error }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Crear cliente de Cohere
        const cohere = createCohere({
            apiKey: process.env.COHERE_API_KEY,
        });

        // Generar respuesta con streaming
        const result = await streamText({
            model: cohere(CONFIG.model),
            prompt: validation.prompt,
            maxTokens: CONFIG.maxTokens,
            temperature: CONFIG.temperature,
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error('Error en /api/chat:', error);

        // Manejar errores específicos de Cohere
        if (error.message?.includes('API key')) {
            return new Response(
                JSON.stringify({ error: 'Error de autenticación con Cohere' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Error genérico
        return new Response(
            JSON.stringify({ error: 'Error interno del servidor' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}