// Body Part Name Normalizer - Fix for knee->lumbar bug
// Problem: SVG uses "left-knee", "right-shoulder-back" etc, but AI expects simple names like "knee", "shoulder"
function normalizeBodyPartName(bodyPartString) {
    if (!bodyPartString) return 'back'; // Default fallback

    const normalized = bodyPartString
        .toLowerCase()
        .replace(/^(left|right)-/, '')  // Remove left-/right- prefix
        .replace(/-(back|front)$/, '')  // Remove -back/-front suffix
        .trim();

    // Map common variations to standard area keys
    const areaMap = {
        'head': 'neck',  // Head issues usually neck-related
        'neck': 'neck',
        'shoulder': 'shoulder',
        'bicep': 'shoulder',  // Upper arm is shoulder complex
        'tricep': 'shoulder',
        'elbow': 'elbow',
        'forearm': 'wrist',  // Forearm strain is wrist/elbow complex
        'wrist': 'wrist',
        'hand': 'wrist',  // Hand pain often wrist-related
        'chest': 'back',  // Chest muscle strain often thoracic spine
        'upper-abs': 'back',
        'lower-abs': 'back',
        'side': 'back',
        'hip': 'back',  // Hip/pelvic pain often lumbar
        'groin': 'back',
        'upper-back': 'back',
        'mid-back': 'back',
        'lower-back': 'back',
        'glute': 'back',  // Glute issues often lumbar-related
        'upper-thigh': 'knee',  // Thigh pain often knee/hip
        'lower-thigh': 'knee',
        'hamstring': 'knee',
        'knee': 'knee',
        'upper-shin': 'ankle',
        'lower-shin': 'ankle',
        'calf': 'ankle',
        'ankle': 'ankle',
        'achilles': 'ankle',
        'heel': 'ankle',
        'foot': 'ankle'
    };

    return areaMap[normalized] || 'back'; // Default to back if not found
}

// Export for use in main code
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeBodyPartName };
}
