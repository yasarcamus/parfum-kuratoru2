import { state, saveStats } from './data.js';
import { showPage } from './router.js';
import { createPerfumeCard } from './ui.js';
import { t, getCurrentLanguage } from './i18n.js';

// Enhanced Quiz with 7 questions and weighted scoring

// Tag weights for more accurate matching
const TAG_WEIGHTS = {
    koku_turu: 3,    // Scent type is most important
    mevsim: 2,       // Season is important
    kullanim: 2,     // Usage is important
    cinsiyet: 1,     // Gender is less restrictive
    intensity: 1,    // Preferred intensity
    character: 1     // Character traits
};

// Store inventory - perfumes available in physical store
// When accessed via QR code (?store=true), only these will be recommended
// Each item has: storeName (custom name), reference (original perfume), gender
const STORE_INVENTORY = [
    { storeName: "TORINO", reference: "Xerjoff Torino 21", gender: "unisex", dbName: "Xerjoff Torino 21" },
    { storeName: "SPORT", reference: "Dior Homme Sport", gender: "erkek", dbName: "Dior Homme Sport" },
    { storeName: "CELESTIA", reference: "Maison Francis Kurkdjian Aqua Celestia", gender: "unisex", dbName: "Aqua Celestia" },
    { storeName: "BLUEBELL", reference: "Jo Malone Wild Bluebell", gender: "kadın", dbName: "Jo Malone Wild Bluebell" },
    { storeName: "SAVAGE", reference: "Dior Sauvage", gender: "erkek", dbName: "Dior Sauvage" },
    { storeName: "EROS", reference: "Versace Eros", gender: "erkek", dbName: "Versace Eros" },
    { storeName: "STRONGER", reference: "Emporio Armani Stronger With You", gender: "erkek", dbName: "Stronger With You" },
    { storeName: "KIRKE", reference: "Tiziana Terenzi Kirke", gender: "unisex", dbName: "Kirke" },
    { storeName: "AVENTUS", reference: "Creed Aventus", gender: "erkek", dbName: "Creed Aventus" },
    { storeName: "ROUGE", reference: "Maison Francis Kurkdjian Baccarat Rouge 540", gender: "unisex", dbName: "Baccarat Rouge 540" },
    { storeName: "CHERRY", reference: "Tom Ford Lost Cherry", gender: "unisex", dbName: "Lost Cherry" },
    { storeName: "LIBRE", reference: "Yves Saint Laurent Libre", gender: "kadın", dbName: "Libre" },
    { storeName: "BOMBSHELL", reference: "Victoria's Secret Bombshell", gender: "kadın", dbName: "Victoria's Secret Bombshell" },
    { storeName: "EILISH", reference: "Billie Eilish Eilish", gender: "kadın", dbName: "Eilish" }
];

// Get store item by database name
const getStoreItem = (dbName) => {
    return STORE_INVENTORY.find(item =>
        item.dbName === dbName ||
        dbName.includes(item.dbName) ||
        item.dbName.includes(dbName)
    );
};

// Check if we're in store mode (QR code access)
const isStoreMode = () => {
    return new URLSearchParams(window.location.search).has('store');
};

