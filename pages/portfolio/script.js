/* =====================================================
   Portfólio — Vitor Melo · interactions
   reveals · counters · filters · cursor · tilt
   ===================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Stagger project + tag reveals ---------- */
  document.querySelectorAll('.projects .project').forEach((el, i) => {
    el.style.transitionDelay = (i % 3 * 0.07) + 's';
  });

  /* ---------- Count-up ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.dataset.count !== undefined) animateCount(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));
    document.querySelectorAll('[data-count]').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('[data-anim]').forEach((el) => el.classList.add('in'));
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  }

  /* ---------- Filters ---------- */
  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.projects .project');
  const empty = document.querySelector('.empty');

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      let visible = 0;
      projects.forEach((p) => {
        const show = cat === 'all' || p.dataset.cat === cat;
        p.classList.toggle('hide', !show);
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    });
  });

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
    document.querySelectorAll('a, button, .tag').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  /* ---------- Featured 3D tilt ---------- */
  const tilt = document.querySelector('[data-tilt]');
  if (tilt && fine && !reduced) {
    const thumb = tilt.querySelector('.featured-thumb');
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = 'perspective(1100px) rotateY(' + (px * 4) + 'deg) rotateX(' + (-py * 4) + 'deg) translateY(-5px)';
      if (thumb) thumb.style.transform = 'translate(' + (px * -14) + 'px,' + (py * -14) + 'px) scale(1.06)';
    });
    tilt.addEventListener('mouseleave', () => {
      tilt.style.transform = '';
      if (thumb) thumb.style.transform = '';
    });
  }
})();
