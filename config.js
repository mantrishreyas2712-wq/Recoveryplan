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
    // GOOGLE SHEETS DATA COLLECTION
    // ==========================================================================
    // Patient form submissions are saved to Google Sheets
    // Set up: Create Google Apps Script with doPost function (see instructions below)
    // STEP 1: Create new Google Sheet
    // STEP 2: Extensions > Apps Script > Paste code from sheets-webhook.js
    // STEP 3: Deploy as Web App > Copy URL here
    SHEETS_WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbyuJhvmD-4oN0CwCfGz8BYCCgxKIZSjl_p4UYaJk24i0PmtCBzEOWh8glIr78kEgSesjw/exec",

    // ==========================================================================
    // LEGACY (Not recommended for production - keys exposed in browser)
    // ==========================================================================
    // OPENAI_API_KEY: "",
    // GEMINI_API_KEY: "",
    // OPENAI_BASE_URL: "",
};