// Quiz questions with weighted tags
const getQuizQuestions = () => [
    {
        key: 'q1',
        question: t('q1'),
        answers: [
            { key: 'q1a1', text: t('q1a1'), tags: { mevsim: ['yaz'], koku_turu: ['akuatik', 'narenciye'], character: ['fresh', 'light'] } },
            { key: 'q1a2', text: t('q1a2'), tags: { mevsim: ['kış'], koku_turu: ['baharatlı', 'odunsu', 'gurme'], character: ['warm', 'cozy'] } },
            { key: 'q1a3', text: t('q1a3'), tags: { mevsim: ['ilkbahar', 'sonbahar'], koku_turu: ['çiçeksi', 'yeşil', 'aromatik'], character: ['natural', 'fresh'] } },
            { key: 'q1a4', text: t('q1a4'), tags: { mevsim: ['dört mevsim'], koku_turu: ['oryantal', 'amber'], kullanim: ['gece'], character: ['elegant', 'sophisticated'] } }
        ]
    },
    {
        key: 'q2',
        question: t('q2'),
        answers: [
            { key: 'q2a1', text: t('q2a1'), tags: { koku_turu: ['çiçeksi'], character: ['romantic', 'feminine'] } },
            { key: 'q2a2', text: t('q2a2'), tags: { koku_turu: ['narenciye', 'meyveli'], character: ['fresh', 'energetic'] } },
            { key: 'q2a3', text: t('q2a3'), tags: { koku_turu: ['baharatlı', 'oryantal', 'amber'], character: ['mysterious', 'exotic'] } },
            { key: 'q2a4', text: t('q2a4'), tags: { koku_turu: ['odunsu', 'aromatik', 'yeşil'], character: ['natural', 'grounded'] } }
        ]
    },
    {
        key: 'q3',
        question: t('q3'),
        answers: [
            { key: 'q3a1', text: t('q3a1'), tags: { kullanim: ['gündüz'], intensity: ['light'] } },
            { key: 'q3a2', text: t('q3a2'), tags: { kullanim: ['gece', 'özel'], intensity: ['strong'] } },
            { key: 'q3a3', text: t('q3a3'), tags: { kullanim: ['her zaman'], intensity: ['medium'] } },
            { key: 'q3a4', text: t('q3a4'), tags: { kullanim: ['gündüz', 'gece'], intensity: ['medium'] } }
        ]
    },
    {
        key: 'q4',
        question: t('q4'),
        answers: [
            { key: 'q4a1', text: t('q4a1'), tags: { koku_turu: ['oryantal', 'çiçeksi'], character: ['luxurious', 'sensual'] } },
            { key: 'q4a2', text: t('q4a2'), tags: { koku_turu: ['deri', 'odunsu'], character: ['masculine', 'strong'] } },
            { key: 'q4a3', text: t('q4a3'), tags: { koku_turu: ['akuatik', 'misk'], character: ['modern', 'clean'] } },
            { key: 'q4a4', text: t('q4a4'), tags: { koku_turu: ['yeşil', 'aromatik'], character: ['natural', 'casual'] } }
        ]
    },
    {
        key: 'q5',
        question: t('q5'),
        answers: [
            { key: 'q5a1', text: t('q5a1'), tags: { koku_turu: ['oryantal', 'amber', 'gurme'], character: ['luxurious', 'warm'] } },
            { key: 'q5a2', text: t('q5a2'), tags: { koku_turu: ['deri', 'baharatlı', 'şipre'], character: ['mysterious', 'dark'] } },
            { key: 'q5a3', text: t('q5a3'), tags: { koku_turu: ['akuatik', 'narenciye', 'yeşil'], mevsim: ['yaz'], character: ['fresh', 'cool'] } },
            { key: 'q5a4', text: t('q5a4'), tags: { koku_turu: ['çiçeksi', 'meyveli'], character: ['romantic', 'soft'] } }
        ]
    },
    {
        key: 'q6',
        question: t('q6'),
        answers: [
            { key: 'q6a1', text: t('q6a1'), tags: { kullanim: ['gece', 'özel'], intensity: ['strong'], character: ['glamorous'] } },
            { key: 'q6a2', text: t('q6a2'), tags: { kullanim: ['gündüz', 'her zaman'], intensity: ['light', 'medium'], character: ['intellectual', 'calm'] } },
            { key: 'q6a3', text: t('q6a3'), tags: { koku_turu: ['baharatlı', 'oryantal'], character: ['exotic', 'vibrant'] } },
            { key: 'q6a4', text: t('q6a4'), tags: { koku_turu: ['akuatik', 'yeşil'], mevsim: ['yaz'], character: ['peaceful', 'natural'] } }
        ]
    },
    {
        key: 'q7',
        question: t('q7'),
        answers: [
            { key: 'q7a1', text: t('q7a1'), tags: { intensity: ['light'], koku_turu: ['narenciye', 'akuatik', 'yeşil'] } },
            { key: 'q7a2', text: t('q7a2'), tags: { intensity: ['medium'] } },
            { key: 'q7a3', text: t('q7a3'), tags: { intensity: ['strong'], koku_turu: ['oryantal', 'odunsu', 'baharatlı'] } },
            { key: 'q7a4', text: t('q7a4'), tags: { intensity: ['very_strong'], koku_turu: ['amber', 'deri', 'gurme'] } }
        ]
    }
];

let currentQuestionIndex = 0;
let userProfile = {
    koku_turu: {},
    mevsim: {},
    kullanim: {},
    cinsiyet: {},
    intensity: {},
    character: {}
};

