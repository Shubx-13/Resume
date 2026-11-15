// This target is set to the beginning of 24 April 2027 in Indian Standard Time.
const ipmatTarget = new Date("2027-04-24T00:00:00+05:30");

// This finds the visual timer in the footer.
const countdownElement = document.querySelector("#ipmat-countdown");

// This updates the timer once every second using the current time.
function updateCountdown() {
    const remainingTime = ipmatTarget.getTime() - new Date().getTime();

    // This replaces the timer with a completed message after the target date.
    if (remainingTime <= 0) {
        countdownElement.textContent = "IPMAT 2027 is here.";
        return;
    }

    // This converts the remaining milliseconds into clear time units.
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    // This writes the live countdown in the footer.
    countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// This draws the first countdown immediately instead of waiting one second.
updateCountdown();

// This keeps the countdown running every second.
setInterval(updateCountdown, 1000);

// This collects the navigation links that point to a section on this page.
const navigationLinks = document.querySelectorAll(".site-nav a[href^='#']");

// This collects the sections that can activate a navigation link while scrolling.
const observedSections = document.querySelectorAll("#story, #work, #experience, #experiments, #path, #philosophy, #contact, #manifesto");

// This updates navigation colour so visitors know where they are on the page.
function setActiveNavigation(sectionId) {
    navigationLinks.forEach((link) => {
        const isCurrentSection = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("is-active", isCurrentSection);
    });
}

// This watches each section and highlights its navigation link when it enters view.
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            setActiveNavigation(entry.target.id);
        }
    });
}, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
});

// This starts observing every section that appears in the navigation.
observedSections.forEach((section) => sectionObserver.observe(section));

// This changes the top navigation into a compact sidebar after the opening screen.
const siteHeader = document.querySelector(".site-header");

// This checks the scroll position whenever the visitor moves through the page.
function updateNavigationPosition() {
    siteHeader.classList.toggle("nav-sidebar", window.scrollY > 260);
}

// This sets the correct navigation position on the first page load.
updateNavigationPosition();

// This keeps the navigation position in sync with scrolling.
window.addEventListener("scroll", updateNavigationPosition, { passive: true });

// This collects sections and the footer for the blur-to-clear entry effect.
const revealTargets = document.querySelectorAll("main section:not(.hero-section)");

// This adds the hidden state before a target enters the visitor's view.
revealTargets.forEach((target) => target.classList.add("reveal-on-scroll"));

// This reveals each target once it reaches the central area of the viewport.
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
});

// This starts watching every section selected for the reveal effect.
revealTargets.forEach((target) => revealObserver.observe(target));

// This collects cards and content groups that should also sharpen into view.
const detailRevealTargets = document.querySelectorAll(
    ".achievement-card, .strength-item, .project-content, .experience-item, .stall-flip, .experiment-list > .experiment-item, .path-item, .philosophy-layout, .manifesto-layout, .contact-section"
);

// This adds the same blurred-to-clear treatment to the smaller visual units.
detailRevealTargets.forEach((target) => target.classList.add("reveal-unit"));

// This reveals cards and smaller content groups once they reach the viewport.
const detailRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            detailRevealObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: "0px 0px -8% 0px",
    threshold: 0.1
});

// This starts the smaller blur-to-clear reveals.
detailRevealTargets.forEach((target) => detailRevealObserver.observe(target));

// This finds the reversible Class 9 to Class 11 cotton-candy story.
const stallFlip = document.querySelector(".stall-flip");

// This stores whether the card is currently being manually explored by click.
let stallManualMode = false;

// This keeps the state and accessibility label in sync on both sides of the card.
function setStallFace(showRelaunch) {
    stallFlip.classList.toggle("is-flipped", showRelaunch);
    stallFlip.setAttribute("aria-pressed", String(showRelaunch));
}

// This previews the Class 11 relaunch as soon as the pointer enters the card.
stallFlip.addEventListener("mouseenter", () => {
    if (!stallManualMode) setStallFace(true);
});

