'use strict';

/* ═══════════════════════════════════════════════════════
   UPAGE v2 — App Script
   Handles: Preloader, Hero Animations, Scroll Reveals,
            iframe Scale, Card Parallax
═══════════════════════════════════════════════════════ */

// ─── Selectors ──────────────────────────────────────────
const preloader     = document.getElementById('preloader');
const heroTitle     = document.getElementById('hero-title');
const revealEls     = document.querySelectorAll('.reveal-block, .reveal-scale, .reveal-left, .reveal-right');
const lineInners    = document.querySelectorAll('.line-inner');
const iframeWraps   = document.querySelectorAll('.iframe-scale-wrap');

// ─── Preloader ───────────────────────────────────────────
(function initPreloader() {
  const MIN_TIME = 2200;
  const start    = Date.now();

  document.body.style.overflow = 'hidden';

  function hide() {
    const wait = Math.max(0, MIN_TIME - (Date.now() - start));
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.overflow = '';

      // Animate hero lines after preloader
      setTimeout(triggerHeroLines, 200);

      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, wait);
  }

  if (document.readyState === 'complete') { hide(); }
  else { window.addEventListener('load', hide, { once: true }); setTimeout(hide, 4500); }
})();

// ─── Hero Line Reveal ─────────────────────────────────────
function triggerHeroLines() {
  lineInners.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

// ─── Dynamic iframe scale (Switched to Desktop Screenshots for performance) ──

// ─── Dynamic iframe scale (Removed: Switched to Desktop Screenshots) ─────────────────

// ─── Scroll Reveal (IntersectionObserver) ─────────────────
(function initReveal() {
  if (!window.IntersectionObserver) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

// ─── Mouse Parallax on Hero Orbs ─────────────────────────
(function initOrbParallax() {
  const orb1 = document.querySelector('.hero__orb--1');
  const orb2 = document.querySelector('.hero__orb--2');
  if (!orb1 || !orb2) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer:coarse)').matches) return;

  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orb1.style.transform = `translate(${dx * 30}px, ${dy * 22}px)`;
      orb2.style.transform = `translate(${-dx * 25}px, ${-dy * 18}px)`;
      ticking = false;
    });
  });
})();

// ─── Card 3D Tilt (Desktop only) ─────────────────────────
(function initTilt() {
  if (window.matchMedia('(pointer:coarse)').matches) return;

  const cards = document.querySelectorAll('.problem-item, .testimonial');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const cx = left + width  / 2;
      const cy = top  + height / 2;
      const rx = ((e.clientY - cy) / height) * -6;
      const ry = ((e.clientX - cx) / width)  *  6;
      card.style.transform =
        `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
      card.style.transform = '';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();

// ─── Feature item hover line ──────────────────────────────
(function initFeatureHover() {
  document.querySelectorAll('.feature-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.querySelector('.feature-item__num').style.opacity = '1';
    });
    item.addEventListener('mouseleave', () => {
      item.querySelector('.feature-item__num').style.opacity = '0.5';
    });
  });
})();

// ─── Portfolio iframe error fallback (Removed) ─────────────

// ─── Portfolio Cards: Video + Mobile Safety ──────────────────
// 1. Play/pause videos based on viewport visibility (IntersectionObserver)
//    → saves battery on mobile, avoids background decoding
// 2. Cap playback at 10s then loop from start
// 3. Block any click/touch that could trigger navigation
(function initPortfolioCards() {
  const cards = document.querySelectorAll('.portfolio-card');

  cards.forEach(function(card) {
    const video = card.querySelector('video');

    // ── Block navigation events on the whole card ──────────
    ['click', 'touchend'].forEach(function(evt) {
      card.addEventListener(evt, function(e) {
        e.preventDefault();
        e.stopPropagation();
      }, { passive: false });
    });
    card.style.touchAction = 'pan-y';
    card.style.cursor      = 'default';

    if (!video) return;

    // ── 10-second loop cap ─────────────────────────────────
    video.addEventListener('timeupdate', function() {
      if (video.currentTime >= 10) {
        video.currentTime = 0;
        // play() returns a promise; ignore rejection on mobile
        var p = video.play(); if (p && p.catch) p.catch(function(){});
      }
    });

    // ── Play only when visible in viewport ─────────────────
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var p = video.play(); if (p && p.catch) p.catch(function(){});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.25 });
      observer.observe(card);
    } else {
      // Fallback: just play
      var p = video.play(); if (p && p.catch) p.catch(function(){});
    }
  });
})();


// ─── Smooth scroll for anchor links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── Page Progress Indicator (thin gold bar at top) ──────
(function initProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; width: 0%;
    background: linear-gradient(90deg, #C9603A, #D4A843);
    z-index: 9998; transition: width 0.1s linear; pointer-events: none;
  `;
  document.body.appendChild(bar);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
      ticking = false;
    });
  }, { passive: true });
})();

// ─── Timeline Scroll Interactive Progress ─────────────────
(function initTimeline() {
  const wrap = document.getElementById('timeline-wrap');
  const bar = document.getElementById('timeline-progress');
  if (!wrap || !bar) return;

  const steps = wrap.querySelectorAll('.timeline-step');
  
  function updateTimeline() {
    const rect = wrap.getBoundingClientRect();
    const windowH = window.innerHeight;
    
    // The "draw" line sits at ~60% down the viewport on mobile to feel natural.
    const drawLine = windowH * 0.65; 
    
    // Total distance over which progress occurs is the wrapper height
    let progress = (drawLine - rect.top) / rect.height;
    
    // Clamp between 0 and 1
    progress = Math.max(0, Math.min(1, progress));
    
    // Update visual golden line
    bar.style.height = `${progress * 100}%`;
    
    // Trigger steps if the drawn line reaches their node
    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect();
      const nodeCenter = stepRect.top + 24; // offset slightly for visual sync
      if (drawLine >= nodeCenter) {
        step.classList.add('is-active');
      } else {
        step.classList.remove('is-active');
      }
    });
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTimeline();
        ticking = false;
      });
      ticking = true;
    }
  }

  const ob = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      window.addEventListener('scroll', onScroll, { passive: true });
      updateTimeline();
    } else {
      window.removeEventListener('scroll', onScroll);
    }
  }, { threshold: 0 });

  ob.observe(wrap);
})();

// ─── TikTok Pixel Click Tracking ───────────────────────────
(function initTikTokTracking() {
  const finalBtn = document.getElementById('final-cta-btn');
  if (finalBtn) {
    finalBtn.addEventListener('click', () => {
      if (typeof ttq !== 'undefined') {
        ttq.track('Contact', {
          content_name: 'WhatsApp Contact',
          content_category: 'Leads'
        });
      }
    });
  }
})();
