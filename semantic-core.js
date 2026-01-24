// Smart Offline AI Core (TensorFlow.js)
// Enables "Understanding" of effectively ANY human scenario using Semantic Anchors.

const SemanticCore = {
    model: null,
    isReady: false,

    // Semantic Anchors (Universal Mapping)
    // Maps infinite variations to specific categories.
    anchors: {
        // 1. ACUTE TRAUMA (Falls, Accidents, Attacks, Weird Stuff)
        'trauma': [
            "I fell down stairs", "I had a bad accident", "I slipped on wet floor",
            "I got into a fight", "someone hit me", "violent impact",
            "motorcycle crash", "twisted my ankle badly", "tumbled down",
            "fell off bike", "attacked by animal", "hit by shark", "punched in face",
            "car accident", "lightning strike", "fell from height", "collision"
        ],
        // 2. HIGH IMPACT / SPORT (Active)
        'running': [
            "I run every morning", "training for marathon", "jogging in the park",
            "sprinting fast", "treadmill running", "high impact cardio",
            "jumping rope", "playing football", "soccer match", "basketball game",
            "scuba diving", "swimming impact", "hiking steep hill"
        ],
        // 3. HEAVY LOAD / GYM (Mechanical)
        'lifting': [
            "gym workout deadlift", "lifting heavy weights", "bench press max",
            "bodybuilding squat", "strained while lifting box", "heavy gym session",
            "moving furniture", "carrying heavy groceries", "construction work lifting"
        ],
        // 4. ERGONOMIC / SEDENTARY (Static)
        'desk': [
            "sitting at computer all day", "office desk job", "typing on keyboard",
            "using mouse continuously", "sedentary lifestyle", "sitting chair work",
            "gaming for hours", "driving long distance", "studying at desk"
        ],
        // 5. INTIMATE / PERSONAL (Specific Strain)
        'intimate': [
            "pain during sex", "pain in groin while being intimate", "intercourse pain",
            "bedroom activity strain", "pain after sexual activity", "pelvic strain"
        ],
        // 6. HOUSEHOLD / REPETITIVE (Daily Life)
        'household': [
            "cleaning the house", "vacuuming floor", "washing dishes", "gardening work",
            "cooking for long time", "sweeping floor", "painting wall", "knitting"
        ],
        // 7. SLEEP / STATIC (Passive)
        'sleep': [
            "slept in bad position", "woke up with pain", "neck hurts after sleeping",
            "bad pillow", "mattress caused pain", "stiff morning", "sleeping wrong"
        ]
    },

    anchorEmbeddings: {},

    async init() {
        if (typeof use === 'undefined') {
            console.warn("TensorFlow USE not loaded via CDN.");
            return;
        }
        console.log("🧠 Initializing Universal Semantic Core...");
        try {
            this.model = await use.load();
            this.isReady = true;
            console.log("🧠 Model Loaded. Computing Universal Anchors...");

            for (const [category, sentences] of Object.entries(this.anchors)) {
                const embeddings = await this.model.embed(sentences);
                this.anchorEmbeddings[category] = embeddings;
            }
            console.log("🧠 Universal Brain Ready.");
        } catch (e) {
            console.error("Failed to load Semantic Core:", e);
        }
    },

    async classify(text) {
        if (!this.isReady || !this.model || !text) return null;

        const inputTensor = await this.model.embed([text]);
        const inputVector = inputTensor.dataSync();

        let bestCategory = null;
        let maxScore = -1;

        for (const [category, anchorTensor] of Object.entries(this.anchorEmbeddings)) {
            const anchorVectors = await anchorTensor.array();
            let categoryMax = -1;
            for (const vec of anchorVectors) {
                const score = this.cosineSimilarity(inputVector, vec);
                if (score > categoryMax) categoryMax = score;
            }

            if (categoryMax > maxScore) {
                maxScore = categoryMax;
                bestCategory = category;
            }
        }

        console.log(`🧠 Prediction: "${text}" -> ${bestCategory} (${maxScore.toFixed(2)})`);
        // Lower threshold slightly to catch weird metaphors
        if (maxScore > 0.35) return bestCategory;
        return null;
    },

    cosineSimilarity(a, b) {
        let dot = 0;
        let magA = 0;
        let magB = 0;
        for (let i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            magA += a[i] * a[i];
            magB += b[i] * b[i];
        }
        return dot / (Math.sqrt(magA) * Math.sqrt(magB));
    }
};

window.SemanticCore = SemanticCore;
setTimeout(() => SemanticCore.init(), 100);