// This always restores the Class 9 first version when the pointer leaves.
stallFlip.addEventListener("mouseleave", () => {
    stallManualMode = false;
    setStallFace(false);
});

// This switches from automatic hover to manual toggling for the current visit.
function toggleStallManually() {
    stallManualMode = true;
    setStallFace(!stallFlip.classList.contains("is-flipped"));
}

// This lets a mouse or touch visitor take manual control of the flip.
stallFlip.addEventListener("click", toggleStallManually);

// This gives keyboard visitors the same manual story control.
stallFlip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleStallManually();
    }
});

// This stores the personal manifesto one line at a time before typing begins.
const manifestoLines = Array.from(document.querySelectorAll(".manifesto p"));
let manifestoHasStarted = false;

// This types the manifesto with its original line breaks and pacing intact.
function typeManifestoLine(lineIndex) {
    if (lineIndex >= manifestoLines.length) {
        return;
    }

    const line = manifestoLines[lineIndex];
    const fullText = line.dataset.fullText;
    let characterIndex = 0;
    line.classList.add("is-typing");

    const typingInterval = window.setInterval(() => {
        line.textContent += fullText.charAt(characterIndex);
        characterIndex += 1;

        if (characterIndex >= fullText.length) {
            window.clearInterval(typingInterval);
            line.classList.remove("is-typing");
            window.setTimeout(() => typeManifestoLine(lineIndex + 1), 350);
        }
    }, 19);
}

// This waits until the note's actual text has reached the visitor's reading area.
const manifestoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !manifestoHasStarted) {
            manifestoHasStarted = true;
            manifestoLines.forEach((line) => {
                line.dataset.fullText = line.textContent.trim();
                line.textContent = "";
            });
            typeManifestoLine(0);
            manifestoObserver.unobserve(entry.target);
        }
    });
}, {
    rootMargin: "0px 0px -45% 0px",
    threshold: 0
});

// This starts watching the manifesto only when it exists on the page.
const manifesto = document.querySelector(".manifesto");
if (manifesto) {
    manifestoObserver.observe(manifesto);
}

// This makes the footer control reliably return to the top even when hash navigation is interrupted.
const backToTop = document.querySelector("#back-to-top");
if (backToTop) {
    backToTop.addEventListener("click", (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.replaceState(null, "", "#top");
    });
}

// This turns the footer signature into a short, celebratory route back to the top.
const loveEasterEgg = document.querySelector("#love-easter-egg");

// This sends a rapid burst of subtle hearts through the visible page.
function launchHeartBurst() {
    const burst = document.createElement("div");
    const heartColors = ["#ff684b", "#ff9770", "#f0eeee", "#f2a7a1"];

    burst.className = "heart-burst";

    for (let index = 0; index < 38; index += 1) {
        const heart = document.createElement("span");
        const angle = (Math.PI * 2 * index) / 38 + (Math.random() - 0.5) * 0.35;
        const distance = 150 + Math.random() * 720;

        heart.className = "heart-particle";
        heart.textContent = "♥";
        heart.style.setProperty("--heart-color", heartColors[index % heartColors.length]);
        heart.style.setProperty("--heart-size", `${14 + Math.random() * 28}px`);
        heart.style.setProperty("--heart-x", `${Math.cos(angle) * distance}px`);
        heart.style.setProperty("--heart-y", `${Math.sin(angle) * distance}px`);
        heart.style.setProperty("--heart-rotate", `${-180 + Math.random() * 360}deg`);
        heart.style.animationDelay = `${Math.random() * 0.13}s`;
        burst.appendChild(heart);
    }

    document.body.appendChild(burst);
    window.setTimeout(() => burst.remove(), 1600);
}

// This keeps the motion respectful for visitors who prefer reduced animation.
function returnToTopWithLove() {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        launchHeartBurst();
    }
}

// This starts the easter egg only when the handwritten footer is intentionally clicked.
if (loveEasterEgg) {
    loveEasterEgg.addEventListener("click", returnToTopWithLove);
}
