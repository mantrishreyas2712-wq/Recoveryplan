document.getElementById('patientForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Gather Data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // 1.5 Save to Google Sheets (async, non-blocking)
    saveToGoogleSheets(data);

    // 2. Show Loading & Start Animation
    document.getElementById('formSection').classList.add('hidden');
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.classList.remove('hidden');

    // Start "Flash Summary" Animation (CSS Graphic Version)
    let stepIndex = 0;
    const steps = [
        { text: "Scanning Symptoms...", html: '<div class="scanner-container"><div class="scanner-line"></div><div class="scanner-icon">🩺</div></div>' },
        { text: "Consulting Specialist AI...", html: '<div class="scanner-container"><div class="scanner-line" style="animation-duration: 1s;"></div><div class="scanner-icon">🤖</div></div>' },
        { text: "Building Diet Plan...", html: '<div class="scanner-container"><div class="scanner-line" style="background: linear-gradient(to bottom, transparent, #10B981);"></div><div class="scanner-icon">🥗</div></div>' },
        { text: "Optimizing Exercises...", html: '<div class="scanner-container"><div class="scanner-line" style="background: linear-gradient(to bottom, transparent, #F59E0B);"></div><div class="scanner-icon">🏃</div></div>' },
        { text: "Finalizing Protocol...", html: '<div class="anim-pulse" style="font-size: 3rem;"><span class="icon-check"></span></div>' }
    ];

    const loadingHeader = loadingSection.querySelector('h3');
    const loadingIconWrapper = loadingSection.querySelector('.pulse-icon');

    // Initial State
    if (loadingHeader) loadingHeader.innerText = steps[0].text;
    if (loadingIconWrapper) loadingIconWrapper.innerHTML = steps[0].html;

    // Cycle Animation
    const intervalId = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        if (loadingHeader) {
            loadingHeader.style.opacity = '0';
            if (loadingIconWrapper) loadingIconWrapper.style.transform = 'scale(0.95)';

            setTimeout(() => {
                loadingHeader.innerText = steps[stepIndex].text;
                if (loadingIconWrapper) {
                    loadingIconWrapper.innerHTML = steps[stepIndex].html;
                    loadingIconWrapper.style.transform = 'scale(1)';
                }
                loadingHeader.style.opacity = '1';
            }, 300);
        }
    }, 2500);

    // 3. AI Generation with Safety Timeout (30s Max for Detailed Analysis)
    const TIMEOUT_MS = 30000;
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("AI_TIMEOUT")), TIMEOUT_MS)
    );

    try {
        // Race: AI Generation vs 30s Timer
        // This prevents the "Stuck Loading" issue on mobile
        const plan = await Promise.race([
            generateRecoveryPlan(data),
            timeoutPromise
        ]);

        clearInterval(intervalId); // Stop animation
        renderResults(plan, data);
    } catch (error) {
        console.warn("AI Generation Failed:", error);
        clearInterval(intervalId);

        // STRICT MODE: No Fake/Offline Plans.
        // Show Error to User so they can Retry.
        if (loadingHeader) {
            loadingHeader.innerText = "Connection Failed. Please Retry.";
            loadingHeader.style.color = "#dc2626"; // Red
        }
        if (loadingIconWrapper) {
            loadingIconWrapper.innerHTML = '<div class="anim-pulse" style="font-size: 3rem;">⚠️</div>';
            loadingIconWrapper.style.animation = "none";
        }

        // Auto-hide loading after 6s (Safe Retry Time - Increased for Mobile Readability)
        setTimeout(() => {
            document.getElementById('loadingSection').classList.add('hidden');
            document.getElementById('formSection').classList.remove('hidden');

            // Reset UI styles for next try
            if (loadingHeader) loadingHeader.style.color = "";
            if (loadingIcon) loadingIcon.style.animation = "";
        }, 6000);
    });

// ==========================================
// SETTINGS UI REMOVED (Moved to Secure Backend)
// ==========================================