// Reset user profile
const resetProfile = () => {
    userProfile = {
        koku_turu: {},
        mevsim: {},
        kullanim: {},
        cinsiyet: {},
        intensity: {},
        character: {}
    };
};

// Add tags to user profile with accumulation
const addToProfile = (tags) => {
    Object.keys(tags).forEach(category => {
        if (!userProfile[category]) userProfile[category] = {};

        tags[category].forEach(tag => {
            userProfile[category][tag] = (userProfile[category][tag] || 0) + 1;
        });
    });
};

// Calculate match score for a perfume
const calculatePerfumeScore = (perfume) => {
    let score = 0;
    let maxPossibleScore = 0;

    // Check koku_turu (scent type)
    if (userProfile.koku_turu) {
        const weight = TAG_WEIGHTS.koku_turu;
        maxPossibleScore += weight * 3; // Max 3 matches possible

        const scentType = perfume.koku_turu?.toLowerCase();
        if (scentType && userProfile.koku_turu[scentType]) {
            score += weight * userProfile.koku_turu[scentType];
        }
    }

    // Check mevsim (season)
    if (userProfile.mevsim) {
        const weight = TAG_WEIGHTS.mevsim;
        maxPossibleScore += weight * 2;

        const season = perfume.mevsim?.toLowerCase();
        if (season) {
            if (userProfile.mevsim[season]) {
                score += weight * userProfile.mevsim[season];
            }
            // Bonus for "dört mevsim" (all year) perfumes
            if (season === 'dört mevsim') {
                score += weight * 0.5;
            }
        }
    }

    // Check kullanim (usage)
    if (userProfile.kullanim) {
        const weight = TAG_WEIGHTS.kullanim;
        maxPossibleScore += weight * 2;

        const usage = perfume.kullanim?.toLowerCase();
        if (usage) {
            if (userProfile.kullanim[usage]) {
                score += weight * userProfile.kullanim[usage];
            }
            // "her zaman" (anytime) is versatile
            if (usage === 'her zaman') {
                score += weight * 0.3;
            }
        }
    }

    // Check intensity preferences
    if (userProfile.intensity) {
        const weight = TAG_WEIGHTS.intensity || 1;
        maxPossibleScore += weight;

        const yildiz = perfume.yildiz || '';
        const starCount = (yildiz.match(/★/g) || []).length;

        // Map star rating to intensity
        if (userProfile.intensity['light'] && starCount <= 3) score += weight;
        if (userProfile.intensity['medium'] && (starCount === 3 || starCount === 4)) score += weight;
        if (userProfile.intensity['strong'] && starCount >= 4) score += weight;
        if (userProfile.intensity['very_strong'] && starCount === 5) score += weight;
    }

    // Normalize score to percentage
    const percentage = maxPossibleScore > 0 ? Math.min(100, Math.round((score / maxPossibleScore) * 100 + 20)) : 50;

    return {
        score,
        maxScore: maxPossibleScore,
        percentage: Math.min(99, percentage) // Cap at 99% for realism
    };
};

