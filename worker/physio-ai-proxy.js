/**
 * Cloudflare Worker: Physio AI Proxy (Hybrid v2)
 * Features:
 * - Robust CORS handling (Always returns headers)
 * - Hybrid Routing (SambaNova 90B Vision -> OpenRouter fallback)
 * - Improved Error Logging
 */

export default {
    async fetch(request, env, ctx) {
        // 1. CORS Headers Helper
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        };

        // 2. Handle Preflight
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

            // 3. Routing Logic (SambaNova)
            // Use 90B as it is the most stable Vision model on SN
            const isVisionRequest = model && (model.includes('Vision') || model.includes('Llama-3.2'));

            // Default: OpenRouter
            let targetUrl = "https://openrouter.ai/api/v1/chat/completions";
            let apiKey = env.OPENROUTER_API_KEY;
            let providerName = "OpenRouter";

            // SambaNova Override
            if (isVisionRequest && env.SAMBANOVA_API_KEY) {
                targetUrl = "https://api.sambanova.ai/v1/chat/completions";
                apiKey = env.SAMBANOVA_API_KEY;
                providerName = "SambaNova";
            }

            if (!apiKey) {
                throw new Error(`Missing API Key for ${providerName}`);
            }

            // 4. Upstream Request
            const response = await fetch(targetUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://physioassist.workers.dev", // For OpenRouter
                },
                body: JSON.stringify({
                    model: model, // Client sends exact ID
                    messages: messages,
                    max_tokens: 1000
                    // Note: SambaNova fails if you send extra unsupported params
                })
            });

            // 5. Handle Upstream Errors (Seamless Fallback Logic Optional?)
            // For now, let's just return the error gracefully with CORS
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`${providerName} Failed [${response.status}]:`, errorText);

                // If SambaNova fails, we could try OpenRouter here... 
                // But let's verify connectivity first.
                return new Response(JSON.stringify({
                    error: `Upstream Error (${providerName}): ${response.status} - ${errorText.substring(0, 200)}`
                }), {
                    status: 500, // Or response.status? 
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            const data = await response.json();

            // 6. Success
            return new Response(JSON.stringify(data), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });

        } catch (error) {
            // 7. Global Catch (Always CORS)
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
    },
};
