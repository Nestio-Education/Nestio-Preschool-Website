// =========================================================
// SpaceECE Landing Interactions
// Clean, lightweight, dependency-free
// =========================================================

(() => {
  const loader = document.getElementById("logoLoader");
  if (loader) {
    document.body.classList.add("is-loading");
    window.addEventListener("load", () => {
      window.setTimeout(() => {
        loader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
      }, 850);
    });
  }

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  const nav = document.getElementById("siteNav");
  const hamburger = document.getElementById("hamburger");

  // Header switches to white only after passing the hero area
  const updateHeaderState = () => {
    const heroThreshold = hero ? Math.max(56, hero.offsetHeight - header.offsetHeight - 24) : 50;
    header.classList.toggle("scrolled", window.scrollY > heroThreshold);
  };
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  // Mobile menu behavior
  hamburger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // FAQ accordion with smooth measured height
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-toggle");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;

    answer.style.maxHeight = "0px";
    button.addEventListener("click", () => {
      const willOpen = !item.classList.contains("active");

      faqItems.forEach((other) => {
        const otherButton = other.querySelector(".faq-toggle");
        const otherAnswer = other.querySelector(".faq-answer");
        if (!otherButton || !otherAnswer) return;
        other.classList.remove("active");
        otherButton.setAttribute("aria-expanded", "false");
        otherAnswer.style.maxHeight = "0px";
      });

      if (willOpen) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  // Scroll reveal for non-hero sections
  const revealItems = document.querySelectorAll(".reveal");
  revealItems.forEach((item, idx) => {
    item.style.transitionDelay = `${(idx % 6) * 45}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -25px 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Offer countdown timer
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (hoursEl && minutesEl && secondsEl) {
    const deadline = Date.now() + (12 * 60 * 60 + 34 * 60 + 56) * 1000;

    const tick = () => {
      const diff = Math.max(0, deadline - Date.now());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    };

    tick();
    window.setInterval(tick, 1000);
  }
})();
