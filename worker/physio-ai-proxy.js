/**
 * Cloudflare Worker: Physio AI Proxy (Hybrid: OpenRouter + SambaNova)
 * 
 * Routes:
 * - Text Models -> OpenRouter (DeepSeek, etc.)
 * - Vision Models -> SambaNova (Llama 3.2 Vision) for speed
 * 
 * SECRETS REQUIRED:
 * - OPENROUTER_API_KEY
 * - SAMBANOVA_API_KEY (Optional - if missing, falls back to OpenRouter)
 */

export default {
    async fetch(request, env, ctx) {
        // Cors Preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Max-Age': '86400',
                },
            });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
        }

        try {
            const body = await request.json();
            const { messages, model } = body;

            // ROUTING LOGIC
            // Check if it's a SambaNova-supported Vision model
            const isSambaNovaModel = model && (
                model.includes('Llama-3.2') && (model.includes('Vision') || model.includes('11B') || model.includes('90B'))
            );

            // DECIDE PROVIDER
            let providerUrl = "https://openrouter.ai/api/v1/chat/completions";
            let apiKey = env.OPENROUTER_API_KEY;
            let providerName = "OpenRouter";

            // If SambaNova is requested AND Key exists -> Route there
            if (isSambaNovaModel && env.SAMBANOVA_API_KEY) {
                providerUrl = "https://api.sambanova.ai/v1/chat/completions";
                apiKey = env.SAMBANOVA_API_KEY;
                providerName = "SambaNova";

                // SambaNova requires exact model ID mapping if different from client
                // But usually "Llama-3.2-11B-Vision-Instruct" works if that's what client sends.
                // We trust the client sends the correct ID.
            }

            if (!apiKey) {
                return new Response(JSON.stringify({ error: `Missing API Key for ${providerName}` }), { status: 500 });
            }

            // PROXY REQUEST
            const response = await fetch(providerUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    // OpenRouter Specific Headers (Ignored by SambaNova)
                    "HTTP-Referer": "https://physioassist.workers.dev",
                    "X-Title": "PhysioAssist Backend"
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    // SambaNova might need max_tokens
                    max_tokens: 1000
                })
            });

            const data = await response.json();

            // Standardize potential error responses
            if (data.error) {
                console.error(`${providerName} Error:`, data.error);
                return new Response(JSON.stringify({ error: data.error }), { status: 500 });
            }

            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }
    },
};
