/**
 * Logique de la page Acteurs
 * Gère le chargement dynamique des données JSON et l'affichage des modales.
 */

// Cache pour stocker les données déjà chargées afin d'éviter des requêtes répétées
const acteursCache = {};

/**
 * Ouvre la modale d'un acteur et charge ses données
 * @param {string} actorKey - La clé correspondant au fichier JSON (ex: 'openai')
 */
async function openModal(actorKey) {
    const modalOverlay = document.getElementById('modal-overlay');

    // Réinitialisation et état de chargement
    document.getElementById('modal-title').textContent = "Chargement...";
    document.getElementById('modal-history').textContent = "Patientez pendant que nous récupérons les données...";
    document.getElementById('modal-mission').textContent = "";
    document.getElementById('modal-leadership').textContent = "";
    document.getElementById('modal-stats').textContent = "";
    document.getElementById('modal-stock').textContent = "";
    document.getElementById('modal-anecdote').textContent = "";
    document.getElementById('modal-anecdote-sources').textContent = '';
    document.getElementById('modal-anecdote-container').style.display = 'none';
    document.getElementById('modal-products').textContent = '';
    document.getElementById('modal-sources').textContent = '';
    document.getElementById('modal-icon').textContent = '';

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
        let data;
        // Vérification du cache
        if (acteursCache[actorKey]) {
            data = acteursCache[actorKey];
        } else {
            // Chargement asynchrone du JSON
            const response = await fetch(`data/acteurs/${actorKey}.json`);
            if (!response.ok) throw new Error("Erreur lors du chargement des données.");
            data = await response.json();
            // Mise en cache
            acteursCache[actorKey] = data;
        }

        // Remplissage des informations basiques
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-mission').textContent = data.mission;
        document.getElementById('modal-leadership').textContent = data.leadership || "Non spécifié";
        document.getElementById('modal-stats').textContent = data.stats;
        document.getElementById('modal-stock').textContent = data.stockFact || "Données boursières non disponibles.";
        document.getElementById('modal-anecdote').textContent = data.anecdote || "Pas d'anecdote disponible.";

        // Gestion de l'histoire (découpage par paragraphes)
        const historyContainer = document.getElementById('modal-history');
        historyContainer.textContent = '';
        const paragraphs = data.history.split('<br><br>');
        paragraphs.forEach(pData => {
            const p = document.createElement('p');
            p.textContent = pData.replace(/<br>/g, '');
            p.style.marginBottom = '1rem';
            historyContainer.appendChild(p);
        });

        // Affichage conditionnel de l'anecdote
        document.getElementById('modal-anecdote-container').style.display = data.anecdote ? 'block' : 'none';

        // Construction des sources de l'anecdote
        const anecdoteSources = document.getElementById('modal-anecdote-sources');
        anecdoteSources.textContent = '';
        if (data.sources_anecdote && data.sources_anecdote.length > 0) {
            data.sources_anecdote.forEach(src => {
                const a = document.createElement('a');
                a.href = src.url;
                a.target = '_blank';
                a.className = 'badge badge-blue';
                a.style.cssText = "text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-size: 0.75rem; background: rgba(37, 99, 235, 0.1); color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.2);";
                a.textContent = `Source: ${src.label}`;

                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "10");
                svg.setAttribute("height", "10");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("fill", "none");
                svg.setAttribute("stroke", "currentColor");
                svg.setAttribute("stroke-width", "2");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3");
                svg.appendChild(path);
                a.appendChild(svg);

                anecdoteSources.appendChild(a);
            });
        }

        // Chargement sécurisé de l'icône/logo
        const iconContainer = document.getElementById('modal-icon');
        iconContainer.textContent = '';
        if (data.icon) {
            const img = document.createElement('img');
            // Si data.icon contient une balise img complète (vieux format), on extrait juste le src
            if (data.icon.includes('<img')) {
                const srcMatch = data.icon.match(/src="([^"]+)"/);
                if (srcMatch) img.src = srcMatch[1];
            } else {
                img.src = data.icon;
            }
            img.alt = data.title || "Logo";
            img.style.width = '32px';
            img.style.height = 'auto';
            iconContainer.appendChild(img);
        }

        // Liste des produits
        const productsList = document.getElementById('modal-products');
        productsList.textContent = '';
        data.products.forEach(prod => {
            const li = document.createElement('li');
            li.textContent = prod;
            productsList.appendChild(li);
        });

        // Sources et Liens externes
        const sourcesContainer = document.getElementById('modal-sources');
        sourcesContainer.textContent = '';

        const createSection = (title, items, colorClass) => {
            const wrapper = document.createElement('div');
            wrapper.style.width = '100%';
            wrapper.style.marginBottom = '1.5rem';

            const h4 = document.createElement('h4');
            h4.textContent = title;
            h4.style.cssText = "text-transform: uppercase; font-size: 0.8rem; color: var(--primary-dark); margin-bottom: 1rem;";
            wrapper.appendChild(h4);

            const badgeGrid = document.createElement('div');
            badgeGrid.style.cssText = "display: flex; flex-wrap: wrap; gap: 0.5rem;";

            items.forEach(item => {
                const a = document.createElement('a');
                a.href = item.url;
                a.target = '_blank';
                a.className = `badge ${colorClass}`;
                a.style.cssText = "text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-bottom: 0.5rem;";
                a.textContent = item.label;

                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("width", "12");
                svg.setAttribute("height", "12");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("fill", "none");
                svg.setAttribute("stroke", "currentColor");
                svg.setAttribute("stroke-width", "2");
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("d", "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3");
                svg.appendChild(path);
                a.appendChild(svg);

                badgeGrid.appendChild(a);
            });

            wrapper.appendChild(badgeGrid);
            return wrapper;
        };

        if (data.links) sourcesContainer.appendChild(createSection("Accès Rapide & Outils", data.links, "badge-green"));
        if (data.sources) sourcesContainer.appendChild(createSection("Sources Documentaires", data.sources, "badge-blue"));

    } catch (error) {
        console.error("Erreur de chargement de l'acteur:", error);
        document.getElementById('modal-title').textContent = "Erreur";
        document.getElementById('modal-history').textContent = "Impossible de charger les données de cet acteur.";
    }
}

/**
 * Ferme la modale
 */
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = 'auto';
}
