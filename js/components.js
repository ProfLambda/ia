/**
 * components.js
 * Gère l'injection dynamique de la navigation et du footer sur toutes les pages.
 * Version sécurisée : Pas de innerHTML.
 */

document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("nav-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    if (navPlaceholder) renderNavigation(navPlaceholder);
    if (footerPlaceholder) renderFooter(footerPlaceholder);

    // La logique du menu mobile est initialisée après l'injection
    initMobileMenu();

    // Ecoute globale de la touche Echap pour fermer les modales
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            // Fermeture de la modal vidéo (si présente et active)
            if (typeof closeModal === 'function') {
                closeModal();
            }

            // Fermeture des autres modales (Acteurs, Cours, etc.)
            const modals = [
                document.getElementById('modal-overlay'),
                document.getElementById('course-modal')
            ];

            modals.forEach(m => {
                if (m && (m.classList.contains('open') || m.classList.contains('active'))) {
                    if (typeof closeModal === 'function' && m.id === 'modal-overlay') { // Pour Acteurs qui a aussi un closeModal
                        closeModal();
                    } else {
                        m.classList.remove('open');
                        m.classList.remove('active');
                        document.body.style.overflow = 'auto';
                    }
                }
            });
        }
    });
});

function renderNavigation(container) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const nav = document.createElement("nav");
    nav.className = "top-nav";

    const navContainer = document.createElement("div");
    navContainer.className = "container nav-content";

    // Logo
    const logoLink = document.createElement("a");
    logoLink.href = "index.html";
    logoLink.className = "logo";

    // SVG Logo (using Namespace for SVG)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "24");
    svg.setAttribute("height", "24");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5");
    svg.appendChild(path);

    logoLink.appendChild(svg);

    // Brand Container (New Styled Logo)
    const brandContainer = document.createElement("div");
    brandContainer.style.cssText = "display: flex; flex-direction: column; line-height: 1.1; margin-left: 10px;";

    const brandName = document.createElement("span");
    brandName.textContent = "ProfLambda";
    brandName.style.cssText = "font-weight: 800; font-size: 1.1rem; color: var(--text-primary); letter-spacing: -0.02em;";

    const brandSub = document.createElement("span");
    brandSub.textContent = "Cours IA • Gemini";
    brandSub.style.cssText = "font-size: 0.7rem; font-weight: 600; color: var(--text-secondary); display: inline-block; position: relative; padding-bottom: 3px;";

    // Underline effect
    const underline = document.createElement("div");
    underline.style.cssText = "height: 3px; width: 100%; background: linear-gradient(90deg, #38bdf8, #8b5cf6); border-radius: 2px;";

    brandSub.appendChild(underline);
    brandContainer.appendChild(brandName);
    brandContainer.appendChild(brandSub);

    logoLink.appendChild(brandContainer);

    // Menu
    const menuWrapper = document.createElement("div");
    menuWrapper.className = "nav-menu-wrapper";

    const ul = document.createElement("ul");
    ul.className = "nav-links";

    const pages = [
        { name: "Accueil", url: "index.html" },
        { name: "Acteurs", url: "acteurs.html" },
        { name: "Concepts", url: "concepts.html" },
        { name: "Outils", url: "outils.html" },
        { name: "Gemini", url: "gemini.html" },
        {
            name: "Ressources",
            url: "#",
            subpages: [
                { name: "Glossaire & FAQ", url: "ressources.html" },
                { name: "Vidéos", url: "videos.html" },
                { name: "Exercices", url: "exercices.html" },
                { name: "Quizz Acteurs", url: "quizz-acteurs.html" }
            ]
        }
    ];

    pages.forEach(page => {
        const li = document.createElement("li");
        li.className = "nav-item";

        if (page.subpages) {
            li.classList.add("has-dropdown");
            const a = document.createElement("a");
            a.href = page.url;
            a.textContent = `${page.name} ▾`;
            if (currentPage === page.url || page.subpages.some(sp => sp.url === currentPage)) a.className = "active";
            li.appendChild(a);

            const dropdown = document.createElement("div");
            dropdown.className = "dropdown-menu";

            page.subpages.forEach(sub => {
                const subA = document.createElement("a");
                subA.href = sub.url;
                subA.className = "dropdown-item";
                subA.textContent = sub.name;
                if (currentPage === sub.url) subA.style.color = "var(--primary-color)";
                dropdown.appendChild(subA);
            });

            li.appendChild(dropdown);
        } else {
            const a = document.createElement("a");
            a.href = page.url;
            a.textContent = page.name;
            if (currentPage === page.url) a.className = "active";
            li.appendChild(a);
        }

        ul.appendChild(li);
    });

    menuWrapper.appendChild(ul);

    // Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-menu-toggle";
    toggleBtn.setAttribute("aria-label", "Menu");
    for (let i = 0; i < 3; i++) {
        toggleBtn.appendChild(document.createElement("span"));
    }

    navContainer.appendChild(logoLink);
    navContainer.appendChild(menuWrapper);
    navContainer.appendChild(toggleBtn);
    nav.appendChild(navContainer);

    container.appendChild(nav);
}

