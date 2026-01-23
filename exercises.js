/**
 * PhysioAssist - Exercise Library
 * Comprehensive collection of physiotherapy exercises with videos and instructions
 */

// ============================================
// NECK EXERCISES
// ============================================
neck: [
    {
        id: 'neck-stretch-lateral',
        name: 'Lateral Neck Stretch',
        target: 'Neck & Trapezius',
        description: 'Gently tilt your head towards one shoulder, holding for 15-30 seconds. Keep shoulders relaxed and down.',
        videoUrl: 'https://www.youtube.com/embed/0eO1aB6U72c', // Valid embed
        imageEmoji: '🧘',
        sets: '2-3',
        reps: '15-30 sec each side',
        difficulty: 'Easy',
        contraindications: ['Severe neck injury', 'Recent whiplash', 'Cervical disc herniation']
    },
    {
        id: 'chin-tucks',
        name: 'Chin Tucks',
        target: 'Deep Neck Flexors',
        description: 'Gently draw your chin back, creating a "double chin". Hold for 5 seconds. Great for forward head posture.',
        videoUrl: 'https://www.youtube.com/embed/EqR66aCN9vU', // Valid embed
        imageEmoji: '😌',
        sets: '3',
        reps: '10-15',
        difficulty: 'Easy',
        contraindications: ['Acute neck pain']
    },
    {
        id: 'neck-rotation',
        name: 'Neck Rotation Stretch',
        target: 'Neck Rotators',
        description: 'Slowly turn your head to look over one shoulder. Hold 15-30 seconds, then repeat on other side.',
        videoUrl: 'https://www.youtube.com/embed/Xq3iO_hYVv4', // Valid embed
        imageEmoji: '🔄',
        sets: '2-3',
        reps: '15-30 sec each side',
        difficulty: 'Easy',
        contraindications: ['Vertigo', 'Cervical instability']
    }
],

    // ============================================
    // SHOULDER EXERCISES
    // ============================================
    shoulder: [
        {
            id: 'shoulder-rolls',
            name: 'Shoulder Rolls',
            target: 'Shoulder & Upper Back',
            description: 'Roll shoulders forward in circular motion, then reverse. Great for releasing tension.',
            videoUrl: 'https://www.youtube.com/embed/qg9bhtY7bgs', // Valid embed
            imageEmoji: '🔃',
            sets: '2-3',
            reps: '10-15 each direction',
            difficulty: 'Easy',
            contraindications: []
        },
        {
            id: 'pendulum-exercise',
            name: 'Pendulum Exercise',
            target: 'Shoulder Joint',
            description: 'Lean forward, let arm hang, and gently swing in small circles. Excellent for frozen shoulder.',
            videoUrl: 'https://www.youtube.com/embed/7kKkz9EBTW8',
            imageEmoji: '🌀',
            sets: '2-3',
            reps: '20-30 circles each direction',
            difficulty: 'Easy',
            contraindications: ['Acute shoulder dislocation']
        },
        {
            id: 'wall-angels',
            name: 'Wall Angels',
            target: 'Shoulder & Posture',
            description: 'Stand with back against wall, arms in "goal post" position. Slide arms up and down while maintaining wall contact.',
            videoUrl: 'https://www.youtube.com/embed/M_ooIhKYs7c',
            imageEmoji: '👐',
            sets: '2-3',
            reps: '10-15',
            difficulty: 'Moderate',
            contraindications: ['Severe shoulder impingement']
        },
        {
            id: 'external-rotation',
            name: 'External Rotation with Resistance',
            target: 'Rotator Cuff',
            description: 'Keep elbow at side, rotate forearm outward against resistance band or towel.',
            videoUrl: 'https://www.youtube.com/embed/WJm9zA2NY8E',
            imageEmoji: '💪',
            sets: '3',
            reps: '12-15',
            difficulty: 'Moderate',
            contraindications: ['Acute rotator cuff tear', 'Post-surgery (without clearance)']
        }
    ],

        // ============================================
        // UPPER BACK EXERCISES
        // ============================================
        'upper-back': [
            {
                id: 'cat-cow',
                name: 'Cat-Cow Stretch',
                target: 'Entire Spine',
                description: 'On all fours, alternate between arching (cow) and rounding (cat) your back. Coordinate with breathing.',
                videoUrl: 'https://www.youtube.com/embed/kqnua4rHVVA',
                imageEmoji: '🐱',
                sets: '2-3',
                reps: '10-15 cycles',
                difficulty: 'Easy',
                contraindications: ['Wrist pain (modified version available)']
            },
            {
                id: 'thoracic-extension',
                name: 'Thoracic Extension on Foam Roller',
                target: 'Upper Back',
                description: 'Lie on foam roller positioned under upper back. Support head and gently extend over roller.',
                videoUrl: 'https://www.youtube.com/embed/SxQkVR2KrYg',
                imageEmoji: '🧱',
                sets: '2-3',
                reps: '30-60 sec',
                difficulty: 'Moderate',
                contraindications: ['Osteoporosis', 'Spinal fracture']
            },
            {
                id: 'thread-the-needle',
                name: 'Thread the Needle',
                target: 'Thoracic Spine Rotation',
                description: 'On all fours, thread one arm under body, rotating spine. Great for mid-back mobility.',
                videoUrl: 'https://www.youtube.com/embed/MxFl-wvvGlQ',
                imageEmoji: '🧵',
                sets: '2-3',
                reps: '8-10 each side',
                difficulty: 'Easy',
                contraindications: ['Shoulder injury']
            }
        ],

            // ============================================
            // LOWER BACK EXERCISES
            // ============================================
            'lower-back': [
                {
                    id: 'knee-to-chest',
                    name: 'Knee to Chest Stretch',
                    target: 'Lower Back & Glutes',
                    description: 'Lie on back, pull one knee towards chest. Hold 20-30 seconds. Helps decompress lower spine.',
                    videoUrl: 'https://www.youtube.com/embed/DWmGArQBtFI',
                    imageEmoji: '🦵',
                    sets: '2-3',
                    reps: '20-30 sec each leg',
                    difficulty: 'Easy',
                    contraindications: ['Acute disc herniation']
                },
                {
                    id: 'pelvic-tilt',
                    name: 'Pelvic Tilts',
                    target: 'Core & Lower Back',
                    description: 'Lie on back with knees bent. Flatten lower back against floor by tilting pelvis. Hold 5 seconds.',
                    videoUrl: 'https://www.youtube.com/embed/1bPAdMov3Ik',
                    imageEmoji: '⬆️',
                    sets: '2-3',
                    reps: '15-20',
                    difficulty: 'Easy',
                    contraindications: []
                },
                {
                    id: 'bird-dog',
                    name: 'Bird-Dog Exercise',
                    target: 'Core Stability & Back',
                    description: 'On all fours, extend opposite arm and leg. Hold 5-10 seconds. Keep core engaged and back flat.',
                    videoUrl: 'https://www.youtube.com/embed/wiFNA3sqjCA',
                    imageEmoji: '🐕',
                    sets: '3',
                    reps: '10-12 each side',
                    difficulty: 'Moderate',
                    contraindications: ['Wrist pain', 'Knee pain (use padding)']
                },
                {
                    id: 'bridge',
                    name: 'Glute Bridge',
                    target: 'Glutes & Lower Back',
                    description: 'Lie on back, feet flat. Lift hips towards ceiling, squeezing glutes. Hold 3-5 seconds at top.',
                    videoUrl: 'https://www.youtube.com/embed/OUgsJ8-Vi0E',
                    imageEmoji: '🌉',
                    sets: '3',
                    reps: '12-15',
                    difficulty: 'Easy',
                    contraindications: []
                },
                {
                    id: 'childs-pose',
                    name: "Child's Pose",
                    target: 'Lower Back & Hips',
                    description: 'Kneel and sit back on heels, reaching arms forward on floor. Rest forehead down and breathe deeply.',
                    videoUrl: 'https://www.youtube.com/embed/2MJGg-dUKh0',
                    imageEmoji: '🙏',
                    sets: '2-3',
                    reps: '30-60 sec',
                    difficulty: 'Easy',
                    contraindications: ['Knee injury']
                },
                {
                    id: 'lumbar-rotation',
                    name: 'Lumbar Rotation Stretch',
                    target: 'Lower Back & Obliques',
                    description: 'Lie on back with knees bent. Let knees fall to one side while keeping shoulders flat. Hold 20-30 sec.',
                    videoUrl: 'https://www.youtube.com/embed/9-s_NEFXAUQ',
                    imageEmoji: '🔁',
                    sets: '2-3',
                    reps: '20-30 sec each side',
                    difficulty: 'Easy',
                    contraindications: ['Acute disc problems']
                }
            ],

                // ============================================
                // HIP EXERCISES
                // ============================================
                hip: [
                    {
                        id: 'hip-flexor-stretch',
                        name: 'Hip Flexor Stretch',
                        target: 'Hip Flexors',
                        description: 'Kneel on one knee, front foot forward. Push hips forward while keeping back straight. Essential for desk workers.',
                        videoUrl: 'https://www.youtube.com/embed/YQmpO9VT2X4',
                        imageEmoji: '🦿',
                        sets: '2-3',
                        reps: '30 sec each side',
                        difficulty: 'Easy',
                        contraindications: ['Knee pain (use cushion)']
                    },
                    {
                        id: 'piriformis-stretch',
                        name: 'Piriformis Stretch',
                        target: 'Deep Hip Rotators',
                        description: 'Lie on back, cross ankle over opposite knee, pull thigh towards chest. Great for sciatica relief.',
                        videoUrl: 'https://www.youtube.com/embed/5tRwHNp1NqI',
                        imageEmoji: '🍐',
                        sets: '2-3',
                        reps: '30 sec each side',
                        difficulty: 'Easy',
                        contraindications: ['Hip replacement (consult doctor)']
                    },
                    {
                        id: 'clamshells',
                        name: 'Clamshell Exercise',
                        target: 'Hip Abductors & Glute Med',
                        description: 'Lie on side with knees bent. Keep feet together and lift top knee. Crucial for hip stability.',
                        videoUrl: 'https://www.youtube.com/embed/rQKFsVZoXdQ',
                        imageEmoji: '🐚',
                        sets: '3',
                        reps: '15-20 each side',
                        difficulty: 'Easy',
                        contraindications: []
                    }
                ],

                    // ============================================
                    // KNEE EXERCISES
                    // ============================================
                    knee: [
                        {
                            id: 'quad-stretch',
                            name: 'Standing Quad Stretch',
                            target: 'Quadriceps',
                            description: 'Stand and pull heel towards buttock. Keep knees together. Hold onto wall for balance if needed.',
                            videoUrl: 'https://www.youtube.com/embed/YqnCgLvnvhk',
                            imageEmoji: '🦵',
                            sets: '2-3',
                            reps: '30 sec each leg',
                            difficulty: 'Easy',
                            contraindications: ['Knee flexion limitation']
                        },
                        {
                            id: 'hamstring-stretch',
                            name: 'Hamstring Stretch',
                            target: 'Hamstrings',
                            description: 'Sit with one leg extended, reach towards toes. Keep back straight. Can also be done lying down.',
                            videoUrl: 'https://www.youtube.com/embed/FDwpEdxZ4H4',
                            imageEmoji: '🧘‍♀️',
                            sets: '2-3',
                            reps: '30 sec each leg',
                            difficulty: 'Easy',
                            contraindications: ['Acute hamstring tear']
                        },
                        {
                            id: 'straight-leg-raise',
                            name: 'Straight Leg Raise',
                            target: 'Quadriceps',
                            description: 'Lie on back, one knee bent. Lift straight leg about 12 inches. Hold 5 seconds. Builds quad strength.',
                            videoUrl: 'https://www.youtube.com/embed/yP9dGoqeco8',
                            imageEmoji: '⬆️',
                            sets: '3',
                            reps: '10-15 each leg',
                            difficulty: 'Easy',
                            contraindications: []
                        },
                        {
                            id: 'step-ups',
                            name: 'Step Ups',
                            target: 'Quadriceps & Glutes',
                            description: 'Step up onto a sturdy platform, then step down. Use railing for support if needed.',
                            videoUrl: 'https://www.youtube.com/embed/dQqApCGd5Ss',
                            imageEmoji: '🪜',
                            sets: '3',
                            reps: '10-12 each leg',
                            difficulty: 'Moderate',
                            contraindications: ['Knee instability', 'Balance issues']
                        }
                    ],

                        // ============================================
                        // ANKLE & FOOT EXERCISES
                        // ============================================
                        ankle: [
                            {
                                id: 'ankle-circles',
                                name: 'Ankle Circles',
                                target: 'Ankle Mobility',
                                description: 'Rotate ankle in circles, both clockwise and counterclockwise. Keep leg still.',
                                videoUrl: 'https://www.youtube.com/embed/K3KDnHKHbdc',
                                imageEmoji: '🔵',
                                sets: '2-3',
                                reps: '10-15 each direction',
                                difficulty: 'Easy',
                                contraindications: []
                            },
                            {
                                id: 'calf-raises',
                                name: 'Calf Raises',
                                target: 'Calves',
                                description: 'Rise up onto toes, hold briefly, lower slowly. Can do on stairs for greater range.',
                                videoUrl: 'https://www.youtube.com/embed/-M4-G8p8fmc',
                                imageEmoji: '🦶',
                                sets: '3',
                                reps: '15-20',
                                difficulty: 'Easy',
                                contraindications: ['Achilles tendon injury (modified)']
                            },
                            {
                                id: 'toe-curls',
                                name: 'Towel Toe Curls',
                                target: 'Foot Intrinsics',
                                description: 'Place foot on towel, scrunch towel towards you using toes. Strengthens arch.',
                                videoUrl: 'https://www.youtube.com/embed/9-19DhFnpBU',
                                imageEmoji: '🧦',
                                sets: '2-3',
                                reps: '15-20',
                                difficulty: 'Easy',
                                contraindications: []
                            },
                            {
                                id: 'ankle-alphabet',
                                name: 'Ankle Alphabet',
                                target: 'Ankle Mobility',
                                description: 'Trace letters of alphabet with your big toe. Great for ankle rehabilitation.',
                                videoUrl: 'https://www.youtube.com/embed/K3KDnHKHbdc',
                                imageEmoji: '🔤',
                                sets: '1-2',
                                reps: 'Full alphabet',
                                difficulty: 'Easy',
                                contraindications: []
                            }
                        ],

                            // ============================================
                            // WRIST & HAND EXERCISES
                            // ============================================
                            wrist: [
                                {
                                    id: 'wrist-flexor-stretch',
                                    name: 'Wrist Flexor Stretch',
                                    target: 'Wrist Flexors',
                                    description: 'Extend arm, palm up, gently pull fingers back with other hand. Hold 20-30 sec.',
                                    videoUrl: 'https://www.youtube.com/embed/iBjGlnuXqN8',
                                    imageEmoji: '🖐️',
                                    sets: '2-3',
                                    reps: '20-30 sec each',
                                    difficulty: 'Easy',
                                    contraindications: []
                                },
                                {
                                    id: 'wrist-extensor-stretch',
                                    name: 'Wrist Extensor Stretch',
                                    target: 'Wrist Extensors',
                                    description: 'Extend arm, palm down, gently push hand down with other hand. Essential for computer users.',
                                    videoUrl: 'https://www.youtube.com/embed/iBjGlnuXqN8',
                                    imageEmoji: '✋',
                                    sets: '2-3',
                                    reps: '20-30 sec each',
                                    difficulty: 'Easy',
                                    contraindications: []
                                },
                                {
                                    id: 'finger-tendon-glides',
                                    name: 'Finger Tendon Glides',
                                    target: 'Finger Tendons',
                                    description: 'Move fingers through specific positions: straight, hook, fist, tabletop, straight fist.',
                                    videoUrl: 'https://www.youtube.com/embed/EiRC80FLbsU',
                                    imageEmoji: '👆',
                                    sets: '2',
                                    reps: '10 cycles',
                                    difficulty: 'Easy',
                                    contraindications: ['Acute finger injury']
                                }
                            ],

                                // ============================================
                                // ELBOW EXERCISES
                                // ============================================
                                elbow: [
                                    {
                                        id: 'forearm-supination',
                                        name: 'Forearm Rotation',
                                        target: 'Forearm',
                                        description: 'With elbow at side, rotate forearm palm up then palm down. Can use light weight.',
                                        videoUrl: 'https://www.youtube.com/embed/1MvZPdZdJig',
                                        imageEmoji: '🔄',
                                        sets: '2-3',
                                        reps: '15-20',
                                        difficulty: 'Easy',
                                        contraindications: []
                                    },
                                    {
                                        id: 'tennis-elbow-stretch',
                                        name: 'Tennis Elbow Stretch',
                                        target: 'Forearm Extensors',
                                        description: 'Extend arm, make fist, bend wrist down, apply gentle pressure with other hand.',
                                        videoUrl: 'https://www.youtube.com/embed/we4UoiKG3Co',
                                        imageEmoji: '🎾',
                                        sets: '3',
                                        reps: '30 sec each arm',
                                        difficulty: 'Easy',
                                        contraindications: []
                                    },
                                    {
                                        id: 'eccentric-wrist-extension',
                                        name: 'Eccentric Wrist Extension',
                                        target: 'Forearm Extensors',
                                        description: 'Hold light weight palm down, use other hand to raise it, slowly lower using affected arm.',
                                        videoUrl: 'https://www.youtube.com/embed/oQ4oqGITlBs',
                                        imageEmoji: '🏋️',
                                        sets: '3',
                                        reps: '15',
                                        difficulty: 'Moderate',
                                        contraindications: ['Acute inflammation']
                                    }
                                ],

                                    // ============================================
                                    // POSTURE EXERCISES
                                    // ============================================
                                    posture: [
                                        {
                                            id: 'doorway-stretch',
                                            name: 'Doorway Pec Stretch',
                                            target: 'Chest & Shoulders',
                                            description: 'Stand in doorway, arms at 90 degrees on frame. Step forward to stretch chest. Great for rounded shoulders.',
                                            videoUrl: 'https://www.youtube.com/embed/vGLDv6Rjyzw',
                                            imageEmoji: '🚪',
                                            sets: '2-3',
                                            reps: '30 sec',
                                            difficulty: 'Easy',
                                            contraindications: ['Shoulder instability']
                                        },
                                        {
                                            id: 'chin-tucks-posture',
                                            name: 'Chin Tucks Against Wall',
                                            target: 'Neck & Posture',
                                            description: 'Stand with back against wall, draw chin back to touch wall. Hold 5 seconds.',
                                            videoUrl: 'https://www.youtube.com/embed/wQylqaCl8Zo',
                                            imageEmoji: '🧱',
                                            sets: '3',
                                            reps: '10-15',
                                            difficulty: 'Easy',
                                            contraindications: []
                                        },
                                        {
                                            id: 'scapular-squeeze',
                                            name: 'Scapular Squeeze',
                                            target: 'Upper Back & Shoulders',
                                            description: 'Squeeze shoulder blades together and down. Hold 5 seconds. Counteracts forward shoulder posture.',
                                            videoUrl: 'https://www.youtube.com/embed/MtQrkMhqDwE',
                                            imageEmoji: '🎯',
                                            sets: '3',
                                            reps: '12-15',
                                            difficulty: 'Easy',
                                            contraindications: []
                                        },
                                        {
                                            id: 'prone-y-raises',
                                            name: 'Prone Y Raises',
                                            target: 'Lower Trapezius',
                                            description: 'Lie face down, lift arms in Y position with thumbs up. Hold 3-5 seconds.',
                                            videoUrl: 'https://www.youtube.com/embed/Yx0SdxVqjJY',
                                            imageEmoji: '✌️',
                                            sets: '3',
                                            reps: '10-12',
                                            difficulty: 'Moderate',
                                            contraindications: ['Shoulder injury']
                                        }
                                    ],

                                        // ============================================
                                        // GENERAL MOBILITY
                                        // ============================================
                                        multiple: [
                                            {
                                                id: 'walking',
                                                name: 'Walking Program',
                                                target: 'Overall Fitness',
                                                description: 'Start with 10-15 minutes of comfortable walking. Gradually increase duration and pace.',
                                                videoUrl: null,
                                                imageEmoji: '🚶',
                                                sets: '1',
                                                reps: '15-30 minutes',
                                                difficulty: 'Easy',
                                                contraindications: ['Severe mobility issues']
                                            },
                                            {
                                                id: 'deep-breathing',
                                                name: 'Diaphragmatic Breathing',
                                                target: 'Core & Relaxation',
                                                description: 'Lie on back, place hand on belly. Breathe deeply so belly rises. Excellent for pain management.',
                                                videoUrl: 'https://www.youtube.com/embed/kgTL5G1ibIo',
                                                imageEmoji: '🌬️',
                                                sets: '2-3',
                                                reps: '10-15 breaths',
                                                difficulty: 'Easy',
                                                contraindications: []
                                            },
                                            {
                                                id: 'full-body-stretch',
                                                name: 'Morning Full Body Stretch',
                                                target: 'Full Body',
                                                description: 'Combine neck rolls, arm circles, side bends, forward folds, and ankle rotations. Perfect wake-up routine.',
                                                videoUrl: 'https://www.youtube.com/embed/sTxC3J3gQEU',
                                                imageEmoji: '☀️',
                                                sets: '1',
                                                reps: '5-10 min routine',
                                                difficulty: 'Easy',
                                                contraindications: []
                                            }
                                        ],

                                            // ============================================
                                            // OTHER / SPECIALIZED
                                            // ============================================
                                            other: [
                                                {
                                                    id: 'pool-walking',
                                                    name: 'Pool / Aquatic Walking',
                                                    target: 'Low-Impact Cardio',
                                                    description: 'Walk in waist to chest-deep water. Water provides resistance while reducing joint stress.',
                                                    videoUrl: null,
                                                    imageEmoji: '🏊',
                                                    sets: '1',
                                                    reps: '15-30 minutes',
                                                    difficulty: 'Easy',
                                                    contraindications: ['Open wounds', 'Fear of water']
                                                },
                                                {
                                                    id: 'balance-single-leg',
                                                    name: 'Single Leg Balance',
                                                    target: 'Balance & Stability',
                                                    description: 'Stand on one leg, hold for 30 seconds. Progress by closing eyes or standing on uneven surface.',
                                                    videoUrl: 'https://www.youtube.com/embed/eniCmYvLNks',
                                                    imageEmoji: '🦩',
                                                    sets: '3',
                                                    reps: '30 sec each leg',
                                                    difficulty: 'Moderate',
                                                    contraindications: ['Severe balance issues (use support)']
                                                }
                                            ],

                                                // ============================================
                                                // HAND & WRIST EXERCISES
                                                // ============================================
                                                wrist: [
                                                    {
                                                        id: 'wrist-flexor-stretch',
                                                        name: 'Wrist Flexor Stretch',
                                                        target: 'Wrist & Forearm',
                                                        description: 'Extend arm forward, palm up. Gently pull fingers back with other hand. Hold 15-30s.',
                                                        videoUrl: 'https://www.youtube.com/embed/Ejl47X2-G2w',
                                                        imageEmoji: '✋',
                                                        sets: '2-3',
                                                        reps: '15-30 sec each side',
                                                        difficulty: 'Easy',
                                                        contraindications: ['Acute fracture']
                                                    },
                                                    {
                                                        id: 'wrist-extensor-stretch',
                                                        name: 'Wrist Extensor Stretch',
                                                        target: 'Wrist & Forearm',
                                                        description: 'Extend arm forward, palm down. Gently pull hand down and back. Great for tennis elbow.',
                                                        videoUrl: 'https://www.youtube.com/embed/Ejl47X2-G2w?start=35', // Linking to specific part
                                                        imageEmoji: '👋',
                                                        sets: '2-3',
                                                        reps: '15-30 sec each side',
                                                        difficulty: 'Easy',
                                                        contraindications: ['Acute fracture']
                                                    },
                                                    {
                                                        id: 'finger-tendon-glides',
                                                        name: 'Tendon Glides',
                                                        target: 'Hand & Fingers',
                                                        description: 'Transition hand through positions: straight, hook fist, full fist, table top, straight fist.',
                                                        videoUrl: 'https://www.youtube.com/embed/VlKeRWz4Z2c',
                                                        imageEmoji: '✊',
                                                        sets: '3',
                                                        reps: '10 cycles',
                                                        difficulty: 'Moderate',
                                                        contraindications: ['Recent surgery (consult surgeon)']
                                                    },
                                                    {
                                                        id: 'grip-strengthening',
                                                        name: 'Grip Strengthening',
                                                        target: 'Hand Grip',
                                                        description: 'Squeeze a stress ball or rolled towel. Hold for 5 seconds and release.',
                                                        videoUrl: 'https://www.youtube.com/embed/J1f3w5qwMFA',
                                                        imageEmoji: '🥎',
                                                        sets: '3',
                                                        reps: '10-15 squeezes',
                                                        difficulty: 'Easy',
                                                        contraindications: ['Acute inflammation']
                                                    }
                                                ]
};

