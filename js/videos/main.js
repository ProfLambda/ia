let allVideos = [];
let currentSort = 'category';

document.addEventListener('DOMContentLoaded', () => {
    initVideos();
    setupFilters();
});

/**
 * Charge les données initiales
 */
async function initVideos() {
    const container = document.getElementById('videos-container');
    if (!container) return;

    try {
        const response = await fetch('data/videos.json');
        if (!response.ok) throw new Error('Erreur chargement vidéos');
        allVideos = await response.json();

        renderVideos(currentSort);
        renderChannelBadges();
        setupModal();

    } catch (error) {
        console.error('Erreur Vidéos:', error);
        container.innerHTML = `<p style="text-align: center; color: var(--danger-color);">Erreur lors du chargement des vidéos. Veuillez réessayer plus tard.</p>`;
    }
}

/**
 * Configure les boutons de filtrage
 */
function setupFilters() {
    const tabs = document.querySelectorAll('.btn-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;

            // Update UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Set sort and re-render
            currentSort = tab.dataset.sort;
            renderVideos(currentSort);
        });
    });
}

/**
 * Regroupe et affiche les vidéos
 */
function renderVideos(groupKey) {
    const container = document.getElementById('videos-container');
    if (!container) return;

    container.textContent = '';

    // Groupement des vidéos
    const grouped = allVideos.reduce((acc, video) => {
        const key = video[groupKey] || 'Autre';
        if (!acc[key]) acc[key] = [];
        acc[key].push(video);
        return acc;
    }, {});

    // Rendu des sections
    Object.keys(grouped).sort().forEach(groupName => {
        const section = document.createElement('div');
        section.className = 'section-fade-in';
        section.style.marginBottom = '4rem';

        const sectionTitle = document.createElement('h2');
        sectionTitle.textContent = groupName;
        sectionTitle.style.marginBottom = '2rem';
        sectionTitle.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        sectionTitle.style.paddingBottom = '0.5rem';

        const grid = document.createElement('div');
        grid.className = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        grid.style.gap = '2rem';

        grouped[groupName].forEach(video => {
            const card = createVideoCard(video, groupKey);
            grid.appendChild(card);
        });

        section.appendChild(sectionTitle);
        section.appendChild(grid);
        container.appendChild(section);
    });
}

/**
 * Crée une carte vidéo individuelle
 */
function createVideoCard(video, groupKey) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.padding = '0';
    card.style.overflow = 'hidden';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';

    // Vignette
    const media = document.createElement('div');
    media.className = 'card-media ratio-16-9';
    media.style.backgroundImage = `url('${video.thumbnail}')`;
    media.style.position = 'relative';
    media.onclick = () => openVideo(video.url);

    const playBtn = document.createElement('div');
    playBtn.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60px; height: 60px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s; cursor: pointer;";
    playBtn.innerHTML = '<span style="color: #ef4444; font-size: 1.5rem; margin-left: 4px;">▶</span>';
    media.appendChild(playBtn);

    // Contenu
    const content = document.createElement('div');
    content.style.padding = '1.5rem';
    content.style.flex = '1';

    // Tag (affiche l'info secondaire selon le tri)
    const secondaryInfo = groupKey === 'category' ? video.channel : video.category;
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.style.marginBottom = '0.5rem';
    badge.style.display = 'inline-block';
    badge.textContent = secondaryInfo;
    badge.style.background = groupKey === 'category' ? 'rgba(37, 99, 235, 0.1)' : 'rgba(16, 185, 129, 0.1)';
    badge.style.color = groupKey === 'category' ? 'var(--primary-color)' : 'var(--success-color)';

    const title = document.createElement('h3');
    title.textContent = video.title;
    title.style.fontSize = '1.1rem';
    title.style.marginBottom = '0.8rem';

    const desc = document.createElement('p');
    desc.textContent = video.description;
    desc.style.fontSize = '0.9rem';
    desc.style.color = 'var(--text-secondary)';

    const link = document.createElement('button');
    link.className = 'btn btn-primary';
    link.style.marginTop = '1.5rem';
    link.style.width = '100%';
    link.textContent = 'Regarder la vidéo';
    link.onclick = (e) => {
        e.stopPropagation();
        openVideo(video.url);
    };

    content.appendChild(badge);
    content.appendChild(title);
    content.appendChild(desc);
    content.appendChild(link);

    card.appendChild(media);
    card.appendChild(content);

    return card;
}

/**
 * Modal Logic (Identique à l'original)
 */
function setupModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModal');
    if (!modal || !closeBtn) return;
    closeBtn.onclick = () => closeModal();
    window.onclick = (event) => { if (event.target === modal) closeModal(); };
}

function openVideo(url) {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('playerContainer');
    if (!modal || !container) return;

    let videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    container.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                width="100%" height="100%" allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
        </iframe>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const container = document.getElementById('playerContainer');
    if (!modal || !container) return;
    modal.classList.remove('active');
    container.innerHTML = '';
    document.body.style.overflow = '';
}

/**
 * Affiche les badges de toutes les chaînes YouTube en bas de page
 */
function renderChannelBadges() {
    const badgeContainer = document.getElementById('channels-footer');
    if (!badgeContainer) return;

    // Extraire les chaînes uniques et les trier
    const channels = [...new Set(allVideos.map(v => v.channel))].sort();

    badgeContainer.textContent = '';

    channels.forEach(channel => {
        const span = document.createElement('span');
        span.className = 'badge';
        span.style.padding = '0.6rem 1.2rem';
        span.style.borderRadius = '50px';
        span.style.background = 'rgba(255, 255, 255, 0.5)';
        span.style.backdropFilter = 'blur(10px)';
        span.style.border = '1px solid rgba(0, 0, 0, 0.05)';
        span.style.color = 'var(--text-secondary)';
        span.style.fontWeight = '600';
        span.style.fontSize = '0.85rem';
        span.style.transition = 'all 0.3s ease';
        span.style.cursor = 'default';

        span.textContent = channel;

        // Effet au survol léger (visuel uniquement)
        span.onmouseover = () => {
            span.style.background = 'var(--primary-color)';
            span.style.color = 'white';
            span.style.transform = 'translateY(-2px)';
        };
        span.onmouseout = () => {
            span.style.background = 'rgba(255, 255, 255, 0.5)';
            span.style.color = 'var(--text-secondary)';
            span.style.transform = 'translateY(0)';
        };

        badgeContainer.appendChild(span);
    });
}
