<script>
    // =========================================================
    // script.js - Portfolio Animations (Rewritten for Clarity & Modularity)
    // =========================================================

    document.addEventListener('DOMContentLoaded', () => {
        // --- 1. CONFIGURATION ---
        const CONFIG = {
            HERO_NAME: "SAIFUL ISLAM SAGOR",
            STAR_COUNT: 200,
            SCROLL_THRESHOLD: 0.2, // 20% visibility
            PHOTO_SOURCES: {
                1: "https://placehold.co/400x400/292e3a/ffffff?text=Addhayan+Academy",
                2: "https://placehold.co/400x400/161b22/ffffff?text=Esquire+Knit",
                3: "https://placehold.co/400x400/30363d/ffffff?text=National+Nursery"
            }
        };

        // --- 2. DOM ELEMENTS ---
        const DOM = {
            nameContainer: document.getElementById("animated-name"),
            introTextWrapper: document.getElementById("intro-text-wrapper"),
            heroDescription: document.getElementById("hero-description"),
            heroButtons: document.getElementById("hero-buttons"),
            mobileMenuButton: document.getElementById('mobile-menu-button'),
            mobileMenu: document.getElementById('mobile-menu'),
            starBackground: document.getElementById('star-background'),
            photoContainer: document.getElementById('current-experience-photo'),
            photoNavButtons: document.querySelectorAll('.experience-photo-nav'),
            skillItems: document.querySelectorAll('.skill-item'),
            animatedTargets: document.querySelectorAll('.animate-up, .animate-left, .animate-right, .slide-in-item, .skill-item, .experience-item')
        };
        
        // --- 3. STATE ---
        let currentPhotoIndex = 1;


        // =========================================================
        // A. HERO SECTION ANIMATION
        // =========================================================

        /**
         * Splits the hero name and applies a staggered slide-in animation.
         */
        const setupHeroAnimation = () => {
            if (!DOM.nameContainer) return;

            DOM.nameContainer.innerHTML = CONFIG.HERO_NAME
                .split('')
                .map(char => `<span class="name-char">${char === ' ' ? '&nbsp;' : char}</span>`)
                .join('');

            const chars = DOM.nameContainer.querySelectorAll('.name-char');

            chars.forEach((char, index) => {
                const delay = index * 0.05; // 50ms stagger
                // Note: The 'letter-slide' keyframe is defined in CSS
                char.style.animation = `letter-slide 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`;
            });

            // Reveal the rest of the hero content after the name finishes
            const totalCharDelay = CONFIG.HERO_NAME.length * 0.05 + 0.5;

            setTimeout(() => {
                DOM.introTextWrapper.classList.remove('initial-hidden');
                DOM.heroDescription.classList.remove('initial-hidden');
                DOM.heroButtons.classList.remove('initial-hidden');
            }, totalCharDelay * 1000 + 100);
        };

        // =========================================================
        // B. NIGHT SKY GENERATION
        // =========================================================

        /**
         * Dynamically generates twinkling stars and meteors.
         */
        const generateStars = () => {
            if (!DOM.starBackground) return;
            const colors = ['#fff', '#fcd34d', '#bae6fd']; 

            // Create stars
            for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
                const star = document.createElement('div');
                star.style.cssText = `
                    width: ${Math.random() * 2 + 1}px;
                    height: ${star.style.width};
                    background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    position: absolute;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    opacity: ${Math.random()};
                    animation: twinkle ${Math.random() * 4 + 2}s infinite alternate ease-in-out;
                    z-index: 0;
                `;
                DOM.starBackground.appendChild(star);
            }

            // Add a few shooting stars
            for (let i = 0; i < 3; i++) {
                const meteor = document.createElement('div');
                meteor.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 100px;
                    background: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
                    top: ${Math.random() * 10}%;
                    left: ${Math.random() * 100}%;
                    animation: meteor-fall ${Math.random() * 10 + 5}s linear infinite;
                    z-index: 0;
                `;
                DOM.starBackground.appendChild(meteor);
            }
        };

        // =========================================================
        // C. SCROLL REVEAL (Intersection Observer)
        // =========================================================

        /**
         * Sets up the Intersection Observer to reveal elements on scroll.
         */
        const setupScrollReveal = () => {
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: CONFIG.SCROLL_THRESHOLD
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target); // Stop observing once visible
                    }
                });
            }, observerOptions);

            DOM.animatedTargets.forEach((el, index) => {
                // Apply stagger delay specifically for lists/grids (skills, projects, experience)
                if (el.classList.contains('skill-item') || el.classList.contains('slide-in-item') || el.classList.contains('experience-item')) {
                    // Stagger items up to 4 per row
                    el.style.transitionDelay = `${(index % 4) * 0.15}s`; 
                }
                observer.observe(el);
            });
        };

        // =========================================================
        // D. SKILLS & MOBILE MENU UTILITIES
        // =========================================================

        /**
         * Populates the skills sections with icons and names from data attributes.
         */
        const populateSkills = () => {
            DOM.skillItems.forEach(item => {
                const logoClass = item.getAttribute('data-logo');
                const name = item.getAttribute('data-name');

                if (logoClass && name) {
                    item.innerHTML = `
                        <i class="${logoClass}"></i>
                        <p class="text-white font-semibold">${name}</p>
                    `;
                }
            });
        };

        /**
         * Toggles the mobile menu visibility.
         */
        const setupMobileMenu = () => {
            if (!DOM.mobileMenuButton) return;

            DOM.mobileMenuButton.addEventListener('click', () => {
                DOM.mobileMenu.classList.toggle('hidden');
            });

            // Close menu when a link is clicked
            DOM.mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    DOM.mobileMenu.classList.add('hidden');
                });
            });
        };


        // =========================================================
        // E. EXPERIENCE PHOTO CAROUSEL
        // =========================================================

        /**
         * Cycles the experience photo and updates navigation dots.
         */
        const changeExperiencePhoto = (newIndex) => {
            if (newIndex === currentPhotoIndex) return;

            const newPhotoSrc = CONFIG.PHOTO_SOURCES[newIndex];

            // 1. Fade out
            DOM.photoContainer.style.opacity = '0';

            setTimeout(() => {
                // 2. Change source and update state
                DOM.photoContainer.src = newPhotoSrc;
                currentPhotoIndex = newIndex;
                
                // 3. Update navigation dots
                DOM.photoNavButtons.forEach(btn => {
                    const btnIndex = parseInt(btn.getAttribute('data-photo'));
                    const icon = btn.querySelector('i');
                    if (btnIndex === newIndex) {
                        icon.classList.replace('far', 'fas');
                    } else {
                        icon.classList.replace('fas', 'far');
                    }
                });
                
                // 4. Fade in
                DOM.photoContainer.style.opacity = '1';

            }, 500); // Matches CSS transition duration
        };

        /**
         * Sets up the click handlers for the photo navigation
         */
        const setupExperienceCarousel = () => {
            if (!DOM.photoContainer) return;
            
            // Initialize the first photo
            DOM.photoContainer.src = CONFIG.PHOTO_SOURCES[currentPhotoIndex]; 

            DOM.photoNavButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newIndex = parseInt(btn.getAttribute('data-photo'));
                    changeExperiencePhoto(newIndex);
                });
            });
        };

        // =========================================================
        // F. INITIALIZATION
        // =========================================================

        // Execute all setup functions
        generateStars();
        populateSkills();
        setupMobileMenu();
        setupHeroAnimation();
        setupScrollReveal();
        setupExperienceCarousel();
    });
</script>