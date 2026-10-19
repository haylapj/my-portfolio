
/* -------------------------------------------------------
   Haileab Dejene — Portfolio JavaScript
   ------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    // ---------------------------------------------------
    // 1. AUTOMATIC FOOTER YEAR
    // ---------------------------------------------------

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // ---------------------------------------------------
    // 2. MOBILE NAVIGATION MENU
    // ---------------------------------------------------

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    function closeMobileMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && navLinks) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("show");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        // Close the menu after selecting a navigation link.
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMobileMenu);
        });

        // Close the menu when clicking outside it.
        document.addEventListener("click", (event) => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        // Close the mobile menu when returning to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 680) {
                closeMobileMenu();
            }
        });

        // Close the menu with Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMobileMenu();
                menuToggle.focus();
            }
        });
    }


    // ---------------------------------------------------
    // 3. DARK / LIGHT THEME TOGGLE
    // ---------------------------------------------------

    const themeToggle = document.querySelector(".theme-toggle");
    const savedTheme = localStorage.getItem("portfolio-theme");

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);

        if (themeToggle) {
            const isLight = theme === "light";

            themeToggle.textContent = isLight ? "☾" : "☀";
            themeToggle.setAttribute(
                "aria-label",
                isLight ? "Switch to dark theme" : "Switch to light theme"
            );
            themeToggle.setAttribute("title", themeToggle.getAttribute("aria-label"));
        }

        // Update browser color controls where supported.
        const colorScheme = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (colorScheme) {
            colorScheme.setAttribute(
                "content",
                theme === "light" ? "#f7f8ff" : "#0b1020"
            );
        }
    }

    const initialTheme =
        savedTheme === "light" || savedTheme === "dark"
            ? savedTheme
            : "dark";

    applyTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme") || "dark";

            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(nextTheme);
            localStorage.setItem("portfolio-theme", nextTheme);
        });
    }


    // ---------------------------------------------------
    // 4. HERO TYPING ANIMATION
    // ---------------------------------------------------

    const typingElement = document.querySelector(".typing-text");

    if (typingElement) {
        const phrases = [
            "Software Development Student",
            "Aspiring Web Developer",
            "Frontend Developer",
            "Creative Problem Solver"
        ];

        let phraseIndex = 0;
        let characterIndex = 0;
        let deleting = false;
        let typingTimer;

        const typingSpeed = 75;
        const deletingSpeed = 38;
        const pauseAfterTyping = 1500;
        const pauseAfterDeleting = 350;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (!deleting) {
                characterIndex++;

                typingElement.textContent = currentPhrase.slice(
                    0,
                    characterIndex
                );

                if (characterIndex >= currentPhrase.length) {
                    deleting = true;
                    typingTimer = window.setTimeout(
                        typeEffect,
                        pauseAfterTyping
                    );
                    return;
                }

                typingTimer = window.setTimeout(typeEffect, typingSpeed);
            } else {
                characterIndex--;

                typingElement.textContent = currentPhrase.slice(
                    0,
                    characterIndex
                );

                if (characterIndex <= 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;

                    typingTimer = window.setTimeout(
                        typeEffect,
                        pauseAfterDeleting
                    );
                    return;
                }

                typingTimer = window.setTimeout(
                    typeEffect,
                    deletingSpeed
                );
            }
        }

        // Avoid a rapidly moving animation for reduced-motion users.
        const reduceMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        if (reduceMotion.matches) {
            typingElement.textContent = phrases[0];
        } else {
            typingElement.textContent = "";

            // Keep a reference so the animation can be stopped if needed.
            typingTimer = window.setTimeout(typeEffect, 500);
        }

        // Stop typing when the page is hidden and restart when visible.
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                window.clearTimeout(typingTimer);
            } else if (!reduceMotion.matches) {
                window.clearTimeout(typingTimer);
                typingTimer = window.setTimeout(typeEffect, 300);
            }
        });
    }


    // ---------------------------------------------------
    // 5. PROJECT FILTERS
    // ---------------------------------------------------

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedFilter = (
                    button.dataset.filter || "all"
                ).toLowerCase();

                // Mark the selected filter as active.
                filterButtons.forEach((item) => {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );
                });

                // Show only matching project cards.
                projectCards.forEach((card) => {
                    const categories = (
                        card.dataset.category || "all"
                    )
                        .toLowerCase()
                        .split(/\s+/);

                    const shouldShow =
                        selectedFilter === "all" ||
                        categories.includes(selectedFilter);

                    card.classList.toggle("hide", !shouldShow);
                    card.setAttribute(
                        "aria-hidden",
                        String(!shouldShow)
                    );
                });
            });
        });

        // Initialize accessible button states.
        filterButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("active"))
            );
        });
    }


    // ---------------------------------------------------
    // 6. CONTACT FORM VALIDATION
    // ---------------------------------------------------

    const contactForm = document.querySelector(".contact-form");
    const formStatus = document.querySelector(".form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            const nameInput = contactForm.querySelector(
                'input[name="name"]'
            );

            const emailInput = contactForm.querySelector(
                'input[name="email"]'
            );

            const messageInput = contactForm.querySelector(
                'textarea[name="message"]'
            );

            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const message = messageInput
                ? messageInput.value.trim()
                : "";

            if (!name || !email || !message) {
                event.preventDefault();

                if (formStatus) {
                    formStatus.textContent =
                        "Please complete all fields before sending.";
                }

                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                event.preventDefault();

                if (formStatus) {
                    formStatus.textContent =
                        "Please enter a valid email address.";
                }

                if (emailInput) {
                    emailInput.focus();
                }

                return;
            }

            /*
             * If the form has a real Formspree endpoint, the browser
             * submits it normally. Otherwise, stop submission and
             * explain that setup is required.
             */
            const formAction = contactForm.getAttribute("action") || "";

            const hasRealEndpoint =
                formAction.includes("formspree.io/f/") &&
                !formAction.includes("your_form_id");

            if (!hasRealEndpoint) {
                event.preventDefault();

                if (formStatus) {
                    formStatus.textContent =
                        "Your form is valid, but a form service must be connected before messages can be sent.";
                }

                return;
            }

            if (formStatus) {
                formStatus.textContent = "Sending your message...";
            }
        });
    }


    // ---------------------------------------------------
    // 7. UPDATE THE CURRENT YEAR AND NAVIGATION BEHAVIOR
    // ---------------------------------------------------

    // Add smooth navigation behavior for browsers that support it.
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches
                        ? "auto"
                        : "smooth",
                    block: "start"
                });

                // Keep the URL hash in sync with the clicked section.
                if (history.replaceState) {
                    history.replaceState(null, "", targetId);
                }
            }
        });
    });

});
