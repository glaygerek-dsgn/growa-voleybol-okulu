/* =========================================================
   Growa — main.js
   Navbar morph, hamburger, scroll reveal, sayaç, yorumlar
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Yıl ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar scroll morph ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Hamburger (mobil) ---------- */
  const burger = document.querySelector('.nav__burger');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    // Mobil menüde linke tıklayınca kapansın
    nav.querySelectorAll('.nav__links a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('mobile-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Smooth scroll offset (fixed nav için) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.getBoundingClientRect().height + 8 : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---------- Sayaç count-up ---------- */
  const counters = document.querySelectorAll('[data-count-to]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.countTo, 10) || 0;
      const duration = 1600;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);
      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOut(progress) * target);
        el.textContent = value.toLocaleString('tr-TR') + (progress === 1 && target >= 100 ? '+' : '');
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target.toLocaleString('tr-TR') + (target >= 100 ? '+' : '');
      };
      requestAnimationFrame(tick);
    };
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => counterIO.observe(el));
  }

  /* ---------- Yorumlar slider ---------- */
  const list = document.getElementById('testimonials');
  if (list) {
    const slides = list.querySelectorAll('.testimonial');
    const dotsWrap = document.getElementById('testimonialDots');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let index = 0;
    let timer = null;
    const AUTO_MS = 5000;

    // Dot oluştur
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Yorum ${i + 1}`);
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(b);
    });

    const update = () => {
      list.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
    };
    const goTo = (i, manual = false) => {
      index = (i + slides.length) % slides.length;
      update();
      if (manual) restart();
    };
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);
    const start = () => { timer = setInterval(next, AUTO_MS); };
    const stop = () => { if (timer) clearInterval(timer); };
    const restart = () => { stop(); start(); };

    prevBtn?.addEventListener('click', () => { prev(); restart(); });
    nextBtn?.addEventListener('click', () => { next(); restart(); });

    // Hover'da duraksat
    const track = list.parentElement;
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);

    // Mobil swipe
    let touchStart = null;
    track.addEventListener('touchstart', (e) => { touchStart = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (touchStart == null) return;
      const dx = e.changedTouches[0].clientX - touchStart;
      if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
      touchStart = null;
      restart();
    });

    update();
    start();
  }

  /* ---------- Aktif menü vurgusu (anasayfada) ---------- */
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
  if (navLinks.length) {
    const sections = Array.from(navLinks)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    const linkBySection = new Map();
    sections.forEach((sec, i) => {
      const link = navLinks[i];
      linkBySection.set(sec, link);
    });
    const sIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = linkBySection.get(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(sec => sIO.observe(sec));
  }
})();
