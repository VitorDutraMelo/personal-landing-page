/* =====================================================
   Currículo — Vitor Melo · interactions
   reveals · counters · cursor · PDF preview modal
   ===================================================== */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const PDF = 'cv/Vitor-Melo-Backend-Developer.pdf';

  /* ---------- Count-up (supports prefix + suffix) ---------- */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    (function step(now) {
      const p = Math.min((now - start) / 1500, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(eased * target) + suffix;
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
      el.textContent = (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || '');
    });
  }

  /* ---------- PDF preview modal ---------- */
  const modal = document.querySelector('[data-modal]');
  const frame = document.querySelector('[data-frame]');
  const previewBtns = document.querySelectorAll('[data-preview]');
  let lastTrigger = null;

  function openModal(trigger) {
    lastTrigger = trigger || null;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    // Set the source AFTER the modal is visible so the PDF viewer renders
    // into a frame that has real dimensions (fixes the blank-preview bug).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { frame.src = PDF; });
    });
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
    frame.src = 'about:blank';            // clear the viewer source
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus(); // restore focus
  }

  previewBtns.forEach((b) => b.addEventListener('click', () => openModal(b)));
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

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
    document.querySelectorAll('a, button, .chip, .tag, .metric').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }
})();
