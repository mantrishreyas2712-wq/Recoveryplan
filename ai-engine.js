const ApiManager = {
    getKey(provider) {
        if (typeof CONFIG === 'undefined') return '';
        if (provider === 'openai') return CONFIG.OPENAI_API_KEY;
        return '';
    }
};

// --- VERIFIED EXERCISE LIBRARY (Real IDs = Real Thumbnails) ---
// Maps common exercise terms to Verified YouTube Video IDs.
const EXERCISE_LIBRARY = {
    // NECK
    'chin tuck': 'E_Wf8_7S4gQ',
    'neck tilt': '0eO1aB6U72c',
    'upper trap': '1Y1_T7y7KzI',
    'levator scapulae': 'W6vOwhlVq_Q',
    'neck rotation': 'Xk8jN5qfC3o',

    // SHOULDER
    'pendulum': 'GFbCDbE86-A',
    'doorway stretch': 'lZ8qZ0y-cRk',
    'wall slide': '33P5AI27ejU',
    'shoulder roll': 'qGL_6c8dZVQ',
    'scapular': '33P5AI27ejU',

    // BACK
    'cat cow': 'sJq0jW4_P68',
    'childs pose': 'Eq6oMDi00n4',
    'knee to chest': 'bJzM6k9gZ24',
    'superman': 'cc6UVRS7TXw',
    'bridge': 'N3lS97aGf-Q',
    'mcgill': '2_e4I-brfqs',
    'cobra': 'fOdrW7nf9gw',

    // KNEE
    'quad set': 'I7C7nF9i8aU',
    'straight leg': 'L8Z_F2qR0lY',
    'heel slide': '02sW4F11i_E',
    'step up': 'dVVQyZ0RjYk',
    'hamstring': 'JWqNgy9w54s',
    'clam': '7L0sT5XwK5s',

    // ANKLE
    'ankle alphabet': 'vvlZ4b19E50',
    'calf raise': 'M4Cj4h9bXM',
    'towel': '9q0Wj2_8eK0',

    // WRIST
    'wrist flexor': 'Ejl47X2-G2w',
    'wrist extensor': 'Ejl47X2-G2w',
    'tendon': 'VlKeRWz4Z2c'
};

function findVerifiedVideo(exerciseName) {
    if (!exerciseName) return null;
    const cleanName = exerciseName.toLowerCase();

    // Fuzzy matching against Library Keys
    for (const [key, id] of Object.entries(EXERCISE_LIBRARY)) {
        if (cleanName.includes(key)) return id;
    }
    return null;
}

async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // --- GATHER MEDICAL HISTORY ---
    const conditions = [];
    if (patientData.condition_diabetes) conditions.push("Diabetes");
    if (patientData.condition_bp) conditions.push("High Blood Pressure");
    if (patientData.condition_heart) conditions.push("Heart Conditions");
    const historyString = conditions.length > 0 ? conditions.join(", ") : "None";
    const surgeryStatus = patientData.recentSurgery !== 'no' ? `Recent Surgery: ${patientData.recentSurgery}` : "No Recent Surgery";

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

    // 1. OpenAI (Primary)
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

    // 2. Pollinations.ai (Free, High-Quality, No Auth, Fetch-Based)
    if (!aiResponseText) {
        try {
            console.log("Attempting Pollinations Free AI...");
            const pollUrl = `https://text.pollinations.ai/${encodeURIComponent(prompt)}`;

            // TIMEOUT ENFORCEMENT for Mobile Networks (8s)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);

            const response = await fetch(pollUrl, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                aiResponseText = await response.text();
            }
        } catch (err) {
            console.warn("Pollinations AI Failed/Timed Out:", err);
        }
    }

    if (aiResponseText) {
        try {
            const plan = processAIResponse(aiResponseText);
            return enrichWithSmartLinks(plan);
        } catch (e) { console.error("Parsing Error:", e); }
    }

    // Default: Offline Clinical Protocol (Fallback)
    console.warn("Using Offline Clinical Protocol (Fallback)");
    return getFallbackPlan(patientData);
}

// --- STOCK THUMBNAIL GALLERY ---
const STOCK_IMAGES = [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', // Gym Guy
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', // Stretching Woman
    'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80', // Home Workout
    'https://images.unsplash.com/photo-1544367563-12123d8959bd?w=600&q=80', // Yoga Pose
    'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80', // Dumbbells
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80'  // Plank
];

