const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'openai') return CONFIG.OPENAI_API_KEY;
        return '';
    }
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

    try {
        const key = ApiManager.getKey('openai');
        if (key && !key.includes('YOUR_')) {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
                body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: prompt }], temperature: 0.7 })
            });
            if (response.ok) {
                const data = await response.json();
                aiResponseText = data.choices[0].message.content;
            }
        }
    } catch (err) { }

    if (!aiResponseText) {
        try {
            if (typeof puter !== 'undefined' && puter.ai) {
                const response = await puter.ai.chat(prompt);
                aiResponseText = typeof response === 'string' ? response : (response?.message?.content || response?.toString());
            }
        } catch (err) { }
    }

    if (aiResponseText) {
        try {
            const plan = processAIResponse(aiResponseText);
            // APPLY DYNAMIC SEARCH STRATEGY
            return enrichWithDynamicLinks(plan);
        } catch (e) { console.error(e); }
    }

    return getFallbackPlan(patientData);
}

// --- DYNAMIC SEARCH STRATEGY ---
// Instead of guessing IDs, generate a YouTube Search URL for the specific exercise.
function enrichWithDynamicLinks(aiPlan) {
    if (aiPlan.exercisePlan && aiPlan.exercisePlan.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex) => {
            const query = encodeURIComponent(`${ex.name} exercise physical therapy short`);
            return {
                ...ex,
                // Generic Pro Thumbnail
                thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
                // GUARANTEED WORKING LINK: Search Results
                videoUrl: `https://www.youtube.com/results?search_query=${query}`
            };
        });
    }
    return aiPlan;
}

function processAIResponse(text) {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
}

function getFallbackPlan(data) {
    const area = (data.problemArea || 'neck').toLowerCase();

    // TEXT-ONLY DATABASE (Links are dynamic)
    const DB_TEXT = {
        'neck': [{ name: 'Chin Tucks' }, { name: 'Upper Trapezius Stretch' }],
        'shoulder': [{ name: 'Pendulum Swing' }, { name: 'Doorway Pec Stretch' }],
        'back': [{ name: 'Cat-Cow Stretch' }, { name: 'McGill Curl-up' }],
        'knee': [{ name: 'Quad Sets with Towel' }, { name: 'Seated Knee Extension' }],
        'ankle': [{ name: 'Ankle Alphabet' }, { name: 'Standing Calf Raises' }],
        'wrist': [{ name: 'Wrist Flexor Stretch' }, { name: 'Tendon Glides' }]
    };

    let selectedKey = 'neck';
    if (area.includes('back')) selectedKey = 'back';
    else if (area.includes('knee')) selectedKey = 'knee';
    else if (area.includes('shoulder')) selectedKey = 'shoulder';
    else if (area.includes('wrist')) selectedKey = 'wrist';
    else if (area.includes('ankle')) selectedKey = 'ankle';

    const exercises = DB_TEXT[selectedKey].map(ex => {
        const query = encodeURIComponent(`${ex.name} physical therapy short`);
        return {
            name: ex.name,
            sets: '3',
            reps: '10-15 reps',
            difficulty: 'Moderate',
            description: 'Perform safely. Click "Search Video" to see demonstrations.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
            videoUrl: `https://www.youtube.com/results?search_query=${query}`
        };
    });

    return {
        "analysis": {
            "understanding": `(Offline Mode) Hello ${data.name}. This protocol targets your ${data.problemArea} symptoms.`,
            "likelyCauses": "Mechanical stress/posture.",
            "severity": "Moderate",
            "prognosis": "Favorable."
        },
        "exercisePlan": { "overview": "Standard Protocol.", "selectedExercises": exercises },
        "dietRecommendations": {
            "overview": "Anti-inflammatory guidelines.",
            "keyFoods": ["Omega-3s", "Greens"],
            "hydration": "3L daily",
            "foodsToAvoid": ["Sugar"]
        },
        "consultation": {
            "urgency": "Routine",
            "specialists": ["Physio"],
            "redFlags": ["Numbness"],
            "followUp": "1 Week"
        },
        "recoveryTimeline": { "week1": "Relief", "week2_3": "Mobility", "longTerm": "Strength" }
    };
}
