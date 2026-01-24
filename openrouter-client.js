// OpenRouter Client (Secure Backend Proxy)
// Forward requests to your Cloudflare Worker. No Keys stored in browser.

const OpenRouter = {
    // 1. Connectivity Check
    isConfigured() {
        return CONFIG.WORKER_URL && CONFIG.WORKER_URL !== "";
    },

    // 2. AI Inference (Proxy Call)
    async analyze(text) {
        if (!this.isConfigured()) {
            console.log("🌐 OpenRouter: Proxy URL missing. Using Offline Brain.");
            return null;
        }

        console.log("🌐 OpenRouter: Calling Secure Proxy...");
        try {
            const response = await fetch(CONFIG.WORKER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert Physiotherapist AI. Analyze the patient's problem statement. Output strictly the 'Likely Medical Cause' (e.g. 'Acute Lumbar Strain'). Keep it concise (under 15 words). Do not give advice yet. Output ONLY the cause."
                        },
                        {
                            "role": "user",
                            "content": text
                        }
                    ]
                })
            });

            if (!response.ok) {
                console.warn(`🌐 Proxy Error: ${response.status}`);
                return null;
            }

            const data = await response.json();

            // Check for OpenRouter standard response structure or Worker error
            if (data.error) {
                console.warn("🌐 Proxy Handled Error:", data.error);
                return null;
            }

            const cause = data.choices?.[0]?.message?.content?.trim();
            console.log("🌐 OpenRouter Result:", cause);
            return cause;

        } catch (e) {
            console.warn("🌐 Proxy Connection Failed (Falling back to TFJS):", e);
            return null;
        }
    }
};

window.OpenRouter = OpenRouter;
console.log("✅ OpenRouter Client Loaded. API URL:", CONFIG.WORKER_URL);