// Calculate scores for all perfumes and return top matches
const calculateQuizScores = () => {
    const results = [];
    const storeMode = isStoreMode();

    if (storeMode) {
        // Store mode: only consider perfumes in inventory
        STORE_INVENTORY.forEach(storeItem => {
            // Find matching perfume in database
            const perfumeName = Object.keys(state.parfum_veritabani).find(name =>
                name.includes(storeItem.dbName) ||
                storeItem.dbName.includes(name) ||
                name === storeItem.dbName
            );

            if (perfumeName) {
                const perfume = state.parfum_veritabani[perfumeName];
                const scoreData = calculatePerfumeScore(perfume);

                results.push({
                    name: perfumeName,
                    storeName: storeItem.storeName,
                    reference: storeItem.reference,
                    gender: storeItem.gender,
                    isStoreItem: true,
                    ...scoreData
                });
            }
        });
    } else {
        // Normal mode: all perfumes
        Object.keys(state.parfum_veritabani).forEach(perfumeName => {
            const perfume = state.parfum_veritabani[perfumeName];
            if (!perfume) return;

            const scoreData = calculatePerfumeScore(perfume);

            results.push({
                name: perfumeName,
                isStoreItem: false,
                ...scoreData
            });
        });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    // In store mode: return top 3 max, in normal mode: return top 6
    const maxResults = storeMode ? 3 : 6;

    return results.slice(0, maxResults).map((result, index) => ({
        ...result,
        // Decrease percentage slightly for lower ranked items
        percentage: Math.max(60, result.percentage - (index * 5))
    }));
};

export const startQuiz = () => {
    currentQuestionIndex = 0;
    resetProfile();
    showPage('quiz-page');
    renderQuestion();
};

const renderQuestion = () => {
    const page = document.getElementById('quiz-page');
    const questions = getQuizQuestions();
    const questionData = questions[currentQuestionIndex];

    // Progress indicator
    const progress = Math.round(((currentQuestionIndex) / questions.length) * 100);

    page.innerHTML = `
        <div class="quiz-header-bar">
            <select id="quiz-language-select" class="quiz-lang-btn">
                <option value="tr" ${getCurrentLanguage() === 'tr' ? 'selected' : ''}>🇹🇷 TR</option>
                <option value="en" ${getCurrentLanguage() === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
                <option value="ru" ${getCurrentLanguage() === 'ru' ? 'selected' : ''}>🇷🇺 RU</option>
                <option value="ar" ${getCurrentLanguage() === 'ar' ? 'selected' : ''}>🇸🇦 AR</option>
            </select>
        </div>
        <div class="quiz-progress">
            <div class="quiz-progress-bar" style="width: ${progress}%"></div>
            <span class="quiz-progress-text">${currentQuestionIndex + 1} / ${questions.length}</span>
        </div>
        <p class="question-text">${questionData.question}</p>
        <div class="answer-options"></div>
    `;

    // Language selector handler
    const langSelect = page.querySelector('#quiz-language-select');
    if (langSelect) {
        langSelect.onchange = (e) => {
            import('./i18n.js').then(module => {
                module.setLanguage(e.target.value);
                renderQuestion(); // Re-render with new language
            });
        };
    }

    const optionsContainer = page.querySelector('.answer-options');
    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(answer.tags);
        optionsContainer.appendChild(button);
    });
};

const selectAnswer = (tags) => {
    addToProfile(tags);
    currentQuestionIndex++;

    const questions = getQuizQuestions();
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showQuizResults();
    }
};

const showQuizResults = () => {
    const page = document.getElementById('quiz-results-page');
    const recommendedPerfumes = calculateQuizScores();
    const storeMode = isStoreMode();

    state.userStats.quizzesTaken++;
    saveStats();

    // Store results for back navigation
    window.lastQuizResults = recommendedPerfumes;
    window.fromQuizResults = true;

    // Enhanced results page with celebration design
    page.innerHTML = `
        <div class="quiz-results-header">
            <div class="confetti-container">
                <span class="confetti">🎉</span>
                <span class="confetti">✨</span>
                <span class="confetti">🌟</span>
            </div>
            <h2 class="results-title">${storeMode ? '🎁 Senin İçin Seçtik!' : t('quizResultsTitle')}</h2>
            <p class="results-subtitle">${storeMode ? 'Koku profiline en uygun parfümler' : t('quizResultsDescription')}</p>
        </div>
        <div id="quiz-results-container" class="results-grid"></div>
        <div class="results-actions">
            <button id="restart-quiz-button" class="styled-button secondary-button">
                🔄 ${t('restartQuiz')}
            </button>
            <button id="back-home-button" class="styled-button primary-button">
                🏠 ${t('backToHome')}
            </button>
        </div>
    `;

    const container = page.querySelector('#quiz-results-container');

    if (recommendedPerfumes.length > 0) {
        recommendedPerfumes.forEach((result, index) => {
            const perfumeCardWrapper = document.createElement('div');
            perfumeCardWrapper.className = 'quiz-result-wrapper';
            perfumeCardWrapper.style.cursor = 'pointer';
            perfumeCardWrapper.style.animationDelay = `${index * 0.15}s`;

            // Match percentage badge
            const matchBadge = document.createElement('div');
            matchBadge.className = 'match-badge';
            matchBadge.innerHTML = `
                <span class="match-percent">${result.percentage}%</span>
                <span class="match-label">Uyum</span>
            `;
            perfumeCardWrapper.appendChild(matchBadge);

            if (storeMode && result.isStoreItem) {
                // Enhanced store card
                const storeCard = document.createElement('div');
                storeCard.className = 'store-perfume-card';
                storeCard.innerHTML = `
                    <div class="store-card-inner">
                        <div class="store-name">${result.storeName}</div>
                        <div class="store-divider"></div>
                        <div class="store-reference">İlham: ${result.reference}</div>
                        <div class="store-meta">
                            <span class="store-gender">${result.gender === 'erkek' ? '👔 Erkek' : result.gender === 'kadın' ? '👗 Kadın' : '✨ Unisex'}</span>
                        </div>
                        <div class="store-vibe">"${state.parfum_veritabani[result.name]?.vibe?.substring(0, 60) || ''}..."</div>
                        <div class="store-cta">👆 Detaylar için dokun</div>
                    </div>
                `;
                perfumeCardWrapper.appendChild(storeCard);

                // Click to open detail page
                perfumeCardWrapper.onclick = () => {
                    import('./ui.js').then(module => {
                        module.renderDetailPage(result.name);
                    });
                };
            } else {
                // Normal display
                createPerfumeCard(result.name, perfumeCardWrapper);
            }

            container.appendChild(perfumeCardWrapper);
        });
    } else {
        container.innerHTML = `<p class="no-results">${t('noResults')}</p>`;
    }

    page.querySelector('#restart-quiz-button').onclick = () => {
        window.fromQuizResults = false;
        startQuiz();
    };
    page.querySelector('#back-home-button').onclick = () => {
        window.fromQuizResults = false;
        showPage('home-page');
    };
    showPage('quiz-results-page');
};

