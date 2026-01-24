# Step-by-Step Deployment Guide (Web Dashboard)

Since we cannot use command-line tools here, you will deploy using the **Cloudflare Browser Dashboard**. It is easy and secure.

## Step 1: Create the Worker
1.  Open [Cloudflare Dashboard](https://dash.cloudflare.com/) in your browser.
2.  Go to **Workers & Pages** -> **Overview**.
3.  Click **Create Application** -> **Create Worker**.
4.  Name it: `physio-ai-proxy`.
5.  Click **Deploy** (this deploys correct "Hello World" code first).
6.  Click **Edit Code**.

## Step 2: Paste the Proxy Code
1.  In the Cloudflare Editor, delete the existing `worker.js` content.
2.  Open the file `worker/physio-ai-proxy.js` on your computer (or copy it from this project).
3.  **Copy EVERYTHING** from `physio-ai-proxy.js`.
4.  **Paste** it into the Cloudflare Editor.
5.  Click **Save and Deploy** (Top Right).

## Step 3: Add Your Secret Key (Crucial Step)
1.  Go back to the Worker's **Settings** tab (exit the code editor).
2.  Click **Variables and Secrets**.
3.  Click **Add**.
4.  **Variable name:** `OPENROUTER_API_KEY`
5.  **Value:** (Paste your actual OpenRouter Key here, e.g., `sk-or-v1-...`)
6.  Click **Encrypt** (or "Secret").
7.  Click **Save** and **Deploy** again if prompted.

## Step 4: Connect the App
1.  On the Worker's Overview page, copy the **Worker URL** (it looks like `https://physio-ai-proxy.yourname.workers.dev`).
2.  Open `config.js` in this project.
3.  Update the `WORKER_URL` line:
    ```javascript
    WORKER_URL: "https://physio-ai-proxy.yourname.workers.dev",
    ```
4.  **Done!** Save `config.js` and refresh your app.
