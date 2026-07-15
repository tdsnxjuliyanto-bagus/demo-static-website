// ============================================================================
//  story.js  —  GSAP island (satu file untuk seluruh animasi & interaksi)
//  Filosofi: konten sudah ada di DOM; animasi hanya lapisan di atasnya.
//  Reduced-motion & no-JS -> semuanya tetap tampil & fungsional.
// ============================================================================
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------- */
/* 1. UI dasar: tema, menu, nav state, skip-story                             */
/* -------------------------------------------------------------------------- */
function initUI() {
  const root = document.documentElement;

  const themeBtn = document.querySelector('[data-theme-toggle]');
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    ScrollTrigger.refresh();
  });

  const nav = document.querySelector('[data-nav]');
  const menuBtn = document.querySelector('[data-menu-toggle]');
  menuBtn?.addEventListener('click', () => {
    const open = nav.toggleAttribute('data-menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('.nav-links a').forEach((a) =>
    a.addEventListener('click', () => {
      nav.removeAttribute('data-menu-open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    })
  );

  // Nav scrolled state
  ScrollTrigger.create({
    start: 'top -40',
    end: 99999,
    onUpdate: (self) => nav?.toggleAttribute('data-scrolled', self.scroll() > 40),
  });

  // Skip story -> lompat ke kontak (tanpa memaksa scroll 400vh manual)
  document.querySelector('[data-skip-story]')?.addEventListener('click', () => {
    document.querySelector('#console')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // Deploy progress rail (global)
  const bar = document.querySelector('[data-deploy-progress]');
  if (bar) {
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { bar.style.width = (self.progress * 100).toFixed(1) + '%'; },
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Reveal on-enter (ringan, tanpa pin) untuk elemen .reveal                */
/* -------------------------------------------------------------------------- */
function initReveals() {
  const els = gsap.utils.toArray('.reveal');
  if (reduceMotion) { els.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  els.forEach((el) => io.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 3. Scene 0: hero on-load                                                    */
/* -------------------------------------------------------------------------- */
function initHero() {
  const name = document.querySelector('[data-hero-name]');
  const els = gsap.utils.toArray('[data-hero-el]');
  if (reduceMotion) { gsap.set([name, ...els], { clearProps: 'all' }); return; }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from(name, { y: 24, opacity: 0, duration: 0.7 })
    .from(els, { y: 18, opacity: 0, duration: 0.55, stagger: 0.08 }, '-=0.3');
}

/* -------------------------------------------------------------------------- */
/* 4. Scene 2: expertise — pin + scrub, node menyala berurutan (desktop)      */
/* -------------------------------------------------------------------------- */
function initExpertise() {
  if (reduceMotion) return;
  ScrollTrigger.matchMedia({
    '(min-width: 861px)': function () {
      const section = document.querySelector('[data-scene="expertise"]');
      const nodes = gsap.utils.toArray('[data-node]', section);
      if (!nodes.length) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=' + (nodes.length * 220),
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          const active = Math.floor(self.progress * nodes.length + 0.0001);
          nodes.forEach((n, i) => n.classList.toggle('is-active', i <= active && self.progress > 0));
        },
      });
    },
  });
}

/* -------------------------------------------------------------------------- */
/* 5. Scene 3: pipeline — horizontal pin+scrub (desktop) / vertikal (mobile)  */
/* -------------------------------------------------------------------------- */
function initPipeline() {
  const section = document.querySelector('[data-scene="pipeline"]');
  if (!section) return;
  const track = section.querySelector('[data-pipeline-track]');
  const stages = gsap.utils.toArray('[data-stage]', section);
  const progress = section.querySelector('[data-pipeline-progress]');

  // Mobile / reduced-motion: reveal vertikal sederhana (tanpa pin)
  const revealStages = () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-active'); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    stages.forEach((s) => io.observe(s));
  };

  if (reduceMotion) { stages.forEach((s) => s.classList.add('is-active')); return; }

  ScrollTrigger.matchMedia({
    '(min-width: 861px)': function () {
      const viewport = section.querySelector('[data-pipeline-viewport]');

      // Jarak geser = posisi tengah kartu TERAKHIR relatif titik tengah viewport.
      // Dihitung dari offsetLeft (tidak terpengaruh transform), bukan scrollWidth
      // — supaya kartu terakhir (+ penanda "now"-nya) berhenti tepat di tengah.
      const distance = () => {
        const last = stages[stages.length - 1];
        if (!last || !viewport) return 0;
        return Math.max(0, last.offsetLeft + last.offsetWidth / 2 - viewport.clientWidth / 2);
      };

      // Titik tengah viewport = posisi baca (tak terlihat). Kartu terdekat
      // dengannya = aktif; yang sudah lewat = passed.
      const markActive = () => {
        if (!viewport) return;
        const box = viewport.getBoundingClientRect();
        const mid = box.left + viewport.clientWidth / 2;
        let best = null;
        let bestDist = Infinity;
        stages.forEach((s) => {
          const r = s.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestDist) { bestDist = d; best = s; }
        });
        stages.forEach((s) => {
          const r = s.getBoundingClientRect();
          const center = r.left + r.width / 2;
          s.classList.toggle('is-active', s === best);
          s.classList.toggle('is-passed', s !== best && center < mid);
        });
      };

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
      });
      ScrollTrigger.create({
        animation: tween,
        trigger: section,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        onRefresh: markActive,
        onUpdate: (self) => {
          if (progress) progress.style.width = (self.progress * 100).toFixed(1) + '%';
          markActive();
        },
      });
      markActive(); // status awal: kartu pertama aktif sebelum scroll
    },
    '(max-width: 860px)': function () {
      revealStages();
    },
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Scene 4: filter proyek (JS statis, tanpa server)                        */
/* -------------------------------------------------------------------------- */
function initFilters() {
  const wrap = document.querySelector('[data-filters]');
  const grid = document.querySelector('[data-proj-grid]');
  if (!wrap || !grid) return;
  const cards = gsap.utils.toArray('[data-tag]', grid);
  wrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    wrap.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    cards.forEach((c) => {
      const show = f === 'All' || c.dataset.tag === f;
      c.hidden = !show;
    });
    ScrollTrigger.refresh();
  });
}

/* -------------------------------------------------------------------------- */
/* 7. Scene 6: contact form -> POST /api/contact (fallback mailto)            */
/* -------------------------------------------------------------------------- */
function initContact() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  const statusEl = form.querySelector('[data-form-status]');
  const setStatus = (msg, state) => { if (statusEl) { statusEl.textContent = msg; statusEl.dataset.state = state || ''; } };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = form.elements;
    const payload = {
      name: fd.namedItem('name').value.trim(),
      email: fd.namedItem('email').value.trim(),
      subject: fd.namedItem('subject').value.trim(),
      message: fd.namedItem('message').value.trim(),
      company_website: fd.namedItem('company_website').value, // honeypot
      clientToken: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    };
    if (!payload.name || !payload.email || !payload.message) {
      setStatus('Please fill in name, email, and message.', 'error');
      return;
    }
    setStatus('Sending…', '');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        form.reset();
        setStatus('Message received — thank you. I\'ll get back to you.', 'ok');
      } else if (res.status === 429) {
        setStatus('Too many attempts. Please try again later.', 'error');
      } else {
        throw new Error('bad status ' + res.status);
      }
    } catch (err) {
      // Fallback: buka email client dengan isi terisi
      const subject = encodeURIComponent(payload.subject || 'Hello from your portfolio');
      const body = encodeURIComponent(`${payload.message}\n\n— ${payload.name} (${payload.email})`);
      const to = (form.getAttribute('action') || '').replace('mailto:', '');
      setStatus('Could not reach the server — opening your email app instead.', 'error');
      if (to) window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* Init                                                                        */
/* -------------------------------------------------------------------------- */
function boot() {
  initUI();
  initReveals();
  initHero();
  initExpertise();
  initPipeline();
  initFilters();
  initContact();
  ScrollTrigger.refresh();
}

if (document.readyState !== 'loading') boot();
else document.addEventListener('DOMContentLoaded', boot);

// Recalculate pinned scenes on resize/rotate (scroll length bergantung dimensi)
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
