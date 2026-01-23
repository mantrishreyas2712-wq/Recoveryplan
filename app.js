document.getElementById('patientForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // 1. Gather Data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // 2. Show Loading
    document.getElementById('formSection').classList.add('hidden');
    const loadingSection = document.getElementById('loadingSection');
    loadingSection.classList.remove('hidden');

    // Dynamic Feedback
    const loadingText = loadingSection.querySelector('p');
    const loadingHeader = loadingSection.querySelector('h3');
    if (loadingText) loadingText.innerText = "Consulting Cloud AI Specialist...";
    if (loadingHeader) loadingHeader.innerText = "Designing Personal Protocol...";

    // 3. AI Generation
    try {
        const plan = await generateRecoveryPlan(data);
        renderResults(plan, data);
    } catch (error) {
        console.error("Plan Gen Error:", error);
        const backup = getFallbackPlan(data);
        renderResults(backup, data);
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

    // Generate Exercises (Hybrid Video Links)
    const exerciseCards = plan.exercisePlan.selectedExercises.map((ex, index) => {
        let vidId = ex.videoId || 'E_Wf8_7S4gQ';

        const thumbUrl = ex.thumbnailUrl || `https://img.youtube.com/vi/${vidId}/mqdefault.jpg`;
        const linkUrl = ex.videoUrl || `https://www.youtube.com/watch?v=${vidId}`;

        return `
        <div class="exercise-card">
            <a href="${linkUrl}" target="_blank" class="exercise-video-link">
                <div class="exercise-thumb" style="background-image: url('${thumbUrl}');">
                    <div class="play-overlay">
                        <div class="play-btn">▶</div>
                        <span>Watch Short 📱</span>
                    </div>
                </div>
            </a>
            <div class="exercise-details">
                <div class="exercise-header">
                    <h4>${index + 1}. ${ex.name}</h4>
                    <span class="badge">${ex.difficulty || 'Easy'}</span>
                </div>
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

    // Inject HTML - CHANGED ORDER HERE
    resultsSection.innerHTML = `
        <div class="results-header">
            <h2>Recovery Plan for ${userData.name}</h2>
            
            <!-- 1. AI SPECIALIST ANALYSIS (MOVED TO TOP) -->
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

        <div class="action-bar sticky-bottom">
            <button onclick="window.print()" class="btn btn-secondary">🖨️ Save PDF</button>
            <button onclick="location.reload()" class="btn btn-outline">🔄 Start Over</button>
        </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
