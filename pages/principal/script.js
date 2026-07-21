/* =====================================================
   Vitor Melo — interactions (vanilla JS)
   custom cursor · smooth scroll · parallax · reveals · magnetic
   ===================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.body.classList.add('loading');

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('[data-reveal], .name');
  document.querySelectorAll('.links .card').forEach((c, i) => {
    c.style.transitionDelay = Math.min(i * 0.06, 0.5) + 's';
  });

  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.remove('loading'), 100);
  });
  setTimeout(() => document.body.classList.remove('loading'), 1200);

  /* ---------- Native scroll + parallax skyline ---------- */
  const skyline = document.querySelector('.fx-skyline');
  function raf() {
    const sc = window.scrollY || window.pageYOffset;
    if (skyline) skyline.style.transform = 'translateX(-50%) translate3d(0,' + (sc * 0.16) + 'px,0)';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ---------- Custom cursor ---------- */
  if (fine && !reduced) {
    const ring = document.querySelector('[data-cursor]');
    const dot = document.querySelector('[data-cursor-dot]');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    function cursorRaf() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(cursorRaf);
    }
    cursorRaf();

    document.querySelectorAll('a, .tech-ic, [data-magnetic], .badge').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ---------- Card glow tracking + magnetic pills ---------- */
  if (fine && !reduced) {
    // glow follows cursor inside cards/highlight (transform stays on CSS :hover)
    document.querySelectorAll('.card, .highlight').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // gentle magnetic movement only for small pill-like elements
    document.querySelectorAll('.loc-pill[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 18;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 18;
        el.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Avatar tilt (3D) ---------- */
  const avatar = document.querySelector('[data-tilt]');
  if (avatar && fine && !reduced) {
    const img = avatar.querySelector('.avatar-img');
    avatar.style.transformStyle = 'preserve-3d';
    avatar.addEventListener('mousemove', (e) => {
      const r = avatar.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      avatar.style.transform = 'perspective(600px) rotateY(' + (px * 12) + 'deg) rotateX(' + (-py * 12) + 'deg) scale(1.04)';
      if (img) img.style.transform = 'translateZ(24px)';
    });
    avatar.addEventListener('mouseleave', () => {
      avatar.style.transform = '';
      if (img) img.style.transform = '';
    });
  }

  /* ---------- Rotating typing role ---------- */
  const roleEl = document.querySelector('[data-role-text]');
  if (roleEl && !reduced) {
    const roles = ['Backend Developer', 'Node.js Developer', 'API Builder', 'Software Engineer'];
    let ri = 0, ci = 0, deleting = false;
    roleEl.textContent = '';
    function tick() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        roleEl.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; return setTimeout(tick, 1600); }
        setTimeout(tick, 90);
      } else {
        ci--;
        roleEl.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(tick, 380); }
        setTimeout(tick, 45);
      }
    }
    setTimeout(tick, 900);
  }
})();
