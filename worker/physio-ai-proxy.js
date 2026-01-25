/**
 * Cloudflare Worker: Physio AI Proxy
 * 
 * This worker acts as a secure backend proxy for the PhysioAssist app.
 * It hides the API key from the browser and forwards requests to Gemini.
 * 
 * DEPLOYMENT:
 * 1. Go to https://dash.cloudflare.com/ -> Workers & Pages -> Create Application -> Create Worker
 * 2. Paste this entire file content into the worker editor
 * 3. Go to Settings -> Variables -> Add Variable:
 *    - Name: GEMINI_API_KEY
 *    - Type: Secret
 *    - Value: (Your Gemini API Key from aistudio.google.com)
 * 4. Click "Save and Deploy"
 * 5. Copy your Worker URL (e.g., https://physio-ai-proxy.YOUR_NAME.workers.dev)
 * 6. Paste the URL into your frontend config.js
 */

// DEPLOYMENT INSTRUCTIONS:
// 1. npx wrangler deploy
// 2. npx wrangler secret put OPENROUTER_API_KEY
//    (Paste your key when prompted)

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
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
            const { messages } = body; // Expecting Chat Messages array for OpenRouter

            if (!messages) {
                return new Response(JSON.stringify({ error: 'Missing messages' }), { status: 400 });
            }

            // SECURE KEY INJECTION (Secret from Env)
            const API_KEY = env.OPENROUTER_API_KEY;
            if (!API_KEY) {
                return new Response(JSON.stringify({ error: 'Server misconfiguration: Missing API Key' }), { status: 500 });
            }

            // Proxy to OpenRouter
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "HTTP-Referer": "https://physioassist.workers.dev",
                    "X-Title": "PhysioAssist Backend",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": body.model || "google/gemini-2.0-flash-exp:free", // Support Client Model Selection
                    "messages": messages
                })
            });

            const data = await response.json();
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
