/**
 * main.js - Moteur du Quizz Acteurs IA
 * Gère le chargement, l'affichage et la logique du quizz.
 */

let quizzQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let canAnswer = true;

document.addEventListener('DOMContentLoaded', () => {
    loadQuizzData();
    setupEventListeners();
});

/**
 * Charge les données depuis le JSON
 */
async function loadQuizzData() {
    try {
        const response = await fetch('data/quizz/acteurs.json');
        if (!response.ok) throw new Error('Erreur de chargement');
        const data = await response.json();

        // Mélanger les questions
        quizzQuestions = data.sort(() => Math.random() - 0.5);

        // Initialiser l'affichage
        displayQuestion();
        updateProgress();
    } catch (error) {
        console.error('Quizz Error:', error);
        document.getElementById('question-text').textContent = "Erreur lors du chargement du quizz.";
    }
}

/**
 * Affiche la question actuelle
 */
function displayQuestion() {
    const question = quizzQuestions[currentQuestionIndex];
    if (!question) return;

    // Reset UI
    const optionsGrid = document.getElementById('options-grid');
    const feedbackBox = document.getElementById('feedback-box');
    const nextBtn = document.getElementById('next-btn');

    optionsGrid.textContent = '';
    feedbackBox.classList.remove('show');
    nextBtn.style.display = 'none';
    canAnswer = true;

    // Update Text
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('theme-label').textContent = question.theme;
    document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1}/${quizzQuestions.length}`;

    // Create Options
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;

        const iconSpan = document.createElement('span');
        iconSpan.textContent = "○"; // Cercle vide
        btn.appendChild(iconSpan);

        btn.onclick = () => handleAnswer(index, btn);
        optionsGrid.appendChild(btn);
    });
}

/**
 * Gère le clic sur une réponse
 */
function handleAnswer(selectedIndex, selectedBtn) {
    if (!canAnswer) return;
    canAnswer = false;

    const question = quizzQuestions[currentQuestionIndex];
    const isCorrect = selectedIndex === question.answer;

    const allBtns = document.querySelectorAll('.option-btn');
    const feedbackBox = document.getElementById('feedback-box');
    const explanationText = document.getElementById('explanation-text');
    const nextBtn = document.getElementById('next-btn');

    // Désactiver tous les boutons
    allBtns.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        score++;
        selectedBtn.classList.add('correct');
        selectedBtn.querySelector('span').textContent = "✓";
    } else {
        selectedBtn.classList.add('wrong');
        selectedBtn.querySelector('span').textContent = "✕";

        // Afficher la bonne réponse
        allBtns[question.answer].classList.add('correct');
        allBtns[question.answer].querySelector('span').textContent = "✓";
    }

    // Afficher l'explication
    explanationText.textContent = question.explanation;

    // Ajouter un lien(s) "En savoir plus" si présent
    if (question.more_url) {
        const urls = Array.isArray(question.more_url) ? question.more_url : [question.more_url];

        const linksContainer = document.createElement('div');
        linksContainer.className = "more-links-container";
        linksContainer.style.display = "flex";
        linksContainer.style.flexWrap = "wrap";
        linksContainer.style.gap = "8px";
        linksContainer.style.marginTop = "15px";

        urls.forEach((url, idx) => {
            const moreLink = document.createElement('a');
            moreLink.href = url;
            moreLink.target = "_blank";
            moreLink.className = "more-link";

            // Si c'est un tableau, on peut afficher des labels plus courts ou numérotés
            if (urls.length > 1) {
                moreLink.textContent = `En savoir plus ${idx + 1} ↗`;
            } else {
                moreLink.textContent = "En savoir plus ↗";
            }

            moreLink.style.display = "inline-block";
            moreLink.style.padding = "6px 12px";
            moreLink.style.borderRadius = "6px";
            moreLink.style.fontWeight = "700";
            moreLink.style.fontSize = "0.80rem";
            moreLink.style.background = isCorrect ? "#dcfce7" : "#fee2e2";
            moreLink.style.color = isCorrect ? "#166534" : "#991b1b";
            moreLink.style.textDecoration = "none";
            moreLink.style.border = `1px solid ${isCorrect ? "#86efac" : "#fca5a5"}`;
            moreLink.style.transition = "all 0.2s";

            linksContainer.appendChild(moreLink);
        });

        explanationText.appendChild(linksContainer);
    }

    feedbackBox.classList.add('show');
    feedbackBox.style.background = isCorrect ? "#f0fdf4" : "#fef2f2";
    feedbackBox.style.border = `1px solid ${isCorrect ? "#22c55e" : "#ef4444"}`;
    feedbackBox.style.color = isCorrect ? "#166534" : "#991b1b";

    // Afficher le bouton suivant
    nextBtn.style.display = 'block';
    if (currentQuestionIndex === quizzQuestions.length - 1) {
        nextBtn.textContent = "Voir mon Résultat →";
    }
}

/**
 * Passe à la question suivante ou affiche les résultats
 */
function handleNext() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizzQuestions.length) {
        displayQuestion();
        updateProgress();
    } else {
        showResults();
    }
}

/**
 * Met à jour la barre de progression
 */
function updateProgress() {
    const progress = (currentQuestionIndex / quizzQuestions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
}

/**
 * Affiche l'écran final
 */
function showResults() {
    document.getElementById('game-screen').style.display = 'none';
    const resultScreen = document.getElementById('result-screen');
    resultScreen.style.display = 'block';

    const finalScore = document.getElementById('final-score');
    finalScore.textContent = score;
    document.getElementById('final-total').textContent = `/${quizzQuestions.length}`;

    const title = document.getElementById('result-title');
    const text = document.getElementById('result-text');

    const percent = (score / quizzQuestions.length) * 100;

    if (percent === 100) {
        title.textContent = "Expert Absolu ! 🏆";
        text.textContent = "Vous connaissez l'écosystème de l'IA sur le bout des doigts. Impressionnant !";
    } else if (percent >= 70) {
        title.textContent = "Très Bien ! 🥈";
        text.textContent = "Vous avez de solides bases sur les acteurs majeurs et leurs enjeux.";
    } else if (percent >= 50) {
        title.textContent = "Pas mal ! 🥉";
        text.textContent = "C'est un bon début, mais quelques révisions sur les acteurs souverains et le hardware pourraient aider.";
    } else {
        title.textContent = "Encore un effort... 📖";
        text.textContent = "L'écosystème de l'IA est complexe. N'hésitez pas à relire les fiches détaillées des acteurs.";
    }
}

function setupEventListeners() {
    document.getElementById('next-btn').onclick = handleNext;
}
