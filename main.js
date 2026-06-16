// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(r => observer.observe(r));
 
// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});
 
// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1800;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(ease * target) + '+';
        if(p < 1) requestAnimationFrame(tick);
        else el.textContent = target + '+';
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));
 
// ── MODAL ──
const modal = document.getElementById('modal');
function openModal() { modal.classList.add('open'); }
function closeModalFn() { modal.classList.remove('open'); }
document.getElementById('modalClose').addEventListener('click', closeModalFn);
modal.addEventListener('click', e => { if(e.target === modal) closeModalFn(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModalFn(); });
 
function submitModal() {
  const n = document.getElementById('mName').value.trim();
  const p = document.getElementById('mPhone').value.trim();
  const a = document.getElementById('mAge').value;
  if(!n || !p || !a) { alert('Please fill all fields.'); return; }
  document.getElementById('modalForm').style.display='none';
  document.getElementById('modalSuccess').style.display='block';
  // Send to WhatsApp as fallback
  setTimeout(()=>{
    window.open(`https://wa.me/919096305648?text=Hi%20Nestio%2C%20I%27d%20like%20to%20book%20a%20free%20visit.%20Name%3A%20${encodeURIComponent(n)}%20%7C%20Phone%3A%20${encodeURIComponent(p)}%20%7C%20Child%20Age%3A%20${encodeURIComponent(a)}`,'_blank');
  }, 1500);
}
 
// ── CONTACT FORM ──
function submitContactForm() {
  const n = document.getElementById('cfName').value.trim();
  const p = document.getElementById('cfPhone').value.trim();
  const a = document.getElementById('cfAge').value;
  if(!n || !p || !a) { alert('Please fill all 3 fields.'); return; }
  document.getElementById('contactForm').style.display='none';
  document.getElementById('contactSuccess').classList.add('show');
  setTimeout(()=>{
    window.open(`https://wa.me/919096305648?text=Hi%20Nestio%2C%20Book%20a%20Free%20Visit.%20Name%3A%20${encodeURIComponent(n)}%20%7C%20Phone%3A%20${encodeURIComponent(p)}%20%7C%20Age%3A%20${encodeURIComponent(a)}`,'_blank');
  }, 1500);
}
 
// ── SMOOTH ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if(window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = '';
    a.style.background = '';
    if(a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--teal)';
      a.style.background = 'var(--teal-light)';
    }
  });
});
 
// ── HAMBURGER / MOBILE MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobClose = document.getElementById('mobClose');
function closeMob() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
}
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
});
mobClose.addEventListener('click', closeMob);
// ── INFINITE CAROUSEL ──
function infiniteCarousel(rowId, speed, direction) {
  const row = document.getElementById(rowId);
  if (!row) return;
  let pos = 0;
  let paused = false;
  if (direction === 'right') {
    const totalW = Array.from(row.children).reduce((s,el)=>s+el.offsetWidth+14,0);
    pos = -totalW / 2;
  }
  row.addEventListener('mouseenter', () => paused = true);
  row.addEventListener('mouseleave', () => paused = false);
  function step() {
    if (!paused) {
      if (direction === 'left') {
        pos -= speed;
        const first = row.children[0];
        if (first && -pos >= first.offsetWidth + 14) {
          pos += first.offsetWidth + 14;
          row.appendChild(first);
        }
      } else {
        pos += speed;
        const last = row.children[row.children.length - 1];
        if (last && pos >= 0) {
          pos -= last.offsetWidth + 14;
          row.insertBefore(last, row.firstChild);
        }
      }
      row.style.transform = `translateX(${pos}px)`;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
window.addEventListener('load', () => {
  infiniteCarousel('row1', 0.7, 'left');   // row 1 → slides LEFT
  infiniteCarousel('row2', 0.7, 'right');  // row 2 → slides RIGHT
});