// =============================================================================
// PHYSIO EXPERT SYSTEM - Highly Personalized Offline Report Generator
// Deep personalization based on every patient input
// =============================================================================

// --- GRANULAR AGE-SPECIFIC MESSAGING ---
function getAgePersonalization(age, name) {
    age = parseInt(age);

    if (age <= 18) {
        return {
            greeting: `${name}, at just ${age} years old, your body has incredible healing capacity!`,
            recovery: "Your young body recovers remarkably fast. Most people your age see significant improvement within just 1-2 weeks.",
            timeline: "Being in your teens, your tissues regenerate quickly. You'll likely feel better much sooner than older patients.",
            caution: "However, don't let quick recovery tempt you to overdo it - let your body heal completely.",
            metabolismNote: "Your high metabolism supports rapid tissue repair.",
            exerciseIntensity: "You can handle slightly more intensive exercises once initial pain subsides."
        };
    } else if (age <= 25) {
        return {
            greeting: `${name}, being ${age} years old puts you in an excellent position for recovery!`,
            recovery: "In your early twenties, your body's healing mechanisms are at peak performance. Recovery is typically swift.",
            timeline: "At ${age}, most patients recover 30-40% faster than the average adult. Expect noticeable improvement within 1-2 weeks.",
            caution: "Your quick recovery shouldn't lead to shortcuts - complete the full recovery program.",
            metabolismNote: "Your active metabolism and cellular regeneration work in your favor.",
            exerciseIntensity: "You can progress to moderate intensity exercises relatively quickly."
        };
    } else if (age <= 30) {
        return {
            greeting: `${name}, at ${age}, you're still in your prime recovery years!`,
            recovery: "Your late twenties body maintains strong healing capacity. With proper care, you'll bounce back well.",
            timeline: "Recovery in your late 20s is still excellent - typically 2-3 weeks for significant improvement.",
            caution: "This is a good time to build lasting healthy habits to prevent future issues.",
            metabolismNote: "Your metabolism remains supportive of quick tissue repair.",
            exerciseIntensity: "You can handle progressive exercise intensity with proper warm-up."
        };
    } else if (age <= 40) {
        return {
            greeting: `${name}, at ${age}, your body is still very capable of strong recovery!`,
            recovery: "Your thirties body heals well, though you may notice it takes slightly longer than your twenties.",
            timeline: "Expect steady improvement over 2-4 weeks. Consistency with exercises is your best friend now.",
            caution: "Pay attention to your body's signals - pushing too hard can extend recovery time.",
            metabolismNote: "Maintain good nutrition to support your body's repair processes.",
            exerciseIntensity: "Progress gradually - your body responds well but needs proper preparation."
        };
    } else if (age <= 50) {
        return {
            greeting: `${name}, at ${age}, you have excellent potential for full recovery with the right approach!`,
            recovery: "In your forties, recovery is absolutely achievable - it just requires more consistency and patience.",
            timeline: "Plan for 3-5 weeks of dedicated rehabilitation. The good news? Each week brings measurable progress.",
            caution: "Warm-up becomes crucial now. Never skip it. Cold muscles and joints are injury-prone.",
            metabolismNote: "Focus on anti-inflammatory foods and adequate protein to support healing.",
            exerciseIntensity: "Start gentle and build up. Your body responds well to gradual progression."
        };
    } else if (age <= 60) {
        return {
            greeting: `${name}, at ${age}, your experience and patience are your greatest assets in recovery!`,
            recovery: "Your body absolutely can heal well in your fifties - it just appreciates a more measured approach.",
            timeline: "Allow 4-6 weeks for substantial improvement. Remember: slow and steady wins the race.",
            caution: "Listen carefully to pain signals. Sharp pain means stop. Mild discomfort during exercise is okay.",
            metabolismNote: "Prioritize calcium, vitamin D, and quality protein. Hydration is also key.",
            exerciseIntensity: "Low to moderate intensity with excellent form is your winning formula."
        };
    } else if (age <= 70) {
        return {
            greeting: `${name}, at ${age}, your body still has wonderful healing capacity with the right support!`,
            recovery: "Recovery in your sixties is very achievable. Many patients your age see excellent outcomes with consistent effort.",
            timeline: "Plan for 6-8 weeks of gentle, consistent work. Every small improvement is a victory worth celebrating.",
            caution: "Safety first - avoid exercises that challenge your balance until you're stronger. Consider supervision initially.",
            metabolismNote: "Protein needs increase with age - aim for quality sources at every meal. Stay well hydrated.",
            exerciseIntensity: "Gentle, controlled movements. Quality over quantity. Rest between sessions is important."
        };
    } else {
        return {
            greeting: `${name}, at ${age}, your dedication to recovery is truly inspiring!`,
            recovery: "Your body continues to heal at any age. With patience and consistency, you can absolutely improve your condition.",
            timeline: "Recovery is a journey - focus on weekly improvements rather than rushing. Every bit of progress counts.",
            caution: "Please work directly with a physiotherapist who can supervise your exercises. Fall prevention is priority.",
            metabolismNote: "Nutrition becomes medicine at this stage - focus on anti-inflammatory, protein-rich foods.",
            exerciseIntensity: "Very gentle movements only. Seated or supported exercises may be safest initially."
        };
    }
}

