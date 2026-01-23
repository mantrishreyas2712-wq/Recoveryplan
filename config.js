const CONFIG = {
    // ==========================================================================
    // SECURE BACKEND PROXY (Industry Standard)
    // ==========================================================================
    // Your API keys are now stored SAFELY on the Cloudflare Worker backend.
    // This URL points to your Worker that proxies requests to Gemini.
    // ==========================================================================

    // STEP 1: Deploy the Worker (see worker/physio-ai-proxy.js)
    // STEP 2: Paste your Worker URL below (e.g., https://physio-ai-proxy.yourname.workers.dev)
    WORKER_URL: "https://physio-ai-proxy.mantrishreyas2712.workers.dev",

    // ==========================================================================
    // LEGACY (Not recommended for production - keys exposed in browser)
    // ==========================================================================
    // OPENAI_API_KEY: "",
    // GEMINI_API_KEY: "",
    // OPENAI_BASE_URL: "",
};
