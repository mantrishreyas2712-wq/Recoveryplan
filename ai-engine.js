const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'openai') return CONFIG.OPENAI_API_KEY;
        return '';
    }
};

// --- VERIFIED EXERCISE LIBRARY ---
const EXERCISE_LIBRARY = {
    'chin tuck': 'E_Wf8_7S4gQ', 'neck tilt': '0eO1aB6U72c', 'upper trap': '1Y1_T7y7KzI',
    'levator scapulae': 'W6vOwhlVq_Q', 'neck rotation': 'Xk8jN5qfC3o',
    'pendulum': 'GFbCDbE86-A', 'doorway stretch': 'lZ8qZ0y-cRk', 'wall slide': '33P5AI27ejU',
    'shoulder roll': 'qGL_6c8dZVQ', 'scapular': '33P5AI27ejU',
    'cat cow': 'sJq0jW4_P68', 'childs pose': 'Eq6oMDi00n4', 'knee to chest': 'bJzM6k9gZ24',
    'superman': 'cc6UVRS7TXw', 'bridge': 'N3lS97aGf-Q', 'mcgill': '2_e4I-brfqs', 'cobra': 'fOdrW7nf9gw',
    'quad set': 'I7C7nF9i8aU', 'straight leg': 'L8Z_F2qR0lY', 'heel slide': '02sW4F11i_E',
    'step up': 'dVVQyZ0RjYk', 'hamstring': 'JWqNgy9w54s', 'clam': '7L0sT5XwK5s',
    'ankle alphabet': 'vvlZ4b19E50', 'calf raise': 'M4Cj4h9bXM', 'towel': '9q0Wj2_8eK0',
    'wrist flexor': 'Ejl47X2-G2w', 'wrist extensor': 'Ejl47X2-G2w', 'tendon': 'VlKeRWz4Z2c'
};

function findVerifiedVideo(exerciseName) {
    if (!exerciseName) return null;
    const cleanName = exerciseName.toLowerCase();
    for (const [key, id] of Object.entries(EXERCISE_LIBRARY)) {
        if (cleanName.includes(key)) return id;
    }
    return null;
}

// --- MAIN AI ENGINE ---
async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // MEDICAL HISTORY
    const conditions = [];
    if (patientData.condition_diabetes) conditions.push("Diabetes");
    if (patientData.condition_bp) conditions.push("High Blood Pressure");
    if (patientData.condition_heart) conditions.push("Heart Conditions");
    const historyString = conditions.length > 0 ? conditions.join(", ") : "None";
    const surgeryStatus = patientData.recentSurgery !== 'no' ? `Recent Surgery: ${patientData.recentSurgery}` : "No Recent Surgery";

    // 1. FULL DETAILED PROMPT (For All Engines)
    const prompt = `
    You are an expert, empathetic Senior Physiotherapist. 
    Analyze the following patient profile deeply:
    - Name: ${patientData.name}
    - Age: ${patientData.age}
    - Profession: ${patientData.occupation}
    - Condition: ${patientData.problemArea}
    - Symptoms: ${patientData.problemStatement}
    - Diet: ${patientData.dietPreference}
    - MEDICAL HISTORY: ${historyString}
    - SURGICAL STATUS: ${surgeryStatus}
    
    INSTRUCTIONS:
    1. Speak directly to ${patientData.name} in a warm, reassuring tone.
    2. Acknowledge their specific age and profession.
    3. Suggest 3 specific exercises. Use standard names like "Chin Tucks", "Cat Cow", "Quad Sets" where possible.
    
    RETURN ONLY JSON (No markdown):
    {
      "analysis": { 
        "understanding": "Hello [Name]...", 
        "likelyCauses": "...", 
        "severity": "...", 
        "prognosis": "..." 
      },
      "exercisePlan": { 
        "selectedExercises": [ 
          { "name": "...", "sets": "...", "reps": "...", "difficulty": "...", "description": "..." } 
        ] 
      },
      "dietRecommendations": { 
        "overview": "...", 
        "keyFoods": ["..."], 
        "foodsToAvoid": ["..."], 
        "hydration": "..." 
      },
      "consultation": { 
        "urgency": "...", 
        "specialists": ["..."], 
        "redFlags": ["..."], 
        "followUp": "..." 
      },
      "recoveryTimeline": { "week1": "...", "week2_3": "...", "longTerm": "..." }
    }`;

    let aiResponseText = null;

    // --- ENGINE 1: OPENAI / CHATANYWHERE (User Key) ---
    try {
        const key = ApiManager.getKey('openai');
        if (key && (key.startsWith('sk-') || key.length > 10)) {
            const baseUrl = (typeof CONFIG !== 'undefined' && CONFIG.OPENAI_BASE_URL)
                ? CONFIG.OPENAI_BASE_URL
                : "https://api.openai.com/v1";

            const apiUrl = baseUrl.endsWith('/') ? `${baseUrl}chat/completions` : `${baseUrl}/chat/completions`;

            console.log(`Using Custom API Key via ${apiUrl}`);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], temperature: 0.7 })
            });

            if (response.ok) {
                const data = await response.json();
                aiResponseText = data.choices[0].message.content;
            }
        }
    } catch (err) { console.warn("OpenAI Key Failed:", err); }

    // --- ENGINE 2: POLLINATIONS OPENAI PROXY (Primary Free, Unlimited, POST) ---
    // Why this works: OpenAI-compatible format creates a "Chat" context, allowing LONG prompts via POST.
    if (!aiResponseText) {
        try {
            console.log("Attempting Pollinations (OpenAI Proxy Mode)...");

            const pollUrl = 'https://text.pollinations.ai/openai/chat/completions';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 40000); // 40s Safety

            const response = await fetch(pollUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'gpt-4o-mini', // Requesting high quality
                    messages: [{ role: 'user', content: prompt }]
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                aiResponseText = data.choices[0].message.content;
            }
        } catch (err) {
            console.warn("Pollinations Proxy Failed:", err);
        }
    }

    // --- ENGINE 3: PUTER (Backup Free Engine) ---
    if (!aiResponseText) {
        try {
            console.log("Loading Puter as Backup...");
            await ensurePuterLoaded();
            if (typeof puter !== 'undefined' && puter.ai) {
                const response = await puter.ai.chat(prompt);
                aiResponseText = typeof response === 'string' ? response : (response?.message?.content || response?.toString());
            }
        } catch (err) {
            console.warn("Puter AI Failed:", err);
        }
    }

    // --- PARSE & FINALIZE ---
    if (aiResponseText) {
        try {
            const plan = processAIResponse(aiResponseText);
            return enrichWithSmartLinks(plan);
        } catch (e) {
            console.error("AI Parse Error:", e);
            throw new Error("AI data corrupted. Please retry.");
        }
    }

    // --- STRICT FAILURE (No Offline) ---
    throw new Error("AI Busy. Please check internet & retry.");
}

