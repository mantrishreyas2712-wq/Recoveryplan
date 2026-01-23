const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'gemini') return CONFIG.GEMINI_API_KEY;
        if (provider === 'openai') return CONFIG.OPENAI_API_KEY;
        if (provider === 'huggingface') return CONFIG.HF_API_KEY;
        return '';
    }
};

async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // JSON Schema Prompt
    const prompt = `Act as an expert physiotherapist.
    Patient: ${patientData.name}, ${patientData.age}, ${patientData.occupation}
    Condition: ${patientData.problemArea} - ${patientData.problemStatement}
    Diet Preference: ${patientData.dietPreference}
    
    RETURN ONLY JSON (No markdown):
    {
      "analysis": { "understanding": "...", "likelyCauses": "...", "severity": "...", "prognosis": "..." },
      "exercisePlan": { "selectedExercises": [ { "name": "...", "sets": "...", "reps": "...", "videoId": "YOUTUBE_ID_HERE", "difficulty": "...", "description": "..." } ] },
      "dietRecommendations": { "overview": "...", "keyFoods": ["..."], "foodsToAvoid": ["..."], "hydration": "..." },
      "consultation": { "urgency": "...", "specialists": ["..."], "redFlags": ["..."], "followUp": "..." },
      "recoveryTimeline": { "week1": "...", "week2_3": "...", "longTerm": "..." }
    }`;

    // 1. PROVIDER: OPENAI (User Key)
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
            return processAIResponse(data.choices[0].message.content);
        }
    } catch (err) { console.warn("OpenAI Failed:", err); }

    // 2. PROVIDER: PUTER.JS (Free AI)
    try {
        if (typeof puter !== 'undefined' && puter.ai) {
            console.log("Attempting Puter.js (Free AI)...");
            // Puter returns a chat response object
            const response = await puter.ai.chat(prompt);
            // The response might be an object or string depending on version, checking both
            const text = typeof response === 'string' ? response : (response?.message?.content || response?.toString());
            return processAIResponse(text);
        }
    } catch (err) { console.warn("Puter AI Failed:", err); }

    // 3. FALLBACK: SIMULATION
    return getFallbackPlan(patientData);
}

// Helper to parse AI JSON
function processAIResponse(text) {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        throw e; // Trigger Fallback
    }
}

