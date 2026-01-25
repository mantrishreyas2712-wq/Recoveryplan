// OpenRouter Client (Secure Backend Proxy)
// Forward requests to your Cloudflare Worker. No Keys stored in browser.

const OpenRouter = {
    // 1. Connectivity Check
    isConfigured() {
        return CONFIG.WORKER_URL && CONFIG.WORKER_URL !== "";
    },

    // 2. AI Inference (Proxy Call)
    async analyze(text, systemInstruction = null, modelOverride = null) {
        if (!this.isConfigured()) {
            console.log("🌐 OpenRouter: Proxy URL missing. Using Offline Brain.");
            return null;
        }

        const defaultSystem = "You are an expert Physiotherapist AI. Analyze the patient's problem statement. Output strictly the 'Likely Medical Cause' (e.g. 'Acute Lumbar Strain'). Keep it concise (under 15 words). Do not give advice yet. Output ONLY the cause.";
        const finalSystem = systemInstruction || defaultSystem;

        // HYBRID STRATEGY: Use DeepSeek for Text, Gemini for Vision
        const selectedModel = modelOverride || "deepseek/deepseek-chat";

        // Text Failover Queue (DeepSeek -> Llama 3.1 405B -> Gemini 2.0)
        // Only use failover if we are in "Text Mode" (default)
        const TEXT_FAILOVER = [
            "deepseek/deepseek-chat",
            "meta-llama/llama-3.1-405b-instruct:free",
            "google/gemini-2.0-flash-exp:free"
        ];

        const modelsToTry = (modelOverride || !selectedModel.includes('deepseek')) ? [selectedModel] : TEXT_FAILOVER;

        for (const model of modelsToTry) {
            console.log(`🌐 OpenRouter: Calling Secure Proxy (${model})...`);
            try {
                const response = await fetch(CONFIG.WORKER_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": model,
                        "messages": [
                            { "role": "system", "content": finalSystem },
                            { "role": "user", "content": text } // 'text' can be string or array (multimodal)
                        ]
                    })
                });

                if (!response.ok) {
                    console.warn(`🌐 Proxy Error (${model}): ${response.status}`);
                    continue; // Try next model
                }

                const data = await response.json();

                // Check for OpenRouter standard response structure or Worker error
                if (data.error) {
                    console.warn(`🌐 Proxy Handled Error (${model}):`, data.error);
                    if (data.error.code === 429 || data.error.code === 502) continue; // Retry on busy/down
                    return null; // Fatal error
                }

                const cause = data.choices?.[0]?.message?.content?.trim();
                console.log(`🌐 OpenRouter Result (${model}):`, cause);
                return cause;

            } catch (e) {
                console.warn(`🌐 Proxy Connection Failed (${model}):`, e);
                // Try next model
            }
        }

        console.error("❌ All AI Text Models Failed.");
        return null;
    }
};

window.OpenRouter = OpenRouter;
console.log("✅ OpenRouter Client Loaded. API URL:", CONFIG.WORKER_URL);