function renderResults(plan, userData) {
    const resultsSection = document.getElementById('resultsSection');
    const loadingSection = document.getElementById('loadingSection');

    // Hide Loading
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Generate Diet List
    const dietList = plan.dietRecommendations.keyFoods.map(food => `<li>${food}</li>`).join('');

    // Dr. Vanshika's WhatsApp - Direct number
    const DR_VANSHIKA_NUMBER = '919993521601';
    const expertMsg = encodeURIComponent(`Hi Dr. Vanshika, I just generated a PhysioAssist Recovery Plan for my ${userData.problemArea} problem. I'd like to book a consultation with you.\n\nPatient: ${userData.name}\nAge: ${userData.age}\nProblem: ${userData.problemStatement || userData.problemArea}`);
    const waLink = `https://wa.me/${DR_VANSHIKA_NUMBER}?text=${expertMsg}`;

    // Generate Exercises (Smart Hybrid Buttons + Affiliate Links)
    const exerciseCards = plan.exercisePlan.selectedExercises.map((ex, index) => {
        const linkUrl = ex.videoUrl;
        const thumbUrl = ex.thumbnailUrl;

        // Button Logic
        const isDirect = ex.type === 'direct';
        const btnIcon = isDirect ? '▶' : '🔎';
        const btnText = isDirect ? 'Watch Now' : 'Find Video';

        // Get pain level for conditional display
        const painLevel = parseInt(userData.painLevel) || 5;

        // Equipment recommendation - different for clinic vs home
        let equipBtn = '';

        if (ex.equipmentType === 'clinic') {
            // CLINIC EQUIPMENT - Book session with Dr. Vanshika
            const sessionMsg = encodeURIComponent(`Hi Dr. Vanshika, I'd like to book a ${ex.sessionName} for my ${userData.problemArea} problem. Can you help me schedule an appointment?`);
            const sessionLink = `https://wa.me/${DR_VANSHIKA_NUMBER}?text=${sessionMsg}`;

            equipBtn = `
            <div style="margin-top: 0.75rem; padding: 0.6rem; background: #EEF2FF; border-radius: 8px; border: 1px solid #C7D2FE;">
                <p style="font-size: 0.8rem; color: #4338CA; margin: 0 0 0.4rem 0;">🏥 This therapy works best with a <strong>${ex.equipmentName}</strong></p>
                <a href="${sessionLink}" target="_blank" style="display: inline-block; background: #4F46E5; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500;">
                    📅 Book ${ex.sessionName}
                </a>
                <p style="font-size: 0.7rem; color: #6B7280; margin: 0.4rem 0 0 0; font-style: italic;">Professional therapy for faster pain relief</p>
            </div>`;
        }
        else if (ex.equipmentType === 'home' && ex.equipmentUrl) {
            // HOME EQUIPMENT - Show Amazon link
            if (painLevel > 7) {
                // HIGH PAIN - Show BOTH book session + equipment
                const sessionMsg = encodeURIComponent(`Hi Dr. Vanshika, I have ${userData.problemArea} pain (${painLevel}/10). I'd like to book a professional session. Can you help?`);
                const sessionLink = `https://wa.me/${DR_VANSHIKA_NUMBER}?text=${sessionMsg}`;

                equipBtn = `
                <div style="margin-top: 0.75rem; padding: 0.6rem; background: #FEF3C7; border-radius: 8px; border: 1px solid #FCD34D;">
                    <p style="font-size: 0.8rem; color: #92400E; margin: 0 0 0.4rem 0;"><span class='icon-bulb'></span> This exercise works best with a <strong>${ex.equipmentName}</strong></p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <a href="${sessionLink}" target="_blank" style="display: inline-block; background: #D97706; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500;">
                            📅 Book Professional Session
                        </a>
                        <a href="${ex.equipmentUrl}" target="_blank" style="display: inline-block; background: #059669; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500;">
                            View ${ex.equipmentName} →
                        </a>
                    </div>
                    <p style="font-size: 0.7rem; color: #6B7280; margin: 0.4rem 0 0 0; font-style: italic;">At pain ${painLevel}/10, professional supervision recommended alongside home therapy</p>
                </div>`;
            } else {
                // NORMAL PAIN - Just show equipment link
                equipBtn = `
                <div style="margin-top: 0.75rem; padding: 0.6rem; background: #F0FDF4; border-radius: 8px; border: 1px solid #BBF7D0;">
                    <p style="font-size: 0.8rem; color: #166534; margin: 0 0 0.4rem 0;"><span class='icon-bulb'></span> This exercise works best with a <strong>${ex.equipmentName}</strong></p>
                    <a href="${ex.equipmentUrl}" target="_blank" style="display: inline-block; background: #059669; color: white; padding: 0.4rem 0.8rem; border-radius: 6px; text-decoration: none; font-size: 0.8rem; font-weight: 500;">
                        View ${ex.equipmentName} Options →
                    </a>
                    <p style="font-size: 0.7rem; color: #6B7280; margin: 0.4rem 0 0 0; font-style: italic;">Optional - only if you don't have one at home</p>
                </div>`;
            }
        }

        return `
        <div class="exercise-card">
            <a href="${linkUrl}" target="_blank" class="exercise-video-link">
                <div class="exercise-thumb" style="background-image: url('${thumbUrl}');">
                    <div class="play-overlay">
                        <div class="play-btn">${btnIcon}</div>
                        <span>${btnText}</span>
                    </div>
                </div>
            </a>
            <div class="exercise-details">
                <div class="exercise-header">
                    <h4>${index + 1}. ${ex.name}</h4>
                    <span class="badge">${ex.difficulty || 'Easy'}</span>
                </div>
                <!-- Affiliate Button -->
                ${equipBtn}

                <div class="exercise-meta">
                    <div class="meta-item">
                        <span class="meta-label">SETS</span>
                        <span class="meta-val">${ex.sets || ex.customSets || '3'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">REPS</span>
                        <span class="meta-val">${ex.reps || ex.customReps || '10'}</span>
                    </div>
                </div>
                <p class="exercise-tip">${ex.description || 'Perform slowly with control.'}</p>
            </div>
        </div>
        `;
    }).join('');

    // Dr. Vanshika WhatsApp link - Direct number
    const drVanshikaMsg = encodeURIComponent(`Hi Dr. Vanshika, I just generated a PhysioAssist Recovery Plan for my ${userData.problemArea} problem. I'd like to book a consultation with you.\n\nPatient: ${userData.name}\nAge: ${userData.age}\nCondition: ${userData.problemStatement || userData.problemArea}`);
    const drVanshikaLink = `https://wa.me/${DR_VANSHIKA_NUMBER}?text=${drVanshikaMsg}`;

    // Inject HTML
    resultsSection.innerHTML = `
        <div class="results-header">
            <h2>Recovery Plan for ${userData.name}</h2>
            
            <!-- 1. PERSONALIZED ANALYSIS + DR VANSHIKA CTA -->
            <div class="ai-insight anim-entry" style="background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%); padding:1.5rem; border-radius:12px; margin-bottom:1.5rem; border:1px solid #7DD3FC;">
                <strong style="color:#0284C7; display:block; margin-bottom:0.5rem; font-size: 1.1rem;"><span class="icon-bulb"></span> Your Personalized Assessment</strong>
                <p style="font-size:1.05rem; line-height:1.8; color:#0C4A6E; white-space: pre-line;">${plan.analysis.understanding}</p>
                
                <!-- PROMINENT DR VANSHIKA CTA -->
                <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #059669 0%, #10B981 100%); border-radius: 10px; text-align: center;">
                    <a href="${drVanshikaLink}" target="_blank" style="display: inline-block; color: white; text-decoration: none; font-weight: 600; font-size: 1.1rem;">
                        👩‍⚕️ Book Dr. Vanshika Now - Get Expert Guidance
                    </a>
                    <p style="color: rgba(255,255,255,0.9); margin: 0.5rem 0 0 0; font-size: 0.85rem;">Certified Physiotherapist • 40-60% Faster Recovery • Personalized Care</p>
                </div>
            </div>

            <!-- 2. LIKELY CAUSES (Separate Section) -->
            <div class="anim-entry" style="background: #FEF3C7; border: 1px solid #FCD34D; padding: 1rem; border-radius: 10px; margin-bottom: 0.75rem; animation-delay: 0.1s;">
                <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
                    <span style="font-size: 1.5rem;"><span class="icon-search"></span></span>
                    <div>
                        <strong style="color: #92400E; font-size: 1rem;">What's Causing This?</strong>
                        <p style="white-space: pre-line; color: #78350F; margin-top: 0.5rem; line-height: 1.6;">${plan.analysis.likelyCauses}</p>
                    </div>
                </div>
            </div>

            <!-- 3. PROGNOSIS / RECOVERY OUTLOOK (Separate Section) -->
            <div class="anim-entry" style="background: #ECFDF5; border: 1px solid #6EE7B7; padding: 1rem; border-radius: 10px; margin-bottom: 0.75rem; animation-delay: 0.2s;">
                <div style="display: flex; align-items: flex-start; gap: 0.8rem;">
                    <span style="font-size: 1.5rem;"><span class="icon-graph"></span></span>
                    <div>
                        <strong style="color: #065F46; font-size: 1rem;">Your Recovery Outlook</strong>
                        <p style="white-space: pre-line; color: #047857; margin-top: 0.5rem; line-height: 1.6;">${plan.analysis.prognosis}</p>
                    </div>
                </div>
            </div>

            <!-- 3. RED FLAGS WARNING -->
            ${plan.consultation.redFlags ? `
            <div class="glass-card-pro" style="background: rgba(254, 242, 242, 0.85); border: 1px solid #FECACA; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <strong style="color: #DC2626; display: flex; align-items: center; gap: 6px;"><span class="icon-warning"></span> Warning Signs - Seek Immediate Care If:</strong>
                <ul style="margin: 0.5rem 0 0 1.5rem; color: #991B1B;">
                    ${plan.consultation.redFlags.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>

        <div class="plan-grid">
            <!-- Exercises Column -->
            <div class="plan-column">
                <h3 class="section-title">📋 Your Exercise Program</h3>
                <p style="color: #666; margin-bottom: 1rem; font-size: 0.95rem;">${plan.exercisePlan.overview || ''}</p>
                <div class="exercises-list">
                    ${exerciseCards}
                </div>
                
                ${parseInt(userData.painLevel) >= 7 ? (() => {
            // Area-specific therapy recommendations
            const areaTherapies = {
                'neck': [
                    { icon: '🔄', name: 'Cervical Traction', desc: 'Spine decompression for nerve relief' },
                    { icon: '⚡', name: 'TENS Therapy', desc: 'Electrical stimulation for pain relief' }
                ],
                'back': [
                    { icon: '💫', name: 'IFT Therapy', desc: 'Deep muscle relaxation and pain relief' },
                    { icon: '🔄', name: 'Lumbar Traction', desc: 'Spine decompression for disc issues' }
                ],
                'knee': [
                    { icon: '🔊', name: 'Ultrasound Therapy', desc: 'Deep tissue healing for joint pain' },
                    { icon: '✨', name: 'Laser Therapy', desc: 'Reduces inflammation and promotes healing' }
                ],
                'shoulder': [
                    { icon: '🔊', name: 'Ultrasound Therapy', desc: 'Rotator cuff and tendon healing' },
                    { icon: '🌊', name: 'Shockwave Therapy', desc: 'Breaks down scar tissue and calcification' }
                ],
                'wrist': [
                    { icon: '⚡', name: 'TENS Therapy', desc: 'Nerve pain relief for carpal tunnel' },
                    { icon: '🔊', name: 'Ultrasound Therapy', desc: 'Tendon inflammation reduction' }
                ],
                'ankle': [
                    { icon: '🔊', name: 'Ultrasound Therapy', desc: 'Ligament and tendon healing' },
                    { icon: '⚡', name: 'TENS Therapy', desc: 'Pain management and swelling reduction' }
                ]
            };

            const therapies = areaTherapies[userData.problemArea] || areaTherapies['back'];

            return `
                    <!-- PROFESSIONAL THERAPY RECOMMENDATIONS (Pain >= 7) -->
                    <div style="margin-top: 1.5rem; padding: 1rem; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 12px; border: 1px solid #A5B4FC;">
                        <h4 style="color: #4338CA; margin: 0 0 0.75rem 0; font-size: 1rem;">🏥 Recommended for ${userData.problemArea.charAt(0).toUpperCase() + userData.problemArea.slice(1)} Pain</h4>
                        <p style="color: #6366F1; font-size: 0.85rem; margin-bottom: 0.75rem;">At pain level ${userData.painLevel}/10, these therapies can accelerate your recovery:</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${therapies.map(t => `
                            <a href="https://wa.me/${DR_VANSHIKA_NUMBER}?text=${encodeURIComponent(`Hi Dr. Vanshika, I have ${userData.problemArea} pain (${userData.painLevel}/10). I'd like to book a ${t.name} session. Can you help?`)}" target="_blank" style="display: flex; align-items: center; gap: 0.5rem; background: white; padding: 0.6rem; border-radius: 8px; text-decoration: none; border: 1px solid #C7D2FE;">
                                <span style="font-size: 1.2rem;">${t.icon}</span>
                                <div>
                                    <strong style="color: #4338CA; font-size: 0.85rem;">${t.name}</strong>
                                    <p style="color: #6B7280; font-size: 0.75rem; margin: 0;">${t.desc}</p>
                                </div>
                            </a>
                            `).join('')}
                        </div>
                        
                        <p style="color: #6B7280; font-size: 0.75rem; margin: 0.75rem 0 0 0; font-style: italic; text-align: center;">Professional therapy + home exercises = fastest recovery</p>
                    </div>
                    `;
        })() : ''}
            </div>

            <!-- Guidelines Column -->
            <div class="plan-column">
                <!-- WORK ADVICE (NEW) -->
                ${plan.workAdvice ? `
                <div class="guideline-card anim-entry" style="background: #FFF7ED; border: 1px solid #FDBA74; padding: 1rem; margin-bottom: 0.75rem; animation-delay: 0.3s;">
                    <h3><span class="icon-bag"></span> Work & Activity Advice</h3>
                    <p style="font-weight: 500; color: #C2410C;">${plan.workAdvice.leaveRecommendation || ''}</p>
                    
                    ${plan.workAdvice.restrictions && plan.workAdvice.restrictions.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <strong style="color: #EA580C;"><span class='icon-ban'></span> Restrictions During Recovery:</strong>
                        <ul style="margin: 0.5rem 0 0 1.2rem; color: #9A3412;">
                            ${plan.workAdvice.restrictions.map(r => `<li style="margin-bottom: 0.3rem;">${r}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${plan.workAdvice.modifications && plan.workAdvice.modifications.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <strong style="color: #16A34A;"><span class="icon-check"></span> Workplace Modifications:</strong>
                        <ul style="margin: 0.5rem 0 0 1.2rem; color: #166534;">
                            ${plan.workAdvice.modifications.map(m => `<li style="margin-bottom: 0.3rem;">${m}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : ''}

                <!-- DIET SECTION (ENHANCED) -->
                <div class="guideline-card">
                    <h3>🥗 Personalized Diet Plan</h3>
                    
                    ${plan.dietRecommendations.bmi ? `
                    <!-- BMI INDICATOR -->
                    <div style="background: linear-gradient(135deg, ${plan.dietRecommendations.bmi.color}15, ${plan.dietRecommendations.bmi.color}05); border: 2px solid ${plan.dietRecommendations.bmi.color}; border-radius: 12px; padding: 1rem; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: ${plan.dietRecommendations.bmi.color}; font-size: 1.1rem;">📊 Your BMI: ${plan.dietRecommendations.bmi.bmi}</strong>
                                <span style="background: ${plan.dietRecommendations.bmi.color}; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.8rem; margin-left: 0.5rem;">${plan.dietRecommendations.bmi.category}</span>
                            </div>
                        </div>
                        ${plan.dietRecommendations.bmi.warning ? `<p style="color: ${plan.dietRecommendations.bmi.color}; margin: 0.5rem 0 0 0; font-size: 0.9rem;">${plan.dietRecommendations.bmi.warning}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    ${plan.dietRecommendations.personalizedMacros ? `
                    <!-- PERSONALIZED NUTRITION TARGETS -->
                    <div style="background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border: 1px solid #86EFAC; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                        <p style="white-space: pre-line; color: #166534; margin: 0; line-height: 1.8;">${plan.dietRecommendations.personalizedMacros}</p>
                    </div>
                    ` : ''}
                    
                    <p class="guideline-intro" style="white-space: pre-line;">${plan.dietRecommendations.overview}</p>
                    
                    ${plan.dietRecommendations.proteinGuidance ? `
                    <div style="background: #ECFDF5; padding: 0.75rem; border-radius: 8px; margin: 1rem 0;">
                        <strong style="color: #059669;">💪 Protein for Recovery:</strong>
                        <p style="color: #047857; margin-top: 0.3rem;">${plan.dietRecommendations.proteinGuidance}</p>
                    </div>
                    ` : ''}
                    
                    <strong>Recommended Foods:</strong>
                    <ul class="food-list">
                        ${dietList}
                    </ul>
                    
                    ${plan.dietRecommendations.foodsToAvoid && plan.dietRecommendations.foodsToAvoid.length > 0 ? `
                    <div class="anim-entry" style="margin-top: 1rem; padding: 0.75rem; background: #FEF2F2; border-radius: 8px; animation-delay: 0.4s;">
                        <strong style="color: #DC2626;"><span class="icon-ban"></span> Foods to Avoid:</strong>
                        <ul style="margin: 0.3rem 0 0 1.2rem; color: #991B1B;">
                            ${plan.dietRecommendations.foodsToAvoid.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    <div class="hydration-box glass-card-pro" style="background: rgba(239, 246, 255, 0.8);">
                        <span class="icon-water"></span> 
                        <strong>Hydration:</strong> ${plan.dietRecommendations.hydration}
                    </div>
                    
                    ${plan.dietRecommendations.supplements ? `
                    <p style="margin-top: 1rem; color: #6B7280; font-size: 0.9rem;">
                        <strong>💊 Supplements:</strong> ${plan.dietRecommendations.supplements}
                    </p>
                    ` : ''}
                    
                    ${plan.dietRecommendations.conditionNotes && plan.dietRecommendations.conditionNotes.length > 0 ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px;">
                        <strong style="color: #92400E;">⚠️ Diet Notes for Your Medical Conditions:</strong>
                        <ul style="margin: 0.3rem 0 0 1.2rem; color: #78350F;">
                            ${plan.dietRecommendations.conditionNotes.map(n => `<li style="margin-bottom: 0.3rem;">${n}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${plan.dietRecommendations.mealPlan ? `
                    <!-- DETAILED MEAL PLAN -->
                    <div style="margin-top: 1.5rem; border-top: 2px solid #E5E7EB; padding-top: 1.5rem;">
                        <h4 style="color: #059669; margin: 0 0 1rem 0; display: flex; align-items: center; gap: 0.5rem;">
                            🍽️ Your Daily Meal Chart
                            <span style="font-size: 0.75rem; background: #D1FAE5; color: #065F46; padding: 0.2rem 0.5rem; border-radius: 4px;">${plan.dietRecommendations.mealPlan.weightNote ? 'Weight-aware' : ''}</span>
                        </h4>
                        
                        <!-- BREAKFAST -->
                        <div class="glass-card-pro" style="background: rgba(254, 243, 199, 0.6); border: 1px solid rgba(253, 230, 138, 0.8); padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="color: #92400E; display: flex; align-items: center; gap: 8px;"><span class="icon-sun"></span> Breakfast</strong>
                                <span style="font-size: 0.75rem; color: #78350F;">${plan.dietRecommendations.mealPlan.timing.breakfast}</span>
                            </div>
                            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                                <tr style="background: #FDE68A;">
                                    <th style="text-align: left; padding: 0.4rem;">Food</th>
                                    <th style="text-align: center; padding: 0.4rem;">Qty</th>
                                    <th style="text-align: center; padding: 0.4rem;">P</th>
                                    <th style="text-align: center; padding: 0.4rem;">C</th>
                                    <th style="text-align: center; padding: 0.4rem;">F</th>
                                </tr>
                                ${plan.dietRecommendations.mealPlan.breakfast.items.map(item => `
                                <tr style="border-bottom: 1px solid #FCD34D;">
                                    <td style="padding: 0.4rem;">${item.item}</td>
                                    <td style="text-align: center; padding: 0.4rem; font-weight: 600;">${item.quantity}</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.fats}g</td>
                                </tr>
                                `).join('')}
                                <tr style="background: #FDE68A; font-weight: 600;">
                                    <td style="padding: 0.4rem;">Total</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.breakfast.totals.cal} cal</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.breakfast.totals.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.breakfast.totals.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.breakfast.totals.fats}g</td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- LUNCH -->
                        <div class="glass-card-pro" style="background: rgba(219, 234, 254, 0.7); border: 1px solid rgba(191, 219, 254, 0.8); padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="color: #1E40AF; display: flex; align-items: center; gap: 8px;"><div class="icon-sun" style="transform: scale(0.9); opacity: 0.8;"></div> Lunch</strong>
                                <span style="font-size: 0.75rem; color: #1E3A8A;">${plan.dietRecommendations.mealPlan.timing.lunch}</span>
                            </div>
                            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                                <tr style="background: #93C5FD;">
                                    <th style="text-align: left; padding: 0.4rem;">Food</th>
                                    <th style="text-align: center; padding: 0.4rem;">Qty</th>
                                    <th style="text-align: center; padding: 0.4rem;">P</th>
                                    <th style="text-align: center; padding: 0.4rem;">C</th>
                                    <th style="text-align: center; padding: 0.4rem;">F</th>
                                </tr>
                                ${plan.dietRecommendations.mealPlan.lunch.items.map(item => `
                                <tr style="border-bottom: 1px solid #93C5FD;">
                                    <td style="padding: 0.4rem;">${item.item}</td>
                                    <td style="text-align: center; padding: 0.4rem; font-weight: 600;">${item.quantity}</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.fats}g</td>
                                </tr>
                                `).join('')}
                                <tr style="background: #93C5FD; font-weight: 600;">
                                    <td style="padding: 0.4rem;">Total</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.lunch.totals.cal} cal</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.lunch.totals.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.lunch.totals.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.lunch.totals.fats}g</td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- DINNER -->
                        <div class="glass-card-pro" style="background: rgba(224, 231, 255, 0.7); border: 1px solid rgba(199, 210, 254, 0.8); padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="color: #4338CA; display: flex; align-items: center; gap: 8px;"><span class="icon-moon"></span> Dinner</strong>
                                <span style="font-size: 0.75rem; color: #3730A3;">${plan.dietRecommendations.mealPlan.timing.dinner}</span>
                            </div>
                            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                                <tr style="background: #A5B4FC;">
                                    <th style="text-align: left; padding: 0.4rem;">Food</th>
                                    <th style="text-align: center; padding: 0.4rem;">Qty</th>
                                    <th style="text-align: center; padding: 0.4rem;">P</th>
                                    <th style="text-align: center; padding: 0.4rem;">C</th>
                                    <th style="text-align: center; padding: 0.4rem;">F</th>
                                </tr>
                                ${plan.dietRecommendations.mealPlan.dinner.items.map(item => `
                                <tr style="border-bottom: 1px solid #A5B4FC;">
                                    <td style="padding: 0.4rem;">${item.item}</td>
                                    <td style="text-align: center; padding: 0.4rem; font-weight: 600;">${item.quantity}</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.fats}g</td>
                                </tr>
                                `).join('')}
                                <tr style="background: #A5B4FC; font-weight: 600;">
                                    <td style="padding: 0.4rem;">Total</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.dinner.totals.cal} cal</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.dinner.totals.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.dinner.totals.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.dinner.totals.fats}g</td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- SNACKS -->
                        <div style="background: #D1FAE5; border-radius: 10px; padding: 1rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                <strong style="color: #065F46;">🥜 Snacks</strong>
                                <span style="font-size: 0.75rem; color: #047857;">${plan.dietRecommendations.mealPlan.timing.midMorningSnack} / ${plan.dietRecommendations.mealPlan.timing.eveningSnack}</span>
                            </div>
                            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                                <tr style="background: #6EE7B7;">
                                    <th style="text-align: left; padding: 0.4rem;">Food</th>
                                    <th style="text-align: center; padding: 0.4rem;">Qty</th>
                                    <th style="text-align: center; padding: 0.4rem;">P</th>
                                    <th style="text-align: center; padding: 0.4rem;">C</th>
                                    <th style="text-align: center; padding: 0.4rem;">F</th>
                                </tr>
                                ${plan.dietRecommendations.mealPlan.snacks.items.map(item => `
                                <tr style="border-bottom: 1px solid #6EE7B7;">
                                    <td style="padding: 0.4rem;">${item.item}</td>
                                    <td style="text-align: center; padding: 0.4rem; font-weight: 600;">${item.quantity}</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${item.fats}g</td>
                                </tr>
                                `).join('')}
                                <tr style="background: #6EE7B7; font-weight: 600;">
                                    <td style="padding: 0.4rem;">Total</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.snacks.totals.cal} cal</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.snacks.totals.protein}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.snacks.totals.carbs}g</td>
                                    <td style="text-align: center; padding: 0.4rem;">${plan.dietRecommendations.mealPlan.snacks.totals.fats}g</td>
                                </tr>
                            </table>
                        </div>
                        
                        <!-- DAILY TOTALS -->
                        <div style="background: linear-gradient(135deg, #059669, #10B981); border-radius: 10px; padding: 1rem; color: white;">
                            <strong>📊 Daily Totals:</strong>
                            <div style="display: flex; justify-content: space-around; margin-top: 0.5rem; text-align: center;">
                                <div><div style="font-size: 1.2rem; font-weight: 700;">${plan.dietRecommendations.mealPlan.dailyTotals.cal}</div><div style="font-size: 0.7rem; opacity: 0.9;">Calories</div></div>
                                <div><div style="font-size: 1.2rem; font-weight: 700;">${plan.dietRecommendations.mealPlan.dailyTotals.protein}g</div><div style="font-size: 0.7rem; opacity: 0.9;">Protein</div></div>
                                <div><div style="font-size: 1.2rem; font-weight: 700;">${plan.dietRecommendations.mealPlan.dailyTotals.carbs}g</div><div style="font-size: 0.7rem; opacity: 0.9;">Carbs</div></div>
                                <div><div style="font-size: 1.2rem; font-weight: 700;">${plan.dietRecommendations.mealPlan.dailyTotals.fats}g</div><div style="font-size: 0.7rem; opacity: 0.9;">Fats</div></div>
                                <div><div style="font-size: 1.2rem; font-weight: 700;">${plan.dietRecommendations.mealPlan.waterIntake}L</div><div style="font-size: 0.7rem; opacity: 0.9;">Water</div></div>
                            </div>
                            <p style="margin: 0.75rem 0 0 0; font-size: 0.8rem; opacity: 0.9; text-align: center;">${plan.dietRecommendations.mealPlan.weightNote}</p>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- TIMELINE SECTION (ENHANCED) -->
                <div class="guideline-card">
                   <h3>📅 Your Recovery Timeline</h3>
                   <div class="timeline">
                       <div class="time-marker" style="background: #DBEAFE; padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem;">
                           <strong style="color: #1D4ED8;">Week 1:</strong>
                           <p style="margin-top: 0.3rem; color: #1E40AF; white-space: pre-line;">${plan.recoveryTimeline.week1}</p>
                       </div>
                       <div class="time-marker" style="background: #D1FAE5; padding: 1rem; border-radius: 8px; margin-bottom: 0.75rem;">
                           <strong style="color: #059669;">Week 2-3:</strong>
                           <p style="margin-top: 0.3rem; color: #047857; white-space: pre-line;">${plan.recoveryTimeline.week2_3}</p>
                       </div>
                       <div class="time-marker" style="background: #FEF3C7; padding: 1rem; border-radius: 8px;">
                           <strong style="color: #D97706;">Long-term:</strong>
                           <p style="margin-top: 0.3rem; color: #B45309; white-space: pre-line;">${plan.recoveryTimeline.longTerm}</p>
                       </div>
                   </div>
                </div>
                
                <!-- CONSULTATION -->
                <div class="guideline-card" style="background: #F0FDF4; border: 1px solid #86EFAC;">
                    <h3>👨‍⚕️ Professional Consultation</h3>
                    <p style="color: #166534;">${plan.consultation.urgency}</p>
                    <p style="margin-top: 0.5rem; color: #15803D;">
                        <strong>Recommended Specialists:</strong> ${plan.consultation.specialists.join(', ')}
                    </p>
                </div>
            </div>
        </div>

        <!-- STICKY BUSINESS BAR (Consultation & Sharing) -->
        <div class="action-bar sticky-bottom business-bar">
            <a href="${waLink}" target="_blank" class="btn btn-whatsapp">💬 Book Expert</a>
            <div class="secondary-actions">
                <button onclick="window.print()" class="btn-icon" title="Print Plan">🖨️</button>
                <button onclick="location.reload()" class="btn-icon" title="New Patient">🔄</button>
            </div>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================================================
// GOOGLE SHEETS DATA COLLECTION
// =============================================================================
// Sends patient data to Google Sheets (non-blocking, fails silently)
async function saveToGoogleSheets(data) {
    // Check if webhook URL is configured
    if (!CONFIG.SHEETS_WEBHOOK_URL || CONFIG.SHEETS_WEBHOOK_URL === "") {
        console.log("[Sheets] Webhook URL not configured. Skipping data save.");
        return;
    }

    try {
        // Send data to Google Apps Script webhook
        const response = await fetch(CONFIG.SHEETS_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Required for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: data.name || '',
                mobile: data.mobile || '',
                age: data.age || '',
                gender: data.gender || '',
                weight: data.weight || '',
                height: data.height || '',
                occupation: data.occupation || '',
                dietPreference: data.dietPreference || '',
                condition_diabetes: data.condition_diabetes ? 'Yes' : 'No',
                condition_bp: data.condition_bp ? 'Yes' : 'No',
                condition_heart: data.condition_heart ? 'Yes' : 'No',
                recentSurgery: data.recentSurgery || 'none',
                problemArea: data.problemArea || '',
                problemStatement: data.problemStatement || '',
                painLevel: data.painLevel || ''
            })
        });

        console.log("[Sheets] Patient data sent successfully");
    } catch (error) {
        // Fail silently - don't block user experience
        console.warn("[Sheets] Failed to save data:", error);
    }
}
