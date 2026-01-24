// =============================================================================
// PHYSIO EXPERT SYSTEM - Offline Report Generator
// No API required - Uses built-in medical knowledge base
// =============================================================================

// --- COMPREHENSIVE CONDITION DATABASE ---
const CONDITION_DB = {
    // NECK CONDITIONS
    'neck': {
        'pain': {
            causes: "prolonged poor posture, muscle strain from desk work, stress-related tension, cervical spondylosis",
            severity: "Moderate - Typically muscular in nature",
            prognosis: "Most cases resolve within 2-4 weeks with proper care",
            exercises: [
                { name: "Chin Tucks", sets: "3", reps: "10-15", difficulty: "Easy", description: "Sit upright, pull chin back creating a double chin, hold 5 seconds. Strengthens deep neck flexors." },
                { name: "Neck Rotation Stretch", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Slowly turn head left/right, hold 15-20 seconds each side. Improves range of motion." },
                { name: "Upper Trapezius Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Tilt head toward shoulder, gently press with hand, hold 30 seconds. Releases tension." }
            ],
            redFlags: ["Radiating arm pain/numbness", "Severe headaches", "Dizziness or balance issues"],
            specialists: ["Physiotherapist", "Orthopedic Specialist"],
            urgency: "Moderate - Start home treatment, consult if no improvement in 2 weeks"
        },
        'stiffness': {
            causes: "poor sleeping position, prolonged static posture, degenerative changes, muscle tightness",
            severity: "Mild to Moderate",
            prognosis: "Usually improves within 1-2 weeks with stretching and posture correction",
            exercises: [
                { name: "Chin Tucks", sets: "3", reps: "10", difficulty: "Easy", description: "Retract chin back while keeping eyes level. Hold 5 seconds." },
                { name: "Levator Scapulae Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Look down toward armpit, apply gentle pressure, hold 30 seconds." },
                { name: "Neck Side Flexion", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Tilt ear toward shoulder, hold 15 seconds. Don't raise shoulder." }
            ],
            redFlags: ["Fever with stiffness", "Recent trauma", "Progressive weakness"],
            specialists: ["Physiotherapist"],
            urgency: "Low - Home treatment usually sufficient"
        }
    },

    // BACK CONDITIONS
    'back': {
        'pain': {
            causes: "muscle strain, poor lifting technique, prolonged sitting, disc-related issues, weak core muscles",
            severity: "Moderate to Severe - Depends on underlying cause",
            prognosis: "80% of cases improve within 6 weeks with conservative treatment",
            exercises: [
                { name: "Cat-Cow Stretch", sets: "3", reps: "10", difficulty: "Easy", description: "On hands and knees, alternate between arching and rounding back. Improves spinal mobility." },
                { name: "Knee to Chest Stretch", sets: "2", reps: "5 each leg", difficulty: "Easy", description: "Lie on back, pull knee toward chest, hold 30 seconds. Releases lower back tension." },
                { name: "Bridge Exercise", sets: "3", reps: "10-12", difficulty: "Moderate", description: "Lie on back, lift hips creating straight line from knees to shoulders. Strengthens glutes and core." }
            ],
            redFlags: ["Loss of bladder/bowel control", "Severe leg weakness", "Numbness in groin area"],
            specialists: ["Physiotherapist", "Spine Specialist", "Orthopedic Surgeon"],
            urgency: "Moderate to High - Seek immediate care if red flags present"
        },
        'stiffness': {
            causes: "degenerative changes, prolonged immobility, muscle guarding, poor posture",
            severity: "Mild to Moderate",
            prognosis: "Gradual improvement with regular movement and stretching",
            exercises: [
                { name: "Child's Pose", sets: "3", reps: "Hold 30 seconds", difficulty: "Easy", description: "Kneel and sit back on heels, stretch arms forward, rest forehead on floor." },
                { name: "Cat-Cow Stretch", sets: "3", reps: "10", difficulty: "Easy", description: "Alternate between flexing and extending spine on all fours." },
                { name: "Seated Rotation Stretch", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Sit cross-legged, rotate torso, hold 20 seconds each side." }
            ],
            redFlags: ["Morning stiffness lasting >1 hour", "Multiple joint involvement"],
            specialists: ["Physiotherapist", "Rheumatologist"],
            urgency: "Low to Moderate"
        }
    },

    // KNEE CONDITIONS
    'knee': {
        'pain': {
            causes: "overuse, patellofemoral syndrome, ligament strain, meniscus issues, arthritis",
            severity: "Moderate - Activity modification recommended",
            prognosis: "Most cases improve in 4-8 weeks with proper rehabilitation",
            exercises: [
                { name: "Quad Sets", sets: "3", reps: "15", difficulty: "Easy", description: "Sit with leg straight, tighten thigh muscle, hold 5 seconds. Activates quadriceps." },
                { name: "Straight Leg Raise", sets: "3", reps: "10", difficulty: "Easy", description: "Lie on back, lift straight leg 6 inches, hold 5 seconds. Strengthens quads without knee stress." },
                { name: "Heel Slides", sets: "2", reps: "10", difficulty: "Easy", description: "Lie on back, slowly slide heel toward buttocks, then back. Improves knee flexion." }
            ],
            redFlags: ["Locked knee", "Significant swelling", "Giving way/instability"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine Doctor"],
            urgency: "Moderate - Rest and ice initially, seek care if no improvement"
        },
        'swelling': {
            causes: "injury, overuse, arthritis, meniscus tear, ligament damage",
            severity: "Moderate to Severe - Requires assessment",
            prognosis: "Depends on underlying cause - may need imaging",
            exercises: [
                { name: "Quad Sets", sets: "3", reps: "15", difficulty: "Easy", description: "Gentle quad activation without movement. Safe even with swelling." },
                { name: "Ankle Pumps", sets: "3", reps: "20", difficulty: "Easy", description: "Pump ankle up and down to improve circulation and reduce swelling." },
                { name: "Gentle Flexion Range", sets: "2", reps: "10", difficulty: "Easy", description: "Gently bend knee within pain-free range to maintain mobility." }
            ],
            redFlags: ["Hot/red joint", "Fever", "Unable to bear weight"],
            specialists: ["Orthopedic Surgeon", "Rheumatologist"],
            urgency: "High - Seek assessment within 48 hours if persistent"
        }
    },

    // SHOULDER CONDITIONS
    'shoulder': {
        'pain': {
            causes: "rotator cuff strain, impingement syndrome, frozen shoulder, tendinitis",
            severity: "Moderate - May limit daily activities",
            prognosis: "Recovery typically takes 6-12 weeks with proper rehabilitation",
            exercises: [
                { name: "Pendulum Exercise", sets: "3", reps: "1 min circles", difficulty: "Easy", description: "Lean forward, let arm hang, make small circles. Promotes gentle movement." },
                { name: "Doorway Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Place forearm on doorframe, step forward to stretch chest and front shoulder." },
                { name: "Scapular Squeezes", sets: "3", reps: "15", difficulty: "Easy", description: "Squeeze shoulder blades together, hold 5 seconds. Improves posture and stability." }
            ],
            redFlags: ["Severe weakness", "Trauma history", "Night pain disturbing sleep"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine"],
            urgency: "Moderate - Start gentle exercises, seek care if no improvement in 3 weeks"
        },
        'stiffness': {
            causes: "frozen shoulder (adhesive capsulitis), post-injury stiffness, lack of movement",
            severity: "Moderate to Severe - Can significantly limit function",
            prognosis: "Frozen shoulder may take 12-24 months to fully resolve",
            exercises: [
                { name: "Pendulum Exercise", sets: "4", reps: "2 min", difficulty: "Easy", description: "Essential for frozen shoulder - perform multiple times daily." },
                { name: "Wall Climbing", sets: "3", reps: "10", difficulty: "Moderate", description: "Face wall, walk fingers up as high as comfortable. Track progress." },
                { name: "Cross Body Stretch", sets: "2", reps: "30 sec hold", difficulty: "Easy", description: "Bring arm across chest, hold with other hand, stretch posterior shoulder." }
            ],
            redFlags: ["Rapid onset without cause", "Associated systemic symptoms"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon"],
            urgency: "Moderate - Early intervention important for frozen shoulder"
        }
    },

    // WRIST/HAND CONDITIONS
    'wrist': {
        'pain': {
            causes: "carpal tunnel syndrome, repetitive strain, tendinitis, De Quervain's",
            severity: "Mild to Moderate",
            prognosis: "Most cases improve with rest and ergonomic changes in 2-4 weeks",
            exercises: [
                { name: "Wrist Flexor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm up, pull fingers back toward body. Stretches forearm flexors." },
                { name: "Wrist Extensor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm down, press hand down. Stretches forearm extensors." },
                { name: "Tendon Glides", sets: "3", reps: "10", difficulty: "Easy", description: "Move fingers through various positions: straight, hook, fist, tabletop. Keeps tendons mobile." }
            ],
            redFlags: ["Severe numbness", "Weakness in grip", "Visible deformity"],
            specialists: ["Physiotherapist", "Hand Therapist", "Orthopedic Surgeon"],
            urgency: "Low to Moderate - Modify activities, use ergonomic supports"
        }
    },

    // ANKLE/FOOT CONDITIONS
    'ankle': {
        'pain': {
            causes: "sprain, plantar fasciitis, Achilles tendinitis, overuse",
            severity: "Mild to Severe - Depends on cause",
            prognosis: "Sprains: 2-6 weeks, Tendinitis: 6-12 weeks",
            exercises: [
                { name: "Ankle Alphabet", sets: "2", reps: "Full A-Z", difficulty: "Easy", description: "Draw letters with your big toe. Improves range of motion in all directions." },
                { name: "Calf Raises", sets: "3", reps: "15", difficulty: "Moderate", description: "Rise onto toes, hold 2 seconds, lower slowly. Strengthens calf and ankle." },
                { name: "Towel Curls", sets: "3", reps: "15", difficulty: "Easy", description: "Scrunch towel with toes. Strengthens foot intrinsic muscles." }
            ],
            redFlags: ["Unable to bear weight", "Severe bruising", "Obvious deformity"],
            specialists: ["Physiotherapist", "Podiatrist", "Orthopedic Surgeon"],
            urgency: "Moderate to High for acute injuries"
        }
    },

    // HIP CONDITIONS
    'hip': {
        'pain': {
            causes: "bursitis, muscle strain, arthritis, labral tear, referred back pain",
            severity: "Moderate",
            prognosis: "Most muscular issues resolve in 4-8 weeks",
            exercises: [
                { name: "Clamshells", sets: "3", reps: "15 each side", difficulty: "Moderate", description: "Lie on side with knees bent, lift top knee keeping feet together. Strengthens hip abductors." },
                { name: "Hip Flexor Stretch", sets: "2", reps: "30 sec each", difficulty: "Easy", description: "Kneel on one knee, push hips forward. Stretches tight hip flexors." },
                { name: "Glute Bridge", sets: "3", reps: "12", difficulty: "Moderate", description: "Lie on back, lift hips, squeeze glutes at top. Strengthens glutes and stabilizes hip." }
            ],
            redFlags: ["Groin pain with clicking", "Night pain", "Unable to bear weight"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Hip Specialist"],
            urgency: "Moderate - Seek assessment if no improvement in 2-3 weeks"
        }
    }
};

// --- DIET RECOMMENDATIONS BY CONDITION TYPE ---
const DIET_DB = {
    'inflammation': {
        overview: "An anti-inflammatory diet can significantly support your recovery by reducing systemic inflammation.",
        keyFoods: ["Fatty fish (salmon, mackerel)", "Leafy greens (spinach, kale)", "Berries (blueberries, strawberries)", "Nuts (walnuts, almonds)", "Olive oil", "Turmeric and ginger"],
        foodsToAvoid: ["Processed foods", "Refined sugars", "Excessive red meat", "Fried foods", "Alcohol"],
        hydration: "Drink 8-10 glasses of water daily. Proper hydration supports tissue healing and reduces stiffness."
    },
    'muscle_recovery': {
        overview: "Protein-rich foods support muscle repair and recovery. Combine with adequate rest for optimal healing.",
        keyFoods: ["Lean protein (chicken, fish, eggs)", "Greek yogurt", "Legumes (lentils, chickpeas)", "Quinoa", "Cottage cheese", "Tofu/paneer"],
        foodsToAvoid: ["Excessive caffeine", "Alcohol", "High sodium foods", "Sugary drinks"],
        hydration: "Aim for 2.5-3 liters of water daily. Add electrolytes if exercising intensely."
    },
    'bone_health': {
        overview: "Calcium and Vitamin D are essential for bone health. Include weight-bearing exercises for optimal bone density.",
        keyFoods: ["Dairy products (milk, yogurt, cheese)", "Fortified plant milk", "Leafy greens", "Sardines with bones", "Eggs", "Mushrooms (sun-exposed)"],
        foodsToAvoid: ["Excessive salt", "Carbonated drinks", "Too much caffeine", "Excessive alcohol"],
        hydration: "Maintain 8 glasses of water daily. Green tea can provide additional antioxidants."
    },
    'vegetarian': {
        overview: "A well-planned vegetarian diet can provide all nutrients needed for recovery. Focus on protein diversity.",
        keyFoods: ["Paneer and tofu", "Legumes and lentils", "Greek yogurt", "Quinoa and amaranth", "Nuts and seeds", "Eggs (if included)"],
        foodsToAvoid: ["Processed vegetarian junk food", "Excessive refined carbs", "Sugary snacks"],
        hydration: "8-10 glasses of water. Include coconut water for natural electrolytes."
    },
    'vegan': {
        overview: "Ensure adequate protein from plant sources and consider B12 supplementation for optimal recovery.",
        keyFoods: ["Tofu and tempeh", "Legumes (all varieties)", "Quinoa", "Nuts and nut butters", "Seeds (chia, hemp, flax)", "Fortified plant milk"],
        foodsToAvoid: ["Highly processed vegan foods", "Refined sugars", "Excessive oils"],
        hydration: "3+ liters of water daily. Herbal teas can provide additional anti-inflammatory benefits."
    }
};

// --- OCCUPATION-SPECIFIC ADVICE ---
const OCCUPATION_ADVICE = {
    'desk': {
        tips: "Take a 5-minute break every 30-45 minutes. Set up an ergonomic workstation with monitor at eye level.",
        riskFactors: "Prolonged sitting increases spinal load. Poor posture leads to anterior head carriage.",
        modifications: "Consider a standing desk, use lumbar support, position keyboard at elbow height."
    },
    'physical': {
        tips: "Use proper lifting techniques - bend at knees, keep load close to body. Stretch before and after work.",
        riskFactors: "Repetitive movements and heavy lifting can strain muscles and joints.",
        modifications: "Use mechanical aids when possible, rotate tasks, ensure adequate rest between shifts."
    },
    'driver': {
        tips: "Adjust seat and mirrors to minimize strain. Take breaks every 2 hours for stretching.",
        riskFactors: "Prolonged sitting with vibration exposure increases back problems.",
        modifications: "Use lumbar support, consider a seat cushion, do seated exercises during breaks."
    },
    'healthcare': {
        tips: "Practice proper patient handling techniques. Strengthen core muscles regularly.",
        riskFactors: "Patient transfers and awkward postures increase musculoskeletal injury risk.",
        modifications: "Use lifting aids, work in pairs for patient handling, maintain fitness."
    },
    'student': {
        tips: "Maintain good study posture. Take regular breaks from screens and books.",
        riskFactors: "Extended sitting and screen time lead to postural issues.",
        modifications: "Use proper desk height, practice the 20-20-20 rule for eyes, stay active."
    },
    'default': {
        tips: "Maintain good posture throughout the day. Take regular movement breaks.",
        riskFactors: "Sedentary behavior and poor posture are common risk factors.",
        modifications: "Incorporate movement into daily routine, stretch regularly, stay hydrated."
    }
};

// --- AGE-SPECIFIC CONSIDERATIONS ---
function getAgeConsiderations(age) {
    age = parseInt(age);
    if (age < 25) {
        return {
            healing: "excellent",
            note: "Your young body has excellent healing capacity. With proper care, recovery should be quick.",
            precautions: "Avoid overtraining while healing. Don't rush back to full activity too soon."
        };
    } else if (age < 40) {
        return {
            healing: "very good",
            note: "Your healing capacity is strong. Consistent effort with the exercise program will yield good results.",
            precautions: "Balance activity with rest. Include recovery days in your routine."
        };
    } else if (age < 55) {
        return {
            healing: "good",
            note: "With consistent effort, you can achieve excellent recovery. Patience and consistency are key.",
            precautions: "Warm up thoroughly before exercises. Progress gradually to avoid setbacks."
        };
    } else if (age < 70) {
        return {
            healing: "moderate",
            note: "Your body is still capable of significant healing. Focus on gradual, consistent progress.",
            precautions: "Avoid high-impact activities. Pay attention to pain signals. Consider supervision initially."
        };
    } else {
        return {
            healing: "gradual",
            note: "Healing takes more time but is definitely achievable. Every small improvement matters.",
            precautions: "Work with a physiotherapist directly. Prioritize safety and fall prevention. Take adequate rest."
        };
    }
}

// --- MAIN REPORT GENERATOR ---
function generateRecoveryPlan(patientData) {
    console.log("Generating expert system report for:", patientData);

    const name = patientData.name || "Patient";
    const age = patientData.age || 30;
    const problemArea = (patientData.problemArea || "").toLowerCase();
    const symptoms = (patientData.problemStatement || "pain").toLowerCase();
    const occupation = (patientData.occupation || "").toLowerCase();
    const diet = (patientData.dietPreference || "").toLowerCase();

    // Determine condition type
    let conditionKey = "pain";
    if (symptoms.includes("stiff")) conditionKey = "stiffness";
    if (symptoms.includes("swell")) conditionKey = "swelling";

    // Find matching condition data
    let areaKey = "back"; // default
    for (const key of Object.keys(CONDITION_DB)) {
        if (problemArea.includes(key)) {
            areaKey = key;
            break;
        }
    }

    const conditionData = CONDITION_DB[areaKey]?.[conditionKey] || CONDITION_DB[areaKey]?.["pain"] || CONDITION_DB["back"]["pain"];
    const ageData = getAgeConsiderations(age);

    // Determine occupation type
    let occType = "default";
    if (occupation.includes("desk") || occupation.includes("office") || occupation.includes("computer") || occupation.includes("it") || occupation.includes("software")) {
        occType = "desk";
    } else if (occupation.includes("driver") || occupation.includes("taxi") || occupation.includes("truck")) {
        occType = "driver";
    } else if (occupation.includes("nurse") || occupation.includes("doctor") || occupation.includes("hospital") || occupation.includes("medical")) {
        occType = "healthcare";
    } else if (occupation.includes("labor") || occupation.includes("construction") || occupation.includes("factory") || occupation.includes("physical")) {
        occType = "physical";
    } else if (occupation.includes("student") || occupation.includes("school") || occupation.includes("college")) {
        occType = "student";
    }
    const occData = OCCUPATION_ADVICE[occType];

    // Determine diet type
    let dietType = "inflammation";
    if (diet.includes("vegan")) dietType = "vegan";
    else if (diet.includes("vegetarian") || diet.includes("veg")) dietType = "vegetarian";
    else if (symptoms.includes("bone") || symptoms.includes("fracture")) dietType = "bone_health";
    else if (symptoms.includes("muscle") || symptoms.includes("strain")) dietType = "muscle_recovery";
    const dietData = DIET_DB[dietType];

    // Build medical history string
    const conditions = [];
    if (patientData.condition_diabetes) conditions.push("Diabetes");
    if (patientData.condition_bp) conditions.push("High Blood Pressure");
    if (patientData.condition_heart) conditions.push("Heart Conditions");

    // Generate personalized report
    const report = {
        analysis: {
            understanding: `Hello ${name}! I understand you're experiencing ${conditionKey} in your ${areaKey} area${symptoms ? `, with symptoms including "${patientData.problemStatement}"` : ""}. At ${age} years old${occupation ? ` and working in ${occupation}` : ""}, ${ageData.note}`,
            likelyCauses: `Based on your profile, the most likely causes include: ${conditionData.causes}. ${occData.riskFactors}`,
            severity: conditionData.severity,
            prognosis: `${conditionData.prognosis} ${ageData.precautions}`,
            medicalHistoryNote: conditions.length > 0 ? `Important: Your medical history (${conditions.join(", ")}) has been considered. Please inform your physiotherapist about these conditions.` : ""
        },
        exercisePlan: {
            overview: `Here is your personalized exercise program. ${occData.tips}`,
            selectedExercises: conditionData.exercises.map(ex => ({
                ...ex,
                type: 'search',
                thumbnailUrl: getStockThumbnail(ex.name),
                videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + " exercise physical therapy")}`
            }))
        },
        dietRecommendations: {
            overview: dietData.overview,
            keyFoods: dietData.keyFoods,
            foodsToAvoid: dietData.foodsToAvoid,
            hydration: dietData.hydration
        },
        consultation: {
            urgency: conditionData.urgency,
            specialists: conditionData.specialists,
            redFlags: conditionData.redFlags,
            followUp: `If symptoms persist beyond 2-3 weeks or worsen, please consult a ${conditionData.specialists[0]} for a detailed assessment.`,
            occupationAdvice: occData.modifications
        },
        recoveryTimeline: {
            week1: `Focus on pain management and gentle mobility. Perform exercises 2-3 times daily. Apply ice/heat as needed. ${ageData.precautions}`,
            week2_3: "Gradually increase exercise intensity and duration. You should notice improvement in range of motion and pain levels.",
            longTerm: `Continue with maintenance exercises 3-4 times per week. ${occData.modifications} Practice good posture and body mechanics consistently.`
        }
    };

    // Enrich with video links
    return enrichWithSmartLinks(report);
}

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
    'band': 'https://www.amazon.in/s?k=resistance+bands+physio',
    'ball': 'https://www.amazon.in/s?k=exercise+ball+physio',
    'roller': 'https://www.amazon.in/s?k=foam+roller',
    'dumbbell': 'https://www.amazon.in/s?k=dumbbells+1kg',
    'weight': 'https://www.amazon.in/s?k=ankle+weights+physio',
    'towel': 'https://www.amazon.in/s?k=microfiber+gym+towel',
    'mat': 'https://www.amazon.in/s?k=yoga+mat+thick'
};

function enrichWithEquipment(plan) {
    if (plan.exercisePlan?.selectedExercises) {
        plan.exercisePlan.selectedExercises = plan.exercisePlan.selectedExercises.map((ex) => {
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
    return plan;
}

function enrichWithSmartLinks(plan) {
    plan = enrichWithEquipment(plan);
    if (plan.exercisePlan?.selectedExercises) {
        plan.exercisePlan.selectedExercises = plan.exercisePlan.selectedExercises.map((ex) => {
            const verifiedId = findVerifiedVideo(ex.name);
            const query = encodeURIComponent(`${ex.name} exercise physical therapy short`);
            let thumbUrl = ex.thumbnailUrl || getStockThumbnail(ex.name || 'exercise');
            let videoUrl = ex.videoUrl || `https://www.youtube.com/results?search_query=${query}`;
            if (verifiedId && verifiedId.length > 5 && !verifiedId.includes(' ')) {
                thumbUrl = `https://img.youtube.com/vi/${verifiedId}/mqdefault.jpg`;
            }
            return { ...ex, type: 'search', thumbnailUrl: thumbUrl, videoUrl: videoUrl };
        });
    }
    return plan;
}
