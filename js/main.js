/* ─── Maytex — main.js
   Animations: Anime.js 3.2.1
   Scroll reveals: IntersectionObserver (no content gated on scroll)
   Strategy: JS sets initial opacity=0 AFTER DOM ready, so content
   is always visible if JS fails or is slow.
──────────────────────────────────────────────────── */

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Nav: glass pill on scroll ─── */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ─── Hero entrance ─── */
(function initHero() {
  const els = {
    headline: document.querySelector('.hero__headline'),
    sub:      document.querySelector('.hero__sub'),
    tagline:  document.querySelector('.hero__tagline'),
    hint:     document.querySelector('.hero__scroll-hint'),
  };

  if (prefersReduced) return; // show immediately, no animation

  // Set initial hidden state via JS only (not CSS)
  Object.values(els).forEach(el => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });

  anime.timeline({ easing: 'easeOutQuart' })
    .add({
      targets: els.headline,
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 1000,
    }, 400)
    .add({
      targets: els.sub,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 800,
    }, 700)
    .add({
      targets: els.tagline,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
    }, 950)
    .add({
      targets: els.hint,
      opacity: [0, 1],
      duration: 600,
    }, 1200);
})();

/* ─── Smooth scroll for hero hint ─── */
const hint = document.querySelector('.hero__scroll-hint');
if (hint) {
  hint.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ─── Scroll reveal: generic .reveal elements ─── */
(function initReveals() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReduced) return; // visible by default

  reveals.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      anime({
        targets: entry.target,
        opacity: [0, 1],
        translateY: [24, 0],
        duration: 800,
        easing: 'easeOutQuart',
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();

/* ─── Intro section: split reveal ─── */
(function initIntro() {
  const heading = document.querySelector('.intro__heading');
  const right   = document.querySelector('.intro__right');

  if (!heading || prefersReduced) return;

  [heading, right].forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = i === 0 ? 'translateX(-20px)' : 'translateY(20px)';
  });

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    anime.timeline({ easing: 'easeOutQuart' })
      .add({ targets: heading, opacity: [0, 1], translateX: [-20, 0], duration: 900 }, 0)
      .add({ targets: right,   opacity: [0, 1], translateY: [20, 0],  duration: 800 }, 150);
    observer.disconnect();
  }, { threshold: 0.15 });

  observer.observe(document.querySelector('.intro'));
})();

/* ─── Services / Sectors: staggered list reveal ───
   Handles every .services__list independently (What We Do + Sectors),
   so each list animates its own items when it scrolls into view. */
(function initServices() {
  const lists = document.querySelectorAll('.services__list');
  if (!lists.length || prefersReduced) return;

  lists.forEach(list => {
    const items = list.querySelectorAll('.service-item');
    if (!items.length) return;

    items.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
    });

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 700,
        delay: anime.stagger(70, { start: 100 }),
        easing: 'easeOutQuart',
      });
      observer.disconnect();
    }, { threshold: 0.08 });

    observer.observe(list);
  });
})();

/* ─── Project data ─── */
// To swap a photo: drop image into "Web assets/" and set `image` to the filename.
// NOTE: images below are DRAFT placeholders sourced from Wikimedia Commons
// (real landmarks where available, representative shots otherwise). Swap for
// Maytex's own jobsite photos before going live.
const projects = [
  { name: 'River Lee',               location: 'Cork',       category: 'Hotel Fit-Out',           image: 'river-lee.jpg' },
  { name: 'NYX Portobello',          location: 'Dublin',     category: 'Hotel Fit-Out',           image: 'nyx-portobello.webp' },
  { name: 'Leonardo',                location: 'Galway',     category: 'Hotel Fit-Out',           image: 'leonardo-galway.webp' },
  { name: 'Leonardo Christchurch',   location: 'Dublin',     category: 'Hotel Fit-Out',           image: 'leonardo-christchurch.png' },
  { name: 'Clayton Clonliff Road',   location: 'Dublin',     category: 'Hotel Fit-Out',           image: 'clayton-croke-park.jpg' },
  { name: 'Westbury',                location: 'Dublin',     category: 'Hotel Fit-Out',           image: 'westbury.jpg' },
  { name: 'The Chancery Hotel',      location: 'Dublin',     category: 'Hotel Fit-Out',           image: 'chancery.webp' },
  { name: 'Kensington Hotel',        location: 'London',     category: 'Hotel Fit-Out',           image: 'kensington.jpg' },
  { name: 'Bloomsbury Hotel',        location: 'London',     category: 'Hotel Fit-Out',           image: 'bloomsbury.jpg' },
  { name: 'Marylebone Hotel',        location: 'London',     category: 'Hotel Fit-Out',           image: 'marylebone.jpg' },
  { name: 'Kaymed POS Rollout',      location: 'Nationwide', category: 'Retail Installation',     image: 'kaymed.jpg' },
  { name: 'IMMA Bespoke Seating',    location: 'Dublin',     category: 'Specialist Fabrication',  image: 'imma.jpg' },
  { name: 'Tallaght Hospital',       location: 'Dublin',     category: 'Medical Relocation',      image: 'tallaght.jpg' },
  { name: 'IRES Head Office',        location: 'Dublin',     category: 'Office Relocation',       image: 'ires.jpg' },
];

/* ─── Render project cards ─── */
(function renderProjects() {
  const track = document.getElementById('projectsTrack');
  if (!track) return;

  projects.forEach(p => {
    const card = document.createElement('div');
    card.className = 'project-card';
    const img = p.image
      ? `<img class="project-card__image" src="Web assets/${p.image}" alt="${p.name}" loading="lazy" />`
      : `<div class="project-card__image placeholder">Photo coming</div>`;
    card.innerHTML = `
      ${img}
      <div class="project-card__body">
        <p class="project-card__category">${p.category}</p>
        <h3 class="project-card__name">
          ${p.name}
          <span class="project-card__location">${p.location}</span>
        </h3>
      </div>
    `;
    track.appendChild(card);
  });
})();

/* ─── Project strip: staggered entrance ─── */
(function initProjectsReveal() {
  const wrap = document.querySelector('.projects__track-wrap');
  if (!wrap || prefersReduced) return;

  const cards = wrap.querySelectorAll('.project-card');
  cards.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(16px)'; });

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    anime({
      targets: cards,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      delay: anime.stagger(50, { start: 100 }),
      easing: 'easeOutQuart',
    });
    observer.disconnect();
  }, { threshold: 0.05 });

  observer.observe(wrap);
})();

/* ─── Project strip: drag-to-scroll ─── */
(function initDragScroll() {
  const wrap = document.querySelector('.projects__track-wrap');
  if (!wrap) return;

  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', e => {
    isDown = true;
    wrap.classList.add('is-dragging');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
  });

  ['mouseleave', 'mouseup'].forEach(evt =>
    wrap.addEventListener(evt, () => {
      isDown = false;
      wrap.classList.remove('is-dragging');
    })
  );

  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    wrap.scrollLeft = scrollLeft - (x - startX) * 1.3;
  });
})();
