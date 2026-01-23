/**
 * PhysioAssist - Multi-Provider AI Handler
 * 
 * Strategy:
 * 1. Try Google Gemini (Best Quality)
 * 2. Failover to HuggingFace (Open Source/Free Backup)
 * 3. Failover to Static Simulation (Guaranteed Result)
 */

const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'gemini') return CONFIG.GEMINI_API_KEY;
        if (provider === 'huggingface') return CONFIG.HF_API_KEY;
        return '';
    }
};

async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // 1. Context Prompt (Shared)
    const prompt = `Act as an expert physiotherapist.
    Patient: ${patientData.name}, ${patientData.age}, ${patientData.occupation}
    Condition: ${patientData.problemArea} - ${patientData.problemStatement}
    Diet Preference: ${patientData.dietPreference}
    
    RETURN ONLY JSON (No markdown, no text):
    {
      "analysis": { "understanding": "Detailed assessment...", "likelyCauses": "...", "severity": "...", "prognosis": "..." },
      "exercisePlan": { "selectedExercises": [ { "exerciseId": "neck-stretch-lateral", "customSets": "2", "customReps": "15s" } ] },
      "dietRecommendations": { "overview": "...", "keyFoods": ["..."], "foodsToAvoid": ["..."], "hydration": "..." },
      "consultation": { "urgency": "...", "specialists": ["..."], "redFlags": ["..."], "followUp": "..." },
      "recoveryTimeline": { "week1": "...", "week2_3": "...", "longTerm": "..." }
    }`;

    // 2. PROVIDER 1: GEMINI
    try {
        const key = ApiManager.getKey('gemini');
        if (!key || key.includes('YOUR_')) throw new Error("No valid Gemini Key");

        console.log("Attempting Gemini...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) throw new Error(`Gemini Error ${response.status}`);
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        return processAIResponse(text);

    } catch (geminiError) {
        console.warn("Gemini Failed:", geminiError);

        // 3. PROVIDER 2: HUGGINGFACE (Backup)
        try {
            const hfKey = ApiManager.getKey('huggingface');
            if (!hfKey || hfKey.includes('YOUR_')) throw new Error("No valid HF Key");

            console.log("Attempting HuggingFace...");
            const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${hfKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: `[INST] ${prompt} [/INST]`,
                    parameters: { max_new_tokens: 1000, return_full_text: false }
                })
            });

            if (!response.ok) throw new Error(`HF Error ${response.status}`);
            const data = await response.json();
            // HF returns array [{ generated_text: "..." }]
            const text = data[0]?.generated_text || "{}";
            return processAIResponse(text);

        } catch (hfError) {
            console.warn("HuggingFace Failed:", hfError);
            return getFallbackPlan(patientData);
        }
    }
}

// Helper to parse and enrich AI JSON
function processAIResponse(text) {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(cleanText);

        // Enrich Exercises with Videos
        if (json.exercisePlan?.selectedExercises && typeof getAllExercises === 'function') {
            const allEx = getAllExercises();
            json.exercisePlan.selectedExercises = json.exercisePlan.selectedExercises.map(ex => {
                const match = allEx.find(e => e.id === ex.exerciseId || e.name === ex.exerciseId);
                return match ? { ...match, ...ex } : ex;
            });
        }
        return json;
    } catch (e) {
        console.error("JSON Parse Error:", e);
        throw e; // Trigger Fallback
    }
}

// 4. RICH FALLBACK LOGIC
function getFallbackPlan(data) {
    console.log("Using Enhanced Fallback Simulation");

    // Logic extraction for Brevity (Same as before but consolidated)
    const area = data.problemArea.toLowerCase();

    // ... Copy of the Rich Fallback Logic I wrote previously ...
    // Re-implementing simplified version to ensure it works

    let exercises = [];
    let conditionDetail = "General Muscle Strain";

    if (area.includes('hand') || area.includes('wrist')) {
        exercises = [
            { id: 'wrist-flexor-stretch', name: 'Wrist Flexor Stretch', customSets: '3', customReps: '30s hold', difficulty: 'Easy', videoUrl: 'https://www.youtube.com/embed/Ejl47X2-G2w' },
            { id: 'finger-tendon-glides', name: 'Tendon Glides', customSets: '3', customReps: '10 cycles', difficulty: 'Moderate', videoUrl: 'https://www.youtube.com/embed/VlKeRWz4Z2c' } // Fixed logic
        ];
        conditionDetail = "Repetitive Strain Injury (RSI)";
    } else {
        // Default Neck/Shoulder
        exercises = [
            { id: 'neck-stretch-lateral', name: 'Lateral Neck Stretch', customSets: '2', customReps: '20s', difficulty: 'Easy', videoUrl: 'https://www.youtube.com/embed/0eO1aB6U72c' },
            { id: 'shoulder-rolls', name: 'Shoulder Rolls', customSets: '2', customReps: '15 reps', difficulty: 'Easy', videoUrl: 'https://www.youtube.com/embed/qg9bhtY7bgs' }
        ];
    }

    // Diet Logic
    const dietType = (data.dietPreference || 'veg').toLowerCase();
    let keyFoods = ["Leafy Greens", "Walnuts"];
    if (dietType.includes('non')) keyFoods = ["Salmon / Fatty Fish", "Chicken Breast", "Eggs", "Bone Broth"];
    else if (dietType.includes('veg')) keyFoods = ["Paneer", "Lentils", "Chickpeas", "Flaxseeds"];

    return {
        "analysis": {
            "understanding": `(Offline Simulation) Hello ${data.name}, based on your profile inputs, I have generated a recovery plan for your ${data.problemArea}.`,
            "likelyCauses": `Likely ${conditionDetail} aggravated by your role as a ${data.occupation}.`,
            "severity": "Moderate",
            "prognosis": "Good with consistency."
        },
        "exercisePlan": {
            "selectedExercises": exercises
        },
        "dietRecommendations": {
            "overview": `Customized ${dietType} recovery diet.`,
            "keyFoods": keyFoods,
            "hydration": "3 Liters/Day",
            "foodsToAvoid": ["Sugar", "Fried Food"]
        },
        "consultation": {
            "urgency": "Routine",
            "specialists": ["Physiotherapist"],
            "redFlags": ["Numbness", "Sharp Pain"],
            "followUp": "1 Week"
        },
        "recoveryTimeline": {
            "week1": "Rest & Ice",
            "week2_3": "Mobility",
            "longTerm": "Prevention"
        }
    };
}