/**
 * Get exercises for a specific body area
 * @param {string} area - Body area key (e.g., 'neck', 'lower-back')
 * @returns {Array} Array of exercise objects
 */
function getExercisesForArea(area) {
    return EXERCISE_LIBRARY[area] || EXERCISE_LIBRARY['multiple'];
}

/**
 * Get exercise by ID
 * @param {string} id - Exercise ID
 * @returns {Object|null} Exercise object or null
 */
function getExerciseById(id) {
    for (const area in EXERCISE_LIBRARY) {
        const exercise = EXERCISE_LIBRARY[area].find(ex => ex.id === id);
        if (exercise) return exercise;
    }
    return null;
}

/**
 * Get all exercises (flattened)
 * @returns {Array} All exercises
 */
function getAllExercises() {
    const all = [];
    for (const area in EXERCISE_LIBRARY) {
        all.push(...EXERCISE_LIBRARY[area]);
    }
    return all;
}

/**
 * Filter exercises by difficulty
 * @param {Array} exercises - Array of exercises
 * @param {string} difficulty - 'Easy', 'Moderate', or 'Advanced'
 * @returns {Array} Filtered exercises
 */
function filterByDifficulty(exercises, difficulty) {
    return exercises.filter(ex => ex.difficulty === difficulty);
}
