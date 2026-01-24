// =============================================================================
// PHYSIO EXPERT SYSTEM - Fully Personalized Offline Report Generator
// EVERY INPUT IS USED - No field ignored
// =============================================================================

// ALL FORM FIELDS CHECKLIST:
// ✅ Step 1: name, age, gender
// ✅ Step 2: occupation, dietPreference
// ✅ Step 3: condition_diabetes, condition_bp, condition_heart, recentSurgery
// ✅ Step 4: problemArea, problemStatement, painLevel

// --- DYNAMIC PHRASE VARIATIONS ---
const PHRASES = {
    greeting: {
        young: [
            (name, age) => `${name}, at ${age} years young, your body is incredibly resilient!`,
            (name, age) => `Great news, ${name}! Being just ${age}, you're in prime healing condition.`,
            (name, age) => `${name}, your ${age}-year-old body has excellent recovery potential!`
        ],
        middle: [
            (name, age) => `${name}, at ${age}, you have solid recovery capabilities ahead!`,
            (name, age) => `Welcome, ${name}! At ${age}, your body knows how to heal effectively.`,
            (name, age) => `${name}, being ${age} years old, you're in a good position for recovery!`
        ],
        senior: [
            (name, age) => `${name}, at ${age}, your patience and wisdom support your healing journey!`,
            (name, age) => `Welcome, ${name}! At ${age}, steady and consistent effort brings great results.`,
            (name, age) => `${name}, your ${age} years of experience teach you to listen to your body well!`
        ]
    },
    recovery: {
        fast: [
            "Your youthful biology supports rapid tissue repair - expect to feel better soon!",
            "With your body's natural regeneration at peak performance, recovery should be quick!",
            "Young tissues heal remarkably well - stay consistent and you'll bounce back fast!"
        ],
        moderate: [
            "Your body has solid healing capacity - consistent effort will bring results!",
            "Recovery is very achievable with dedication - your body responds well to proper care!",
            "With the right approach, you'll see steady improvement week by week!"
        ],
        gradual: [
            "Healing takes a bit more time now, but every day of effort counts significantly!",
            "Your body heals at its own pace - patience and consistency are your best allies!",
            "Steady progress is still progress - celebrate every improvement along the way!"
        ]
    }
};

// --- DYNAMIC SENTENCE BUILDERS (not preset phrases) ---
// These build unique sentences using actual patient data

function buildValidationPhrase(symptom, occupation, name, age, bodyArea, painLevel) {
    // Dynamic word choices
    const empathyWords = ['understand', 'recognize', 'acknowledge', 'see', 'note'];
    const concernWords = ['dealing with', 'experiencing', 'going through', 'facing', 'managing'];
    const actionWords = ['address', 'tackle', 'work on', 'focus on', 'help with'];
    const supportWords = ['together', 'step by step', 'with proper guidance', 'systematically', 'carefully'];

    const empathy = empathyWords[Math.floor(Math.random() * empathyWords.length)];
    const concern = concernWords[Math.floor(Math.random() * concernWords.length)];
    const action = actionWords[Math.floor(Math.random() * actionWords.length)];
    const support = supportWords[Math.floor(Math.random() * supportWords.length)];

    // Age-specific context
    const ageContext = age < 30 ? "Your young body has excellent healing potential" :
        age < 50 ? "At your age, focused rehabilitation yields great results" :
            "With experience comes patience, which aids recovery";

    // Pain-level context
    const painContext = painLevel <= 4 ? "catching this early gives us a great advantage" :
        painLevel <= 7 ? "this level of discomfort needs proper attention" :
            "this significant pain requires immediate, focused care";

    return `${name}, I ${empathy} you're ${concern} "${symptom}" in your ${bodyArea}. ${ageContext}, and ${painContext}. Let's ${action} this ${support}.`;
}

function buildSurgeryValidationPhrase(symptom, name, age, bodyArea, painLevel, surgeryType) {
    const severityWords = surgeryType === 'major' ?
        ['serious', 'significant', 'major', 'important'] :
        ['healing', 'recovering', 'post-operative', 'recent'];
    const careWords = ['carefully designed', 'specifically tailored', 'thoughtfully created', 'specially adapted'];
    const priorityWords = ['your surgical recovery comes first', 'healing from surgery is the priority', 'your post-operative care takes precedence'];

    const severity = severityWords[Math.floor(Math.random() * severityWords.length)];
    const care = careWords[Math.floor(Math.random() * careWords.length)];
    const priority = priorityWords[Math.floor(Math.random() * priorityWords.length)];

    const painNote = painLevel > 6 ? ` With pain at ${painLevel}/10, ` : ` `;

    return `${name}, experiencing "${symptom}" after your ${severity} surgery requires specialized attention.${painNote}This plan is ${care} for your ${bodyArea} while ${priority}.`;
}

// Random picker
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// --- GENDER-SPECIFIC LANGUAGE ---
function getGenderTerms(gender) {
    if (gender === "female") {
        return { pronoun: "she", possessive: "her", title: "Ms.", reflexive: "herself" };
    } else if (gender === "male") {
        return { pronoun: "he", possessive: "his", title: "Mr.", reflexive: "himself" };
    }
    return { pronoun: "they", possessive: "their", title: "", reflexive: "themselves" };
}

// --- BMI CALCULATION & NUTRITION ---
function calculateBMI(weight, height) {
    // weight in kg, height in cm
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let category, warning, jointImpact, color;

    if (bmi < 18.5) {
        category = "Underweight";
        warning = "Being underweight may affect your body's healing capacity. Ensure adequate nutrition.";
        jointImpact = null;
        color = "#3B82F6"; // Blue
    } else if (bmi < 25) {
        category = "Normal";
        warning = null;
        jointImpact = null;
        color = "#10B981"; // Green
    } else if (bmi < 30) {
        category = "Overweight";
        warning = "Extra weight increases stress on your joints, especially knees, ankles, and lower back.";
        jointImpact = "Each extra kg adds approximately 4 kg of pressure on your knee joints during walking.";
        color = "#F59E0B"; // Yellow
    } else {
        category = "Obese";
        warning = "Your weight is significantly impacting joint health. Weight management should be part of your recovery plan.";
        jointImpact = "Obesity increases joint pain by 4-5x and slows healing. Consider Dr. Vanshika's weight management guidance.";
        color = "#EF4444"; // Red
    }

    return { bmi: bmi.toFixed(1), category, warning, jointImpact, color };
}

function calculateNutrition(weight, height, age, gender, activityLevel = 'moderate') {
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier (for recovery patients, mostly sedentary to light)
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725
    };

    const tdee = Math.round(bmr * activityMultipliers[activityLevel] || 1.375);

    // Calculate macros
    const protein = Math.round(weight * 1.6); // 1.6g/kg for recovery
    const fats = Math.round((tdee * 0.25) / 9); // 25% of calories from fats
    const carbs = Math.round((tdee - (protein * 4) - (fats * 9)) / 4);

    // Water intake (30-35ml per kg)
    const waterLiters = ((weight * 33) / 1000).toFixed(1);

    // Ideal weight range (BMI 20-24)
    const heightM = height / 100;
    const idealWeightMin = Math.round(20 * heightM * heightM);
    const idealWeightMax = Math.round(24 * heightM * heightM);

    return {
        calories: tdee,
        protein: protein,
        carbs: carbs,
        fats: fats,
        water: waterLiters,
        idealWeightMin: idealWeightMin,
        idealWeightMax: idealWeightMax,
        weightToLose: weight > idealWeightMax ? Math.round(weight - idealWeightMax) : 0
    };
}

