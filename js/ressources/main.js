let courseData = null;

document.addEventListener('DOMContentLoaded', () => {
    initGlossaire();
    initExercices();
    setupCourseModal();
});

/**
 * Prépare la modale de cours
 */
async function setupCourseModal() {
    const modal = document.getElementById('course-modal');
    const closeBtn = document.getElementById('close-course-modal');

    if (!modal || !closeBtn) return;

    // Fermeture
    closeBtn.onclick = () => modal.classList.remove('open');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };

    // Chargement des données de cours une seule fois
    try {
        const response = await fetch('data/cours.json');
        if (response.ok) courseData = await response.json();
    } catch (error) {
        console.error('Erreur chargement cours:', error);
    }
}

/**
 * Ouvre la modale pour un tag spécifique
 */
function openCourseModal(tagName) {
    const modal = document.getElementById('course-modal');
    if (!modal || !courseData || !courseData[tagName]) return;

    const course = courseData[tagName];

    document.getElementById('course-title').textContent = tagName;
    document.getElementById('course-savoir').textContent = course.savoir;
    document.getElementById('course-maitriser').textContent = course.maitriser;

    const stepsList = document.getElementById('course-steps');
    stepsList.textContent = '';
    course.mise_en_place.forEach(step => {
        const li = document.createElement('li');
        li.style.marginBottom = '1rem';

        if (step.includes('Prompt Suggeré') || step.includes('Prompt suggéré')) {
            // Style spécial pour les prompts
            li.style.listStyle = 'none';
            li.style.marginLeft = '-1.2rem';
            li.style.marginTop = '1.5rem';

            const parts = step.split(' : ');
            const headerText = parts[0];
            const promptText = parts.slice(1).join(' : ').replace(/^'|'$/g, ''); // Enlever les guillemets simples éventuels

            const header = document.createElement('strong');
            header.textContent = `💡 ${headerText} :`;
            header.style.display = 'block';
            header.style.marginBottom = '0.8rem';
            header.style.color = 'var(--primary-dark)';
            header.style.fontSize = '0.9rem';

            const box = document.createElement('div');
            box.style.cssText = "background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid var(--accent-color); padding: 1.2rem; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 0.9rem; color: #334155; line-height: 1.6; position: relative; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);";
            box.textContent = promptText;

            // Bouton Copier
            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copier';
            copyBtn.style.cssText = "position: absolute; top: 0.5rem; right: 0.5rem; font-size: 0.65rem; padding: 0.2rem 0.5rem; background: var(--accent-color); color: white; border: none; border-radius: 4px; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;";
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(promptText);
                copyBtn.textContent = 'Copié !';
                copyBtn.style.background = 'var(--secondary-color)';
                setTimeout(() => {
                    copyBtn.textContent = 'Copier';
                    copyBtn.style.background = 'var(--accent-color)';
                }, 2000);
            };
            copyBtn.onmouseover = () => copyBtn.style.opacity = '1';
            copyBtn.onmouseout = () => copyBtn.style.opacity = '0.7';

            box.appendChild(copyBtn);
            li.appendChild(header);
            li.appendChild(box);
        } else {
            li.textContent = step;
        }
        stepsList.appendChild(li);
    });

    modal.classList.add('open');
}

/**
 * Charge et affiche le glossaire
 */
async function initGlossaire() {
    const container = document.getElementById('glossaire-grid');
    if (!container) return;

    try {
        const response = await fetch('data/glossaire.json');
        if (!response.ok) throw new Error('Erreur Glossaire');
        const data = await response.json();

        container.textContent = '';
        data.forEach(item => {
            const itemDiv = document.createElement('div');
            const h4 = document.createElement('h4');
            h4.style.color = "var(--primary-dark)";
            h4.textContent = item.term;
            const p = document.createElement('p');
            p.style.fontSize = "0.9rem";
            p.textContent = item.definition;
            itemDiv.appendChild(h4);
            itemDiv.appendChild(p);
            container.appendChild(itemDiv);
        });
    } catch (error) {
        console.error('Erreur Glossaire:', error);
    }
}

const EXERCICES_DONE_KEY = 'cours_ia_exercices_done';

/**
 * Récupère la liste des exercices terminés
 */
function getDoneExercices() {
    const done = localStorage.getItem(EXERCICES_DONE_KEY);
    return done ? JSON.parse(done) : [];
}

