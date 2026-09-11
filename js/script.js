// ===== Header scroll effect =====
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
});

// ===== Mobile nav toggle =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close mobile nav when a link is clicked
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

// ===== Animated counters =====
const counters = document.querySelectorAll("[data-count]");
const runCounter = (el) => {
    const target = +el.dataset.count;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);
        el.textContent = value.toLocaleString() + (progress === 1 && target >= 1000 ? "+" : progress === 1 ? "+" : "");
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
};

// ===== Scroll reveal + counter trigger =====
const revealEls = document.querySelectorAll(
    ".feature-item, .doctor-card, .service-card, .testimonial, .about-content, .about-visual, .appointment-form, .appointment-info"
);
revealEls.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Trigger counters once hero stats are in view
const statsObserver = new IntersectionObserver(
    (entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                counters.forEach(runCounter);
                obs.disconnect();
            }
        });
    },
    { threshold: 0.4 }
);
if (counters.length) statsObserver.observe(counters[0]);

// ===== Appointment form =====
const form = document.getElementById("appointmentForm");
const success = document.getElementById("formSuccess");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = new FormData(form);
    const message =
        `*New Appointment Request*\n\n` +
        `Name: ${data.get("name")}\n` +
        `Phone: ${data.get("phone")}\n` +
        `Email: ${data.get("email")}\n` +
        `Doctor: ${data.get("doctor")}\n` +
        `Date: ${data.get("date")}\n` +
        `Time: ${data.get("time")}\n` +
        `Message: ${data.get("message") || "-"}`;

    const whatsappUrl = `https://wa.me/919989806544?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    success.hidden = false;
    form.reset();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => (success.hidden = true), 6000);
});

// Prevent selecting past dates
const dateInput = document.getElementById("date");
if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
