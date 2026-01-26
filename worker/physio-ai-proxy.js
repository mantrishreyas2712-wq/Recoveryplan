export default {
    async fetch(request, env, ctx) {
        // 1. CONSTANT CORS HEADERS
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        try {
            const body = await request.json();
            const { messages, model } = body;

            // 2. ROUTING CONFIG
            const isVisionRequest = model && (model.includes('Vision') || model.includes('Llama-3.2'));

            // Primary: SambaNova (if Vision & Key exists)
            // Secondary: OpenRouter
            let useSambaNova = isVisionRequest && env.SAMBANOVA_API_KEY;

            // 3. EXECUTION FUNCTION
            const callProvider = async (provider, requestModel, requestMessages) => {
                let url, key;
                if (provider === 'SambaNova') {
                    url = "https://api.sambanova.ai/v1/chat/completions";
                    key = env.SAMBANOVA_API_KEY;
                } else {
                    url = "https://openrouter.ai/api/v1/chat/completions";
                    key = env.OPENROUTER_API_KEY;
                }

                if (!key) throw new Error(`Missing API Key for ${provider}`);

                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${key}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://physioassist.workers.dev",
                    },
                    body: JSON.stringify({
                        model: requestModel,
                        messages: requestMessages,
                        max_tokens: 1000
                    })
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`${provider} Failed [${response.status}]: ${text.substring(0, 200)}`);
                }
                return await response.json();
            };

            let data;

            // 4. ATTEMPT 1: SAMBANOVA
            if (useSambaNova) {
                try {
                    // Try 90B or 11B (Client sends exact ID, but we can override if needed)
                    // We stick to what client requested for now: Llama-3.2-90B
                    data = await callProvider('SambaNova', model, messages);
                } catch (snError) {
                    console.error("⚠️ SambaNova Failed. Falling back to OpenRouter...", snError.message);
                    // FALLBACK TRIGGERED
                    useSambaNova = false;
                }
            }

            // 5. ATTEMPT 2: OPENROUTER (Fallback or Default)
            if (!useSambaNova && !data) {
                const fallbackModel = "google/gemini-2.0-flash-exp:free";
                // If the original model was already an OpenRouter one, keep it. 
                // If it was a SambaNova one, switch to Gemini.
                const finalModel = isVisionRequest ? fallbackModel : model;

                data = await callProvider('OpenRouter', finalModel, messages);
            }

            // 6. SUCCESS
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            // 7. GLOBAL ERROR
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    },
};
