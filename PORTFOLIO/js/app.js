/* ==========================================================================
   APP.JS - HIGH-END GSAP MOTION, CANVAS MESH, MODAL SHOWCASE & MICRO-INTERACTIONS
   Yazeed Al-Araisha Portfolio (AI & Automation Architect)
   ========================================================================== */

(function () {
  'use strict';

  // State
  let currentLang = localStorage.getItem('portfolio_lang') || 'ar';

  // DOM Elements
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.getElementById('nav-links');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const toastContainer = document.getElementById('toast-container');
  const skillsFilterTabs = document.querySelectorAll('.skills-filter-tabs .tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  // Modal Gallery Elements
  // Timesheet Modal Elements
  const modalOverlay = document.getElementById('showcase-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseFooterBtn = document.getElementById('modal-close-footer-btn');
  const modalImageDisplay = document.getElementById('modal-image-display');
  const modalScreenDesc = document.getElementById('modal-screen-desc');
  const modalTabBtns = document.querySelectorAll('#showcase-modal .modal-tab-btn');
  const openModalBtns = document.querySelectorAll('.open-showcase-btn');

  // Timesheet Screenshots Data
  const screenshots = [
    { src: 'assets/img/timesheet-ocr.png', descKey: 'modal.desc1' },
    { src: 'assets/img/timesheet-schedule.png', descKey: 'modal.desc2' },
    { src: 'assets/img/timesheet-overtime.png', descKey: 'modal.desc3' },
    { src: 'assets/img/timesheet-employees.png', descKey: 'modal.desc4' },
    { src: 'assets/img/timesheet-records.png', descKey: 'modal.desc5' }
  ];
  let currentScreenshotIndex = 0;

  // Budget Modal Gallery Elements
  const budgetModalOverlay = document.getElementById('budget-modal');
  const budgetModalCloseBtn = document.getElementById('budget-modal-close-btn');
  const budgetModalCloseFooterBtn = document.getElementById('budget-modal-close-footer-btn');
  const budgetModalImageDisplay = document.getElementById('budget-modal-image-display');
  const budgetModalScreenDesc = document.getElementById('budget-modal-screen-desc');
  const budgetModalTabBtns = document.querySelectorAll('#budget-modal .modal-tab-btn');
  const openBudgetModalBtns = document.querySelectorAll('.open-budget-showcase-btn');

  // Budget Screenshots Data
  const budgetScreenshots = [
    { src: 'assets/img/budget-app-screen1.png', descKey: 'modalBudget.desc1' },
    { src: 'assets/img/budget-app-screen2.png', descKey: 'modalBudget.desc2' },
    { src: 'assets/img/budget-app-screen3.png', descKey: 'modalBudget.desc3' },
    { src: 'assets/img/budget-app-screen4.png', descKey: 'modalBudget.desc4' },
    { src: 'assets/img/budget-app-screen5.png', descKey: 'modalBudget.desc5' }
  ];
  let currentBudgetScreenshotIndex = 0;

  // ------------------------------------------------------------------------
  // 1. Language & Internationalization (i18n)
  // ------------------------------------------------------------------------
  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);
    htmlEl.setAttribute('lang', lang);
    bodyEl.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const transObj = translations[lang] || translations.ar;

    // Update text content with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const path = el.getAttribute('data-i18n').split('.');
      let val = transObj;
      for (const p of path) {
        if (val && val[p] !== undefined) {
          val = val[p];
        } else {
          val = null;
          break;
        }
      }
      if (val !== null) {
        el.innerHTML = val;
      }
    });

    // Update placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const path = el.getAttribute('data-i18n-placeholder').split('.');
      let val = transObj;
      for (const p of path) {
        if (val && val[p] !== undefined) {
          val = val[p];
        } else {
          val = null;
          break;
        }
      }
      if (val !== null) {
        el.setAttribute('placeholder', val);
      }
    });

    // Update button text
    if (langToggleBtn) {
      const label = langToggleBtn.querySelector('.lang-label');
      if (label) {
        label.textContent = lang === 'ar' ? 'English' : 'العربية';
      }
    }

    // Update modal active description in current language
    updateModalView(currentScreenshotIndex);
    updateBudgetModalView(currentBudgetScreenshotIndex);
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  }

  // ------------------------------------------------------------------------
  // 2. Interactive Background Canvas (Cyber Particle Mesh)
  // ------------------------------------------------------------------------
  function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 36 : 75;
    const maxDistance = isMobile ? 95 : 145;

    let mouse = {
      x: null,
      y: null,
      radius: 160
    };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      bodyEl.style.setProperty('--mouse-x', `${e.clientX}px`);
      bodyEl.style.setProperty('--mouse-y', `${e.clientY}px`);
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.75;
        this.speedY = (Math.random() - 0.5) * 0.75;
        this.isVulcanico = Math.random() > 0.25; // 75% Vulcanico, 25% Cyber Cyan
        this.color = this.isVulcanico ? 'rgba(255, 65, 3, ' : 'rgba(0, 229, 255, ';
        this.alpha = Math.random() * 0.6 + 0.25;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const dirX = (dx / dist) * force * 1.6;
            const dirY = (dy / dist) * force * 1.6;
            this.x -= dirX;
            this.y -= dirY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = this.isVulcanico ? 12 : 8;
        ctx.shadowColor = this.isVulcanico ? '#FF4103' : '#00e5ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.24;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].isVulcanico
              ? `rgba(255, 65, 3, ${opacity})`
              : `rgba(0, 229, 255, ${opacity})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ------------------------------------------------------------------------
  // 3. Micro-interactions: 3D Tilt Cards & Magnetic Buttons
  // ------------------------------------------------------------------------
  function initTiltCards() {
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach((card) => {
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.24}px, ${y * 0.24}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. GSAP & ScrollTrigger Animations (High-End Luxury Motion)
  // ------------------------------------------------------------------------
  function initGSAPAnimations() {
    if (typeof gsap === 'undefined') {
      console.warn('GSAP library not loaded yet.');
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Timeline animation: fast, smooth reveal that never leaves content invisible
    const heroTl = gsap.timeline({
      defaults: { ease: 'power2.out', duration: 0.55 },
      onComplete: () => {
        gsap.set('.site-nav, .hero-badge-container, .hero-title, .hero-desc, .hero-cta-group .btn, .hero-stats .stat-item, .hero-tech-card', {
          clearProps: 'all'
        });
      }
    });

    heroTl
      .fromTo('.site-nav', { y: -25, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.5, clearProps: 'all' })
      .fromTo('.hero-badge-container', { y: 15, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.4, clearProps: 'all' }, '-=0.25')
      .fromTo('.hero-title', { y: 20, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.45, clearProps: 'all' }, '-=0.2')
      .fromTo('.hero-desc', { y: 15, opacity: 0.6 }, { y: 0, opacity: 1, duration: 0.4, clearProps: 'all' }, '-=0.2')
      .fromTo('.hero-cta-group .btn', { y: 12, opacity: 0.6 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, clearProps: 'all' }, '-=0.2')
      .fromTo('.hero-stats .stat-item', { y: 15, opacity: 0.6 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4, clearProps: 'all' }, '-=0.2')
      .fromTo('.hero-tech-card', { scale: 0.96, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.2)', clearProps: 'all' }, '-=0.3');

    // Section Headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.fromTo(header,
        { y: 30, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: header,
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    });

    // AI Pillars in About Section
    if (document.querySelector('.ai-pillars-grid')) {
      gsap.fromTo('.pillar-card',
        { y: 30, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: '.ai-pillars-grid',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }

    // Project Cards - Solid reveal with guaranteed visibility & immediateRender: false
    if (document.querySelector('.projects-grid')) {
      gsap.fromTo('.project-card',
        { y: 30, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }

    // CMMS Flagship Section & KPIs Animation
    if (document.querySelector('.cmms-section')) {
      gsap.fromTo('.cmms-container-card',
        { y: 30, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: '.cmms-section',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );

      gsap.fromTo('.cmms-kpi-card',
        { y: 15, opacity: 0.8 },
        {
          scrollTrigger: {
            trigger: '.cmms-kpis-grid',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.5,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }

    // Timeline Items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { x: bodyEl.getAttribute('dir') === 'rtl' ? -25 : 25, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: item,
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: i * 0.03,
          clearProps: 'all'
        }
      );
    });

    // Certifications Cards - Guaranteed 100% trigger & solid visibility
    if (document.querySelector('.certs-grid')) {
      gsap.fromTo('.cert-card',
        { y: 25, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: '.certs-grid',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }

    // Contact Section Cards
    if (document.querySelector('.contact-section')) {
      gsap.fromTo('.contact-card-item, .contact-form-card',
        { y: 25, opacity: 0.75 },
        {
          scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 94%',
            toggleActions: 'play none none none',
            once: true
          },
          immediateRender: false,
          y: 0,
          opacity: 1,
          stagger: 0.06,
          duration: 0.55,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }

    // Refresh ScrollTrigger calculations after initial layout pass
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    // Animated Numbers Counter
    initCounterAnimations();

    // Skill Bar Fill on Scroll
    initSkillBarAnimations();
  }

  // ------------------------------------------------------------------------
  // 4.5. Bulletproof Visibility Guard: Enforces 100% Solid Readable Cards
  // ------------------------------------------------------------------------
  function enforceAllCardsVisibility() {
    const cardSelectors = [
      '.project-card',
      '.cert-card',
      '.pillar-card',
      '.skill-card',
      '.timeline-card',
      '.cmms-container-card',
      '.cmms-kpi-card',
      '.cmms-report-card',
      '.cmms-eng-card',
      '.cmms-barcode-card',
      '.hero-tech-card',
      '.hero-title',
      '.hero-desc',
      '.hero-badge-container',
      '.hero-stats .stat-item',
      '.hero-cta-group .btn',
      '.contact-card-item',
      '.contact-form-card',
      '.section-header'
    ];

    document.querySelectorAll(cardSelectors.join(',')).forEach((el) => {
      const compStyle = window.getComputedStyle(el);
      const op = parseFloat(compStyle.opacity);
      if (isNaN(op) || op < 0.95) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
      if (compStyle.visibility === 'hidden') {
        el.style.visibility = 'visible';
      }
    });

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // Counter Number Animation
  function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target') || counter.textContent, 10);
      counter.textContent = '0';

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(counter, {
              duration: 2.2,
              innerText: target,
              snap: { innerText: 1 },
              ease: 'power2.out'
            });
          }
        });
      } else {
        counter.textContent = target;
      }
    });
  }

  // Skill Bar Fill Animation
  function initSkillBarAnimations() {
    const bars = document.querySelectorAll('.skill-bar-fill');

    bars.forEach((bar) => {
      const pct = bar.getAttribute('data-pct') || '85';
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: bar,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            bar.style.width = `${pct}%`;
          }
        });
      } else {
        bar.style.width = `${pct}%`;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 5. Skills Tab Filter
  // ------------------------------------------------------------------------
  function initSkillsFilter() {
    skillsFilterTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        skillsFilterTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        skillCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, 
                { opacity: 0.35, scale: 0.95 }, 
                { opacity: 1, scale: 1, duration: 0.4, clearProps: 'opacity,transform' }
              );
            } else {
              card.style.opacity = '1';
            }
          } else {
            card.style.display = 'none';
          }
        });

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 100);
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Interactive Modal Showcase for Timesheet Screenshots
  // ------------------------------------------------------------------------
  function updateModalView(index) {
    if (!screenshots[index]) return;
    currentScreenshotIndex = index;

    if (modalImageDisplay) {
      modalImageDisplay.style.opacity = '0';
      setTimeout(() => {
        modalImageDisplay.src = screenshots[index].src;
        modalImageDisplay.style.opacity = '1';
      }, 150);
    }

    // Update active tab button
    modalTabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    // Update description text based on current language
    if (modalScreenDesc) {
      const transObj = translations[currentLang] || translations.ar;
      const keyPath = screenshots[index].descKey.split('.');
      let text = transObj;
      for (const p of keyPath) {
        if (text && text[p] !== undefined) {
          text = text[p];
        } else {
          text = '';
          break;
        }
      }
      modalScreenDesc.textContent = text;
    }
  }

  function openShowcaseModal(initialIndex = 0) {
    if (!modalOverlay) return;
    updateModalView(initialIndex);
    modalOverlay.classList.add('active');
    bodyEl.style.overflow = 'hidden';
  }

  function closeShowcaseModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    bodyEl.style.overflow = '';
  }

  function initModalShowcase() {
    openModalBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(btn.getAttribute('data-screen-index') || '0', 10);
        openShowcaseModal(index);
      });
    });

    modalTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index') || '0', 10);
        updateModalView(index);
      });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeShowcaseModal);
    if (modalCloseFooterBtn) modalCloseFooterBtn.addEventListener('click', closeShowcaseModal);

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeShowcaseModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeShowcaseModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6.4. Smart Budget Mobile App Modal Showcase Logic
  // ------------------------------------------------------------------------
  function updateBudgetModalView(index) {
    if (index < 0 || index >= budgetScreenshots.length) return;
    currentBudgetScreenshotIndex = index;

    if (budgetModalImageDisplay) {
      budgetModalImageDisplay.style.opacity = '0.3';
      setTimeout(() => {
        budgetModalImageDisplay.src = budgetScreenshots[index].src;
        budgetModalImageDisplay.style.opacity = '1';
      }, 150);
    }

    budgetModalTabBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });

    if (budgetModalScreenDesc) {
      const transObj = translations[currentLang] || translations.ar;
      const keyPath = budgetScreenshots[index].descKey.split('.');
      let text = transObj;
      for (const p of keyPath) {
        if (text && text[p] !== undefined) {
          text = text[p];
        } else {
          text = '';
          break;
        }
      }
      budgetModalScreenDesc.textContent = text;
    }
  }

  function openBudgetModal(initialIndex = 0) {
    if (!budgetModalOverlay) return;
    updateBudgetModalView(initialIndex);
    budgetModalOverlay.classList.add('active');
    bodyEl.style.overflow = 'hidden';
  }

  function closeBudgetModal() {
    if (!budgetModalOverlay) return;
    budgetModalOverlay.classList.remove('active');
    bodyEl.style.overflow = '';
  }

  function initBudgetModalShowcase() {
    openBudgetModalBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt(btn.getAttribute('data-screen-index') || '0', 10);
        openBudgetModal(index);
      });
    });

    budgetModalTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-budget-index') || '0', 10);
        updateBudgetModalView(index);
      });
    });

    if (budgetModalCloseBtn) budgetModalCloseBtn.addEventListener('click', closeBudgetModal);
    if (budgetModalCloseFooterBtn) budgetModalCloseFooterBtn.addEventListener('click', closeBudgetModal);

    if (budgetModalOverlay) {
      budgetModalOverlay.addEventListener('click', (e) => {
        if (e.target === budgetModalOverlay) {
          closeBudgetModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && budgetModalOverlay && budgetModalOverlay.classList.contains('active')) {
        closeBudgetModal();
      }
    });
  }

  // ------------------------------------------------------------------------
  // 6.5. Timesheet Inline Screenshot Switcher (Direct on Project 1 Card)
  // ------------------------------------------------------------------------
  function initTimesheetInlineGallery() {
    const gallery = document.querySelector('.timesheet-preview-gallery');
    if (!gallery) return;

    const imgEl = document.getElementById('card-timesheet-img');
    const captionEl = document.getElementById('card-timesheet-caption');
    const tabBtns = gallery.querySelectorAll('.card-tab-btn');

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const targetImg = btn.getAttribute('data-img');
        const captionKey = btn.getAttribute('data-caption');

        if (imgEl && targetImg) {
          imgEl.style.opacity = '0.35';
          setTimeout(() => {
            imgEl.src = targetImg;
            imgEl.style.opacity = '1';
          }, 150);
        }

        if (captionEl && captionKey) {
          captionEl.setAttribute('data-i18n', captionKey);
          const currentLang = document.documentElement.lang || 'ar';
          const dict = translations[currentLang];
          if (dict && dict.modal && dict.modal[`desc${idx + 1}`]) {
            captionEl.textContent = dict.modal[`desc${idx + 1}`];
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6.6. Smart Budget Mobile App Inline Screenshot Switcher (Project 2 Card)
  // ------------------------------------------------------------------------
  function initBudgetInlineGallery() {
    const gallery = document.querySelector('.budget-preview-gallery');
    if (!gallery) return;

    const imgEl = document.getElementById('card-budget-img');
    const captionEl = document.getElementById('card-budget-caption');
    const tabBtns = gallery.querySelectorAll('.card-tab-btn');

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const targetImg = btn.getAttribute('data-img');
        if (imgEl && targetImg) {
          imgEl.style.opacity = '0.35';
          setTimeout(() => {
            imgEl.src = targetImg;
            imgEl.style.opacity = '1';
          }, 150);
        }

        if (captionEl) {
          const currentLang = document.documentElement.lang || 'ar';
          const dict = translations[currentLang];
          if (dict && dict.modalBudget && dict.modalBudget[`desc${idx + 1}`]) {
            captionEl.textContent = dict.modalBudget[`desc${idx + 1}`];
          }
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6.6. CMMS Standalone Interactive Dashboard (WOs, PM, Inventory & Reports)
  // ------------------------------------------------------------------------
  function initCmmsSection() {
    const cmmsSection = document.getElementById('cmms');
    if (!cmmsSection) return;

    const cmmsTabs = cmmsSection.querySelectorAll('.cmms-tab-btn');
    const cmmsPanes = cmmsSection.querySelectorAll('.cmms-tab-pane');
    const searchInput = document.getElementById('cmms-search-input');

    // Tab Switching
    cmmsTabs.forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const targetTab = tabBtn.getAttribute('data-tab');
        cmmsTabs.forEach((b) => b.classList.remove('active'));
        tabBtn.classList.add('active');

        cmmsPanes.forEach((pane) => {
          pane.classList.remove('active');
        });

        const targetPane = document.getElementById(`cmms-pane-${targetTab}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }

        if (searchInput && searchInput.value.trim()) {
          filterCmmsTable(searchInput.value.trim());
        }

        if (typeof ScrollTrigger !== 'undefined') {
          setTimeout(() => ScrollTrigger.refresh(), 120);
        }
      });
    });

    // Real-time Search Filter across active tab pane
    function filterCmmsTable(query) {
      const q = query.toLowerCase().trim();
      const activePane = cmmsSection.querySelector('.cmms-tab-pane.active');
      if (!activePane) return;

      // Filter rows in active pane table(s)
      const rows = activePane.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });

      // Filter cards in reports pane if active
      const cards = activePane.querySelectorAll('.cmms-report-card, .cmms-eng-card');
      if (cards.length > 0) {
        cards.forEach((card) => {
          const text = card.textContent.toLowerCase();
          if (!q || text.includes(q)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterCmmsTable(e.target.value);
      });
    }
  }

  // ------------------------------------------------------------------------
  // 7. Scroll Progress & Active Nav Link Spy
  // ------------------------------------------------------------------------
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${scrolled}%`;
      }

      // Active Section Spy
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      let currentSection = '';

      sections.forEach((sec) => {
        const secTop = sec.offsetTop - 130;
        const secHeight = sec.offsetHeight;
        if (winScroll >= secTop && winScroll < secTop + secHeight) {
          currentSection = sec.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 7.8. Precision Smooth Navigation & Anchor Scrolling (Tabs & Links)
  // ------------------------------------------------------------------------
  function scrollToTargetSection(targetId) {
    const cleanId = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    const targetEl = document.getElementById(cleanId);
    if (!targetEl) return;

    const navbar = document.getElementById('main-header');
    const navHeight = navbar ? navbar.offsetHeight : 75;
    const extraOffset = window.innerWidth <= 768 ? 16 : 26;
    const totalOffset = navHeight + extraOffset;

    const rect = targetEl.getBoundingClientRect();
    const scrollTarget = rect.top + window.pageYOffset - totalOffset;

    window.scrollTo({
      top: Math.max(0, scrollTarget),
      behavior: 'smooth'
    });

    // Refresh ScrollTrigger so cards and animations display crisply
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => ScrollTrigger.refresh(), 350);
    }
  }

  function initSmoothNavScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.length <= 1) return;

        const cleanId = href.startsWith('#') ? href.substring(1) : href;
        const targetEl = document.getElementById(cleanId);

        if (targetEl) {
          e.preventDefault();

          // Close mobile menu if open
          if (navLinksContainer && navLinksContainer.classList.contains('open')) {
            navLinksContainer.classList.remove('open');
            if (mobileMenuBtn) {
              mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
          }

          // Smoothly glide to the target with navbar clearance
          scrollToTargetSection(cleanId);

          // Update active link immediately in navbar
          document.querySelectorAll('.nav-link').forEach((nl) => {
            nl.classList.remove('active');
            if (nl.getAttribute('href') === `#${cleanId}`) {
              nl.classList.add('active');
            }
          });

          // Update history URL state smoothly without browser instant jump
          if (window.history && window.history.pushState) {
            window.history.pushState(null, null, `#${cleanId}`);
          }
        }
      });
    });

    // If page was loaded directly with a hash in URL (e.g. index.html#projects), scroll smoothly to it
    if (window.location.hash && window.location.hash.length > 1) {
      setTimeout(() => {
        scrollToTargetSection(window.location.hash);
      }, 300);
    }
  }

  // ------------------------------------------------------------------------
  // 8. Mobile Menu Navigation
  // ------------------------------------------------------------------------
  function initMobileMenu() {
    if (!mobileMenuBtn || !navLinksContainer) return;

    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('open');
      const isExpanded = navLinksContainer.classList.contains('open');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinksContainer.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinksContainer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 9. Toast Notification System & Clipboard Helper
  // ------------------------------------------------------------------------
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3200);
  }

  function initClipboardCopy() {
    document.querySelectorAll('[data-copy-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy-target');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const currentMsg = currentLang === 'ar'
              ? translations.ar.contact.copyToast
              : translations.en.contact.copyToast;
            showToast(currentMsg);
          });
        }
      });
    });
  }

  // ------------------------------------------------------------------------
  // 10. Direct WhatsApp & Contact Form Handlers
  // ------------------------------------------------------------------------
  function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const whatsappBtn = document.getElementById('whatsapp-direct-btn');

    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        const phone = '962793101728';
        const msg = currentLang === 'ar'
          ? 'مرحباً أ. يزيد العرايشه، اطلعت على موقعك الشخصي وأنظمتك المبتكرة وأرغب في بحث مشروع أتمتة وذكاء اصطناعي معك.'
          : 'Hello Yazeed Al-Araisha, I reviewed your portfolio and intelligent systems, and I would like to discuss an AI & automation project.';
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        const mailtoSubject = encodeURIComponent(`[AI Project Inquiry] ${subject} - ${name}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nProject Scope:\n${message}`);

        window.location.href = `mailto:yazeedalaraisha@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        const successNotice = currentLang === 'ar'
          ? 'جاري فتح برنامج البريد الإلكتروني لإرسال تفاصيل مشروعك...'
          : 'Opening your email client to dispatch your project inquiry...';
        showToast(successNotice);
      });
    }
  }

  // ------------------------------------------------------------------------
  // 11. Lifecycle Initialization & Fail-Safe Visibility Handlers
  // ------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLang);
    initBackgroundCanvas();
    initTiltCards();
    initMagneticButtons();
    initSmoothNavScrolling();
    initSkillsFilter();
    initModalShowcase();
    initTimesheetInlineGallery();
    initBudgetModalShowcase();
    initBudgetInlineGallery();
    initCmmsSection();
    initScrollProgress();
    initMobileMenu();
    initClipboardCopy();
    initContactForm();

    // Attach Toggle Listener
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', toggleLanguage);
    }

    // Initialize GSAP with high priority
    setTimeout(() => {
      initGSAPAnimations();
    }, 60);

    // Visibility Guards to ensure all cards are 100% visible and non-transparent
    setTimeout(enforceAllCardsVisibility, 400);
    setTimeout(enforceAllCardsVisibility, 1000);
    setTimeout(enforceAllCardsVisibility, 2200);
  });

  // When all images, fonts, and assets finish loading, recalculate ScrollTrigger
  window.addEventListener('load', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    enforceAllCardsVisibility();
  });

  // Refresh on viewport resize to adapt fluidly across devices
  window.addEventListener('resize', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }, { passive: true });

  // Safety scroll watcher: ensures cards are revealed even if user scrolls fast
  let scrollGuardTimer = null;
  window.addEventListener('scroll', () => {
    if (!scrollGuardTimer) {
      scrollGuardTimer = setTimeout(() => {
        enforceAllCardsVisibility();
        scrollGuardTimer = null;
      }, 250);
    }
  }, { passive: true });
})();