/**
 * Enregistre ou supprime un exercice de la liste des terminés
 */
function toggleExerciceDone(id, isDone) {
    let done = getDoneExercices();
    if (isDone) {
        if (!done.includes(id)) done.push(id);
    } else {
        done = done.filter(d => d !== id);
    }
    localStorage.setItem(EXERCICES_DONE_KEY, JSON.stringify(done));
}

/**
 * Charge et affiche les exercices enrichis
 */
async function initExercices() {
    const container = document.getElementById('exercices-grid');
    if (!container) return;

    try {
        const response = await fetch('data/exercices.json');
        if (!response.ok) throw new Error('Erreur Exercices');
        const data = await response.json();
        const doneList = getDoneExercices();

        container.textContent = '';
        data.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.id = ex.id;

            const isDone = doneList.includes(ex.id);
            if (isDone) {
                card.style.opacity = '0.7';
                card.style.background = '#fcfcfc';
            }

            // Détermination de la couleur de bordure selon le niveau (badge_class)
            let borderColor = 'var(--primary-color)';
            if (ex.level_class === 'badge-green') borderColor = 'var(--secondary-color)';
            if (ex.level_class === 'badge-orange') borderColor = 'var(--primary-color)';
            if (ex.level_class === 'badge-accent') borderColor = 'var(--accent-color)';

            card.style.borderLeft = `5px solid ${borderColor}`;
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.height = '100%';
            card.style.position = 'relative'; // Pour positionner la checkbox

            // Checkbox de complétion
            const checkContainer = document.createElement('label');
            checkContainer.style.cssText = "position: absolute; top: 1rem; right: 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0,0,0,0.05); user-select: none;";

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = isDone;
            checkbox.style.cursor = 'pointer';

            checkbox.onchange = (e) => {
                const checked = e.target.checked;
                toggleExerciceDone(ex.id, checked);
                if (checked) {
                    card.style.opacity = '0.7';
                    card.style.background = '#fcfcfc';
                    card.style.transition = 'all 0.4s';
                } else {
                    card.style.opacity = '1';
                    card.style.background = '#ffffff';
                }
            };

            const checkLabel = document.createTextNode(isDone ? 'Terminé' : 'À faire');
            checkContainer.appendChild(checkbox);
            const labelSpan = document.createElement('span');
            labelSpan.textContent = isDone ? 'Terminé' : 'À faire';
            checkContainer.appendChild(labelSpan);

            checkbox.addEventListener('change', () => {
                labelSpan.textContent = checkbox.checked ? 'Terminé' : 'À faire';
            });

            const level = document.createElement('span');
            level.className = `badge ${ex.level_class}`;
            level.textContent = ex.level;
            level.style.marginBottom = '1rem';
            level.style.width = 'fit-content';

            const h3 = document.createElement('h3');
            h3.textContent = ex.title;
            h3.style.paddingRight = '5rem'; // Eviter le texte sous la checkbox

            const p = document.createElement('p');
            p.textContent = ex.description;
            p.style.flex = '1';

            // Conteneur des tags
            const tagContainer = document.createElement('div');
            tagContainer.style.cssText = "display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;";

            if (ex.tags) {
                ex.tags.forEach(tag => {
                    const tagBtn = document.createElement('button');
                    tagBtn.className = 'badge';
                    tagBtn.style.cssText = "font-size: 0.7rem; background: var(--secondary-color); color: white; border: none; transition: all 0.2s; cursor: pointer; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px;";
                    tagBtn.textContent = `🏷️ ${tag.label}`;

                    // Clic pour ouvrir la modale de cours
                    tagBtn.onclick = (e) => {
                        e.preventDefault();
                        openCourseModal(tag.label);
                    };

                    // Effet hover
                    tagBtn.onmouseover = () => { tagBtn.style.transform = 'translateY(-2px)'; tagBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; };
                    tagBtn.onmouseout = () => { tagBtn.style.transform = 'translateY(0)'; tagBtn.style.boxShadow = 'none'; };

                    tagContainer.appendChild(tagBtn);
                });
            }

            card.appendChild(checkContainer);
            card.appendChild(level);
            card.appendChild(h3);
            card.appendChild(p);
            card.appendChild(tagContainer);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erreur Exercices:', error);
    }
}