// 4. RICH FALLBACK LOGIC (The "Mega-Simulation")
function getFallbackPlan(data) {
    console.log("Engaging Specialist Simulation Engine...");

    // Normalize Input
    const area = (data.problemArea || 'neck').toLowerCase();
    const job = data.occupation || 'Patient';

    // --- DATABASE OF EXPERT PLANS ---
    // Video IDs are pure YouTube IDs
    const DB = {
        'neck': {
            condition: "Cervical Strain / 'Tech Neck'",
            rootCause: "Prolonged static posture and forward head alignment.",
            exercises: [
                { name: 'Chin Tucks', sets: '3', reps: '10 reps', videoId: 'E_Wf8_7S4gQ', difficulty: 'Easy', description: 'Gently pull your head back to align ears with shoulders.' },
                { name: 'Upper Trapezius Stretch', sets: '2', reps: '30s hold', videoId: '0eO1aB6U72c', difficulty: 'Easy', description: 'Tilt head to side, keep shoulder down.' }
            ]
        },
        'shoulder': {
            condition: "Rotator Cuff Tendonitis",
            rootCause: "Repetitive overhead movement or shoulder impingement.",
            exercises: [
                { name: 'Pendulum Swing', sets: '3', reps: '1 min', videoId: 'GFbCDbE86-A', difficulty: 'Easy', description: 'Let arm hang loose and swing gently.' },
                { name: 'Doorway Pec Stretch', sets: '3', reps: '30s', videoId: 'lZ8qZ0y-cRk', difficulty: 'Moderate', description: 'Stretch chest muscles in a door frame.' }
            ]
        },
        'back': {
            condition: "Lumbar Muscular Strain",
            rootCause: "Weak core stability or improper lifting mechanics.",
            exercises: [
                { name: 'Cat-Cow Stretch', sets: '3', reps: '10 cycles', videoId: 'sJq0jW4_P68', difficulty: 'Easy', description: 'Mobilize the spine gently on all fours.' },
                { name: 'McGill Curl-up', sets: '3', reps: '10 sec hold', videoId: '2_e4I-brfqs', difficulty: 'Moderate', description: 'Core bracing without flexing spine.' }
            ]
        },
        'knee': {
            condition: "Patellofemoral Pain Syndrome",
            rootCause: "Knee cap tracking issues due to quad weakness.",
            exercises: [
                { name: 'Quad Sets (Towel)', sets: '3', reps: '15 reps', videoId: 'I7C7nF9i8aU', difficulty: 'Easy', description: 'Press knee down into a rolled towel.' },
                { name: 'Seated Knee Extension', sets: '3', reps: '12 reps', videoId: 'vvlZ4b19E50', difficulty: 'Easy', description: 'Straighten leg fully and hold briefly.' }
            ]
        },
        'ankle': {
            condition: "Ankle Sprain / Instability",
            rootCause: "Ligament overstretching or past injury.",
            exercises: [
                { name: 'Ankle Alphabet', sets: '3', reps: '1 set', videoId: 'I7C7nF9i8aU', difficulty: 'Easy', description: 'Draw letters with your toes.' },
                { name: 'Calf Raises', sets: '3', reps: '15 reps', videoId: 'M4Cj4h9bXM', difficulty: 'Moderate', description: 'Lift heels off ground slowly.' }
            ]
        },
        'wrist': {
            condition: "Repetitive Strain Injury (Carpal Tunnel)",
            rootCause: "Repetitive typing or fine motor overuse.",
            exercises: [
                { name: 'Wrist Flexor Stretch', sets: '3', reps: '30s hold', videoId: 'Ejl47X2-G2w', difficulty: 'Easy', description: 'Pull fingers back gently.' },
                { name: 'Tendon Glides', sets: '3', reps: '10 cycles', videoId: 'VlKeRWz4Z2c', difficulty: 'Moderate', description: 'Gliding movements for hand tendons.' }
            ]
        }
    };

    // Improved Fuzzy Matching
    let selectedKey = 'neck';
    if (area.includes('back') || area.includes('lumbar')) selectedKey = 'back';
    else if (area.includes('knee') || area.includes('leg')) selectedKey = 'knee';
    else if (area.includes('shoulder')) selectedKey = 'shoulder';
    else if (area.includes('wrist') || area.includes('hand')) selectedKey = 'wrist';
    else if (area.includes('ankle') || area.includes('foot')) selectedKey = 'ankle';

    const selectedPlan = DB[selectedKey];

    // Diet Logic
    const dietType = (data.dietPreference || 'veg').toLowerCase();
    let dietInfo = { overview: "Anti-Inflammatory Plant Focus", foods: ["Turmeric", "Ginger", "Walnuts", "Spinach"] };
    if (dietType.includes('non') || dietType.includes('egg')) {
        dietInfo.overview = `High-Protein Tissue Repair Plan (${dietType})`;
        dietInfo.foods = ["Salmon/Fatty Fish", "Chicken Breast", "Bone Broth", "Eggs"];
    }

    // Construct Response with GUARANTEED Links
    return {
        "analysis": {
            "understanding": `Hello ${data.name}, based on your input (${data.problemArea}), this indicates ${selectedPlan.condition}.`,
            "likelyCauses": selectedPlan.condition,
            "severity": `Variable (Pain Level: ${data.painLevel || 5}/10)`,
            "prognosis": "Highly favorable with consistency."
        },
        "exercisePlan": {
            "overview": "Focus on unloading injured tissue.",
            "selectedExercises": selectedPlan.exercises.map(ex => ({
                ...ex,
                // CRITICAL FIX: Ensure full URLs are always present
                thumbnailUrl: `https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg`,
                videoUrl: `https://www.youtube.com/watch?v=${ex.videoId}`
            }))
        },
        "dietRecommendations": {
            "overview": dietInfo.overview,
            "keyFoods": dietInfo.foods,
            "hydration": "3 Liters daily",
            "foodsToAvoid": ["Refined Sugars", "Processed Foods"]
        },
        "consultation": {
            "urgency": "Routine Care",
            "specialists": ["Physiotherapist"],
            "redFlags": ["Severe Night Pain", "Loss of Sensation"],
            "followUp": "1 Week"
        },
        "recoveryTimeline": {
            "week1": "Pain Reduction",
            "week2_3": "Mobility & Strength",
            "longTerm": "Full Activity"
        }
    };
}