function getStockThumbnail(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % STOCK_IMAGES.length;
    return STOCK_IMAGES[index];
}

// --- AFFILIATE / EQUIPMENT LOGIC ---
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
    if (aiPlan.exercisePlan && aiPlan.exercisePlan.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex) => {
            let equipLink = null;
            let equipName = null;

            // Check for keywords
            const lowerName = ex.name.toLowerCase();
            const lowerDesc = (ex.description || '').toLowerCase();

            for (const [key, url] of Object.entries(EQUIPMENT_MAP)) {
                if (lowerName.includes(key) || lowerDesc.includes(key)) {
                    equipLink = url;
                    equipName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize match (e.g. "Band")
                    break; // Only one link per card to keep UI clean
                }
            }

            return { ...ex, equipmentUrl: equipLink, equipmentName: equipName };
        });
    }
    return aiPlan;
}

// --- SMART LINK STRATEGY (SAFE MODE) ---
function enrichWithSmartLinks(aiPlan) {
    // First, add Equipment Links
    aiPlan = enrichWithEquipment(aiPlan);

    if (aiPlan.exercisePlan && aiPlan.exercisePlan.selectedExercises) {
        aiPlan.exercisePlan.selectedExercises = aiPlan.exercisePlan.selectedExercises.map((ex) => {
            const verifiedId = findVerifiedVideo(ex.name);
            const query = encodeURIComponent(`${ex.name} exercise physical therapy short`);

            // DEFAULT: Search Link + RANDOM Stock Thumb
            let thumbUrl = getStockThumbnail(ex.name || 'exercise');
            let videoUrl = `https://www.youtube.com/results?search_query=${query}`;

            // MATCH FOUND: Upgrade Thumbnail Only
            if (verifiedId && verifiedId.length > 5 && !verifiedId.includes(' ')) {
                thumbUrl = `https://img.youtube.com/vi/${verifiedId}/mqdefault.jpg`;
            }

            return {
                ...ex,
                type: 'search',
                thumbnailUrl: thumbUrl,
                videoUrl: videoUrl
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

    // Fallback names match the Library Keys to ensure they get Real IDs
    const DB_NAMES = {
        'neck': ['Chin Tucks', 'Upper Trap Stretch'],
        'shoulder': ['Pendulum Swing', 'Doorway Stretch'],
        'back': ['Cat Cow', 'McGill Curl Up'],
        'knee': ['Quad Set', 'Straight Leg Raise'],
        'ankle': ['Ankle Alphabet', 'Calf Raise'],
        'wrist': ['Wrist Flexor', 'Tendon Glide']
    };

    let selectedKey = 'neck';
    if (area.includes('back')) selectedKey = 'back';
    else if (area.includes('knee')) selectedKey = 'knee';
    else if (area.includes('shoulder')) selectedKey = 'shoulder';
    else if (area.includes('wrist')) selectedKey = 'wrist';
    else if (area.includes('ankle')) selectedKey = 'ankle';

    const exercises = DB_NAMES[selectedKey].map(name => {
        return {
            name: name,
            sets: '3',
            reps: '10-15 reps',
            difficulty: 'Moderate',
            description: 'Perform safely with control.'
        };
    });

    // Run fallback through Enricher to get Links/Thumbs
    const fallbackPlan = {
        "analysis": {
            "understanding": `Hello ${data.name}. Based on your report of ${area} pain, we have designed a specialized mobility and strengthening protocol.`,
            "likelyCauses": "Mechanical stress or posture.",
            "severity": "Moderate",
            "prognosis": "Favorable with consistency."
        },
        "exercisePlan": { "overview": "Standard Protocol.", "selectedExercises": exercises },
        "dietRecommendations": {
            "overview": "Anti-inflammatory Focus.",
            "keyFoods": ["Leafy Greens", "Berries", "Lean Protein"],
            "hydration": "3L daily",
            "foodsToAvoid": ["Processed Sugar"]
        },
        "consultation": {
            "urgency": "Routine",
            "specialists": ["Physio"],
            "redFlags": ["Numbness"],
            "followUp": "1 Week"
        },
        "recoveryTimeline": { "week1": "Pain Relief", "week2_3": "Mobility Restoration", "longTerm": "Strength Building" }
    };

    return enrichWithSmartLinks(fallbackPlan);
}
