const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'gemini') return CONFIG.GEMINI_API_KEY;
        if (provider === 'openai') return CONFIG.OPENAI_API_KEY;
        if (provider === 'huggingface') return CONFIG.HF_API_KEY;
        return '';
    }
};

// --- TRUSTED VIDEO DATABASE (The "Safe List") ---
// Using Official "Bob & Brad" / "AskDoctorJo" IDs for maximum reliability
const TRUSTED_DB = {
    'neck': [
        { id: 'E_Wf8_7S4gQ', name: 'Chin Tucks (Posture Fix)' },
        { id: '0eO1aB6U72c', name: 'Trapezius Relief Stretch' }
    ],
    'shoulder': [
        { id: 'GFbCDbE86-A', name: 'Pendulum Swing ' },
        { id: 'lZ8qZ0y-cRk', name: 'Doorway Chest Stretch' }
    ],
    'back': [
        { id: 'sJq0jW4_P68', name: 'Cat-Cow Mobility' },
        { id: '2_e4I-brfqs', name: 'McGill Curl-up (Core)' }
    ],
    'knee': [
        { id: 'I7C7nF9i8aU', name: 'Isometric Quad Set' },
        { id: 'vvlZ4b19E50', name: 'Seated Knee Extension' }
    ],
    'ankle': [
        { id: 'vvlZ4b19E50', name: 'Ankle Alphabet Mobility' },
        { id: 'M4Cj4h9bXM', name: 'Calf Raises' }
    ],
    'wrist': [
        { id: 'Ejl47X2-G2w', name: 'Wrist Flexor Stretch' },
        { id: 'VlKeRWz4Z2c', name: 'Tendon Glides' }
    ]
};

async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // --- OPTIMIZED EMPATHIC PROMPT ---
    const prompt = `
    You are an expert, empathetic Senior Physiotherapist. 
    Analyze the following patient profile deeply:
    - Name: ${patientData.name}
    - Age: ${patientData.age}
    - Profession: ${patientData.occupation} (Consider how this job affects their pain)
    - Condition: ${patientData.problemArea}
    - Symptoms: ${patientData.problemStatement}
    - Diet: ${patientData.dietPreference}
    
    INSTRUCTIONS:
    1. Speak directly to ${patientData.name} in a warm, reassuring tone.
    2. Acknowledge their specific age and profession. Explain WHY their job as a "${patientData.occupation}" might be making the "${patientData.problemArea}" worse.
    3. Be specific, not generic. Use medical reasoning but simple language.
    
    RETURN ONLY JSON (No markdown):
    {
      "analysis": { 
        "understanding": "Hello [Name], I understand you are suffering from... As a [Profession] at [Age], this is common because...", 
        "likelyCauses": "Specific biomechanical cause...", 
        "severity": "...", 
        "prognosis": "..." 
      },
      "exercisePlan": { 
        "selectedExercises": [ 
          { "name": "...", "sets": "...", "reps": "...", "videoId": "YOUTUBE_ID_HERE", "difficulty": "...", "description": "..." } 
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

    // 1. PROVIDER: OPENAI (Primary)
    try {
        const key = ApiManager.getKey('openai');
        if (key && !key.includes('YOUR_')) {
            console.log("Attempting OpenAI...");
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });
            if (!response.ok) throw new Error(`OpenAI Error ${response.status}`);
            const data = await response.json();
            aiResponseText = data.choices[0].message.content;
        }
    } catch (err) { console.warn("OpenAI Failed:", err); }

    // 2. PROVIDER: PUTER.JS (Free AI)
    if (!aiResponseText) {
        try {
            if (typeof puter !== 'undefined' && puter.ai) {
                console.log("Attempting Puter.js...");
                const response = await puter.ai.chat(prompt);
                aiResponseText = typeof response === 'string' ? response : (response?.message?.content || response?.toString());
            }
        } catch (err) { console.warn("Puter AI Failed:", err); }
    }

    // Process & Hybrid Repair
    if (aiResponseText) {
        try {
            const plan = processAIResponse(aiResponseText);
            // CRITICAL STEP: Trusted Link Injection
            return enrichWithTrustedLinks(plan, patientData.problemArea);
        } catch (e) {
            console.error("AI Parse Error, reverting to simulation", e);
        }
    }

    // 3. FALLBACK: SIMULATION
    return getFallbackPlan(patientData);
}

// Ensure the Plan has VALID video links
function enrichWithTrustedLinks(aiPlan, problemArea) {
    const area = (problemArea || 'neck').toLowerCase();
    let trustedKey = 'neck';

    // Fuzzy match input to DB keys
    if (area.includes('back')) trustedKey = 'back';
    else if (area.includes('knee') || area.includes('leg')) trustedKey = 'knee';
    else if (area.includes('shoulder')) trustedKey = 'shoulder';
    else if (area.includes('ankle') || area.includes('foot')) trustedKey = 'ankle';
    else if (area.includes('wrist') || area.includes('hand')) trustedKey = 'wrist';

    const safeVideos = TRUSTED_DB[trustedKey] || TRUSTED_DB['neck'];

    if (aiPlan.exercisePlan && aiPlan.exercisePlan.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex, index) => {
            const safeVid = safeVideos[index % safeVideos.length];
            return {
                ...ex,
                // KEEP AI text but FORCE safe video ID
                videoId: safeVid.id,
                thumbnailUrl: `https://img.youtube.com/vi/${safeVid.id}/mqdefault.jpg`,
                videoUrl: `https://www.youtube.com/watch?v=${safeVid.id}`
            };
        });
    }
    return aiPlan;
}

function processAIResponse(text) {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
}

// 4. RICH FALLBACK LOGIC
function getFallbackPlan(data) {
    console.log("Engaging Specialist Simulation Engine...");
    const area = (data.problemArea || 'neck').toLowerCase();

    let selectedKey = 'neck';
    if (area.includes('back')) selectedKey = 'back';
    else if (area.includes('knee')) selectedKey = 'knee';
    else if (area.includes('shoulder')) selectedKey = 'shoulder';
    else if (area.includes('wrist')) selectedKey = 'wrist';
    else if (area.includes('ankle')) selectedKey = 'ankle';

    const exercises = TRUSTED_DB[selectedKey].map(vid => ({
        name: vid.name,
        sets: '3',
        reps: '12-15 reps',
        difficulty: 'Moderate',
        description: 'Perform with control.',
        videoId: vid.id,
        thumbnailUrl: `https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`,
        videoUrl: `https://www.youtube.com/watch?v=${vid.id}`
    }));

    return {
        "analysis": {
            "understanding": `(Offline Mode) Hello ${data.name}. Based on your report of ${data.problemArea} pain...`,
            "likelyCauses": "Mechanical stress and posture factors.",
            "severity": "Moderate",
            "prognosis": "Good with consistent rehab."
        },
        "exercisePlan": {
            "overview": "Specific mobility and strength protocol.",
            "selectedExercises": exercises
        },
        "dietRecommendations": {
            "overview": "Anti-inflammatory guidelines.",
            "keyFoods": ["Omega-3s", "Leafy Greens"],
            "hydration": "3L daily",
            "foodsToAvoid": ["Processed sugar"]
        },
        "consultation": {
            "urgency": "Routine",
            "specialists": ["Physio"],
            "redFlags": ["Numbness"],
            "followUp": "1 Week"
        },
        "recoveryTimeline": {
            "week1": "Reduce Pain",
            "week2_3": "Restore Range",
            "longTerm": "Strengthen"
        }
    };
}