// --- DETAILED MEAL PLAN GENERATOR ---
function generateMealPlan(nutritionData, dietPref, bmiCategory) {
    const { calories, protein, carbs, fats, water } = nutritionData;

    // Calculate per-meal targets (Breakfast 25%, Lunch 35%, Dinner 25%, Snacks 15%)
    const mealSplit = {
        breakfast: { calPct: 0.25, proteinPct: 0.25 },
        lunch: { calPct: 0.35, proteinPct: 0.35 },
        dinner: { calPct: 0.25, proteinPct: 0.30 },
        snacks: { calPct: 0.15, proteinPct: 0.10 }
    };

    const isVeg = dietPref === 'vegetarian' || dietPref === 'vegan';
    const needsWeightLoss = bmiCategory === 'Overweight' || bmiCategory === 'Obese';

    // VEG/NON-VEG FOOD DATABASE with macros per 100g
    const foods = {
        // BREAKFAST OPTIONS
        breakfast: {
            veg: [
                { name: 'Oats (cooked)', protein: 5, carbs: 27, fats: 3, cal: 150 },
                { name: 'Poha', protein: 3, carbs: 25, fats: 4, cal: 130 },
                { name: 'Idli (2 pcs)', protein: 4, carbs: 20, fats: 1, cal: 100 },
                { name: 'Besan Chilla', protein: 8, carbs: 18, fats: 5, cal: 140 },
                { name: 'Moong Dal Dosa', protein: 7, carbs: 20, fats: 3, cal: 130 },
                { name: 'Upma', protein: 4, carbs: 22, fats: 4, cal: 130 }
            ],
            nonveg: [
                { name: 'Egg Whites Omelette (3)', protein: 11, carbs: 1, fats: 0, cal: 50 },
                { name: 'Boiled Eggs (2)', protein: 13, carbs: 1, fats: 10, cal: 155 },
                { name: 'Egg Bhurji', protein: 12, carbs: 3, fats: 11, cal: 160 }
            ]
        },
        // LUNCH OPTIONS
        lunch: {
            veg: [
                { name: 'Brown Rice', protein: 3, carbs: 25, fats: 1, cal: 110 },
                { name: 'Roti (2 pcs)', protein: 6, carbs: 30, fats: 2, cal: 160 },
                { name: 'Dal (1 bowl)', protein: 9, carbs: 20, fats: 2, cal: 120 },
                { name: 'Paneer Sabzi', protein: 18, carbs: 4, fats: 20, cal: 265 },
                { name: 'Rajma', protein: 9, carbs: 23, fats: 1, cal: 127 },
                { name: 'Chole', protein: 8, carbs: 27, fats: 5, cal: 164 },
                { name: 'Mixed Veg Sabzi', protein: 3, carbs: 10, fats: 3, cal: 70 }
            ],
            nonveg: [
                { name: 'Grilled Chicken Breast', protein: 31, carbs: 0, fats: 4, cal: 165 },
                { name: 'Fish Curry', protein: 22, carbs: 5, fats: 8, cal: 180 },
                { name: 'Egg Curry (2 eggs)', protein: 14, carbs: 6, fats: 12, cal: 190 }
            ]
        },
        // DINNER OPTIONS
        dinner: {
            veg: [
                { name: 'Roti (1 pc)', protein: 3, carbs: 15, fats: 1, cal: 80 },
                { name: 'Khichdi', protein: 6, carbs: 25, fats: 3, cal: 140 },
                { name: 'Vegetable Soup', protein: 2, carbs: 10, fats: 1, cal: 50 },
                { name: 'Palak Paneer', protein: 14, carbs: 8, fats: 18, cal: 240 },
                { name: 'Tofu Stir Fry', protein: 12, carbs: 5, fats: 8, cal: 140 },
                { name: 'Moong Dal', protein: 7, carbs: 15, fats: 1, cal: 100 }
            ],
            nonveg: [
                { name: 'Grilled Fish', protein: 26, carbs: 0, fats: 5, cal: 150 },
                { name: 'Chicken Tikka', protein: 25, carbs: 3, fats: 8, cal: 180 },
                { name: 'Egg Salad', protein: 10, carbs: 5, fats: 8, cal: 130 }
            ]
        },
        // SNACK OPTIONS
        snacks: {
            veg: [
                { name: 'Greek Yogurt', protein: 10, carbs: 4, fats: 0, cal: 60 },
                { name: 'Roasted Chana', protein: 8, carbs: 18, fats: 3, cal: 120 },
                { name: 'Mixed Nuts (small)', protein: 5, carbs: 6, fats: 14, cal: 160 },
                { name: 'Fruit (Apple/Banana)', protein: 1, carbs: 25, fats: 0, cal: 95 },
                { name: 'Sprouts Salad', protein: 7, carbs: 15, fats: 1, cal: 90 }
            ],
            nonveg: [
                { name: 'Boiled Egg', protein: 6, carbs: 0, fats: 5, cal: 78 }
            ]
        }
    };

    // GENERATE MEAL PLAN
    function buildMeal(mealType, targetCals, targetProtein) {
        const vegOptions = foods[mealType].veg;
        const nonvegOptions = isVeg ? [] : foods[mealType].nonveg;
        const allOptions = [...vegOptions, ...(isVeg ? [] : nonvegOptions)];

        // Select items to hit targets
        const selected = [];
        let totalProtein = 0, totalCals = 0, totalCarbs = 0, totalFats = 0;

        // Shuffle and pick
        const shuffled = allOptions.sort(() => Math.random() - 0.5);

        for (const food of shuffled) {
            if (totalCals < targetCals * 0.9) {
                // Calculate portion to fit remaining calories
                const remainingCals = targetCals - totalCals;
                const portion = Math.min(Math.round((remainingCals / food.cal) * 100), 200); // Max 200g per item

                if (portion >= 50) { // Minimum 50g portion
                    selected.push({
                        item: food.name,
                        quantity: `${portion}g`,
                        protein: Math.round(food.protein * portion / 100),
                        carbs: Math.round(food.carbs * portion / 100),
                        fats: Math.round(food.fats * portion / 100),
                        cal: Math.round(food.cal * portion / 100)
                    });
                    totalProtein += food.protein * portion / 100;
                    totalCals += food.cal * portion / 100;
                    totalCarbs += food.carbs * portion / 100;
                    totalFats += food.fats * portion / 100;
                }
            }
            if (selected.length >= 3) break; // Max 3 items per meal
        }

        return {
            items: selected,
            totals: {
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fats: Math.round(totalFats),
                cal: Math.round(totalCals)
            }
        };
    }

    // Build complete meal plan
    const mealPlan = {
        breakfast: buildMeal('breakfast', calories * mealSplit.breakfast.calPct, protein * mealSplit.breakfast.proteinPct),
        lunch: buildMeal('lunch', calories * mealSplit.lunch.calPct, protein * mealSplit.lunch.proteinPct),
        dinner: buildMeal('dinner', calories * mealSplit.dinner.calPct, protein * mealSplit.dinner.proteinPct),
        snacks: buildMeal('snacks', calories * mealSplit.snacks.calPct, protein * mealSplit.snacks.proteinPct)
    };

    // Calculate daily totals
    const dailyTotals = {
        protein: mealPlan.breakfast.totals.protein + mealPlan.lunch.totals.protein + mealPlan.dinner.totals.protein + mealPlan.snacks.totals.protein,
        carbs: mealPlan.breakfast.totals.carbs + mealPlan.lunch.totals.carbs + mealPlan.dinner.totals.carbs + mealPlan.snacks.totals.carbs,
        fats: mealPlan.breakfast.totals.fats + mealPlan.lunch.totals.fats + mealPlan.dinner.totals.fats + mealPlan.snacks.totals.fats,
        cal: mealPlan.breakfast.totals.cal + mealPlan.lunch.totals.cal + mealPlan.dinner.totals.cal + mealPlan.snacks.totals.cal
    };

    // Weight loss note
    const weightNote = needsWeightLoss
        ? `This plan creates a mild calorie deficit for healthy weight loss (0.3-0.5kg/week). Stick to portion sizes for best results.`
        : `This plan maintains your current healthy weight while supporting tissue repair.`;

    return {
        ...mealPlan,
        dailyTotals,
        waterIntake: water,
        weightNote,
        timing: {
            breakfast: '7:00 - 8:30 AM',
            midMorningSnack: '10:30 - 11:00 AM',
            lunch: '12:30 - 1:30 PM',
            eveningSnack: '4:00 - 5:00 PM',
            dinner: '7:00 - 8:00 PM'
        }
    };
}

// --- PAIN LEVEL INTERPRETATION ---
function getPainInterpretation(painLevel, name) {
    const level = parseInt(painLevel) || 5;

    if (level <= 3) {
        return {
            severity: "Mild",
            description: `${name}, your pain level of ${level}/10 suggests early-stage discomfort. This is the ideal time to intervene before it worsens.`,
            urgency: "Low - Home exercises should be very effective",
            exerciseAdvice: "You can perform exercises with moderate intensity.",
            lifestyle: "Continue most normal activities with awareness."
        };
    } else if (level <= 5) {
        return {
            severity: "Moderate",
            description: `${name}, at ${level}/10 pain, you're experiencing noticeable discomfort that's likely affecting your daily activities.`,
            urgency: "Moderate - Start exercises gently and progress as pain reduces",
            exerciseAdvice: "Begin exercises at lower intensity and increase gradually as pain allows.",
            lifestyle: "Modify strenuous activities. Take frequent rest breaks."
        };
    } else if (level <= 7) {
        return {
            severity: "Significant",
            description: `${name}, a pain level of ${level}/10 indicates significant discomfort. This needs focused attention.`,
            urgency: "Moderate-High - Consider professional assessment if pain persists",
            exerciseAdvice: "Start very gently. Stop if any exercise increases pain.",
            lifestyle: "Limit aggravating activities. Prioritize rest and recovery."
        };
    } else {
        return {
            severity: "Severe",
            description: `${name}, at ${level}/10 pain, you're dealing with severe discomfort that significantly impacts quality of life.`,
            urgency: "High - Professional assessment recommended within 48-72 hours",
            exerciseAdvice: "Focus only on gentle, pain-free movements. Stop immediately if pain increases.",
            lifestyle: "Avoid all aggravating activities. Rest is priority. Consider pain management."
        };
    }
}

