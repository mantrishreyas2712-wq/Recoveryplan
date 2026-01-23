document.getElementById('patientForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Gather Data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // 2. Show Loading & Start Animation
    document.getElementById('formSection').classList.add('hidden');
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.classList.remove('hidden');

    // Start "Flash Summary" Animation
    let stepIndex = 0;
    const steps = [
        { text: "Analyzing Symptoms...", icon: "🩺" },
        { text: "Consulting Specialist AI...", icon: "🤖" },
        { text: "Building Diet Plan...", icon: "🥗" },
        { text: "Selecting Best Exercises...", icon: "🏃" },
        { text: "Finalizing Protocol...", icon: "✅" }
    ];

    const loadingHeader = loadingSection.querySelector('h3');
    const loadingIcon = loadingSection.querySelector('.pulse-icon');

    // Initial State
    if (loadingHeader) loadingHeader.innerText = steps[0].text;
    if (loadingIcon) loadingIcon.innerText = steps[0].icon;

    // Cycle Animation
    const intervalId = setInterval(() => {
        stepIndex = (stepIndex + 1) % steps.length;
        if (loadingHeader) {
            loadingHeader.style.opacity = '0'; // Fade out
            if (loadingIcon) loadingIcon.style.transform = 'scale(0.5)';

            setTimeout(() => {
                loadingHeader.innerText = steps[stepIndex].text;
                if (loadingIcon) {
                    loadingIcon.innerText = steps[stepIndex].icon;
                    loadingIcon.style.transform = 'scale(1)';
                }
                loadingHeader.style.opacity = '1'; // Fade in
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
        if (loadingIcon) {
            loadingIcon.innerText = "⚠️";
            loadingIcon.style.animation = "none";
        }

        // Auto-hide loading after 6s (Safe Retry Time - Increased for Mobile Readability)
        setTimeout(() => {
            document.getElementById('loadingSection').classList.add('hidden');
            document.getElementById('formSection').classList.remove('hidden');

            // Reset UI styles for next try
            if (loadingHeader) loadingHeader.style.color = "";
            if (loadingIcon) loadingIcon.style.animation = "";
        }, 6000);
    }
});

function renderResults(plan, userData) {
    const resultsSection = document.getElementById('resultsSection');
    const loadingSection = document.getElementById('loadingSection');

    // Hide Loading
    loadingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');

    // Generate Diet List
    const dietList = plan.dietRecommendations.keyFoods.map(food => `<li>${food}</li>`).join('');

    // Generate WhatsApp Business Message
    const expertMsg = encodeURIComponent(`Hi, I just generated a PhysioAssist Plan for ${userData.problemArea}. I'd like to book a professional consultation to review it.`);
    // Optimized Shortlink for faster redirection
    const waLink = `https://wa.me/?text=${expertMsg}`;

    // Generate Exercises (Smart Hybrid Buttons + Affiliate Links)
    const exerciseCards = plan.exercisePlan.selectedExercises.map((ex, index) => {
        const linkUrl = ex.videoUrl;
        const thumbUrl = ex.thumbnailUrl;

        // Button Logic
        const isDirect = ex.type === 'direct';
        const btnIcon = isDirect ? '▶' : '🔎';
        const btnText = isDirect ? 'Watch Now' : 'Find Video';

        // Affiliate Button Logic
        let equipBtn = '';
        if (ex.equipmentUrl) {
            equipBtn = `<a href="${ex.equipmentUrl}" target="_blank" class="btn-micro-shop">🛒 Buy ${ex.equipmentName}</a>`;
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

    // Inject HTML
    resultsSection.innerHTML = `
        <div class="results-header">
            <h2>Recovery Plan for ${userData.name}</h2>
            
            <!-- 1. AI SPECIALIST ANALYSIS -->
            <div class="ai-insight" style="background:#F0F9FF; padding:1.5rem; border-radius:12px; margin-bottom:1.5rem; border:1px solid #BAE6FD;">
                <strong style="color:#0284C7; display:block; margin-bottom:0.5rem;">💡 Specialist Analysis</strong>
                <p style="font-size:1.05rem; line-height:1.6; color:#0C4A6E;">"${plan.analysis.understanding}"</p>
            </div>

            <!-- 2. CONDITION BADGE -->
            <div class="condition-badge" style="margin-top:0;">
                <span class="icon">🩺</span>
                <div>
                    <strong>Target Condition</strong>
                    <p>${plan.analysis.likelyCauses}</p>
                </div>
            </div>
        </div>

        <div class="plan-grid">
            <!-- exercises -->
            <div class="plan-column">
                <h3 class="section-title">Daily Exercises</h3>
                <div class="exercises-list">
                    ${exerciseCards}
                </div>
            </div>

            <!-- Guidelines -->
            <div class="plan-column">
                <div class="guideline-card">
                    <h3>🥗 Recovery Diet</h3>
                    <p class="guideline-intro">${plan.dietRecommendations.overview}</p>
                    <ul class="food-list">
                        ${dietList}
                    </ul>
                    <div class="hydration-box">
                        <span class="drop">💧</span> 
                        <strong>Hydration Goal:</strong> ${plan.dietRecommendations.hydration}
                    </div>
                </div>

                <div class="guideline-card">
                   <h3>📅 Timeline</h3>
                   <div class="timeline">
                       <div class="time-marker">
                           <strong>Week 1:</strong> ${plan.recoveryTimeline.week1}
                       </div>
                       <div class="time-marker">
                           <strong>Week 2-3:</strong> ${plan.recoveryTimeline.week2_3}
                       </div>
                   </div>
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
