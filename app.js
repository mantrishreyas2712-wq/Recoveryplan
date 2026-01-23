/**
 * PhysioAssist - Professional Medical App Logic
 * 
 * Handles UI interactions, API orchestration, and Result Rendering.
 * Updated for 'Medical Premium' Design System & Thumbnail Video Player
 */

/* ================= UTILITIES ================= */
const getEl = (id) => document.getElementById(id);

const elements = {
    // Structural
    apiKeyModal: getEl('apiKeyModal'),
    formSection: getEl('formSection'),
    loadingSection: getEl('loadingSection'),
    resultsSection: getEl('resultsSection'),

    // Inputs
    patientForm: getEl('patientForm'),
    painLevel: getEl('painLevel'),
    painValue: getEl('painValue'),

    // Outputs
    patientNameDisplay: getEl('patientNameDisplay'),
    analysisContent: getEl('analysisContent'),
    exercisesGrid: getEl('exercisesGrid'),
    dietContent: getEl('dietContent'),
    consultationContent: getEl('consultationContent'),
    timelineContent: getEl('timelineContent'),

    // Actions
    printPlanBtn: getEl('printPlan'),
    newAssessmentBtn: getEl('newAssessment')
};

/* ================= INITIALIZATION ================= */
function initApp() {
    console.log("PhysioAssist Medical App Initializing...");

    // 1. Hide Legacy Modal (We use Config Key)
    if (elements.apiKeyModal) {
        elements.apiKeyModal.style.display = 'none';
    }

    // 2. Setup Form Listener
    if (elements.patientForm) {
        elements.patientForm.addEventListener('submit', handleFormSubmit);
    }

    // 3. Setup Pain Slider Interactions
    if (elements.painLevel) {
        elements.painLevel.addEventListener('input', (e) => {
            if (elements.painValue) elements.painValue.textContent = e.target.value;
            updateSliderColor(e.target);
        });
        updateSliderColor(elements.painLevel); // Init color
    }

    // 4. Setup Action Buttons
    if (elements.printPlanBtn) elements.printPlanBtn.addEventListener('click', () => window.print());
    if (elements.newAssessmentBtn) elements.newAssessmentBtn.addEventListener('click', () => location.reload());
}

// Helper: Visual feedback for pain slider
function updateSliderColor(slider) {
    const val = slider.value;
    let color = '#10B981'; // Green
    if (val > 4) color = '#F59E0B'; // Orange
    if (val > 7) color = '#EF4444'; // Red
    slider.style.background = `linear-gradient(to right, ${color} ${val * 10}%, #E2E8F0 ${val * 10}%)`;
}

/* ================= CORE LOGIC ================= */
async function handleFormSubmit(e) {
    if (e) e.preventDefault();

    // 1. Switch to Loading View
    elements.formSection.classList.add('hidden');
    elements.loadingSection.classList.remove('hidden');
    elements.resultsSection.classList.add('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        // 2. Gather Data
        const formData = new FormData(elements.patientForm);
        const patientData = Object.fromEntries(formData.entries());

        // 3. Generate Plan (Gemini Logic)
        const plan = await generateRecoveryPlan(patientData);

        // 4. Determine Source (AI vs Fallback)
        const isAI = plan.analysis.understanding.length > 50 && !plan.analysis.understanding.includes("The API is busy");

        // 5. Render Results
        renderPlan(plan, patientData.name, isAI);

        // 6. Show Results
        await new Promise(r => setTimeout(r, 800));
        elements.loadingSection.classList.add('hidden');
        elements.resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error("Plan Generation Failed:", error);
        alert("We encountered an error. Please try again or refresh the page.");
        location.reload();
    }
}

