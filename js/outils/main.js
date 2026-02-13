/**
 * Logique de la page Outils
 * Gère le chargement dynamique des outils depuis les fichiers JSON.
 */

const toolsList = [
    'chatgpt', 'claude', 'perplexity',
    'midjourney', 'canva', 'adobe-firefly',
    'runway', 'elevenlabs', 'sora'
];

async function initOutils() {
    const containers = {
        'texte': document.getElementById('outils-texte'),
        'image': document.getElementById('outils-image'),
        'video': document.getElementById('outils-video')
    };

    // Nettoyage des squelettes si présents
    Object.values(containers).forEach(c => { if (c) c.textContent = ''; });

    for (const toolKey of toolsList) {
        try {
            const response = await fetch(`data/outils/${toolKey}.json`);
            if (!response.ok) continue;
            const data = await response.json();

            const card = createToolCard(data);
            if (containers[data.category]) {
                containers[data.category].appendChild(card);
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de l'outil ${toolKey}:`, error);
        }
    }
}

/**
 * Crée l'élément DOM de la carte d'outil
 * @param {Object} data - Données de l'outil
 * @returns {HTMLElement}
 */
function createToolCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.height = '100%';

    // Header : Icon + Title
    const header = document.createElement('div');
    header.style.cssText = "display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;";

    const img = document.createElement('img');
    img.src = data.icon;
    img.alt = `${data.name} logo`;
    img.style.cssText = "width: 32px; height: 32px; border-radius: 6px; object-fit: contain; background: #f8fafc; padding: 2px; border: 1px solid rgba(0,0,0,0.05); opacity: 0; transition: opacity 0.2s;";

    // Afficher l'image uniquement quand elle est chargée pour éviter les flashs d'alt-text
    img.onload = () => { img.style.opacity = '1'; };

    // Fallback si l'image ne charge pas
    img.onerror = () => {
        img.src = 'assets/img/logos/logo-ai-default.svg';
        img.style.opacity = '1';
    };

    const titleContainer = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = data.name;
    h3.style.margin = '0';
    h3.style.fontSize = '1.1rem';

    const publisher = document.createElement('div');
    publisher.textContent = data.publisher;
    publisher.style.fontSize = '0.75rem';
    publisher.style.color = '#64748b';

    titleContainer.appendChild(h3);
    titleContainer.appendChild(publisher);
    header.appendChild(img);
    header.appendChild(titleContainer);

    // Description
    const p = document.createElement('p');
    p.textContent = data.description;
    p.style.fontSize = '0.9rem';
    p.style.color = '#334155';
    p.style.flex = '1';

    // Features
    const featuresList = document.createElement('ul');
    featuresList.style.cssText = "list-style: none; padding: 0; margin: 1rem 0; font-size: 0.8rem; color: #64748b;";
    data.features.slice(0, 3).forEach(feat => {
        const li = document.createElement('li');
        li.style.cssText = "display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.3rem;";

        // Création sécurisée de l'icône SVG
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "12");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "#22c55e");
        svg.setAttribute("stroke-width", "3");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        polyline.setAttribute("points", "20 6 9 17 4 12");
        svg.appendChild(polyline);

        const featText = document.createElement('span');
        featText.textContent = feat;

        li.appendChild(svg);
        li.appendChild(featText);
        featuresList.appendChild(li);
    });

    // Footer : Tag + Link
    const footer = document.createElement('div');
    footer.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 1rem;";

    const tag = document.createElement('span');
    tag.className = `badge ${data.tag_class}`;
    tag.textContent = data.tag;
    tag.style.fontSize = '0.7rem';

    const link = document.createElement('a');
    link.href = data.url;
    link.target = '_blank';
    link.className = 'btn btn-secondary';
    link.style.cssText = "padding: 0.4rem 0.8rem; font-size: 0.8rem; transition: all 0.2s;";
    link.textContent = "Accéder";

    footer.appendChild(tag);
    footer.appendChild(link);

    card.appendChild(header);
    card.appendChild(p);
    card.appendChild(featuresList);
    card.appendChild(footer);

    return card;
}

// Lancement au chargement du DOM
document.addEventListener('DOMContentLoaded', initOutils);
