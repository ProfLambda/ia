/**
 * Logique de la page Outils
 * Gère le chargement dynamique des outils depuis les fichiers JSON.
 */

const toolsList = [
    'gemini', 'chatgpt', 'claude', 'copilot', 'perplexity', 'mistral', 'grok', 'notion-ai', 'deepl-write', 'huggingface',
    'midjourney', 'canva', 'adobe-firefly', 'leonardo', 'ideogram', 'stable-diffusion', 'hunyuan-3d',
    'runway', 'elevenlabs', 'sora', 'luma', 'suno', 'kling', 'pika'
];

async function initOutils() {
    const containers = {
        'texte': document.getElementById('outils-texte'),
        'image': document.getElementById('outils-image'),
        'video': document.getElementById('outils-video')
    };

    const badgeContainer = document.getElementById('tools-badges');

    // Nettoyage initial
    Object.values(containers).forEach(c => { if (c) c.textContent = ''; });
    if (badgeContainer) badgeContainer.textContent = '';

    // Chargement parallèle pour plus de robustesse
    const loadPromises = toolsList.map(async (toolKey) => {
        try {
            const response = await fetch(`data/outils/${toolKey}.json`);
            if (!response.ok) throw new Error(`404: ${toolKey}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.warn(`Erreur pour ${toolKey}:`, error);
            return null;
        }
    });

    const allToolsData = await Promise.all(loadPromises);

    allToolsData.filter(d => d !== null).forEach(data => {
        // 1. Rendu de la carte
        const card = createToolCard(data);
        if (containers[data.category]) {
            containers[data.category].appendChild(card);
        }

        // 2. Rendu du badge footer
        if (badgeContainer) {
            const a = document.createElement('a');
            a.href = data.url;
            a.target = '_blank';
            a.className = 'badge';
            a.style.cssText = `
                padding: 0.6rem 1.2rem;
                border-radius: 50px;
                background: rgba(255, 255, 255, 0.5);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.1);
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 0.85rem;
                transition: all 0.3s ease;
                text-decoration: none;
                display: inline-block;
            `;
            a.textContent = data.name;

            a.onmouseover = () => {
                a.style.background = 'var(--primary-color)';
                a.style.color = 'white';
                a.style.transform = 'translateY(-2px)';
            };
            a.onmouseout = () => {
                a.style.background = 'rgba(255, 255, 255, 0.5)';
                a.style.color = 'var(--text-secondary)';
                a.style.transform = 'translateY(0)';
            };
            badgeContainer.appendChild(a);
        }
    });
}

function createToolCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = "display: flex; flex-direction: column; height: 100%; transition: transform 0.3s ease; position: relative;";

    // Header : Icon + Title (Cliquables)
    const header = document.createElement('div');
    header.style.cssText = "display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;";

    const mainLink = document.createElement('a');
    mainLink.href = data.url;
    mainLink.target = '_blank';
    mainLink.style.cssText = "display: flex; align-items: center; gap: 1rem; text-decoration: none; color: inherit; flex: 1;";

    const img = document.createElement('img');
    img.src = data.icon;
    img.alt = `${data.name} logo`;
    img.style.cssText = "width: 38px; height: 38px; border-radius: 8px; object-fit: contain; background: #fff; padding: 3px; border: 1px solid rgba(0,0,0,0.08);";
    img.onerror = () => { img.src = 'assets/img/logos/logo-ai-default.svg'; };

    const titleContainer = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = data.name;
    h3.style.margin = '0';
    h3.style.fontSize = '1.15rem';
    h3.style.fontWeight = '700';

    const publisher = document.createElement('div');
    publisher.textContent = data.publisher;
    publisher.style.fontSize = '0.75rem';
    publisher.style.color = '#64748b';

    titleContainer.appendChild(h3);
    titleContainer.appendChild(publisher);
    mainLink.appendChild(img);
    mainLink.appendChild(titleContainer);
    header.appendChild(mainLink);

    // Description
    const p = document.createElement('p');
    p.textContent = data.description;
    p.style.cssText = "font-size: 0.95rem; color: #334155; line-height: 1.5; margin-bottom: 1.5rem;";

    // Features
    const featuresList = document.createElement('ul');
    featuresList.style.cssText = "list-style: none; padding: 0; margin-bottom: 1.5rem; font-size: 0.85rem; color: #64748b; flex: 1;";
    data.features.slice(0, 3).forEach(feat => {
        const li = document.createElement('li');
        li.style.cssText = "display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;";

        // SVG Checkmark (Sécurisé)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "12");
        svg.setAttribute("height", "12");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "#22c55e");
        svg.setAttribute("stroke-width", "3");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
        poly.setAttribute("points", "20 6 9 17 4 12");
        svg.appendChild(poly);

        const span = document.createElement('span');
        span.textContent = feat;

        li.appendChild(svg);
        li.appendChild(span);
        featuresList.appendChild(li);
    });

    // Footer : Tag + Button
    const footer = document.createElement('div');
    footer.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding-top: 1.2rem; border-top: 1px solid rgba(0,0,0,0.06);";

    const tagLink = document.createElement('a');
    tagLink.href = data.url;
    tagLink.target = '_blank';
    tagLink.className = `badge ${data.tag_class}`;
    tagLink.textContent = data.tag;
    tagLink.style.cssText = "text-decoration: none; font-size: 0.75rem; font-weight: 600;";

    const accessBtn = document.createElement('a');
    accessBtn.href = data.url;
    accessBtn.target = '_blank';
    accessBtn.className = 'btn btn-secondary';
    accessBtn.textContent = 'Tester';
    accessBtn.style.cssText = "padding: 0.4rem 0.9rem; font-size: 0.85rem; background: #f1f5f9; border: 1px solid #e2e8f0; color: #065f46; border-radius: 6px; text-decoration: none; font-weight: 600;";

    footer.appendChild(tagLink);
    footer.appendChild(accessBtn);

    card.appendChild(header);
    card.appendChild(p);
    card.appendChild(featuresList);
    card.appendChild(footer);

    return card;
}

document.addEventListener('DOMContentLoaded', initOutils);