// --- OCCUPATION-SPECIFIC DEEP PERSONALIZATION ---
function getOccupationPersonalization(occupation, problemArea, name) {
    const occ = occupation.toLowerCase();
    const area = problemArea.toLowerCase();

    let result = {
        workImpact: "",
        restrictions: [],
        modifications: [],
        leaveAdvice: "",
        returnToWork: "",
        workplaceChanges: []
    };

    // DESK/IT/SOFTWARE JOBS
    if (occ.includes("desk") || occ.includes("office") || occ.includes("computer") || occ.includes("it") || occ.includes("software") || occ.includes("developer") || occ.includes("programmer") || occ.includes("analyst")) {
        result.workImpact = `${name}, as someone who works with computers, your ${area} issue is likely connected to prolonged sitting and screen use.`;
        result.workplaceChanges = [
            "Position your monitor at eye level to avoid neck strain",
            "Use a chair with proper lumbar support",
            "Keep keyboard and mouse at elbow height",
            "Consider a standing desk or sit-stand converter"
        ];

        if (area.includes("neck") || area.includes("shoulder")) {
            result.restrictions = [
                "Take a 5-minute break every 30 minutes - set a timer",
                "Avoid cradling phone between ear and shoulder",
                "Don't work on laptop in bed or on couch"
            ];
            result.leaveAdvice = "If pain is severe, consider 2-3 days rest. Otherwise, work with frequent breaks is usually fine.";
        } else if (area.includes("back")) {
            result.restrictions = [
                "Don't sit for more than 45 minutes at a stretch",
                "Avoid slouching - use a lumbar roll or towel",
                "Stand up and walk for 2-3 minutes every hour"
            ];
            result.leaveAdvice = "For severe back pain, 3-5 days off may help initial recovery. Modify work setup on return.";
        } else if (area.includes("wrist") || area.includes("hand")) {
            result.restrictions = [
                "Use an ergonomic keyboard and vertical mouse",
                "Take micro-breaks every 15-20 minutes for wrist circles",
                "Avoid resting wrists on hard desk edges"
            ];
            result.leaveAdvice = "Consider 2-3 days complete rest from typing if symptoms are severe.";
        }
        result.returnToWork = "You can likely continue working with proper ergonomic setup and regular breaks.";
    }

    // DRIVERS
    else if (occ.includes("driver") || occ.includes("taxi") || occ.includes("uber") || occ.includes("truck") || occ.includes("delivery")) {
        result.workImpact = `${name}, as a driver, prolonged sitting with vibration exposure puts extra stress on your ${area}.`;
        result.workplaceChanges = [
            "Adjust seat position to maintain natural spine curve",
            "Use a seat cushion or lumbar support",
            "Adjust mirrors to minimize neck turning",
            "Take breaks every 1-2 hours to walk and stretch"
        ];

        if (area.includes("back") || area.includes("neck")) {
            result.restrictions = [
                "Limit driving to 2-hour stretches maximum during recovery",
                "Avoid heavy lifting (loading/unloading) for 2-3 weeks",
                "Don't reach into back seat while twisted"
            ];
            result.leaveAdvice = "Consider taking 1 week off if pain is severe. Driving with back pain can worsen condition.";
        }
        result.returnToWork = "Gradual return to driving - start with shorter routes and build up.";
    }

    // HEAVY PHYSICAL WORK
    else if (occ.includes("labor") || occ.includes("construction") || occ.includes("factory") || occ.includes("warehouse") || occ.includes("lifting") || occ.includes("mechanic") || occ.includes("plumber") || occ.includes("electrician")) {
        result.workImpact = `${name}, your physically demanding work means your ${area} condition needs careful management.`;
        result.workplaceChanges = [
            "Use mechanical aids for heavy lifting when possible",
            "Wear supportive gear (back brace, knee pads as needed)",
            "Work in pairs for heavy or awkward loads",
            "Stretch before and after shifts"
        ];
        result.restrictions = [
            "AVOID heavy lifting until pain-free for at least 1 week",
            "NO overhead work if shoulder/neck is affected",
            "Avoid prolonged bent-over positions"
        ];
        result.leaveAdvice = `${name}, I strongly recommend taking at least 1-2 weeks off from heavy physical work. Continuing to work through this pain will significantly delay your recovery and risks turning an acute issue into a chronic problem.`;
        result.returnToWork = "Start with light duties on return. Build back to full capacity over 2-3 weeks.";
    }

    // HEALTHCARE WORKERS
    else if (occ.includes("nurse") || occ.includes("doctor") || occ.includes("hospital") || occ.includes("caregiver") || occ.includes("physio") || occ.includes("medical")) {
        result.workImpact = `${name}, healthcare work involves patient handling which puts significant demands on your ${area}.`;
        result.workplaceChanges = [
            "Use hoists and sliding sheets for patient transfers",
            "Always adjust bed height before procedures",
            "Work in pairs for patient handling",
            "Wear supportive footwear"
        ];
        result.restrictions = [
            "Avoid manual patient lifts until recovered",
            "Request assignment to less physically demanding duties temporarily",
            "Don't skip breaks even when busy"
        ];
        result.leaveAdvice = "If possible, request light duties rather than full leave. If not possible, 1 week off may be needed.";
        result.returnToWork = "Gradual return with modified duties before full patient handling.";
    }

    // TEACHERS/STANDING JOBS
    else if (occ.includes("teacher") || occ.includes("professor") || occ.includes("lecturer") || occ.includes("retail") || occ.includes("shop") || occ.includes("standing")) {
        result.workImpact = `${name}, standing for long periods in your work can aggravate ${area} issues.`;
        result.workplaceChanges = [
            "Wear cushioned, supportive footwear",
            "Use anti-fatigue mats if standing in one spot",
            "Shift weight between feet regularly",
            "Sit when possible (during marking, admin work)"
        ];
        result.restrictions = [
            "Limit continuous standing to 30-minute intervals",
            "Use a stool or chair when possible",
            "Avoid high heels completely during recovery"
        ];
        result.leaveAdvice = "Usually can continue work with modifications. Take 2-3 days off if pain is severe.";
        result.returnToWork = "Alternate sitting and standing throughout the day.";
    }

    // STUDENTS
    else if (occ.includes("student") || occ.includes("school") || occ.includes("college") || occ.includes("university")) {
        result.workImpact = `${name}, long hours of studying and sitting can contribute to your ${area} problem.`;
        result.workplaceChanges = [
            "Set up a proper study desk - not on bed or couch",
            "Use a supportive chair with back support",
            "Position laptop/books at eye level when possible",
            "Follow the 20-20-20 rule: every 20 mins, look 20 feet away for 20 secs"
        ];
        result.restrictions = [
            "Don't carry heavy books in one-shoulder bag - use backpack",
            "Take breaks every 30-45 minutes during study sessions",
            "Avoid studying in bed - it wrecks your posture"
        ];
        result.leaveAdvice = "You likely don't need to miss classes, but take study breaks seriously.";
        result.returnToWork = "Continue studies with proper posture and regular breaks.";
    }

    // HOMEMAKER
    else if (occ.includes("home") || occ.includes("housewife") || occ.includes("housework") || occ.includes("homemaker")) {
        result.workImpact = `${name}, household work involves many repetitive movements that can aggravate ${area} issues.`;
        result.workplaceChanges = [
            "Use long-handled tools for sweeping/mopping",
            "Kneel rather than bend for floor-level tasks",
            "Keep frequently used items at waist level",
            "Use a trolley to move heavy items"
        ];
        result.restrictions = [
            "Avoid heavy lifting (wet clothes, gas cylinders) for 2-3 weeks",
            "Delegate strenuous chores temporarily",
            "Break up tasks - don't do all cleaning in one day"
        ];
        result.leaveAdvice = "Ask family members to help with heavy chores during recovery.";
        result.returnToWork = "Gradual return to normal activities. Heaviest tasks last.";
    }

    // DEFAULT/UNKNOWN
    else {
        result.workImpact = `${name}, depending on your daily activities, your ${area} condition may need some work modifications.`;
        result.workplaceChanges = [
            "Maintain good posture throughout your activities",
            "Take regular breaks every 30-45 minutes",
            "Avoid staying in one position for too long"
        ];
        result.restrictions = [
            "Avoid aggravating activities until symptoms improve",
            "Listen to your body - pain is a signal to stop"
        ];
        result.leaveAdvice = "If work aggravates symptoms, consider 2-3 days rest.";
        result.returnToWork = "Gradual return to full activity as symptoms allow.";
    }

    // ADD CONDITION-SPECIFIC RESTRICTIONS
    if (area.includes("wrist") || area.includes("hand")) {
        result.restrictions.push("Avoid two-wheeler driving - gripping handlebars worsens wrist strain");
        result.restrictions.push("Don't carry heavy bags with the affected hand");
        result.restrictions.push("Avoid wringing clothes or towels");
        result.restrictions.push("Use voice typing instead of keyboard when possible");
    }
    if (area.includes("knee")) {
        result.restrictions.push("Avoid stairs as much as possible - use elevators/ramps");
        result.restrictions.push("Don't sit cross-legged on the floor");
        result.restrictions.push("Avoid squatting positions");
        result.restrictions.push("Use handrails when available");
    }
    if (area.includes("ankle") || area.includes("foot")) {
        result.restrictions.push("Avoid walking on uneven surfaces");
        result.restrictions.push("Don't wear high heels or flip-flops - use supportive footwear");
        result.restrictions.push("Limit walking distances initially");
    }
    if (area.includes("shoulder")) {
        result.restrictions.push("Avoid reaching overhead - use step stools instead");
        result.restrictions.push("Don't carry bags on the affected shoulder");
        result.restrictions.push("Sleep on the opposite side");
    }

    return result;
}

