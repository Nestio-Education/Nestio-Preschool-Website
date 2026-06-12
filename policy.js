function togglePolicy(header) {
  const section = header.parentElement;
  section.classList.toggle('open');
}

// Highlight active TOC link on scroll
const tocLinks = document.querySelectorAll('.toc-link');
const policySections = document.querySelectorAll('.policy-section');

window.addEventListener('scroll', () => {
  let current = '';
  policySections.forEach(s => {
    const top = s.getBoundingClientRect().top;
    if(top < 160) current = s.id;
  });
  tocLinks.forEach(a => {
    a.classList.remove('active');
    if(a.getAttribute('href') === '#' + current) a.classList.add('active');
  });
});

// Auto-open section from URL hash
function openFromHash() {
  const hash = window.location.hash.slice(1);
  if(!hash) return;
  const target = document.getElementById(hash);
  if(target) {
    target.classList.add('open');
    setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}
window.addEventListener('load', openFromHash);
window.addEventListener('hashchange', openFromHash);
