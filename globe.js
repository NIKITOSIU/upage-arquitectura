/* ═══════════════════════════════════════════════════════
   UPAGE Globe.js — Interactive Testimonial Globe
   Canvas 2D · No dependencies · Mobile-First
═══════════════════════════════════════════════════════ */
'use strict';

(function () {

  /* ── Testimonial pins ─────────────────────────────── */
  const PINS = [
    {
      id: 'mexico', lat: 19.4, lon: -99.1, flag: '🇲🇽',
      location: 'Ciudad de México, México',
      quote: 'Desde el primer mes, las consultas de proyectos premium se triplicaron. UPAGE entiende exactamente cómo posicionar arquitectura de lujo.',
      author: 'Carlos Mendoza', role: 'Arq. Director · Mendoza & Asociados'
    },
    {
      id: 'spain', lat: 40.4, lon: -3.7, flag: '🇪🇸',
      location: 'Madrid, España',
      quote: 'Lograron captar la esencia de nuestros espacios y convertirla en una experiencia digital fluida. Por fin nuestra web está a la altura de nuestras obras.',
      author: 'Roberto Fuentes', role: 'Fundador · Fuentes Diseño Espacial'
    },
    {
      id: 'usa', lat: 25.8, lon: -80.2, flag: '🇺🇸',
      location: 'Miami, Estados Unidos',
      quote: 'Los leads calificados aumentaron un 40% en dos meses. UPAGE fue la mejor inversión que hicimos para nuestro estudio este año.',
      author: 'Elena Valbuena', role: 'CEO · Studio Arquitectura V&V'
    },
    {
      id: 'colombia', lat: 4.7, lon: -74.1, flag: '🇨🇴',
      location: 'Bogotá, Colombia',
      quote: 'La presencia digital no hacía justicia a nuestra arquitectura. UPAGE lo transformó todo — el diseño mobile es impecable.',
      author: 'Valeria Ríos', role: 'Arq. Principal · Prisma Constructores'
    },
    {
      id: 'france', lat: 57, lon: 10, flag: '🇫🇷',
      location: 'París, Francia',
      quote: 'En un mercado tan exigente como el parisino, necesitábamos una web que comunicara lujo desde el primer segundo. UPAGE lo entendió a la perfección.',
      author: 'Sophie Marchand', role: 'Directora · Atelier Marchand Architecture'
    },
    {
      id: 'italy', lat: 39, lon: 27, flag: '🇮🇹',
      location: 'Milán, Italia',
      quote: 'Il design del sito riflette perfettamente l\'essenza del nostro studio. I contatti qualificati sono aumentati in modo significativo dal lancio.',
      author: 'Marco Ferretti', role: 'Fondatore · Ferretti Studio Milano'
    },
    {
      id: 'portugal', lat: 52, lon: -20, flag: '🇵🇹',
      location: 'Lisboa, Portugal',
      quote: 'Tínhamos um portfólio incrível mas uma presença digital fraca. A UPAGE mudou isso completamente — simples, rápida e que converte.',
      author: 'Ana Cardoso', role: 'Sócia · Cardoso & Lima Arquitectos'
    },
    {
      id: 'argentina', lat: -34.6, lon: -58.4, flag: '🇦🇷',
      location: 'Buenos Aires, Argentina',
      quote: 'En tres semanas ya teníamos consultas de clientes que antes ni nos encontraban. La inversión se pagó sola en el primer proyecto cerrado.',
      author: 'Martín Ibáñez', role: 'Arq. Socio · Ibáñez + Estudio'
    }
  ];

  /* ── Land detection (lightweight approximation) ───── */
  function isLand(lat, lon) {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    if (lon >= -168 && lon <= -50 && lat >= 15 && lat <= 72) return true;   // N. America
    if (lon >= -82  && lon <= -34 && lat >= -56 && lat <= 12) return true;  // S. America
    if (lon >= -54  && lon <= -17 && lat >= 59  && lat <= 84) return true;  // Greenland
    if (lon >= -12  && lon <= 45  && lat >= 34  && lat <= 72) return true;  // Europe
    if (lon >= -18  && lon <= 52  && lat >= -36 && lat <= 37) return true;  // Africa
    if (lon >= 35   && lon <= 60  && lat >= 12  && lat <= 38) return true;  // Arabia
    if (lon >= 25   && lon <= 180 && lat >= 45  && lat <= 78) return true;  // Russia
    if (lon >= 40   && lon <= 145 && lat >= 5   && lat <= 55) return true;  // Asia
    if (lon >= 95   && lon <= 141 && lat >= -10 && lat <= 28) return true;  // SE Asia
    if (lon >= 113  && lon <= 154 && lat >= -40 && lat <= -10) return true; // Australia
    if (lon >= 66   && lon <= 97  && lat >= 5   && lat <= 35) return true;  // India
    if (lon >= 129  && lon <= 146 && lat >= 30  && lat <= 46) return true;  // Japan
    return false;
  }

  /* ── Pre-generate land dot positions ──────────────── */
  const DOTS = [];
  const RNG_SEED = 42;
  let seed = RNG_SEED;
  function rand() { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; }

  for (let i = 0; i < 2800; i++) {
    const lat = rand() * 165 - 82.5;
    const lon = rand() * 360 - 180;
    if (!isLand(lat, lon)) continue;
    const phi   = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    DOTS.push([
      -Math.sin(phi) * Math.cos(theta),
       Math.cos(phi),
       Math.sin(phi) * Math.sin(theta)
    ]);
  }

  /* ── Globe renderer ────────────────────────────────── */
  class Globe {
    constructor(canvas, tooltip) {
      this.canvas  = canvas;
      this.ctx     = canvas.getContext('2d');
      this.tooltip = tooltip;
      this.rotX    = 0.25;    // tilt
      this.rotY    = 0.3;     // longitude
      this.velX    = 0;
      this.velY    = 0;
      this.drag    = false;
      this.lastX   = 0;
      this.lastY   = 0;
      this.movedDuringDrag = false;
      this.autoSpin = true;
      this.raf      = null;
      this.visible  = false;
      this.resize();
      this.bindEvents();
      this.observe();
    }

    resize() {
      const W = this.canvas.parentElement.offsetWidth;
      const H = Math.min(600, Math.max(380, W * 0.78));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width  = W * dpr;
      this.canvas.height = H * dpr;
      this.canvas.style.width  = W + 'px';
      this.canvas.style.height = H + 'px';
      this.cx = (W * dpr) / 2;
      this.cy = ((H * dpr) / 2) - (15 * dpr); // shift slightly up
      this.R  = Math.min(W, H) * dpr * 0.39; // make globe bigger
      this.W  = W; this.H = H; this.dpr = dpr;
    }

    /* ─ Math helpers ─ */
    rotate(x, y, z) {
      // Rotate Y (longitude)
      const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY);
      let x1 = x * cy - z * sy;
      let z1 = x * sy + z * cy;
      // Rotate X (tilt)
      const cx = Math.cos(this.rotX), sx = Math.sin(this.rotX);
      let y1 = y * cx - z1 * sx;
      let z2 = y * sx + z1 * cx;
      return { sx: this.cx + x1 * this.R, sy: this.cy - y1 * this.R, front: z2 > 0 };
    }

    latLon(lat, lon) {
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return [
        -Math.sin(phi) * Math.cos(theta),
         Math.cos(phi),
         Math.sin(phi) * Math.sin(theta)
      ];
    }

    /* ─ Draw ─ */
    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Globe base circle (subtle fill)
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.R, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(248,244,239,0.95)';
      ctx.fill();
      // Outer subtle border
      ctx.strokeStyle = 'rgba(44,44,44,0.06)';
      ctx.lineWidth = this.dpr;
      ctx.stroke();

      // Lat/lon wireframe grid
      ctx.strokeStyle = 'rgba(44,44,44,0.13)';
      ctx.lineWidth   = this.dpr * 0.9;

      // Latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 3) {
          const [x, y, z] = this.latLon(lat, lon);
          const p = this.rotate(x, y, z);
          if (!p.front) { first = true; continue; }
          first ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy);
          first = false;
        }
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const [x, y, z] = this.latLon(lat, lon);
          const p = this.rotate(x, y, z);
          if (!p.front) { first = true; continue; }
          first ? ctx.moveTo(p.sx, p.sy) : ctx.lineTo(p.sx, p.sy);
          first = false;
        }
        ctx.stroke();
      }

      // Land dots
      ctx.fillStyle = 'rgba(44,44,44,0.3)';
      for (const [x, y, z] of DOTS) {
        const p = this.rotate(x, y, z);
        if (!p.front) continue;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, this.dpr * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pins
      const t = Date.now() * 0.001;
      this.pinScreenPositions = [];

      PINS.forEach((pin, i) => {
        const [x, y, z] = this.latLon(pin.lat, pin.lon);
        const p = this.rotate(x * 1.015, y * 1.015, z * 1.015);
        this.pinScreenPositions.push({ p, front: p.front, pin });

        if (!p.front) return;

        const pulse = (Math.sin(t * 2 + i * 1.57) + 1) / 2;
        const pr    = this.R * 0.055;

        // Pulse ring
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, pr * (1 + pulse * 0.6), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,168,67,${0.5 - pulse * 0.45})`;
        ctx.lineWidth   = this.dpr * 1.5;
        ctx.stroke();

        // Outer ring
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, pr, 0, Math.PI * 2);
        ctx.strokeStyle = '#D4A843';
        ctx.lineWidth   = this.dpr * 2;
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, pr * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#D4A843';
        ctx.fill();
      });

      // Update HTML pin hits
      this.updatePinHits();
    }

    /* ─ Clickable pin overlays ─ */
    updatePinHits() {
      const hits = document.querySelectorAll('.globe-pin-hit');
      hits.forEach((el, i) => {
        const entry = this.pinScreenPositions[i];
        if (!entry || !entry.front) {
          el.style.display = 'none';
          return;
        }
        el.style.display = 'block';
        const pr = (this.R / this.dpr) * 0.075;
        el.style.left   = (entry.p.sx / this.dpr - pr) + 'px';
        el.style.top    = (entry.p.sy / this.dpr - pr) + 'px';
        el.style.width  = pr * 2 + 'px';
        el.style.height = pr * 2 + 'px';
      });
    }

    /* ─ Events ─ */
    bindEvents() {
      const c = this.canvas;

      const down = (e) => {
        this.drag = true; this.autoSpin = false; this.movedDuringDrag = false;
        const s = e.touches ? e.touches[0] : e;
        this.lastX = s.clientX; this.lastY = s.clientY;
        if (this.tooltip) this.tooltip.classList.remove('globe-tooltip--visible');
      };
      const move = (e) => {
        if (!this.drag) return;
        const s = e.touches ? e.touches[0] : e;
        const dx = s.clientX - this.lastX, dy = s.clientY - this.lastY;
        this.velY = dx * -0.006; this.velX = dy * 0.006;
        this.rotY += this.velY;
        this.rotX += this.velX;
        this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX));
        this.lastX = s.clientX; this.lastY = s.clientY;
        if (Math.abs(dx) + Math.abs(dy) > 4) this.movedDuringDrag = true;
      };
      const up = (e) => {
        this.drag = false;
        setTimeout(() => { this.autoSpin = true; }, 2500);
      };

      c.addEventListener('mousedown', down);
      c.addEventListener('mousemove', move);
      c.addEventListener('mouseup', up);
      c.addEventListener('touchstart', down, { passive: true });
      c.addEventListener('touchmove', (e) => {
        if (this.drag) e.preventDefault();
        move(e);
      }, { passive: false });
      c.addEventListener('touchend', up);

      window.addEventListener('resize', () => { this.resize(); });
    }

    /* ─ Visibility observer (pause off-screen) ─ */
    observe() {
      const obs = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        if (this.visible && !this.raf) this.loop();
      }, { threshold: 0.1 });
      obs.observe(this.canvas.parentElement);
    }

    /* ─ Animation loop ─ */
    loop() {
      if (!this.visible) { this.raf = null; return; }
      this.raf = requestAnimationFrame(() => this.loop());

      if (this.autoSpin && !this.drag) {
        this.rotY += 0.0025;
        this.velX *= 0.9; this.velY *= 0.9;
      } else if (!this.drag) {
        this.rotY += this.velY; this.rotX += this.velX;
        this.rotX = Math.max(-1.1, Math.min(1.1, this.rotX));
        this.velX *= 0.92; this.velY *= 0.92;
      }

      this.draw();
    }
  }

  /* ── Init on DOMContentLoaded ──────────────────────── */
  function init() {
    const canvas  = document.getElementById('globe-canvas');
    const tooltip = document.getElementById('globe-tooltip');
    const wrapper = document.getElementById('globe-section');
    if (!canvas || !tooltip || !wrapper) return;

    // Create clickable HTML overlays for each pin
    PINS.forEach((pin, i) => {
      const btn = document.createElement('button');
      btn.className   = 'globe-pin-hit';
      btn.setAttribute('aria-label', `Ver testimonio: ${pin.location}`);
      btn.dataset.idx = i;
      wrapper.appendChild(btn);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showCard(pin, tooltip, btn);
      });
      btn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        showCard(pin, tooltip, btn);
      });
    });

    // Close tooltip when clicking outside
    document.addEventListener('click', (e) => {
      if (!tooltip.contains(e.target) && !e.target.classList.contains('globe-pin-hit')) {
        tooltip.classList.remove('globe-tooltip--visible');
      }
    });

    const globe = new Globe(canvas, tooltip);
  }

  /* ── Show popup card ───────────────────────────────── */
  function showCard(pin, tooltip, btn) {
    tooltip.innerHTML = `
      <button class="globe-card__close" aria-label="Cerrar">&times;</button>
      <div class="globe-card__loc">
        <span class="globe-card__flag" aria-hidden="true">${pin.flag}</span>
        <span>${pin.location}</span>
      </div>
      <blockquote class="globe-card__quote">&ldquo;${pin.quote}&rdquo;</blockquote>
      <footer class="globe-card__footer">
        <strong class="globe-card__name">${pin.author}</strong>
        <span class="globe-card__role">${pin.role}</span>
      </footer>
    `;
    tooltip.classList.add('globe-tooltip--visible');

    tooltip.querySelector('.globe-card__close').addEventListener('click', () => {
      tooltip.classList.remove('globe-tooltip--visible');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