// --- DIET PERSONALIZATION BASED ON DIET TYPE + CONDITION ---
function getDietPersonalization(dietPreference, problemArea, name, age, conditions) {
    const diet = (dietPreference || "").toLowerCase();
    const area = (problemArea || "").toLowerCase();
    const isYoung = parseInt(age) < 30;
    const hasDiabetes = conditions.includes("Diabetes");
    const hasBP = conditions.includes("High Blood Pressure");

    let result = {
        overview: "",
        proteinAdvice: "",
        antiInflammatory: "",
        specificFoods: [],
        foodsToAvoid: [],
        hydration: "",
        supplements: "",
        mealTiming: ""
    };

    // VEGAN
    if (diet.includes("vegan")) {
        result.overview = `${name}, as a vegan, you can absolutely get all the nutrients needed for your ${area} recovery from plant sources - you just need to be strategic about it.`;
        result.proteinAdvice = "Combine legumes with grains to get complete protein. Aim for 1.2-1.5g protein per kg body weight during recovery. Example: rice + dal, roti + chole, quinoa salad.";
        result.specificFoods = [
            "Tofu and tempeh (excellent complete protein)",
            "Lentils, chickpeas, kidney beans (dal varieties)",
            "Quinoa and amaranth (high protein grains)",
            "Chia seeds, hemp seeds, pumpkin seeds",
            "Nut butters - peanut, almond, cashew",
            "Soy milk, fortified plant milks",
            "Dark leafy greens (spinach, kale) for iron and calcium"
        ];
        result.foodsToAvoid = [
            "Highly processed vegan junk food",
            "Excessive refined carbs (maida)",
            "Too much oil in cooking"
        ];
        result.supplements = "Consider B12 supplement (essential for vegans), and possibly vitamin D and omega-3 (algae-based) for optimal healing.";
    }

    // VEGETARIAN
    else if (diet.includes("vegetarian") || diet.includes("veg")) {
        result.overview = `${name}, your vegetarian diet can fully support your ${area} recovery. Focus on protein-rich options.`;
        result.proteinAdvice = "Include protein at every meal. Good options: paneer, eggs (if you eat them), Greek yogurt, dals, legumes. Aim for palm-sized protein portions.";
        result.specificFoods = [
            "Paneer (cottage cheese) - excellent protein source",
            "Greek yogurt/dahi - protein + probiotics",
            "Eggs (if included in your diet) - complete protein",
            "All varieties of dal and legumes",
            "Milk, curd, lassi, buttermilk",
            "Cheese in moderation",
            "Nuts and seeds",
            "Soy products - tofu, soy chunks"
        ];
        result.foodsToAvoid = [
            "Deep fried pakoras/samosas - use inflammatory oils",
            "Excessive sweets and sugar",
            "Too much processed cheese"
        ];
        result.supplements = "Most vegetarians get adequate nutrients from diet. Consider vitamin D supplement if you have limited sun exposure.";
    }

    // NON-VEG
    else {
        result.overview = `${name}, being non-vegetarian gives you access to multiple high-quality protein sources that can accelerate your ${area} recovery. Make the most of this advantage!`;
        result.proteinAdvice = "You have excellent protein options available. Include 1-2 servings of quality protein daily. Lean meats, fish, and eggs provide complete amino acids that directly support tissue repair.";
        result.specificFoods = [
            "Fatty fish (salmon, sardines, mackerel) - omega-3 reduces inflammation",
            "Chicken breast - lean, high-quality protein",
            "Eggs - complete protein, easy to digest, have 2-3 per day",
            "Fish (rohu, catla, pomfret) - lighter than meat",
            "Bone broth/soup - contains collagen for joint health",
            "Lean mutton in moderation",
            "Prawns and other seafood"
        ];
        result.foodsToAvoid = [
            "Processed meats (sausages, bacon, salami)",
            "Deep fried chicken/fish",
            "Red meat more than 2-3 times per week",
            "Very spicy preparations that may cause inflammation"
        ];
        result.supplements = "You likely get most nutrients from diet. Fish oil supplements can provide additional anti-inflammatory benefits.";
    }

    // ANTI-INFLAMMATORY (common for all)
    result.antiInflammatory = "Add these anti-inflammatory powerhouses to your diet: turmeric (haldi) with black pepper, ginger (adrak), garlic, green leafy vegetables, berries, green tea.";

    // HYDRATION based on age
    if (isYoung) {
        result.hydration = `${name}, at ${age}, aim for 3-4 liters of water daily. Your active metabolism needs it. Add nimbu pani (without excess sugar) for variety.`;
    } else {
        result.hydration = `${name}, stay well hydrated with 2.5-3 liters of water daily. Proper hydration keeps joints lubricated and muscles supple. Coconut water is a great natural option.`;
    }

    // CONDITION-SPECIFIC additions
    if (area.includes("bone") || area.includes("joint") || area.includes("knee") || area.includes("hip")) {
        result.specificFoods.push("Milk and dairy for calcium");
        result.specificFoods.push("Sesame seeds (til) - high calcium");
        result.specificFoods.push("Ragi (finger millet) - excellent for bones");
    }

    if (area.includes("muscle") || area.includes("strain")) {
        result.mealTiming = "Have your protein-rich meal within 2 hours of doing your exercises for optimal muscle recovery.";
    }

    // MEDICAL CONDITION adjustments
    if (hasDiabetes) {
        result.foodsToAvoid.push("Refined sugars and sweets");
        result.foodsToAvoid.push("White rice/maida in excess");
        result.overview += " Given your diabetes, focus on low-glycemic options and avoid sugar spikes.";
    }
    if (hasBP) {
        result.foodsToAvoid.push("Excessive salt/sodium");
        result.foodsToAvoid.push("Pickles and papad");
        result.overview += " With your blood pressure condition, keep salt intake minimal.";
    }

    return result;
}