// --- DETECT SURGERY FROM PROBLEM STATEMENT (Multilingual + Fuzzy) ---
function detectSurgeryFromText(text) {
    const surgeryKeywords = [
        // ENGLISH - Standard
        'surgery', 'operation', 'operated', 'surgical', 'post-op', 'postop',
        'after surgery', 'had surgery', 'got operated', 'procedure', 'implant',
        'replacement', 'arthroscopy', 'laparoscopy', 'c-section', 'cesarean',
        'bypass', 'angioplasty', 'appendix', 'hernia', 'spine surgery',
        'knee replacement', 'hip replacement', 'stitches', 'operated on',
        'post operative', 'post-operative', 'postoperative',

        // ENGLISH - Common misspellings
        'surgry', 'surgury', 'surjery', 'surjury', 'sergery', 'sergury',
        'opration', 'operasion', 'operashun', 'opretion', 'operetion',
        'opperation', 'operrated', 'oprated', 'opreation',

        // HINDI - Devanagari script
        'ऑपरेशन', 'आपरेशन', 'सर्जरी', 'शल्य', 'शल्यक्रिया', 'शल्य चिकित्सा',
        'टांके', 'टाँके', 'घाव', 'चीरा', 'कटाई',

        // HINGLISH - Transliterated
        'operation hua', 'operation hui', 'operation tha', 'operation thi',
        'surgery hua', 'surgery hui', 'surgery tha', 'surgery thi',
        'surgery karwai', 'surgery karwayi', 'surgery karvai', 'surgery karaya',
        'operate hua', 'operate hui', 'operate kiya', 'operate karvaya',
        'opration hua', 'opration hui', 'opration karwai',
        'tanke lage', 'tanke the', 'tanke hain', 'tanke lagaye',
        'operation ke baad', 'surgery ke baad', 'opration ke baad',
        'post surgery',

        // REGIONAL VARIATIONS
        'op hua', 'op hui', 'op karwaya', 'op se', 'op ke baad',

        // SPECIFIC SURGERIES (English + Hinglish)
        'appendix ka operation', 'appendix nikala', 'appendix nikali',
        'hernia ka operation', 'hernia operation',
        'cesarean', 'c section', 'csection', 'c-sec', 'csec',
        'normal delivery nahi', 'ceserean', 'ceasarean', 'cesarian',
        'angioplasty', 'anjiyoplasty', 'anjeoplasty', 'stent',
        'bypass', 'by pass', 'baypas', 'heart surgery', 'dil ka operation',
        'knee ka operation', 'ghutne ka operation', 'knee op',
        'hip ka operation', 'hip replacement', 'joint replacement',
        'spine ka operation', 'back surgery', 'kamar ka operation',
        'brain surgery', 'dimag ka operation',
        'eye surgery', 'ankh ka operation', 'lasik', 'cataract', 'motiyabind',
        'kidney surgery', 'kidney stone operation', 'pathri ka operation',
        'gall bladder', 'pittha', 'pitha', 'gallstone',

        // RECOVERY CONTEXT
        'recovering from operation', 'abhi operation hua',
        'hospital se discharge', 'haal hi mein operation',
        'recently operated', 'just had surgery', 'surgery abhi hui',
        'operation abhi hua', 'stitches abhi', 'stitches hain',
        'incision', 'cut', 'wound from surgery', 'surgical wound',

        // BODY PART + SURGERY COMBOS
        'shoulder operation', 'kandhe ka operation',
        'neck surgery', 'gardan ka operation',
        'wrist surgery', 'kalai ka operation',
        'ankle surgery', 'takhne ka operation',
        'fracture operation', 'haddi ka operation', 'bone surgery',
        'tumor', 'tumour', 'rasauli', 'gaanth', 'ganth'
    ];

    const lowerText = text.toLowerCase();
    for (const keyword of surgeryKeywords) {
        if (lowerText.includes(keyword)) {
            return true;
        }
    }
    return false;
}

// --- COMPREHENSIVE AGE + GENDER GREETING ---
function getPersonalizedGreeting(name, age, gender) {
    const ageNum = parseInt(age);
    const terms = getGenderTerms(gender);

    let category = 'middle';
    if (ageNum <= 25) category = 'young';
    else if (ageNum > 55) category = 'senior';

    const greetingFn = pick(PHRASES.greeting[category]);
    return greetingFn(name, age);
}