// Interactive Quiz (Panel) - Updated for 7 questions
export const setupInteractiveQuiz = () => {
    const quizPanel = document.getElementById('quiz-promo-panel');
    if (!quizPanel) return;

    quizPanel.innerHTML = `
        <h3>${t('quizTitle')}</h3>
        <p>${t('quizDescription')}</p>
        <button id="promo-quiz-start-btn" class="styled-button primary-button">${t('startQuiz')}</button>
    `;

    document.getElementById('promo-quiz-start-btn').onclick = () => {
        currentQuestionIndex = 0;
        resetProfile();
        renderQuizQuestionInPanel(quizPanel);
    };
};

const renderQuizQuestionInPanel = (panel) => {
    const questions = getQuizQuestions();
    const questionData = questions[currentQuestionIndex];

    const progress = Math.round(((currentQuestionIndex) / questions.length) * 100);

    panel.innerHTML = `
        <div class="quiz-progress panel-progress">
            <div class="quiz-progress-bar" style="width: ${progress}%"></div>
            <span class="quiz-progress-text">${currentQuestionIndex + 1} / ${questions.length}</span>
        </div>
        <h3 class="question-text">${questionData.question}</h3>
        <div class="answer-options"></div>
    `;

    const optionsContainer = panel.querySelector('.answer-options');

    questionData.answers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-button';
        button.textContent = answer.text;
        button.onclick = () => selectAnswerInPanel(answer.tags, panel);
        optionsContainer.appendChild(button);
    });
};

const selectAnswerInPanel = (tags, panel) => {
    addToProfile(tags);
    currentQuestionIndex++;

    const questions = getQuizQuestions();
    if (currentQuestionIndex < questions.length) {
        renderQuizQuestionInPanel(panel);
    } else {
        showQuizResultsInPanel(panel);
    }
};

const showQuizResultsInPanel = (panel) => {
    const recommendedPerfumes = calculateQuizScores();

    panel.innerHTML = `
        <h3>${t('quizResultsTitle')}</h3>
        <p>${t('quizResultsDescription')}</p>
        <div id="panel-quiz-results-container"></div>
        <button id="restart-panel-quiz-btn" class="styled-button secondary-button" style="margin-top: 20px;">${t('restartQuiz')}</button>
    `;

    const container = panel.querySelector('#panel-quiz-results-container');

    if (recommendedPerfumes.length > 0) {
        // Show only top 3 in panel
        recommendedPerfumes.slice(0, 3).forEach(result => {
            const wrapper = document.createElement('div');
            wrapper.className = 'quiz-result-wrapper panel-result';

            const matchBadge = document.createElement('span');
            matchBadge.className = 'match-badge-small';
            matchBadge.textContent = `${result.percentage}%`;

            wrapper.appendChild(matchBadge);
            container.appendChild(wrapper);

            createPerfumeCard(result.name, wrapper);
        });
    } else {
        container.innerHTML = `<p>${t('noResults')}</p>`;
    }

    panel.querySelector('#restart-panel-quiz-btn').onclick = () => setupInteractiveQuiz();
};

export { calculateQuizScores, getQuizQuestions };
