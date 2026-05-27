/* =====================================================
   NESTIO PRESCHOOL — script.js
   All Interactions, Animations & Dynamic Behavior
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------
     1. STICKY NAVBAR + ACTIVE LINK ON SCROLL
  -------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function onScroll() {
    // Add scrolled class for sticky nav background
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active nav link based on current section
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run on load

  /* --------------------------------------------------
     2. HAMBURGER MOBILE MENU
  -------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinksMenu = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navLinksMenu.classList.toggle("open");
    hamburger.classList.toggle("active");
  });

  // Close menu on nav link click
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksMenu.classList.remove("open");
      hamburger.classList.remove("active");
    });
  });

  /* --------------------------------------------------
     3. SCROLL REVEAL ANIMATION (IntersectionObserver)
  -------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Optionally unobserve after reveal (one-time animation)
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* --------------------------------------------------
     4. TESTIMONIALS SLIDER
  -------------------------------------------------- */
  const testiCards = document.querySelectorAll(".testi-card");
  const dotBtns = document.querySelectorAll(".dot-btn");
  const prevBtn = document.getElementById("testiPrev");
  const nextBtn = document.getElementById("testiNext");
  let currentTesti = 0;
  let autoSlideTimer;

  function showTesti(index) {
    testiCards.forEach((card) => card.classList.remove("active"));
    dotBtns.forEach((dot) => dot.classList.remove("active"));

    currentTesti = (index + testiCards.length) % testiCards.length;
    testiCards[currentTesti].classList.add("active");
    dotBtns[currentTesti].classList.add("active");
  }

  function nextTesti() {
    showTesti(currentTesti + 1);
  }
  function prevTesti() {
    showTesti(currentTesti - 1);
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(nextTesti, 4500);
  }
  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextTesti();
    resetAutoSlide();
  });
  prevBtn.addEventListener("click", () => {
    prevTesti();
    resetAutoSlide();
  });
  dotBtns.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      showTesti(i);
      resetAutoSlide();
    });
  });

  startAutoSlide();

  /* --------------------------------------------------
     5. CONTACT FORM SUBMIT
  -------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector(".cf-submit");
      btn.textContent = "✅ Message Sent!";
      btn.style.background = "#128C7E";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Send Message 🌱";
        btn.style.background = "";
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* --------------------------------------------------
     6. SMOOTH SCROLL FOR ALL ANCHOR LINKS
  -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 8;
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* --------------------------------------------------
     7. ACTIVITY CARD DYNAMIC BACKGROUND ON HOVER
  -------------------------------------------------- */
  const activityCards = document.querySelectorAll(".activity-card");
  activityCards.forEach((card) => {
    const color = card.getAttribute("data-color");
    card.addEventListener("mouseenter", () => {
      card.style.background = color;
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "";
    });
  });

  /* --------------------------------------------------
     8. FLOATING HERO ELEMENTS — MOUSE PARALLAX
  -------------------------------------------------- */
  const blobs = document.querySelectorAll(".blob");
  document.addEventListener("mousemove", (e) => {
    const { clientX: x, clientY: y } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    blobs.forEach((blob, i) => {
      const intensity = (i + 1) * 8;
      blob.style.transform = `translate(${dx * intensity}px, ${dy * intensity}px)`;
    });
  });

  /* --------------------------------------------------
     9. COUNTER ANIMATION FOR HERO STATS
  -------------------------------------------------- */
  const statNums = document.querySelectorAll(".stat-num");

  function animateCounter(el) {
    const target = el.textContent;
    const suffix = target.replace(/[0-9]/g, "");
    const number = parseInt(target);
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        current = number;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, stepTime);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.8 },
  );

  statNums.forEach((el) => statsObserver.observe(el));

  /* --------------------------------------------------
     10. GALLERY ITEM STAGGER REVEAL
  -------------------------------------------------- */
  const galleryItems = document.querySelectorAll(".gallery-item");
  galleryItems.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
  });
});