function renderFooter(container) {
    const footer = document.createElement("footer");

    const innerContainer = document.createElement("div");
    innerContainer.className = "container";

    const flexDiv = document.createElement("div");
    flexDiv.style.display = "flex";
    flexDiv.style.justifyContent = "space-between";
    flexDiv.style.alignItems = "center";
    flexDiv.style.flexWrap = "wrap";
    flexDiv.style.gap = "2rem";

    // Info Side
    const infoDiv = document.createElement("div");
    infoDiv.style.display = "flex";
    infoDiv.style.alignItems = "center";
    infoDiv.style.gap = "1rem";

    const brandSp = document.createElement("span");
    brandSp.style.fontWeight = "800";
    brandSp.style.color = "var(--primary-dark)";
    brandSp.textContent = "ProfLambda | Cours IA";

    const separator = document.createElement("span");
    separator.style.color = "var(--text-secondary)";
    separator.textContent = "|";

    const projectSp = document.createElement("span");
    projectSp.style.fontSize = "0.9rem";
    projectSp.textContent = "Projet pédagogique - © 2026 - zarbix.com";

    infoDiv.appendChild(brandSp);
    infoDiv.appendChild(separator);
    infoDiv.appendChild(projectSp);

    // Links Side
    const linksDiv = document.createElement("div");
    linksDiv.style.display = "flex";
    linksDiv.style.gap = "1.5rem";

    const footLinks = [
        { name: "FAQ", url: "ressources.html#faq" },
        { name: "Contact", url: "ressources.html#contact" },
        { name: "Zarbix.com", url: "https://zarbix.com" }
    ];

    footLinks.forEach(link => {
        const a = document.createElement("a");
        a.href = link.url;
        a.style.fontSize = "0.9rem";
        a.style.color = "var(--text-secondary)";
        a.textContent = link.name;
        linksDiv.appendChild(a);
    });

    flexDiv.appendChild(infoDiv);
    flexDiv.appendChild(linksDiv);
    innerContainer.appendChild(flexDiv);
    footer.appendChild(innerContainer);

    container.appendChild(footer);
}

function initMobileMenu() {
    // Petit délai pour s'assurer que le bouton est bien dans le DOM
    setTimeout(() => {
        const toggleBtn = document.querySelector(".mobile-menu-toggle");
        const navWrapper = document.querySelector(".nav-menu-wrapper");
        const navLinks = document.querySelectorAll(".nav-item a");

        if (toggleBtn && navWrapper) {
            const handleToggle = () => {
                navWrapper.classList.toggle("active");
                toggleBtn.classList.toggle("open");
            };

            toggleBtn.addEventListener("click", handleToggle);

            navLinks.forEach((link) => {
                link.addEventListener("click", () => {
                    navWrapper.classList.remove("active");
                    toggleBtn.classList.remove("open");
                });
            });

            document.addEventListener("click", (e) => {
                if (!navWrapper.contains(e.target) && !toggleBtn.contains(e.target) && navWrapper.classList.contains("active")) {
                    navWrapper.classList.remove("active");
                    toggleBtn.classList.remove("open");
                }
            });

            // Prevent resize animations
            let resizeTimer;
            window.addEventListener("resize", () => {
                document.body.classList.add("resize-animation-stopper");
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    document.body.classList.remove("resize-animation-stopper");
                }, 400);
            });
        }
    }, 50);
}
