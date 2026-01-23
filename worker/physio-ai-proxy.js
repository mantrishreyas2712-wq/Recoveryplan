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

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }

        try {
            // Get request body (patient data from frontend)
            const body = await request.json();
            const { prompt } = body;

            if (!prompt) {
                return new Response(JSON.stringify({ error: 'Missing prompt' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                });
            }

            // Call Gemini API with secret key (hidden from browser)
            const GEMINI_API_KEY = env.GEMINI_API_KEY;
            if (!GEMINI_API_KEY) {
                return new Response(JSON.stringify({ error: 'API key not configured' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                });
            }

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

            const geminiResponse = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 2048,
                    },
                }),
            });

            if (!geminiResponse.ok) {
                const errorText = await geminiResponse.text();
                console.error('Gemini Error:', errorText);
                return new Response(JSON.stringify({ error: 'AI service error', details: errorText }), {
                    status: geminiResponse.status,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                });
            }

            const geminiData = await geminiResponse.json();

            // Extract text from Gemini response
            const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

            return new Response(JSON.stringify({ success: true, response: aiText }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

        } catch (error) {
            console.error('Worker Error:', error);
            return new Response(JSON.stringify({ error: 'Internal server error', message: error.message }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }
    },
};