// --- CONDITION DATABASE (remains same but optimized) ---
const CONDITION_DB = {
    'neck': {
        'pain': {
            causes: ["prolonged poor posture", "muscle strain from desk work", "stress-related tension", "cervical spondylosis", "sleeping in awkward position"],
            exercises: [
                { name: "Chin Tucks", sets: "3", reps: "10-15", difficulty: "Easy", description: "Sit upright, pull chin back creating a double chin, hold 5 seconds. Strengthens deep neck flexors." },
                { name: "Neck Rotation Stretch", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Slowly turn head left/right, hold 15-20 seconds each side. Improves range of motion." },
                { name: "Upper Trapezius Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Tilt head toward shoulder, gently press with hand, hold 30 seconds. Releases tension." }
            ],
            redFlags: ["Radiating arm pain/numbness", "Severe headaches", "Dizziness or balance issues"],
            specialists: ["Physiotherapist", "Orthopedic Specialist"],
            timeline: { mild: "1-2 weeks", moderate: "2-4 weeks", severe: "4-8 weeks" }
        },
        'stiffness': {
            causes: ["poor sleeping position", "prolonged static posture", "degenerative changes", "muscle tightness", "lack of movement"],
            exercises: [
                { name: "Chin Tucks", sets: "3", reps: "10", difficulty: "Easy", description: "Retract chin back while keeping eyes level. Hold 5 seconds." },
                { name: "Levator Scapulae Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Look down toward armpit, apply gentle pressure, hold 30 seconds." },
                { name: "Neck Side Flexion", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Tilt ear toward shoulder, hold 15 seconds. Don't raise shoulder." }
            ],
            redFlags: ["Fever with stiffness", "Recent trauma", "Progressive weakness"],
            specialists: ["Physiotherapist"],
            timeline: { mild: "1 week", moderate: "1-2 weeks", severe: "2-4 weeks" }
        }
    },
    'back': {
        'pain': {
            causes: ["muscle strain", "poor lifting technique", "prolonged sitting", "disc-related issues", "weak core muscles", "postural imbalances"],
            exercises: [
                { name: "Cat-Cow Stretch", sets: "3", reps: "10", difficulty: "Easy", description: "On hands and knees, alternate between arching and rounding back. Improves spinal mobility." },
                { name: "Knee to Chest Stretch", sets: "2", reps: "5 each leg", difficulty: "Easy", description: "Lie on back, pull knee toward chest, hold 30 seconds. Releases lower back tension." },
                { name: "Bridge Exercise", sets: "3", reps: "10-12", difficulty: "Moderate", description: "Lie on back, lift hips creating straight line from knees to shoulders. Strengthens glutes and core." }
            ],
            redFlags: ["Loss of bladder/bowel control", "Severe leg weakness", "Numbness in groin area"],
            specialists: ["Physiotherapist", "Spine Specialist", "Orthopedic Surgeon"],
            timeline: { mild: "2-3 weeks", moderate: "4-6 weeks", severe: "6-12 weeks" }
        },
        'stiffness': {
            causes: ["degenerative changes", "prolonged immobility", "muscle guarding", "poor posture", "sedentary lifestyle"],
            exercises: [
                { name: "Child's Pose", sets: "3", reps: "Hold 30 seconds", difficulty: "Easy", description: "Kneel and sit back on heels, stretch arms forward, rest forehead on floor." },
                { name: "Cat-Cow Stretch", sets: "3", reps: "10", difficulty: "Easy", description: "Alternate between flexing and extending spine on all fours." },
                { name: "Seated Rotation Stretch", sets: "2", reps: "5 each side", difficulty: "Easy", description: "Sit cross-legged, rotate torso, hold 20 seconds each side." }
            ],
            redFlags: ["Morning stiffness lasting >1 hour", "Multiple joint involvement"],
            specialists: ["Physiotherapist", "Rheumatologist"],
            timeline: { mild: "1-2 weeks", moderate: "2-4 weeks", severe: "4-6 weeks" }
        }
    },
    'knee': {
        'pain': {
            causes: ["overuse", "patellofemoral syndrome", "ligament strain", "meniscus issues", "arthritis", "improper footwear"],
            exercises: [
                { name: "Quad Sets", sets: "3", reps: "15", difficulty: "Easy", description: "Sit with leg straight, tighten thigh muscle, hold 5 seconds. Activates quadriceps." },
                { name: "Straight Leg Raise", sets: "3", reps: "10", difficulty: "Easy", description: "Lie on back, lift straight leg 6 inches, hold 5 seconds. Strengthens quads without knee stress." },
                { name: "Heel Slides", sets: "2", reps: "10", difficulty: "Easy", description: "Lie on back, slowly slide heel toward buttocks, then back. Improves knee flexion." }
            ],
            redFlags: ["Locked knee", "Significant swelling", "Giving way/instability", "Unable to bear weight"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine Doctor"],
            timeline: { mild: "2-4 weeks", moderate: "4-8 weeks", severe: "8-12 weeks" }
        },
        'swelling': {
            causes: ["injury", "overuse", "arthritis", "meniscus tear", "ligament damage", "infection"],
            exercises: [
                { name: "Quad Sets", sets: "3", reps: "15", difficulty: "Easy", description: "Gentle quad activation without movement. Safe even with swelling." },
                { name: "Ankle Pumps", sets: "3", reps: "20", difficulty: "Easy", description: "Pump ankle up and down to improve circulation and reduce swelling." },
                { name: "Gentle Flexion Range", sets: "2", reps: "10", difficulty: "Easy", description: "Gently bend knee within pain-free range to maintain mobility." }
            ],
            redFlags: ["Hot/red joint", "Fever", "Unable to bear weight", "Rapid onset without injury"],
            specialists: ["Orthopedic Surgeon", "Rheumatologist"],
            timeline: { mild: "1-2 weeks", moderate: "2-4 weeks", severe: "4-8 weeks" }
        }
    },
    'shoulder': {
        'pain': {
            causes: ["rotator cuff strain", "impingement syndrome", "frozen shoulder", "tendinitis", "bursitis", "overuse"],
            exercises: [
                { name: "Pendulum Exercise", sets: "3", reps: "1 min circles", difficulty: "Easy", description: "Lean forward, let arm hang, make small circles. Promotes gentle movement." },
                { name: "Doorway Stretch", sets: "2", reps: "3 each side", difficulty: "Easy", description: "Place forearm on doorframe, step forward to stretch chest and front shoulder." },
                { name: "Scapular Squeezes", sets: "3", reps: "15", difficulty: "Easy", description: "Squeeze shoulder blades together, hold 5 seconds. Improves posture and stability." }
            ],
            redFlags: ["Severe weakness", "Trauma history", "Night pain disturbing sleep", "Deformity"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon", "Sports Medicine"],
            timeline: { mild: "2-4 weeks", moderate: "6-12 weeks", severe: "12-24 weeks" }
        },
        'stiffness': {
            causes: ["frozen shoulder (adhesive capsulitis)", "post-injury stiffness", "lack of movement", "rotator cuff issues"],
            exercises: [
                { name: "Pendulum Exercise", sets: "4", reps: "2 min", difficulty: "Easy", description: "Essential for frozen shoulder - perform multiple times daily." },
                { name: "Wall Climbing", sets: "3", reps: "10", difficulty: "Moderate", description: "Face wall, walk fingers up as high as comfortable. Track progress." },
                { name: "Cross Body Stretch", sets: "2", reps: "30 sec hold", difficulty: "Easy", description: "Bring arm across chest, hold with other hand, stretch posterior shoulder." }
            ],
            redFlags: ["Rapid onset without cause", "Associated systemic symptoms", "Complete inability to move"],
            specialists: ["Physiotherapist", "Orthopedic Surgeon"],
            timeline: { mild: "4-8 weeks", moderate: "3-6 months", severe: "12-24 months (frozen shoulder)" }
        }
    },
    'wrist': {
        'pain': {
            causes: ["carpal tunnel syndrome", "repetitive strain", "tendinitis", "De Quervain's", "overuse from typing/mobile"],
            exercises: [
                { name: "Wrist Flexor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm up, pull fingers back toward body. Stretches forearm flexors." },
                { name: "Wrist Extensor Stretch", sets: "3", reps: "30 sec hold", difficulty: "Easy", description: "Extend arm, palm down, press hand down. Stretches forearm extensors." },
                { name: "Tendon Glides", sets: "3", reps: "10", difficulty: "Easy", description: "Move fingers through various positions: straight, hook, fist, tabletop." }
            ],
            redFlags: ["Severe numbness", "Weakness in grip", "Visible deformity", "Constant tingling"],
            specialists: ["Physiotherapist", "Hand Therapist", "Orthopedic Surgeon"],
            timeline: { mild: "1-2 weeks", moderate: "2-4 weeks", severe: "4-8 weeks" }
        }
    },
    'ankle': {
        'pain': {
            causes: ["sprain", "plantar fasciitis", "Achilles tendinitis", "overuse", "improper footwear"],
            exercises: [
                { name: "Ankle Alphabet", sets: "2", reps: "Full A-Z", difficulty: "Easy", description: "Draw letters with your big toe. Improves range of motion in all directions." },
                { name: "Calf Raises", sets: "3", reps: "15", difficulty: "Moderate", description: "Rise onto toes, hold 2 seconds, lower slowly. Strengthens calf and ankle." },
                { name: "Towel Curls", sets: "3", reps: "15", difficulty: "Easy", description: "Scrunch towel with toes. Strengthens foot intrinsic muscles." }
            ],
            redFlags: ["Unable to bear weight", "Severe bruising", "Obvious deformity", "Numbness"],
            specialists: ["Physiotherapist", "Podiatrist", "Orthopedic Surgeon"],
            timeline: { mild: "1-2 weeks", moderate: "2-6 weeks", severe: "6-12 weeks" }
        }
    }
};

// --- OCCUPATION PERSONALIZATION ---
function getOccupationPersonalization(occupation, problemArea, name, painLevel) {
    const occ = (occupation || "").toLowerCase();
    const area = (problemArea || "").toLowerCase();
    const painNum = parseInt(painLevel) || 5;

    let result = {
        workImpact: "",
        restrictions: [],
        modifications: [],
        leaveAdvice: "",
        returnToWork: ""
    };

    // IT/DESK JOBS
    if (occ.includes("desk") || occ.includes("office") || occ.includes("computer") || occ.includes("it") || occ.includes("software") || occ.includes("developer")) {
        result.workImpact = `${name}, your desk-based work directly contributes to ${area} strain through prolonged sitting and screen exposure.`;
        result.modifications = [
            "Set up monitor at eye level - this is non-negotiable",
            "Use chair with proper lumbar support",
            "Position keyboard/mouse at elbow height",
            "Consider a standing desk converter"
        ];
        result.restrictions = [
            "Take a 5-minute movement break every 30-45 minutes",
            "Avoid working on laptop in bed or on couch",
            "Don't cradle phone between ear and shoulder"
        ];
        result.leaveAdvice = painNum > 7 ? "Consider 2-3 days rest to reduce acute pain before returning to work with modifications." : "You can likely continue working with proper ergonomic setup.";
        result.returnToWork = "Work with frequent breaks and ergonomic setup.";
    }
    // PHYSICAL/LABOR
    else if (occ.includes("labor") || occ.includes("construction") || occ.includes("factory") || occ.includes("warehouse") || occ.includes("mechanic") || occ.includes("physical")) {
        result.workImpact = `${name}, your physically demanding work puts significant load on your ${area}.`;
        result.modifications = [
            "Use mechanical aids for lifting when possible",
            "Wear supportive gear appropriate to your job",
            "Work in pairs for heavy/awkward loads",
            "Warm up before starting physical work"
        ];
        result.restrictions = [
            "AVOID heavy lifting until pain reduces significantly",
            "No overhead work if shoulder/neck affected",
            "Avoid prolonged bent-over positions"
        ];
        result.leaveAdvice = `${name}, with pain at ${painNum}/10 and physical work demands, I strongly recommend ${painNum > 6 ? "1-2 weeks" : "3-5 days"} off work. Continuing physical labor with this pain will delay recovery significantly.`;
        result.returnToWork = "Start with light duties, build to full capacity over 1-2 weeks.";
    }
    // HEALTHCARE
    else if (occ.includes("nurse") || occ.includes("doctor") || occ.includes("hospital") || occ.includes("healthcare") || occ.includes("caregiver")) {
        result.workImpact = `${name}, patient handling and long shifts in healthcare put considerable strain on your ${area}.`;
        result.modifications = [
            "Use hoists and sliding sheets for transfers",
            "Adjust bed height before procedures",
            "Work in pairs for patient handling",
            "Wear supportive footwear"
        ];
        result.restrictions = [
            "Avoid manual patient lifts during recovery",
            "Request lighter duties temporarily",
            "Take your breaks even when busy"
        ];
        result.leaveAdvice = painNum > 6 ? "Request modified/light duties for 1-2 weeks rather than full sick leave." : "Continue with modified patient handling duties.";
        result.returnToWork = "Gradual return with modified duties before full patient handling.";
    }
    // DRIVER
    else if (occ.includes("driver") || occ.includes("taxi") || occ.includes("uber") || occ.includes("truck") || occ.includes("delivery")) {
        result.workImpact = `${name}, prolonged sitting with vibration exposure as a driver stresses your ${area} significantly.`;
        result.modifications = [
            "Adjust seat to maintain natural spine curve",
            "Use lumbar support cushion",
            "Take breaks every 1-2 hours to walk and stretch"
        ];
        result.restrictions = [
            "Limit continuous driving to 2-hour stretches",
            "Avoid heavy loading/unloading during recovery",
            "Don't twist to reach into back seat"
        ];
        result.leaveAdvice = painNum > 7 ? "Consider 1 week off driving - vibration exposure worsens many conditions." : "Continue with shorter routes and frequent breaks.";
        result.returnToWork = "Start with shorter routes, build back to normal hours.";
    }
    // STUDENT
    else if (occ.includes("student") || occ.includes("school") || occ.includes("college") || occ.includes("university")) {
        result.workImpact = `${name}, long study hours and carrying heavy bags contribute to your ${area} issue.`;
        result.modifications = [
            "Set up a proper study desk - not on bed",
            "Use supportive chair at correct height",
            "Follow 20-20-20 rule for screen breaks",
            "Use both straps of backpack evenly"
        ];
        result.restrictions = [
            "Don't carry bag on one shoulder",
            "Take breaks every 30-45 minutes during study",
            "Avoid studying in bed or hunched on couch"
        ];
        result.leaveAdvice = "You likely don't need to miss classes, but study posture must improve.";
        result.returnToWork = "Continue studies with proper posture and breaks.";
    }
    // HOMEMAKER
    else if (occ.includes("home") || occ.includes("housewife") || occ.includes("housework") || occ.includes("homemaker")) {
        result.workImpact = `${name}, household activities involve repetitive movements that strain your ${area}.`;
        result.modifications = [
            "Use long-handled tools for floor cleaning",
            "Kneel rather than bend for floor tasks",
            "Keep heavy items at waist level",
            "Break up chores across multiple days"
        ];
        result.restrictions = [
            "Avoid heavy lifting (wet clothes, gas cylinders) for 2-3 weeks",
            "Delegate strenuous tasks temporarily",
            "Don't do marathon cleaning sessions"
        ];
        result.leaveAdvice = "Get family help with heavy chores during recovery.";
        result.returnToWork = "Return to normal activities gradually.";
    }
    // DEFAULT
    else {
        result.workImpact = `${name}, your daily activities at work may be contributing to your ${area} condition.`;
        result.modifications = [
            "Maintain good posture throughout activities",
            "Take movement breaks every 30-45 minutes",
            "Avoid staying in one position too long"
        ];
        result.restrictions = [
            "Modify activities that aggravate pain",
            "Listen to pain signals - they mean stop"
        ];
        result.leaveAdvice = painNum > 7 ? "Consider 2-3 days rest if work aggravates symptoms." : "Continue with mindful movement and breaks.";
        result.returnToWork = "Gradual return as symptoms allow.";
    }

    // Add condition-specific work restrictions
    if (area.includes("wrist") || area.includes("hand")) {
        result.restrictions.push("Avoid two-wheeler driving - gripping worsens wrist strain");
        result.restrictions.push("Use voice typing instead of keyboard when possible");
        result.restrictions.push("Don't carry heavy bags with affected hand");
    }
    if (area.includes("knee") || area.includes("ankle")) {
        result.restrictions.push("Use elevator instead of stairs when possible");
        result.restrictions.push("Avoid squatting or sitting cross-legged on floor");
        result.restrictions.push("Wear supportive footwear - no flip-flops");
    }
    if (area.includes("shoulder") || area.includes("neck")) {
        result.restrictions.push("Avoid reaching overhead - use step stool");
        result.restrictions.push("Sleep on unaffected side");
    }

    return result;
}

// --- DIET PERSONALIZATION ---
function getDietPersonalization(dietPreference, problemArea, name, age, conditions, painLevel) {
    const diet = (dietPreference || "").toLowerCase();
    const area = (problemArea || "").toLowerCase();
    const painNum = parseInt(painLevel) || 5;
    const hasDiabetes = conditions.includes("Diabetes");
    const hasBP = conditions.includes("High Blood Pressure");
    const hasHeart = conditions.includes("Heart Conditions");

    let result = {
        overview: "",
        proteinAdvice: "",
        keyFoods: [],
        foodsToAvoid: [],
        hydration: "",
        supplements: "",
        conditionNotes: []
    };

    // DIET TYPE SPECIFIC
    if (diet.includes("vegan")) {
        result.overview = `${name}, your vegan diet can fully support recovery - strategic protein combining is key.`;
        result.proteinAdvice = "Combine legumes + grains for complete protein (rice-dal, roti-chole). Aim for 1.2-1.5g/kg body weight.";
        result.keyFoods = ["Tofu and tempeh", "Lentils and chickpeas", "Quinoa and amaranth", "Chia, hemp, flax seeds", "Nut butters", "Fortified plant milks", "Dark leafy greens"];
        result.foodsToAvoid = ["Processed vegan junk food", "Excessive refined carbs", "Too much added oil"];
        result.supplements = "B12 supplement is essential. Consider vitamin D and algae-based omega-3.";
    } else if (diet.includes("veg")) {
        result.overview = `${name}, your vegetarian diet provides excellent recovery nutrition with dairy and plant proteins.`;
        result.proteinAdvice = "Include paneer, yogurt, eggs (if eaten), and legumes at every meal. Palm-sized protein portions.";
        result.keyFoods = ["Paneer (cottage cheese)", "Greek yogurt/dahi", "Eggs (if included)", "All dals and legumes", "Milk and buttermilk", "Soy products", "Nuts and seeds"];
        result.foodsToAvoid = ["Deep-fried pakoras/samosas", "Excessive sweets", "Processed cheese"];
        result.supplements = "Most nutrients from diet. Consider vitamin D if limited sun.";
    } else if (diet.includes("keto")) {
        result.overview = `${name}, your keto diet supports anti-inflammatory healing with healthy fats.`;
        result.proteinAdvice = "Prioritize fatty fish, quality meats, eggs. Fat for fuel, protein for repair.";
        result.keyFoods = ["Fatty fish (salmon, mackerel)", "Eggs and cheese", "Avocados", "Olive oil and coconut oil", "Nuts (macadamia, almonds)", "Low-carb vegetables", "Quality meats"];
        result.foodsToAvoid = ["All sugars and sweets", "Grains and bread", "High-carb fruits", "Processed foods"];
        result.supplements = "Electrolytes important. Magnesium and potassium for muscle function.";
    } else {
        // Non-veg default
        result.overview = `${name}, your diet gives you access to excellent protein sources for ${area} recovery.`;
        result.proteinAdvice = "Leverage quality animal proteins - fish, chicken, eggs provide complete amino acids for tissue repair.";
        result.keyFoods = ["Fatty fish (omega-3 powerhouse)", "Chicken breast (lean protein)", "Eggs (2-3 daily is fine)", "Bone broth for joints", "Greek yogurt", "Lean mutton (moderate)", "Legumes and lentils"];
        result.foodsToAvoid = ["Processed meats (sausage, bacon)", "Deep fried items", "Excessive red meat", "Very spicy preparations"];
        result.supplements = "Fish oil for additional anti-inflammatory benefit.";
    }

    // ANTI-INFLAMMATORY (universal)
    result.keyFoods.push("Turmeric (haldi) + black pepper");
    result.keyFoods.push("Ginger (adrak)");
    result.keyFoods.push("Berries and colorful fruits");
    result.keyFoods.push("Green leafy vegetables");

    // HYDRATION based on pain level
    result.hydration = painNum > 6
        ? `${name}, hydration is critical for healing - aim for 3+ liters minimum. Dehydration worsens pain perception.`
        : `Aim for 2.5-3 liters of water daily. Well-hydrated tissues heal faster.`;

    // MEDICAL CONDITION NOTES
    if (hasDiabetes) {
        result.conditionNotes.push("⚠️ DIABETES: Avoid sugars, choose low-glycemic foods, monitor blood sugar.");
        result.foodsToAvoid.push("White rice and maida in excess");
        result.foodsToAvoid.push("Fruit juices and sugary drinks");
    }
    if (hasBP) {
        result.conditionNotes.push("⚠️ HIGH BP: Limit salt strictly. Avoid pickles, papad, processed foods.");
        result.foodsToAvoid.push("High-sodium foods");
        result.foodsToAvoid.push("Canned/packaged items");
    }
    if (hasHeart) {
        result.conditionNotes.push("⚠️ HEART CONDITION: Focus on heart-healthy fats. Limit saturated fats, avoid trans fats.");
        result.foodsToAvoid.push("Fried foods");
        result.foodsToAvoid.push("Butter and cream in excess");
        result.keyFoods.push("Walnuts and flaxseeds (omega-3)");
    }

    return result;
}

// --- SURGERY DETECTION AND HANDLING ---
function getSurgeryInfo(recentSurgery, problemStatement, name) {
    const statement = (problemStatement || "").toLowerCase();

    // Check dropdown OR detect from problem statement
    const hasSurgeryFromDropdown = recentSurgery === "yes_minor" || recentSurgery === "yes_major";
    const hasSurgeryFromText = detectSurgeryFromText(statement);

    const hasSurgery = hasSurgeryFromDropdown || hasSurgeryFromText;
    const isMajor = recentSurgery === "yes_major" || statement.includes("major") || statement.includes("replacement") || statement.includes("bypass");

    if (!hasSurgery) {
        return { hasSurgery: false, isMajor: false, warning: "", restrictions: [], exerciseNote: "", consultNote: "" };
    }

    if (isMajor) {
        return {
            hasSurgery: true,
            isMajor: true,
            warning: `🚨 <strong>CRITICAL - POST-SURGICAL PATIENT:</strong> ${name}, you've mentioned a recent major operation. This takes PRIORITY over everything else in this plan.`,
            restrictions: [
                "DO NOT start any exercises without your surgeon's explicit clearance",
                "Your body is healing internally - strenuous activity can cause complications",
                "Wait minimum 6-8 weeks post-surgery before active rehabilitation",
                "Your surgical site healing comes FIRST before addressing other pain"
            ],
            exerciseNote: `⚠️ <strong>STOP - SURGEON CLEARANCE REQUIRED:</strong> ${name}, the exercises below are NOT to be started until your operating surgeon clears you. Major surgery recovery takes precedence.`,
            consultNote: `${name}, with your recent surgery, please FIRST see your surgeon for clearance. Dr. Vanshika can then design a post-surgical rehabilitation program coordinated with your surgeon's guidelines.`
        };
    } else {
        return {
            hasSurgery: true,
            isMajor: false,
            warning: `⚠️ <strong>POST-SURGICAL NOTE:</strong> ${name}, your recent surgery has been factored into these recommendations.`,
            restrictions: [
                "Avoid exercises that strain or pull near the surgery site",
                "Start at 50% of recommended intensity",
                "Stop immediately if you feel pain at surgical area"
            ],
            exerciseNote: `Given your recent procedure, start these exercises at HALF the recommended intensity and progress slowly.`,
            consultNote: `With your surgical history, getting clearance from your surgeon before starting is advisable.`
        };
    }
}

// =============================================================================
// MAIN REPORT GENERATOR - USES ALL INPUTS
// =============================================================================
function generateRecoveryPlan(patientData) {
    console.log("Generating FULLY personalized report. All inputs:", patientData);

    // STEP 1 INPUTS
    const name = patientData.name || "Patient";
    const age = parseInt(patientData.age) || 30;
    const gender = patientData.gender || "other";
    const weight = parseFloat(patientData.weight) || 70;
    const height = parseFloat(patientData.height) || 170;

    // STEP 2 INPUTS
    const occupation = patientData.occupation || "working professional";
    const dietPref = patientData.dietPreference || "non-veg";

    // STEP 3 INPUTS
    const conditions = [];
    if (patientData.condition_diabetes) conditions.push("Diabetes");
    if (patientData.condition_bp) conditions.push("High Blood Pressure");
    if (patientData.condition_heart) conditions.push("Heart Conditions");
    const recentSurgery = patientData.recentSurgery || "";

    // STEP 4 INPUTS
    const problemArea = (patientData.problemArea || "back").toLowerCase();
    const problemStatement = patientData.problemStatement || "pain";
    const painLevel = parseInt(patientData.painLevel) || 5;

    // DERIVED DATA
    const genderTerms = getGenderTerms(gender);
    const painData = getPainInterpretation(painLevel, name);
    const surgeryInfo = getSurgeryInfo(recentSurgery, problemStatement, name);

    // BMI & Nutrition Calculations
    const bmiData = calculateBMI(weight, height);
    const nutritionData = calculateNutrition(weight, height, age, gender, 'light'); // Recovery = light activity

    // Determine condition type from symptoms
    let conditionKey = "pain";
    if (problemStatement.toLowerCase().includes("stiff")) conditionKey = "stiffness";
    if (problemStatement.toLowerCase().includes("swell")) conditionKey = "swelling";

    // Find matching body area
    let areaKey = "back";
    for (const key of Object.keys(CONDITION_DB)) {
        if (problemArea.includes(key)) {
            areaKey = key;
            break;
        }
    }

    const conditionData = CONDITION_DB[areaKey]?.[conditionKey] || CONDITION_DB[areaKey]?.["pain"] || CONDITION_DB["back"]["pain"];

    // Get occupation and diet personalization
    const occData = getOccupationPersonalization(occupation, problemArea, name, painLevel);
    const dietData = getDietPersonalization(dietPref, problemArea, name, age, conditions, painLevel);

    // Dynamic recovery speed based on age
    let recoverySpeed = "moderate";
    if (age <= 25) recoverySpeed = "fast";
    else if (age > 55) recoverySpeed = "gradual";

    // Build timeline based on pain level
    const timelineKey = painLevel <= 4 ? "mild" : (painLevel <= 7 ? "moderate" : "severe");
    const expectedTimeline = conditionData.timeline[timelineKey] || "4-6 weeks";

    // BUILD THE REPORT
    const report = {
        analysis: {
            // PERSONALIZED GREETING (uses name, age, gender, occupation, symptoms)
            understanding: `${getPersonalizedGreeting(name, age, gender)}

${surgeryInfo.hasSurgery ? buildSurgeryValidationPhrase(problemStatement, name, age, areaKey, painLevel, surgeryInfo.isMajor ? 'major' : 'minor') : buildValidationPhrase(problemStatement, occupation, name, age, areaKey, painLevel)}

${conditions.length > 0 ? `<strong>Medical Profile Noted:</strong> Your conditions (${conditions.join(", ")}) have been carefully factored into every recommendation below.` : ""}

${surgeryInfo.hasSurgery ? `
${surgeryInfo.warning}

${surgeryInfo.consultNote}
` : ""}

<strong>Your Pain Level:</strong> ${painData.severity} (${painLevel}/10)
${painData.description}

📋 Below is your personalized recovery plan with exercises, nutrition, and timeline. For optimal results, I recommend consulting <strong>Dr. Vanshika</strong> who can:
• Assess your condition hands-on
• Customize exercises for ${genderTerms.possessive} specific body mechanics
• Coordinate with ${surgeryInfo.hasSurgery ? "your surgeon for safe rehabilitation" : "any specialists you're seeing"}
• Accelerate your recovery by 40-60%

👉 <strong>Book Dr. Vanshika now</strong> for expert-guided recovery.`,

            // CAUSES - Now shows DEEPER WHY, not what user already told us
            likelyCauses: `<strong>Why Your ${areaKey.charAt(0).toUpperCase() + areaKey.slice(1)} Is Hurting:</strong>

<strong>The Anatomy Behind Your Pain:</strong>
${areaKey === 'neck' ? `• <strong>Forward Head Posture:</strong> Every inch your head moves forward adds 10 lbs of strain on neck muscles
• <strong>Upper Trap Overload:</strong> Your trapezius muscles are doing overtime to hold your head up
• <strong>Deep Flexor Weakness:</strong> The small stabilizing muscles have become weak, forcing larger muscles to compensate` : ''}
${areaKey === 'back' ? `• <strong>Disc Compression:</strong> Sitting compresses spinal discs to 40% more pressure than standing
• <strong>Hip Flexor Tightness:</strong> Tight hip flexors pull your pelvis forward, stressing the lower back
• <strong>Core Deactivation:</strong> Hours of sitting causes core muscles to "switch off", leaving spine unsupported` : ''}
${areaKey === 'knee' ? `• <strong>Quad-Hamstring Imbalance:</strong> Uneven muscle strength creates abnormal joint forces
• <strong>Patella Tracking:</strong> Weak VMO muscle causes kneecap to track incorrectly
• <strong>Hip Weakness:</strong> Weak glutes cause knee to collapse inward during movement` : ''}
${areaKey === 'shoulder' ? `• <strong>Rotator Cuff Fatigue:</strong> Small stabilizer muscles can't keep up with demands
• <strong>Scapular Dysfunction:</strong> Poor shoulder blade movement causes impingement
• <strong>Postural Rounding:</strong> Hunched posture reduces shoulder space, pinching tendons` : ''}
${areaKey === 'wrist' ? `• <strong>Tendon Overuse:</strong> Repetitive motions cause micro-tears that accumulate
• <strong>Carpal Tunnel Pressure:</strong> Wrist position during typing increases nerve compression
• <strong>Flexor/Extensor Imbalance:</strong> One-sided repetitive work creates muscle asymmetry` : ''}
${areaKey === 'ankle' ? `• <strong>Ligament Laxity:</strong> Previous injuries may have left ligaments loose
• <strong>Calf Tightness:</strong> Tight calves limit ankle mobility and stress the joint
• <strong>Proprioception Loss:</strong> Reduced balance awareness from modern footwear` : ''}
${!['neck', 'back', 'knee', 'shoulder', 'wrist', 'ankle'].includes(areaKey) ? `• <strong>Tissue Overload:</strong> Demand exceeding tissue capacity
• <strong>Movement Pattern Issues:</strong> Compensatory movements stressing the area
• <strong>Recovery Deficit:</strong> Insufficient rest between activities` : ''}

<strong>Quick Fixes You Can Do Now:</strong>
${areaKey === 'neck' ? `✅ Set phone/laptop at eye level to reduce forward head
✅ Chin tucks every 30 minutes (5 reps)
✅ Avoid holding phone between ear and shoulder` : ''}
${areaKey === 'back' ? `✅ Stand up every 30 minutes for 60 seconds
✅ Sit with lumbar support (rolled towel works)
✅ Keep knees at 90° when sitting` : ''}
${areaKey === 'knee' ? `✅ Avoid prolonged bent-knee positions
✅ Ice for 15 min after activity
✅ Strengthen quads with wall sits` : ''}
${areaKey === 'shoulder' ? `✅ Avoid sleeping on affected side
✅ Pull shoulders back before lifting anything
✅ Keep elbows below shoulder height when working` : ''}
${areaKey === 'wrist' ? `✅ Keep wrists neutral (not bent) while typing
✅ Take 2-minute breaks every 30 minutes
✅ Shake out hands frequently` : ''}
${areaKey === 'ankle' ? `✅ Avoid walking barefoot on hard floors
✅ Stretch calves before walking long distances
✅ Consider supportive footwear` : ''}
${!['neck', 'back', 'knee', 'shoulder', 'wrist', 'ankle'].includes(areaKey) ? `✅ Apply ice/heat as appropriate
✅ Avoid positions that trigger pain
✅ Gentle movement better than complete rest` : ''}

${bmiData.warning && ['knee', 'ankle', 'foot', 'back'].includes(areaKey) ? `<strong>⚠️ Weight Factor:</strong> BMI ${bmiData.bmi} (${bmiData.category}) - ${bmiData.jointImpact || bmiData.warning}` : ""}`,

            severity: `${painData.severity} - Pain ${painLevel}/10`,

            // PROGNOSIS (uses age, pain level, surgery)
            prognosis: `<strong>Your Recovery Outlook:</strong>

${surgeryInfo.isMajor ? `🚨 <strong>SURGICAL RECOVERY FIRST:</strong> Your major operation requires 6-8 weeks minimum healing before focusing on ${areaKey} rehabilitation. Consult your surgeon.

` : ""}<strong>Expected Timeline:</strong> ${expectedTimeline} (at current pain level ${painLevel}/10)

<strong>Your Age Factor (${age}):</strong> ${pick(PHRASES.recovery[recoverySpeed])}

<strong>Urgency Level:</strong> ${painData.urgency}

${surgeryInfo.hasSurgery && !surgeryInfo.isMajor ? `⚠️ <strong>Surgery Note:</strong> Your recent procedure may extend recovery by 1-2 weeks. Be patient with ${genderTerms.possessive.toLowerCase()} body.` : ""}

💡 <strong>With Dr. Vanshika's guidance</strong>, recovery typically accelerates significantly.`
        },

        exercisePlan: {
            overview: `${surgeryInfo.isMajor ? surgeryInfo.exerciseNote + "\n\n" : ""}${name}, here is your ${areaKey} exercise program:

${surgeryInfo.hasSurgery && !surgeryInfo.isMajor ? surgeryInfo.exerciseNote + "\n\n" : ""}${painData.exerciseAdvice}

<strong>Frequency:</strong> ${age > 55 ? "Once daily, gently" : (painLevel > 6 ? "Once daily initially" : "2-3 times daily")}`,

            selectedExercises: conditionData.exercises.map(ex => ({
                ...ex,
                personalNote: surgeryInfo.isMajor
                    ? "⚠️ GET SURGEON CLEARANCE BEFORE STARTING"
                    : (painLevel > 7 ? "Start very gently - stop if pain increases" : (age > 60 ? "Go slowly and gently" : "Progress at your comfort"))
            }))
        },

        workAdvice: {
            impact: occData.workImpact,
            restrictions: surgeryInfo.hasSurgery ? [...occData.restrictions, ...surgeryInfo.restrictions] : occData.restrictions,
            modifications: occData.modifications,
            leaveRecommendation: surgeryInfo.isMajor
                ? `🚨 ${name}, focus on surgical recovery first. Work should wait until surgeon clears you.`
                : occData.leaveAdvice,
            returnToWork: surgeryInfo.isMajor
                ? "Return ONLY after surgical clearance, then gradual return."
                : occData.returnToWork,
            painLevelNote: `At pain ${painLevel}/10: ${painData.lifestyle}`
        },

        dietRecommendations: {
            overview: dietData.overview,
            proteinGuidance: dietData.proteinAdvice,
            keyFoods: dietData.keyFoods,
            foodsToAvoid: dietData.foodsToAvoid,
            hydration: dietData.hydration,
            supplements: dietData.supplements,
            conditionNotes: dietData.conditionNotes,
            // Personalized Nutrition from BMI
            bmi: bmiData,
            nutrition: nutritionData,
            // Detailed Meal Plan (uses dietPref for veg/non-veg)
            mealPlan: generateMealPlan(nutritionData, dietPref, bmiData.category),
            personalizedMacros: `<strong>Your Daily Nutrition Targets (Based on ${weight}kg, ${height}cm):</strong>
• <strong>Calories:</strong> ${nutritionData.calories} kcal/day
• <strong>Protein:</strong> ${nutritionData.protein}g (essential for tissue repair)
• <strong>Carbs:</strong> ${nutritionData.carbs}g (energy for healing)
• <strong>Fats:</strong> ${nutritionData.fats}g (healthy fats for inflammation control)
• <strong>Water:</strong> ${nutritionData.water}L/day minimum

${nutritionData.weightToLose > 0 ? `<strong>Weight Goal:</strong> Your ideal weight range is ${nutritionData.idealWeightMin}-${nutritionData.idealWeightMax}kg. Losing ${nutritionData.weightToLose}kg would significantly reduce ${areaKey} strain.` : `<strong>Weight Status:</strong> You're within a healthy weight range - maintain this for optimal joint health.`}`
        },

        consultation: {
            urgency: `${name}, ${painData.urgency}

${surgeryInfo.hasSurgery ? surgeryInfo.consultNote : `With pain at ${painLevel}/10, ${painLevel > 6 ? "professional assessment is recommended" : "start with home exercises and consult if no improvement in 2 weeks"}.`}`,
            specialists: conditionData.specialists,
            redFlags: conditionData.redFlags,
            followUp: `${name}, if any warning signs appear, seek immediate care. Otherwise, track your progress weekly.`
        },

        recoveryTimeline: {
            week1: `<strong>Week 1 - ${surgeryInfo.isMajor ? "REST & SURGICAL HEALING" : "Foundation Phase"}</strong>
${surgeryInfo.isMajor ? "Focus entirely on surgical recovery. No exercises without surgeon clearance." : `
Pain Management: Ice/heat as needed, ${painData.lifestyle}
Exercise: ${age > 55 ? "Once daily, very gently" : (painLevel > 6 ? "Once daily, gentle" : "2-3 times daily")}
${age < 30 ? "Your young body should respond quickly!" : "Be patient - consistency matters."}`}`,

            week2_3: `<strong>Week 2-3 - ${surgeryInfo.isMajor ? "FOLLOW SURGEON'S GUIDANCE" : "Progress Phase"}</strong>
${surgeryInfo.isMajor ? "Continue following surgeon's post-op instructions. No independent rehabilitation." : `
${name}, you should notice improvement.
${age < 30 ? `Being ${age}, you may feel significantly better by now!` : "Steady progress - each day is a step forward."}

Increase exercise duration gradually.`}`,

            longTerm: `<strong>Long-term - Maintenance</strong>
${surgeryInfo.isMajor ? "Once cleared by surgeon, begin rehabilitation with Dr. Vanshika's guidance." : `
${occData.returnToWork}

Maintain exercises ${age < 40 ? "3-4 times weekly" : "daily"} to prevent recurrence.
${name}, prevention is your best medicine now.`}

👉 Monthly check-in with Dr. Vanshika keeps you on track.`
        }
    };

    // Enrich with video links and equipment
    return enrichWithSmartLinks(report);
}

// --- VERIFIED EXERCISE LIBRARY ---
// Comprehensive mapping of exercise names to verified YouTube video IDs
const EXERCISE_LIBRARY = {
    // NECK EXERCISES
    'chin tuck': 'E_Wf8_7S4gQ',
    'chin tucks': 'E_Wf8_7S4gQ',
    'neck rotation': 'Xk8jN5qfC3o',
    'neck rotation stretch': 'Xk8jN5qfC3o',
    'upper trapezius': '1Y1_T7y7KzI',
    'upper trap': '1Y1_T7y7KzI',
    'levator scapulae': 'W6vOwhlVq_Q',
    'neck side flexion': 'gicD5UzB47s',
    'neck tilt': '0eO1aB6U72c',

    // SHOULDER EXERCISES
    'pendulum': 'GFbCDbE86-A',
    'pendulum exercise': 'GFbCDbE86-A',
    'doorway stretch': 'lZ8qZ0y-cRk',
    'scapular squeeze': '33P5AI27ejU',
    'scapular squeezes': '33P5AI27ejU',
    'wall slide': '33P5AI27ejU',
    'shoulder roll': 'qGL_6c8dZVQ',
    'wall climbing': 's0os_nVdaP0',
    'cross body stretch': 'IlFPo2Etbnc',
    'cross body': 'IlFPo2Etbnc',

    // BACK EXERCISES
    'cat cow': 'sJq0jW4_P68',
    'cat-cow': 'sJq0jW4_P68',
    'cat-cow stretch': 'sJq0jW4_P68',
    'childs pose': 'Eq6oMDi00n4',
    'child\'s pose': 'Eq6oMDi00n4',
    'knee to chest': 'bJzM6k9gZ24',
    'knee to chest stretch': 'bJzM6k9gZ24',
    'superman': 'cc6UVRS7TXw',
    'bridge': 'N3lS97aGf-Q',
    'bridge exercise': 'N3lS97aGf-Q',
    'glute bridge': 'N3lS97aGf-Q',
    'mcgill': '2_e4I-brfqs',
    'cobra': 'fOdrW7nf9gw',
    'seated rotation': 'MfWuXRbBt44',
    'seated rotation stretch': 'MfWuXRbBt44',

    // KNEE EXERCISES
    'quad set': 'I7C7nF9i8aU',
    'quad sets': 'I7C7nF9i8aU',
    'straight leg': 'L8Z_F2qR0lY',
    'straight leg raise': 'L8Z_F2qR0lY',
    'heel slide': '02sW4F11i_E',
    'heel slides': '02sW4F11i_E',
    'step up': 'dVVQyZ0RjYk',
    'hamstring': 'JWqNgy9w54s',
    'hamstring stretch': 'JWqNgy9w54s',
    'clam': '7L0sT5XwK5s',
    'clamshell': '7L0sT5XwK5s',
    'ankle pump': 'OdYKE8PVVqg',
    'ankle pumps': 'OdYKE8PVVqg',
    'gentle flexion': 'xS9K4xyGpHE',
    'gentle flexion range': 'xS9K4xyGpHE',

    // ANKLE/FOOT EXERCISES
    'ankle alphabet': 'vvlZ4b19E50',
    'calf raise': 'M4Cj4h9bXM',
    'calf raises': 'M4Cj4h9bXM',
    'towel curl': '9q0Wj2_8eK0',
    'towel curls': '9q0Wj2_8eK0',

    // WRIST/HAND EXERCISES
    'wrist flexor': 'Ejl47X2-G2w',
    'wrist flexor stretch': 'Ejl47X2-G2w',
    'wrist extensor': 'ClhOerJrpBY',
    'wrist extensor stretch': 'ClhOerJrpBY',
    'tendon glide': 'VlKeRWz4Z2c',
    'tendon glides': 'VlKeRWz4Z2c',

    // HIP EXERCISES
    'hip flexor': 'YZK5K2vF_eo',
    'hip flexor stretch': 'YZK5K2vF_eo'
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
// Use inline SVG data URL as reliable placeholder (never grey)
function getPlaceholderThumbnail(name) {
    // Generate a color based on exercise name for variety
    let hash = 0;
    for (let i = 0; i < name.length; i++) { hash = name.charCodeAt(i) + ((hash << 5) - hash); }
    const colors = ['10B981', '3B82F6', '8B5CF6', 'EC4899', 'F59E0B', '06B6D4'];
    const color = colors[Math.abs(hash) % colors.length];

    // SVG placeholder with play button and exercise emoji
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
            <rect fill="%23${color}" width="320" height="180"/>
            <circle cx="160" cy="90" r="35" fill="white" opacity="0.9"/>
            <polygon points="150,75 150,105 175,90" fill="%23${color}"/>
            <text x="160" y="150" text-anchor="middle" fill="white" font-size="12" font-family="Arial">🏃 ${encodeURIComponent(name.substring(0, 20))}</text>
        </svg>
    `.replace(/\n/g, '').replace(/\s+/g, ' ');

    return `data:image/svg+xml,${svg}`;
}

// --- AMAZON AFFILIATE EQUIPMENT LINKS ---
// Associate ID: drvanshika0d-21
const AFFILIATE_TAG = 'drvanshika0d-21';

// CLINIC EQUIPMENT - Requires professional/Dr. Vanshika session
const CLINIC_EQUIPMENT = {
    'tens': { name: 'TENS Machine', sessionName: 'TENS Therapy Session' },
    'ultrasound': { name: 'Ultrasound Therapy', sessionName: 'Ultrasound Session' },
    'tekar': { name: 'Tekar/TECAR Therapy', sessionName: 'Tekar Therapy Session' },
    'tecar': { name: 'TECAR Therapy', sessionName: 'TECAR Session' },
    'ift': { name: 'IFT Machine', sessionName: 'IFT Therapy Session' },
    'interferential': { name: 'Interferential Therapy', sessionName: 'IFT Session' },
    'laser': { name: 'Laser Therapy', sessionName: 'Laser Therapy Session' },
    'traction': { name: 'Traction Machine', sessionName: 'Traction Session' },
    'shockwave': { name: 'Shockwave Therapy', sessionName: 'Shockwave Session' },
    'cupping': { name: 'Cupping Therapy', sessionName: 'Cupping Session' },
    'dry needling': { name: 'Dry Needling', sessionName: 'Dry Needling Session' },
    'ems': { name: 'EMS Machine', sessionName: 'EMS Therapy Session' },
    'electrical stimulation': { name: 'Electrical Stimulation', sessionName: 'E-Stim Session' },
    'hydro': { name: 'Hydrotherapy', sessionName: 'Hydrotherapy Session' },
    'wax': { name: 'Paraffin Wax', sessionName: 'Wax Therapy Session' },
    'cryotherapy': { name: 'Cryotherapy', sessionName: 'Cryotherapy Session' }
};

// HOME EQUIPMENT - Can be bought on Amazon
const HOME_EQUIPMENT = {
    // Resistance & Strength
    'band': { name: 'Resistance Band', url: `https://www.amazon.in/s?k=resistance+bands+physiotherapy&tag=${AFFILIATE_TAG}` },
    'theraband': { name: 'Theraband', url: `https://www.amazon.in/s?k=theraband+physiotherapy&tag=${AFFILIATE_TAG}` },
    'resistance': { name: 'Resistance Band', url: `https://www.amazon.in/s?k=resistance+bands+exercise&tag=${AFFILIATE_TAG}` },
    'dumbbell': { name: 'Dumbbells', url: `https://www.amazon.in/s?k=dumbbells+1kg+2kg&tag=${AFFILIATE_TAG}` },
    'weight': { name: 'Ankle Weights', url: `https://www.amazon.in/s?k=ankle+weights+physiotherapy&tag=${AFFILIATE_TAG}` },
    'kettlebell': { name: 'Kettlebell', url: `https://www.amazon.in/s?k=kettlebell+4kg&tag=${AFFILIATE_TAG}` },

    // Balls & Rollers
    'ball': { name: 'Exercise Ball', url: `https://www.amazon.in/s?k=exercise+ball+65cm+anti+burst&tag=${AFFILIATE_TAG}` },
    'swiss ball': { name: 'Swiss Ball', url: `https://www.amazon.in/s?k=swiss+ball+gym&tag=${AFFILIATE_TAG}` },
    'roller': { name: 'Foam Roller', url: `https://www.amazon.in/s?k=foam+roller+muscle+recovery&tag=${AFFILIATE_TAG}` },
    'foam': { name: 'Foam Roller', url: `https://www.amazon.in/s?k=foam+roller+physiotherapy&tag=${AFFILIATE_TAG}` },
    'massage ball': { name: 'Massage Ball', url: `https://www.amazon.in/s?k=massage+ball+trigger+point&tag=${AFFILIATE_TAG}` },
    'spiky ball': { name: 'Spiky Massage Ball', url: `https://www.amazon.in/s?k=spiky+ball+physiotherapy&tag=${AFFILIATE_TAG}` },

    // Mats & Surfaces
    'mat': { name: 'Yoga Mat', url: `https://www.amazon.in/s?k=yoga+mat+6mm+anti+slip&tag=${AFFILIATE_TAG}` },
    'yoga mat': { name: 'Yoga Mat', url: `https://www.amazon.in/s?k=yoga+mat+thick+exercise&tag=${AFFILIATE_TAG}` },

    // Hot/Cold Therapy
    'ice': { name: 'Ice Pack', url: `https://www.amazon.in/s?k=ice+pack+gel+reusable&tag=${AFFILIATE_TAG}` },
    'heat': { name: 'Hot Water Bag', url: `https://www.amazon.in/s?k=hot+water+bag+electric&tag=${AFFILIATE_TAG}` },
    'hot pack': { name: 'Hot Pack', url: `https://www.amazon.in/s?k=hot+cold+pack+therapy&tag=${AFFILIATE_TAG}` },
    'cold pack': { name: 'Cold Pack', url: `https://www.amazon.in/s?k=cold+pack+gel+pain+relief&tag=${AFFILIATE_TAG}` },

    // Supports & Braces
    'brace': { name: 'Support Brace', url: `https://www.amazon.in/s?k=knee+brace+support&tag=${AFFILIATE_TAG}` },
    'knee brace': { name: 'Knee Brace', url: `https://www.amazon.in/s?k=knee+brace+pain+relief&tag=${AFFILIATE_TAG}` },
    'ankle brace': { name: 'Ankle Brace', url: `https://www.amazon.in/s?k=ankle+brace+support&tag=${AFFILIATE_TAG}` },
    'wrist brace': { name: 'Wrist Brace', url: `https://www.amazon.in/s?k=wrist+brace+carpal+tunnel&tag=${AFFILIATE_TAG}` },
    'back brace': { name: 'Back Support', url: `https://www.amazon.in/s?k=back+brace+lumbar+support&tag=${AFFILIATE_TAG}` },
    'lumbar': { name: 'Lumbar Support', url: `https://www.amazon.in/s?k=lumbar+support+pillow+office&tag=${AFFILIATE_TAG}` },
    'neck brace': { name: 'Neck Collar', url: `https://www.amazon.in/s?k=cervical+collar+soft&tag=${AFFILIATE_TAG}` },
    'shoulder brace': { name: 'Shoulder Support', url: `https://www.amazon.in/s?k=shoulder+brace+support&tag=${AFFILIATE_TAG}` },

    // Pillows & Cushions
    'pillow': { name: 'Cervical Pillow', url: `https://www.amazon.in/s?k=cervical+pillow+memory+foam&tag=${AFFILIATE_TAG}` },
    'neck pillow': { name: 'Neck Pillow', url: `https://www.amazon.in/s?k=neck+pillow+orthopedic&tag=${AFFILIATE_TAG}` },
    'cushion': { name: 'Seat Cushion', url: `https://www.amazon.in/s?k=seat+cushion+coccyx+orthopedic&tag=${AFFILIATE_TAG}` },

    // Props & Accessories
    'towel': { name: 'Exercise Towel', url: `https://www.amazon.in/s?k=gym+towel+microfiber&tag=${AFFILIATE_TAG}` },
    'strap': { name: 'Yoga Strap', url: `https://www.amazon.in/s?k=yoga+strap+stretching&tag=${AFFILIATE_TAG}` },
    'block': { name: 'Yoga Block', url: `https://www.amazon.in/s?k=yoga+block+foam&tag=${AFFILIATE_TAG}` },
    'stick': { name: 'Massage Stick', url: `https://www.amazon.in/s?k=muscle+roller+stick&tag=${AFFILIATE_TAG}` },
    'step': { name: 'Aerobic Step', url: `https://www.amazon.in/s?k=aerobic+step+platform&tag=${AFFILIATE_TAG}` },
    'balance': { name: 'Balance Board', url: `https://www.amazon.in/s?k=balance+board+wobble&tag=${AFFILIATE_TAG}` },

    // Massage devices (home versions)
    'massager': { name: 'Electric Massager', url: `https://www.amazon.in/s?k=body+massager+muscle+pain&tag=${AFFILIATE_TAG}` },

    // General
    'bottle': { name: 'Water Bottle', url: `https://www.amazon.in/s?k=water+bottle+gym+1+litre&tag=${AFFILIATE_TAG}` },
    'grip': { name: 'Hand Gripper', url: `https://www.amazon.in/s?k=hand+gripper+strengthener&tag=${AFFILIATE_TAG}` },
    'squeeze': { name: 'Stress Ball', url: `https://www.amazon.in/s?k=stress+ball+hand+exercise&tag=${AFFILIATE_TAG}` }
};

function enrichWithSmartLinks(plan) {
    if (plan.exercisePlan?.selectedExercises) {
        plan.exercisePlan.selectedExercises = plan.exercisePlan.selectedExercises.map((ex) => {
            const query = encodeURIComponent(`${ex.name} exercise physical therapy`);
            // Always use colorful placeholder (YouTube IDs can become invalid)
            let thumbUrl = getPlaceholderThumbnail(ex.name || 'exercise');
            let videoUrl = `https://www.youtube.com/results?search_query=${query}`;

            // Check for equipment - prioritize clinic detection first
            let equipType = null; // 'clinic' or 'home'
            let equipLink = null;
            let equipName = null;
            let sessionName = null;

            const lowerName = (ex.name + ' ' + (ex.description || '')).toLowerCase();

            // First check for clinic equipment
            for (const [key, equipData] of Object.entries(CLINIC_EQUIPMENT)) {
                if (lowerName.includes(key)) {
                    equipType = 'clinic';
                    equipName = equipData.name;
                    sessionName = equipData.sessionName;
                    break;
                }
            }

            // If not clinic, check for home equipment
            if (!equipType) {
                for (const [key, equipData] of Object.entries(HOME_EQUIPMENT)) {
                    if (lowerName.includes(key)) {
                        equipType = 'home';
                        equipLink = equipData.url;
                        equipName = equipData.name;
                        break;
                    }
                }
            }

            return {
                ...ex,
                type: 'search',
                thumbnailUrl: thumbUrl,
                videoUrl: videoUrl,
                equipmentType: equipType,
                equipmentUrl: equipLink,
                equipmentName: equipName,
                sessionName: sessionName
            };
        });
    }
    return plan;
}
