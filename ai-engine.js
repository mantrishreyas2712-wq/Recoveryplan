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

// --- MAIN AI ENGINE (Secure Backend Proxy) ---
async function generateRecoveryPlan(patientData) {
    console.log("Generating plan for:", patientData);

    // Check if Worker URL is configured
    if (typeof CONFIG === 'undefined' || !CONFIG.WORKER_URL) {
        throw new Error("Backend not configured. Please deploy the Cloudflare Worker and add the URL to config.js");
    }

    // Build the prompt
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

    // Call the secure backend proxy
    console.log("Calling Worker Proxy:", CONFIG.WORKER_URL);

    const response = await fetch(CONFIG.WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Backend Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.response) {
        throw new Error(data.error || "Invalid response from backend");
    }

    // Parse AI response
    const plan = processAIResponse(data.response);
    return enrichWithSmartLinks(plan);
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
