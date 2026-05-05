/* =========================================================
   Growa — gallery.js
   Filtre + Lightbox (next/prev/ESC)
   ========================================================= */
(() => {
  'use strict';

  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const filterBtns = document.querySelectorAll('.gallery-filters button');

  /* ---------- Filtre ---------- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        const match = f === 'all' || it.dataset.category === f;
        it.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.getElementById('lightboxClose');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  let current = -1;

  const visibleItems = () => items.filter(it => !it.classList.contains('is-hidden'));

  const open = (i) => {
    const list = visibleItems();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    const el = list[current];
    lbImg.src = el.getAttribute('href');
    lbImg.alt = el.querySelector('img')?.alt || '';
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    current = -1;
  };
  const next = () => open(current + 1);
  const prev = () => open(current - 1);

  items.forEach((it) => {
    it.addEventListener('click', (e) => {
      e.preventDefault();
      const list = visibleItems();
      const idx = list.indexOf(it);
      if (idx >= 0) open(idx);
    });
  });

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  });
})();
