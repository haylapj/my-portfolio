// DOM elements
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const typingTextElement = document.getElementById("typing-text");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

// 1. Mobile Menu Toggle
menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("show");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close menu when clicking links
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// 2. Dark/Light Theme Toggle
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.textContent = "🌙";
}

themeToggle.addEventListener("click", function () {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
        document.documentElement.removeAttribute("data-theme");
        themeIcon.textContent = "☀️";
        localStorage.setItem("portfolio-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.textContent = "🌙";
        localStorage.setItem("portfolio-theme", "light");
    }
});

// 3. Typing Effect
const roles = ["Student Developer", "Frontend Learner", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
    }

    setTimeout(typeEffect, speed);
}

document.addEventListener("DOMContentLoaded", typeEffect);

// 4. Project Filters
filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        filterBtns.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        const filter = this.getAttribute("data-filter");

        projectCards.forEach(card => {
            const category = card.getAttribute("data-category");
            if (filter === "all" || category.includes(filter)) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    });
});

// 5. Contact Form Handler
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const data = new FormData(e.target);

        fetch(e.target.action, {
            method: contactForm.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                formStatus.style.color = "green";
                formStatus.textContent = "Thank you! Message sent successfully.";
                contactForm.reset();
            } else {
                formStatus.style.color = "red";
                formStatus.textContent = "Oops! Something went wrong.";
            }
        }).catch(() => {
            formStatus.style.color = "red";
            formStatus.textContent = "Oops! Something went wrong.";
        });
    });
}

// 6. Current Year
document.getElementById("year").textContent = new Date().getFullYear();