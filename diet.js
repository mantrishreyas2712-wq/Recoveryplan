/**
 * PhysioAssist - Diet & Nutrition Database
 * Comprehensive nutrition recommendations for physiotherapy recovery
 */

const DIET_DATABASE = {
    // ============================================
    // ANTI-INFLAMMATORY FOODS
    // ============================================
    antiInflammatory: {
        title: "Anti-Inflammatory Foods",
        description: "These foods help reduce inflammation and support recovery",
        icon: "🥗",
        foods: [
            { name: "Fatty Fish (Salmon, Mackerel)", emoji: "🐟", benefits: "Rich in Omega-3 fatty acids" },
            { name: "Berries", emoji: "🫐", benefits: "High in antioxidants" },
            { name: "Leafy Greens (Spinach, Kale)", emoji: "🥬", benefits: "Vitamins K, C, and antioxidants" },
            { name: "Turmeric", emoji: "🟡", benefits: "Contains curcumin, powerful anti-inflammatory" },
            { name: "Ginger", emoji: "🫚", benefits: "Reduces muscle pain and soreness" },
            { name: "Olive Oil (Extra Virgin)", emoji: "🫒", benefits: "Contains oleocanthal" },
            { name: "Walnuts", emoji: "🥜", benefits: "Omega-3 and antioxidants" },
            { name: "Green Tea", emoji: "🍵", benefits: "EGCG antioxidant" },
            { name: "Tomatoes", emoji: "🍅", benefits: "Lycopene antioxidant" },
            { name: "Cherries", emoji: "🍒", benefits: "Reduce uric acid and inflammation" }
        ]
    },

    // ============================================
    // PROTEIN FOR MUSCLE RECOVERY
    // ============================================
    proteinRecovery: {
        title: "Protein for Muscle Recovery",
        description: "Essential for repairing and building muscle tissue",
        icon: "💪",
        foods: [
            { name: "Chicken Breast", emoji: "🍗", benefits: "Lean protein source" },
            { name: "Eggs", emoji: "🥚", benefits: "Complete protein with all amino acids" },
            { name: "Greek Yogurt", emoji: "🥛", benefits: "Protein and probiotics" },
            { name: "Lentils", emoji: "🫘", benefits: "Plant protein and fiber" },
            { name: "Paneer (Cottage Cheese)", emoji: "🧀", benefits: "Casein protein for slow release" },
            { name: "Fish", emoji: "🐠", benefits: "High-quality protein and omega-3" },
            { name: "Tofu/Tempeh", emoji: "🍲", benefits: "Complete plant protein" },
            { name: "Quinoa", emoji: "🌾", benefits: "Complete protein grain" },
            { name: "Chickpeas", emoji: "🥙", benefits: "Protein and fiber" },
            { name: "Milk/Buttermilk", emoji: "🥛", benefits: "Calcium and protein" }
        ]
    },

    // ============================================
    // BONE HEALTH FOODS
    // ============================================
    boneHealth: {
        title: "Bone Health & Calcium",
        description: "Support bone density and healing",
        icon: "🦴",
        foods: [
            { name: "Milk & Dairy Products", emoji: "🥛", benefits: "Calcium and Vitamin D" },
            { name: "Sesame Seeds (Til)", emoji: "⚪", benefits: "Very high in calcium" },
            { name: "Ragi (Finger Millet)", emoji: "🌾", benefits: "Excellent calcium source" },
            { name: "Dark Leafy Greens", emoji: "🥬", benefits: "Calcium and Vitamin K" },
            { name: "Sardines with Bones", emoji: "🐟", benefits: "Calcium and Omega-3" },
            { name: "Almonds", emoji: "🌰", benefits: "Calcium and magnesium" },
            { name: "Fortified Foods", emoji: "🥣", benefits: "Added Vitamin D" },
            { name: "Egg Yolks", emoji: "🍳", benefits: "Natural Vitamin D" },
            { name: "Broccoli", emoji: "🥦", benefits: "Calcium and Vitamin K" },
            { name: "Oranges", emoji: "🍊", benefits: "Vitamin C for collagen" }
        ]
    },

    // ============================================
    // JOINT HEALTH FOODS
    // ============================================
    jointHealth: {
        title: "Joint Health & Cartilage",
        description: "Foods that support joint health and cartilage repair",
        icon: "🦿",
        foods: [
            { name: "Bone Broth", emoji: "🍲", benefits: "Collagen and glucosamine" },
            { name: "Citrus Fruits", emoji: "🍋", benefits: "Vitamin C for collagen synthesis" },
            { name: "Bell Peppers", emoji: "🫑", benefits: "Very high Vitamin C" },
            { name: "Garlic", emoji: "🧄", benefits: "Anti-inflammatory compounds" },
            { name: "Onions", emoji: "🧅", benefits: "Quercetin antioxidant" },
            { name: "Pomegranate", emoji: "🔴", benefits: "Reduces cartilage damage" },
            { name: "Avocado", emoji: "🥑", benefits: "Healthy fats and antioxidants" },
            { name: "Papaya", emoji: "🥭", benefits: "Vitamin C and enzymes" },
            { name: "Mushrooms", emoji: "🍄", benefits: "Vitamin D (sun-exposed)" },
            { name: "Seeds (Chia, Flax)", emoji: "🌱", benefits: "Omega-3 fatty acids" }
        ]
    },

    // ============================================
    // FOODS TO AVOID
    // ============================================
    foodsToAvoid: {
        title: "Foods to Limit or Avoid",
        description: "These may increase inflammation and slow recovery",
        icon: "⚠️",
        foods: [
            { name: "Processed/Fried Foods", emoji: "🍟", reason: "Trans fats increase inflammation" },
            { name: "Refined Sugar", emoji: "🍬", reason: "Spikes inflammation markers" },
            { name: "Excessive Red Meat", emoji: "🥩", reason: "High in saturated fats" },
            { name: "White Bread/Refined Carbs", emoji: "🍞", reason: "Rapid blood sugar spikes" },
            { name: "Soda & Sugary Drinks", emoji: "🥤", reason: "Empty calories, inflammation" },
            { name: "Excessive Alcohol", emoji: "🍺", reason: "Dehydrates and inflames" },
            { name: "Excess Salt", emoji: "🧂", reason: "Can worsen swelling" },
            { name: "Processed Meats", emoji: "🌭", reason: "Preservatives increase inflammation" },
            { name: "Margarine", emoji: "🧈", reason: "May contain trans fats" },
            { name: "Excessive Caffeine", emoji: "☕", reason: "Can affect sleep and recovery" }
        ]
    },

    // ============================================
    // HYDRATION
    // ============================================
    hydration: {
        title: "Hydration Guidelines",
        description: "Proper hydration is crucial for tissue health and recovery",
        icon: "💧",
        guidelines: [
            { tip: "Drink 8-10 glasses of water daily", icon: "🥛" },
            { tip: "Increase intake during exercise", icon: "🏃" },
            { tip: "Monitor urine color (pale yellow is ideal)", icon: "🚽" },
            { tip: "Include water-rich foods: cucumber, watermelon", icon: "🥒" },
            { tip: "Coconut water for natural electrolytes", icon: "🥥" },
            { tip: "Limit diuretics (coffee, alcohol)", icon: "☕" },
            { tip: "Herbal teas count towards hydration", icon: "🍵" },
            { tip: "Drink water before, during, and after exercises", icon: "⏰" }
        ]
    },

    // ============================================
    // CONDITION-SPECIFIC RECOMMENDATIONS
    // ============================================
    conditions: {
        'lower-back': {
            focus: ['antiInflammatory', 'proteinRecovery', 'boneHealth'],
            tips: [
                "Maintain healthy weight to reduce spine stress",
                "Include magnesium-rich foods for muscle relaxation",
                "Consider turmeric milk (golden milk) daily"
            ]
        },
        'neck': {
            focus: ['antiInflammatory', 'proteinRecovery'],
            tips: [
                "Stay hydrated for disc health",
                "Omega-3s help reduce neck stiffness",
                "Avoid excessive caffeine that may increase tension"
            ]
        },
        'shoulder': {
            focus: ['antiInflammatory', 'proteinRecovery', 'jointHealth'],
            tips: [
                "Collagen supplements may help tendon repair",
                "Include vitamin C for tissue healing",
                "Anti-inflammatory diet is especially important"
            ]
        },
        'knee': {
            focus: ['jointHealth', 'antiInflammatory', 'boneHealth'],
            tips: [
                "Maintain healthy weight to reduce knee stress",
                "Glucosamine from bone broth helps cartilage",
                "Vitamin D is crucial for knee health"
            ]
        },
        'hip': {
            focus: ['jointHealth', 'boneHealth', 'antiInflammatory'],
            tips: [
                "Calcium intake is vital for hip bone health",
                "Weight management reduces hip joint stress",
                "Include anti-inflammatory foods daily"
            ]
        },
        'ankle': {
            focus: ['antiInflammatory', 'proteinRecovery'],
            tips: [
                "Protein for ligament repair",
                "Bromelain (from pineapple) may reduce swelling",
                "Avoid excess salt to reduce fluid retention"
            ]
        },
        'wrist': {
            focus: ['antiInflammatory', 'jointHealth'],
            tips: [
                "B vitamins may help with carpal tunnel symptoms",
                "Reduce inflammatory foods to decrease swelling",
                "Stay hydrated for tendon health"
            ]
        },
        'posture': {
            focus: ['antiInflammatory', 'proteinRecovery', 'boneHealth'],
            tips: [
                "Strong muscles need adequate protein",
                "Calcium for spine health",
                "Magnesium helps with muscle function"
            ]
        },
        default: {
            focus: ['antiInflammatory', 'proteinRecovery', 'hydration'],
            tips: [
                "Balanced nutrition supports overall recovery",
                "Anti-inflammatory foods benefit all conditions",
                "Adequate protein is essential for tissue repair"
            ]
        }
    }
};

