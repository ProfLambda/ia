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
			if (typeof closeModal === "function") {
				closeModal();
			}

			// Fermeture des autres modales (Acteurs, Cours, etc.)
			const modals = [
				document.getElementById("modal-overlay"),
				document.getElementById("course-modal"),
			];

			modals.forEach((m) => {
				if (
					m &&
					(m.classList.contains("open") || m.classList.contains("active"))
				) {
					if (
						typeof closeModal === "function" &&
						m.id === "modal-overlay"
					) {
						// Pour Acteurs qui a aussi un closeModal
						closeModal();
					} else {
						m.classList.remove("open");
						m.classList.remove("active");
						document.body.style.overflow = "auto";
					}
				}
			});
		}
	});
});

function renderNavigation(container) {
	const currentPage =
		window.location.pathname.split("/").pop() || "index.html";

	const nav = document.createElement("nav");
	nav.className = "top-nav";

	const navContainer = document.createElement("div");
	navContainer.className = "container nav-content";

	// Logo ProfLambda
	const logoLink = document.createElement("a");
	logoLink.href = "index.html";
	logoLink.className = "logo";
	logoLink.style.cssText = "display: flex; align-items: center; gap: 12px; transition: opacity 0.3s ease;";
	logoLink.onmouseover = () => logoLink.style.opacity = "0.8";
	logoLink.onmouseout = () => logoLink.style.opacity = "1";

	// Thumbnail image (Local Logo)
	const logoImg = document.createElement("img");
	logoImg.src = "assets/proflambda.png";
	logoImg.alt = "ProfLambda";
	logoImg.style.cssText = "width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.1);";

	// Add text next to it
	const logoText = document.createElement("span");
	logoText.textContent = "ProfLambda";
	logoText.style.cssText = "font-weight: 800; font-size: 1.2rem; color: var(--text-primary); letter-spacing: -0.02em;";

	logoLink.appendChild(logoImg);
	logoLink.appendChild(logoText);

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
		{ name: "Éthique", url: "ethique.html" },
		{ name: "Sécurité", url: "securite.html" },

		{
			name: "Ressources",
			url: "#",
			subpages: [
				{ name: "Guide Particulier", url: "guide-particulier.html" },
				{ name: "Guide Entreprise", url: "guide-entreprise.html" },
				{ name: "Glossaire & FAQ", url: "ressources.html" },
				{ name: "Vidéos", url: "videos.html" },
				{ name: "Exercices", url: "exercices.html" },
				{ name: "Quizz Acteurs", url: "quizz-acteurs.html" },
				{ name: "Liens utiles", url: "liste_liens.html" },
			],
		},
	];

	pages.forEach((page) => {
		const li = document.createElement("li");
		li.className = "nav-item";

		if (page.subpages) {
			li.classList.add("has-dropdown");
			const a = document.createElement("a");
			a.href = page.url;
			a.textContent = page.name;
			if (
				currentPage === page.url ||
				page.subpages.some((sp) => sp.url === currentPage)
			)
				a.className = "active";
			li.appendChild(a);

			const dropdown = document.createElement("div");
			dropdown.className = "dropdown-menu";

			page.subpages.forEach((sub) => {
				const subA = document.createElement("a");
				subA.href = sub.url;
				subA.className = "dropdown-item";
				subA.textContent = sub.name;
				if (currentPage === sub.url)
					subA.style.color = "var(--primary-color)";
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
	projectSp.textContent = "Projet pédagogique - © 2026 - proflambda.github.io";

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
		{
			name: "Proflambda.github.io/ia",
			url: "https://proflambda.github.io/ia",
		},
	];

	footLinks.forEach((link) => {
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
				link.addEventListener("click", (e) => {
					const parent = link.closest(".nav-item");
					if (parent && parent.classList.contains("has-dropdown") && window.innerWidth <= 900) {
						// Only prevent default if clicking the main link or the arrow
						if (link.getAttribute("href") === "#") {
							e.preventDefault();
							parent.classList.toggle("mobile-open");
						} else {
							// If it's a real link, let it navigate (and menu is closed by general logic)
							navWrapper.classList.remove("active");
							toggleBtn.classList.remove("open");
						}
					} else {
						navWrapper.classList.remove("active");
						toggleBtn.classList.remove("open");
					}
				});
			});

			document.addEventListener("click", (e) => {
				if (
					!navWrapper.contains(e.target) &&
					!toggleBtn.contains(e.target) &&
					navWrapper.classList.contains("active")
				) {
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