/* ================= RENDERING ================= */
function renderPlan(plan, name, isAI) {
    // Header Name
    if (elements.patientNameDisplay) elements.patientNameDisplay.textContent = name;

    // AI Badge Injection
    const badgeHTML = isAI
        ? `<span class="badge" style="background:#DCFCE7; color:#166534; margin-left:1rem;">⚡ AI Analysis</span>`
        : `<span class="badge" style="background:#FEF3C7; color:#B45309; margin-left:1rem;">⚠️ Offline Simulation</span>`;

    // Analysis
    const analysis = plan.analysis || {};
    elements.analysisContent.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            ${badgeHTML}
            <p style="font-size: 1.05rem; margin-top: 1rem; color: var(--text-main); line-height:1.7;">
                ${analysis.understanding || 'Analysis pending...'}
            </p>
        </div>
        <div class="form-grid" style="background: #F8FAFC; padding: 1.5rem; border-radius: 12px;">
            <div>
                <strong style="display:block; color:#64748B; font-size:0.8rem; text-transform:uppercase;">Likely Condition</strong>
                <span style="font-size:1.1rem; font-weight:600; color:var(--primary);">${analysis.likelyCauses || 'Under Review'}</span>
            </div>
            <div>
                <strong style="display:block; color:#64748B; font-size:0.8rem; text-transform:uppercase;">Severity</strong>
                <span style="font-size:1.1rem; font-weight:600; color:var(--accent);">${analysis.severity || 'Moderate'}</span>
            </div>
            <div style="grid-column: span 2;">
                <strong style="display:block; color:#64748B; font-size:0.8rem; text-transform:uppercase;">Prognosis</strong>
                <span style="color:var(--secondary);">${analysis.prognosis || 'Good'}</span>
            </div>
        </div>
    `;

    // Exercises (Thumbnail Video Player)
    elements.exercisesGrid.innerHTML = '';
    const exercises = plan.exercisePlan?.selectedExercises || [];

    exercises.forEach(ex => {
        // Extract Video ID
        let videoId = '';
        if (ex.videoUrl) {
            if (ex.videoUrl.includes('embed/')) videoId = ex.videoUrl.split('embed/')[1].split('?')[0];
            else if (ex.videoUrl.includes('v=')) videoId = ex.videoUrl.split('v=')[1].split('&')[0];
        }

        const card = document.createElement('div');
        card.className = 'exercise-card';
        card.innerHTML = `
            <div class="exercise-video" style="background-image: url('https://img.youtube.com/vi/${videoId}/hqdefault.jpg');">
                <a href="${ex.videoUrl || '#'}" target="_blank" class="play-overlay">
                    <div class="play-btn">▶</div>
                    <span class="watch-text">Watch on YouTube</span>
                </a>
            </div>
            <div class="exercise-details">
                <div class="exercise-header">
                    <h4>${ex.name}</h4>
                    <span class="badge">${ex.difficulty || 'Easy'}</span>
                </div>
                
                <div class="exercise-meta">
                    <div class="meta-item">
                        <span class="meta-label">Sets</span>
                        <span class="meta-val">${ex.customSets || ex.sets || '-'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Reps/Time</span>
                        <span class="meta-val">${ex.customReps || ex.reps || '-'}</span>
                    </div>
                </div>
                
                <div class="exercise-tip">
                    <strong>💡 Expert Tip:</strong> ${ex.description || ex.specialNotes || 'Focus on correct form.'}
                </div>
            </div>
        `;
        elements.exercisesGrid.appendChild(card);
    });

    // Diet
    const diet = plan.dietRecommendations || {};
    elements.dietContent.innerHTML = `
        <div class="info-list">
             <p><strong>🥗 Overview:</strong> ${diet.overview}</p>
             <p><strong>✅ Recommended Foods:</strong> ${(diet.keyFoods || []).join(', ')}</p>
             <p><strong>❌ Foods to Limit:</strong> ${(diet.foodsToAvoid || []).join(', ')}</p>
             <p><strong>💧 Hydration Goal:</strong> ${diet.hydration}</p>
        </div>
    `;

    // Consultation
    const consult = plan.consultation || {};
    elements.consultationContent.innerHTML = `
        <div class="info-list">
             <p><strong>🚨 Urgency Status:</strong> ${consult.urgency}</p>
             <p><strong>👨‍⚕️ Specialist:</strong> ${(consult.specialists || []).join(', ')}</p>
             <p><strong>📅 Follow Up:</strong> ${consult.followUp}</p>
             <p class="red-text"><strong>⚠️ Red Flags (Seek Help):</strong> ${(consult.redFlags || []).join(', ')}</p>
        </div>
    `;

    // Timeline
    const timeline = plan.recoveryTimeline || {};
    elements.timelineContent.innerHTML = `
        <div class="timeline-grid">
            <div class="timeline-item">
                <strong>Week 1</strong>
                <p style="margin:0; font-size:0.9rem;">${timeline.week1}</p>
            </div>
            <div class="timeline-item">
                <strong>Week 2-3</strong>
                <p style="margin:0; font-size:0.9rem;">${timeline.week2_3}</p>
            </div>
            <div class="timeline-item">
                <strong>Long Term</strong>
                <p style="margin:0; font-size:0.9rem;">${timeline.longTerm}</p>
            </div>
        </div>
    `;
}

// Start App
document.addEventListener('DOMContentLoaded', initApp);