// Helper: Lazy Load Puter (Only if needed)
async function ensurePuterLoaded() {
    if (typeof puter !== 'undefined') return;
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Puter script"));
        document.head.appendChild(script);
        setTimeout(() => reject(new Error("Puter Load Timeout")), 8000);
    });
}

// --- ENRICHMENT LOGIC ---
const STOCK_IMAGES = [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80',
    'https://images.unsplash.com/photo-1544367563-12123d8959bd?w=600&q=80',
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80'
];

function getStockThumbnail(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    const index = Math.abs(hash) % STOCK_IMAGES.length;
    return STOCK_IMAGES[index];
}

const EQUIPMENT_MAP = {
    'band': 'https://www.amazon.in/s?k=resistance+bands+physio&tag=YOUR_TAG_HERE',
    'ball': 'https://www.amazon.in/s?k=exercise+ball+physio&tag=YOUR_TAG_HERE',
    'roller': 'https://www.amazon.in/s?k=foam+roller&tag=YOUR_TAG_HERE',
    'dumbbell': 'https://www.amazon.in/s?k=dumbbells+1kg&tag=YOUR_TAG_HERE',
    'weight': 'https://www.amazon.in/s?k=ankle+weights+physio&tag=YOUR_TAG_HERE',
    'towel': 'https://www.amazon.in/s?k=microfiber+gym+towel&tag=YOUR_TAG_HERE',
    'mat': 'https://www.amazon.in/s?k=yoga+mat+thick&tag=YOUR_TAG_HERE'
};

function enrichWithEquipment(aiPlan) {
    if (aiPlan.exercisePlan?.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex) => {
            let equipLink = null;
            let equipName = null;
            const lowerName = ex.name.toLowerCase();
            const lowerDesc = (ex.description || '').toLowerCase();
            for (const [key, url] of Object.entries(EQUIPMENT_MAP)) {
                if (lowerName.includes(key) || lowerDesc.includes(key)) {
                    equipLink = url;
                    equipName = key.charAt(0).toUpperCase() + key.slice(1);
                    break;
                }
            }
            return { ...ex, equipmentUrl: equipLink, equipmentName: equipName };
        });
    }
    return aiPlan;
}

function enrichWithSmartLinks(aiPlan) {
    aiPlan = enrichWithEquipment(aiPlan);
    if (aiPlan.exercisePlan?.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex) => {
            const verifiedId = findVerifiedVideo(ex.name);
            const query = encodeURIComponent(`${ex.name} exercise physical therapy short`);
            let thumbUrl = getStockThumbnail(ex.name || 'exercise');
            let videoUrl = `https://www.youtube.com/results?search_query=${query}`;
            if (verifiedId && verifiedId.length > 5 && !verifiedId.includes(' ')) {
                thumbUrl = `https://img.youtube.com/vi/${verifiedId}/mqdefault.jpg`;
            }
            return { ...ex, type: 'search', thumbnailUrl: thumbUrl, videoUrl: videoUrl };
        });
    }
    return aiPlan;
}

function processAIResponse(text) {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
}