// --- COMPREHENSIVE CONDITION DATABASE ---
const CONDITION_DB = {
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
            specialists: ["Physiotherapist", "Orthopedic Specialist"]
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
            specialists: ["Physiotherapist"]
        }
    },
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
            specialists: ["Physiotherapist", "Spine Specialist", "Orthopedic Surgeon"]
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
            specialists: ["Physiotherapist", "Rheumatologist"]
        }
    },
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
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine Doctor"]
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
            specialists: ["Orthopedic Surgeon", "Rheumatologist"]
        }
    },
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
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine"]
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
            specialists: ["Physiotherapist", "Orthopedic Surgeon"]
        }
    },
    'wrist': {
        'pain': {
            causes: "carpal tunnel syndrome, repetitive strain, tendinitis, De Quervain's",
            severity: "Mild to Moderate",
            prognosis: "Most cases improve with rest and ergonomic changes in 2-4 weeks",
            exercises: [
                { name: "Wrist Flexor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm up, pull fingers back toward body. Stretches forearm flexors." },
                { name: "Wrist Extensor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm down, press hand down. Stretches forearm extensors." },
                { name: "Tendon Glides", sets: "3", reps: "10", difficulty: "Easy", description: "Move fingers through various positions: straight, hook, fist, tabletop." }
            ],
            redFlags: ["Severe numbness", "Weakness in grip", "Visible deformity"],
            specialists: ["Physiotherapist", "Hand Therapist", "Orthopedic Surgeon"]
        }
    },
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
            specialists: ["Physiotherapist", "Podiatrist", "Orthopedic Surgeon"]
        }
    },
    'hip': {
        'pain': {
            causes: "bursitis, muscle strain, arthritis, labral tear, referred back pain",
            severity: "Moderate",
            prognosis: "Most muscular issues resolve in 4-8 weeks",
            exercises: [
                { name: "Clamshells", sets: "3", reps: "15 each side", difficulty: "Moderate", description: "Lie on side with knees bent, lift top knee keeping feet together." },
                { name: "Hip Flexor Stretch", sets: "2", reps: "30 sec each", difficulty: "Easy", description: "Kneel on one knee, push hips forward. Stretches tight hip flexors." },
                { name: "Glute Bridge", sets: "3", reps: "12", difficulty: "Moderate", description: "Lie on back, lift hips, squeeze glutes at top." }
            ],
            redFlags: ["Groin pain with clicking", "Night pain", "Unable to bear weight"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Hip Specialist"]
        }
    },
    'hand': {
        'pain': {
            causes: "arthritis, tendinitis, trigger finger, overuse injury",
            severity: "Mild to Moderate",
            prognosis: "Usually improves with rest and activity modification in 2-4 weeks",
            exercises: [
                { name: "Finger Spreads", sets: "3", reps: "10", difficulty: "Easy", description: "Spread fingers wide apart, then bring together. Repeat slowly." },
                { name: "Grip Strengthening", sets: "2", reps: "10", difficulty: "Easy", description: "Squeeze a soft ball gently, hold 5 seconds. Build grip strength gradually." },
                { name: "Thumb Circles", sets: "2", reps: "10 each direction", difficulty: "Easy", description: "Make circles with thumb. Maintains mobility." }
            ],
            redFlags: ["Severe swelling", "Numbness/tingling", "Locked fingers"],
            specialists: ["Physiotherapist", "Hand Therapist"]
        }
    },
    'foot': {
        'pain': {
            causes: "plantar fasciitis, heel spurs, metatarsalgia, nerve compression",
            severity: "Mild to Moderate",
            prognosis: "Plantar fasciitis takes 6-12 months; others improve in 4-8 weeks",
            exercises: [
                { name: "Towel Curls", sets: "3", reps: "15", difficulty: "Easy", description: "Scrunch towel with toes to strengthen foot muscles." },
                { name: "Calf Stretches", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Stand facing wall, stretch calf by leaning forward." },
                { name: "Frozen Bottle Roll", sets: "2", reps: "5 min", difficulty: "Easy", description: "Roll frozen water bottle under foot arch for massage and ice therapy." }
            ],
            redFlags: ["Severe heel pain with first steps", "Numbness", "Visible deformity"],
            specialists: ["Physiotherapist", "Podiatrist"]
        }
    },
    'elbow': {
        'pain': {
            causes: "tennis elbow, golfer's elbow, bursitis, nerve entrapment",
            severity: "Mild to Moderate",
            prognosis: "Usually 6-12 weeks with proper management; can be stubborn",
            exercises: [
                { name: "Wrist Flexor Stretch", sets: "3", reps: "30 sec", difficulty: "Easy", description: "Extend arm, pull hand back gently. Stretches inner forearm." },
                { name: "Wrist Extensor Stretch", sets: "3", reps: "30 sec", difficulty: "Easy", description: "Extend arm, push hand down gently. Stretches outer forearm." },
                { name: "Eccentric Wrist Curls", sets: "3", reps: "15", difficulty: "Moderate", description: "Lower a light weight slowly. Key exercise for tennis elbow." }
            ],
            redFlags: ["Severe swelling", "Inability to straighten arm", "Numbness in hand"],
            specialists: ["Physiotherapist", "Sports Medicine Doctor"]
        }
    }
};

// --- MAIN REPORT GENERATOR ---
function generateRecoveryPlan(patientData) {
    console.log("Generating highly personalized report for:", patientData);

    const name = patientData.name || "Patient";
    const age = patientData.age || 30;
    const problemArea = (patientData.problemArea || "back").toLowerCase();
    const symptoms = (patientData.problemStatement || "pain").toLowerCase();
    const occupation = patientData.occupation || "working professional";
    const dietPref = patientData.dietPreference || "non-vegetarian";
    const recentSurgery = patientData.recentSurgery || "no";

    // Build medical conditions array
    const conditions = [];
    if (patientData.condition_diabetes) conditions.push("Diabetes");
    if (patientData.condition_bp) conditions.push("High Blood Pressure");
    if (patientData.condition_heart) conditions.push("Heart Conditions");

    // Surgery status handling
    let surgeryInfo = {
        hasSurgery: false,
        isMajor: false,
        warning: "",
        restrictions: [],
        exerciseNote: "",
        consultNote: ""
    };

    if (recentSurgery === "yes_minor") {
        surgeryInfo = {
            hasSurgery: true,
            isMajor: false,
            warning: `⚠️ **Important:** You mentioned having a recent minor surgery. This has been factored into your plan.`,
            restrictions: [
                "Avoid any exercises that cause pulling or strain at the surgery site",
                "Start with 50% intensity and progress very slowly",
                "Stop immediately if you feel any pain near the surgical area"
            ],
            exerciseNote: "Given your recent surgery, start these exercises at HALF the recommended intensity.",
            consultNote: "With your recent surgery, I strongly recommend getting clearance from your surgeon before starting any exercise program."
        };
    } else if (recentSurgery === "yes_major") {
        surgeryInfo = {
            hasSurgery: true,
            isMajor: true,
            warning: `🚨 **CRITICAL:** You mentioned having a recent MAJOR operation. This significantly impacts your recovery approach.`,
            restrictions: [
                "DO NOT start any exercises without explicit clearance from your surgeon",
                "Your body is still healing internally - avoid all strenuous activity",
                "Risk of complications is much higher during post-surgical recovery",
                "Wait at least 6-8 weeks post-surgery before any physical rehabilitation",
                "Your surgical site needs priority healing before addressing other issues"
            ],
            exerciseNote: `⚠️ **POST-SURGICAL NOTICE:** ${name}, before attempting ANY exercises below, you MUST consult your surgeon. Major surgery requires internal healing that takes precedence over this condition.`,
            consultNote: `${name}, with your recent major operation, please FIRST consult your operating surgeon. Once they clear you, Dr. Vanshika can create a post-surgical rehabilitation program specifically designed for your recovery.`
        };
    }

    // Determine condition type
    let conditionKey = "pain";
    if (symptoms.includes("stiff")) conditionKey = "stiffness";
    if (symptoms.includes("swell")) conditionKey = "swelling";

    // Find matching area
    let areaKey = "back";
    for (const key of Object.keys(CONDITION_DB)) {
        if (problemArea.includes(key)) {
            areaKey = key;
            break;
        }
    }

    const conditionData = CONDITION_DB[areaKey]?.[conditionKey] || CONDITION_DB[areaKey]?.["pain"] || CONDITION_DB["back"]["pain"];

    // Get personalization data
    const ageData = getAgePersonalization(age, name);
    const occData = getOccupationPersonalization(occupation, problemArea, name);
    const dietData = getDietPersonalization(dietPref, problemArea, name, age, conditions);

    // Build deeply personalized report
    const report = {
        analysis: {
            // SECTION 1: Empathetic greeting + validation + CTA to Dr. Vanshika
            understanding: `${ageData.greeting}

I can see you're experiencing "${patientData.problemStatement}" - and I want you to know that this is a very common concern, especially for someone in your profession (${occupation}). You've taken the right step by seeking help.

${conditions.length > 0 ? `I've noted your medical history (${conditions.join(", ")}) and this has been carefully considered in your personalized plan below.` : ""}

${surgeryInfo.hasSurgery ? `
${surgeryInfo.warning}

${surgeryInfo.consultNote}
` : ""}

📋 **Below is your evidence-based recovery plan** with exercises, diet guidance, and a clear timeline. This plan is designed to be highly effective when followed consistently.

💡 **However, for the best possible outcome**, I strongly recommend booking a one-on-one consultation with **Dr. Vanshika** - a certified physiotherapy specialist who can:
• Physically assess your condition and identify the exact problem
• Customize these exercises to your specific body mechanics  
• Monitor your progress and adjust the plan as you heal
${surgeryInfo.isMajor ? "• Coordinate with your surgeon for safe post-operative rehabilitation" : "• Address any complications early before they become serious"}

👉 **Click "Book Dr. Vanshika" below to schedule your consultation** and get expert guidance that can accelerate your recovery by 40-60%.`,

            // SECTION 2: Clinical causes (purely diagnostic)
            likelyCauses: `**What's likely causing your ${areaKey} ${conditionKey}:**

${conditionData.causes}.

**Contributing factors in your case:**
• Age (${age} years): ${parseInt(age) < 30 ? "Your tissues are resilient, but overuse can still cause strain" : parseInt(age) < 50 ? "Some natural wear may be contributing" : "Age-related changes may be a factor"}
• Occupation (${occupation}): ${occData.workImpact}
${surgeryInfo.hasSurgery ? `• Recent Surgery: ${surgeryInfo.isMajor ? "Your major operation is currently the PRIMARY consideration. Your body is using resources for surgical healing." : "Your recent minor surgery may be affecting your overall recovery capacity."}` : ""}`,

            // SECTION 3: Severity assessment  
            severity: conditionData.severity,

            // SECTION 4: Recovery outlook (purely prognostic)
            prognosis: `**Your Recovery Outlook:**

${surgeryInfo.isMajor ? `🚨 **POST-SURGICAL PRIORITY:** ${name}, your recent major surgery takes precedence. Your body needs 6-8 weeks minimum to heal from the operation before focusing on other issues. Consult your surgeon first.

` : ""}${conditionData.prognosis}

**Based on your age (${age}):** ${ageData.recovery}

**Important:** ${ageData.caution}
${surgeryInfo.hasSurgery && !surgeryInfo.isMajor ? `
⚠️ **Surgery Note:** Your recent surgery may slow recovery slightly. Be extra gentle and patient.` : ""}

⚡ **With expert guidance from Dr. Vanshika**, many patients see results 2-3 weeks faster than self-treatment alone.`
        },

        exercisePlan: {
            overview: `${surgeryInfo.isMajor ? surgeryInfo.exerciseNote + "\n\n" : ""}${name}, here is your personalized exercise program designed specifically for your ${areaKey} ${conditionKey}.

${ageData.exerciseIntensity}
${surgeryInfo.hasSurgery && !surgeryInfo.isMajor ? "\n" + surgeryInfo.exerciseNote : ""}

Perform these exercises ${parseInt(age) > 50 ? "once daily, gently" : "2-3 times daily for best results"}.

⚠️ **Note:** These are general exercises. Dr. Vanshika can demonstrate proper form and modify them based on your exact condition.${surgeryInfo.hasSurgery ? " This is especially important given your recent surgery." : ""}`,

            selectedExercises: conditionData.exercises.map(ex => ({
                ...ex,
                personalNote: surgeryInfo.isMajor ? "⚠️ GET SURGEON CLEARANCE FIRST" : (parseInt(age) > 60 ? "Go very gently - stop if any sharp pain" : "Progress at your own pace")
            }))
        },

        workAdvice: {
            impact: occData.workImpact,
            restrictions: surgeryInfo.hasSurgery ? [...occData.restrictions, ...surgeryInfo.restrictions] : occData.restrictions,
            modifications: occData.workplaceChanges,
            leaveRecommendation: surgeryInfo.isMajor ? `🚨 ${name}, with your recent major surgery, you should NOT be working until cleared by your surgeon. Recovery from surgery is your #1 priority right now. ${occData.leaveAdvice}` : occData.leaveAdvice,
            returnToWork: surgeryInfo.isMajor ? "Return to work ONLY after your surgeon clears you. Then follow a gradual return plan." : occData.returnToWork,
            surgeryNote: surgeryInfo.hasSurgery ? surgeryInfo.warning : null
        },

        dietRecommendations: {
            overview: dietData.overview,
            proteinGuidance: dietData.proteinAdvice,
            antiInflammatory: dietData.antiInflammatory,
            keyFoods: dietData.specificFoods,
            foodsToAvoid: dietData.foodsToAvoid,
            hydration: dietData.hydration,
            supplements: dietData.supplements,
            mealTiming: dietData.mealTiming || "Have regular, balanced meals. Don't skip breakfast."
        },

        consultation: {
            urgency: `${name}, while this plan is comprehensive, ${parseInt(age) > 50 ? "I strongly recommend" : "I recommend"} booking a session with **Dr. Vanshika** for:
• Professional hands-on assessment
• Personalized exercise modifications
• Faster recovery with expert guidance

${parseInt(age) > 50 ? "At your age, professional supervision ensures safety and optimal results." : "Expert guidance can prevent this from becoming a recurring issue."}`,
            specialists: conditionData.specialists,
            redFlags: conditionData.redFlags,
            followUp: `${name}, if any of these warning signs appear, seek immediate medical attention. Otherwise, book with Dr. Vanshika for your follow-up assessment.`,
            drVanshikaCTA: true // Flag for special button
        },

        recoveryTimeline: {
            week1: `**Week 1 - Foundation Phase**
${ageData.timeline.replace("${age}", age)} 

Focus on: Pain reduction and gentle mobility
Ice therapy: 15-20 min if inflammation present
Exercise frequency: ${parseInt(age) > 50 ? "Once daily, very gently" : "2-3 times daily"}

💡 *Booking Dr. Vanshika this week ensures you start with correct form.*`,

            week2_3: `**Week 2-3 - Progress Phase**
${name}, you should start noticing improvement now.

${parseInt(age) < 30 ? "Your body heals fast - you may feel significantly better already!" : "Patience is key - celebrate small daily improvements."}

Gradually increase exercise duration and intensity.

💡 *A mid-recovery check-in with Dr. Vanshika can fine-tune your program.*`,

            longTerm: `**Long-term - Maintenance & Prevention**
${occData.returnToWork}

Continue maintenance exercises ${parseInt(age) < 40 ? "3-4 times per week" : "daily"} to prevent recurrence.

${name}, the habits you build now will protect you for years. Prevention is always better than cure.

👉 **Consider a monthly check-in with Dr. Vanshika** to maintain your gains and catch any issues early.`
        }
    };

    // Enrich with video links and equipment
    return enrichWithSmartLinks(report);
}

// --- VERIFIED EXERCISE LIBRARY ---
const EXERCISE_LIBRARY = {
    'chin tuck': 'E_Wf8_7S4gQ', 'neck tilt': '0eO1aB6U72c', 'upper trap': '1Y1_T7y7KzI',
    'levator scapulae': 'W6vOwhlVq_Q', 'neck rotation': 'Xk8jN5qfC3o',
    'pendulum': 'GFbCDbE86-A', 'doorway stretch': 'lZ8qZ0y-cRk', 'wall slide': '33P5AI27ejU',
    'shoulder roll': 'qGL_6c8dZVQ', 'scapular': '33P5AI27ejU',
    'cat cow': 'sJq0jW4_P68', 'cat-cow': 'sJq0jW4_P68', 'childs pose': 'Eq6oMDi00n4', 'child\'s pose': 'Eq6oMDi00n4',
    'knee to chest': 'bJzM6k9gZ24', 'superman': 'cc6UVRS7TXw', 'bridge': 'N3lS97aGf-Q',
    'mcgill': '2_e4I-brfqs', 'cobra': 'fOdrW7nf9gw', 'quad set': 'I7C7nF9i8aU',
    'straight leg': 'L8Z_F2qR0lY', 'heel slide': '02sW4F11i_E', 'step up': 'dVVQyZ0RjYk',
    'hamstring': 'JWqNgy9w54s', 'clam': '7L0sT5XwK5s', 'clamshell': '7L0sT5XwK5s',
    'ankle alphabet': 'vvlZ4b19E50', 'calf raise': 'M4Cj4h9bXM', 'towel': '9q0Wj2_8eK0',
    'wrist flexor': 'Ejl47X2-G2w', 'wrist extensor': 'Ejl47X2-G2w', 'tendon': 'VlKeRWz4Z2c',
    'glute bridge': 'N3lS97aGf-Q', 'hip flexor': 'YZK5K2vF_eo'
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
    return STOCK_IMAGES[Math.abs(hash) % STOCK_IMAGES.length];
}

const EQUIPMENT_MAP = {
    'band': 'https://www.amazon.in/s?k=resistance+bands+physio',
    'ball': 'https://www.amazon.in/s?k=exercise+ball+physio',
    'roller': 'https://www.amazon.in/s?k=foam+roller',
    'dumbbell': 'https://www.amazon.in/s?k=dumbbells+1kg',
    'weight': 'https://www.amazon.in/s?k=ankle+weights+physio',
    'towel': 'https://www.amazon.in/s?k=microfiber+gym+towel',
    'mat': 'https://www.amazon.in/s?k=yoga+mat+thick',
    'bottle': 'https://www.amazon.in/s?k=water+bottle+gym'
};

function enrichWithSmartLinks(plan) {
    if (plan.exercisePlan?.selectedExercises) {
        plan.exercisePlan.selectedExercises = plan.exercisePlan.selectedExercises.map((ex) => {
            const verifiedId = findVerifiedVideo(ex.name);
            const query = encodeURIComponent(`${ex.name} exercise physical therapy`);
            let thumbUrl = getStockThumbnail(ex.name || 'exercise');
            let videoUrl = `https://www.youtube.com/results?search_query=${query}`;

            if (verifiedId && verifiedId.length > 5) {
                thumbUrl = `https://img.youtube.com/vi/${verifiedId}/mqdefault.jpg`;
            }

            // Check for equipment
            let equipLink = null, equipName = null;
            const lowerName = (ex.name + ' ' + (ex.description || '')).toLowerCase();
            for (const [key, url] of Object.entries(EQUIPMENT_MAP)) {
                if (lowerName.includes(key)) {
                    equipLink = url;
                    equipName = key.charAt(0).toUpperCase() + key.slice(1);
                    break;
                }
            }

            return { ...ex, type: 'search', thumbnailUrl: thumbUrl, videoUrl: videoUrl, equipmentUrl: equipLink, equipmentName: equipName };
        });
    }
    return plan;
}
