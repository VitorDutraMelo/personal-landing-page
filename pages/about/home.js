/* =====================================================
   Comece por aqui — Vitor Melo · interactions
   reveals · counters · progress bars · cursor · tilt
   ===================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Stagger delays for grouped items ---------- */
  document.querySelectorAll('.tech-grid .tech-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.05) + 's';
  });
  document.querySelectorAll('.bars .bar-row').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.hero-copy [data-anim]').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  /* ---------- Count-up animation ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Progress bar fill ---------- */
  function fillBar(el) {
    el.style.width = (parseInt(el.dataset.pct, 10) || 0) + '%';
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add('in');

        if (el.dataset.count !== undefined) animateCount(el);
        el.querySelectorAll && el.querySelectorAll('[data-count]').forEach(animateCount);
        el.querySelectorAll && el.querySelectorAll('.bar-fill[data-pct]').forEach(fillBar);

        io.unobserve(el);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));
    // counters/bars sit inside animated containers, but observe directly too for safety
    document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
    document.querySelectorAll('.bar-fill[data-pct]').forEach((el) => io.observe(el));
  } else {
    // no-JS-motion fallback: show everything at final state
    document.querySelectorAll('[data-anim]').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    document.querySelectorAll('.bar-fill[data-pct]').forEach(fillBar);
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduced) {
    const ring = document.querySelector('[data-cursor]');
    const dot = document.querySelector('[data-cursor-dot]');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

    addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, .chip, .tech-card, .tl-icon, .avatar-wrap').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ---------- Avatar 3D tilt ---------- */
  const avatar = document.querySelector('[data-tilt]');
  if (avatar && fine && !reduced) {
    const img = avatar.querySelector('.avatar-img');
    avatar.style.transformStyle = 'preserve-3d';
    avatar.addEventListener('mousemove', (e) => {
      const r = avatar.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      avatar.style.transform = 'perspective(700px) rotateY(' + (px * 12) + 'deg) rotateX(' + (-py * 12) + 'deg) scale(1.03)';
      if (img) img.style.transform = 'translateZ(26px)';
    });
    avatar.addEventListener('mouseleave', () => {
      avatar.style.transform = '';
      if (img) img.style.transform = '';
    });
  }
})();