/**
 * Get diet recommendations for a specific condition
 * @param {string} condition - Body area or condition
 * @returns {Object} Diet recommendations
 */
function getDietForCondition(condition) {
    const conditionData = DIET_DATABASE.conditions[condition] || DIET_DATABASE.conditions.default;

    const recommendations = {
        categories: [],
        tips: conditionData.tips,
        foodsToAvoid: DIET_DATABASE.foodsToAvoid,
        hydration: DIET_DATABASE.hydration
    };

    conditionData.focus.forEach(categoryKey => {
        if (DIET_DATABASE[categoryKey]) {
            recommendations.categories.push(DIET_DATABASE[categoryKey]);
        }
    });

    return recommendations;
}

/**
 * Get all diet categories
 * @returns {Object} All diet categories
 */
function getAllDietCategories() {
    return {
        antiInflammatory: DIET_DATABASE.antiInflammatory,
        proteinRecovery: DIET_DATABASE.proteinRecovery,
        boneHealth: DIET_DATABASE.boneHealth,
        jointHealth: DIET_DATABASE.jointHealth,
        foodsToAvoid: DIET_DATABASE.foodsToAvoid,
        hydration: DIET_DATABASE.hydration
    };
}

/**
 * Generate a sample meal plan based on condition
 * @param {string} condition - Body area or condition
 * @returns {Object} Sample meal plan
 */
function getSampleMealPlan(condition) {
    return {
        breakfast: [
            "🥣 Oatmeal with berries and walnuts",
            "🍳 Eggs with whole grain toast and avocado",
            "🥛 Greek yogurt with fruits and seeds"
        ],
        lunch: [
            "🥗 Grilled chicken salad with olive oil dressing",
            "🍲 Lentil soup with whole grain roti",
            "🐟 Fish curry with brown rice and vegetables"
        ],
        dinner: [
            "🍗 Baked salmon with roasted vegetables",
            "🥘 Paneer tikka with mixed vegetables",
            "🍲 Dal with quinoa and sautéed greens"
        ],
        snacks: [
            "🥜 Handful of mixed nuts",
            "🍎 Apple with almond butter",
            "🥒 Vegetable sticks with hummus",
            "🍵 Turmeric golden milk"
        ]
    };
}
