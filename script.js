/**
 * CHROMAVISION - INNOVATIVE SMART EYEWEAR STARTUP
 * Official JavaScript Engine (script.js)
 * Clean, well-organized, beginner-friendly Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. SIMULATOR STATE & COLOR PROFILES CONFIGURATION
     ========================================================================== */
  
  // Current active simulator parameters
  const simState = {
    temp: 'cold',       // 'cold' | 'mild' | 'warm'
    sun: 'low',         // 'low' | 'moderate' | 'intense'
    showRx: false,      // boolean for prescription crosshairs overlay
    showRays: false     // boolean for animated UV light rays
  };

  /**
   * Color profiles corresponding to environmental states.
   * Logic requirement:
   *  - Cold + Low = Ice Blue
   *  - Mild + Low = Silver Grey
   *  - Warm + Low = Bronze
   *  - Intense sunlight (at any temperature) = Dark Black (Solar Override)
   */
  const colorProfiles = {
    // 1. COLD STATES (<12°C)
    'cold-low': {
      tintName: 'Light Ice Blue',
      dotColor: '#38bdf8',
      stops: {
        left:  ['#a5f3fc', '#38bdf8', '#0284c7'],
        right: ['#a5f3fc', '#38bdf8', '#0284c7'],
        opacity: [0.85, 0.75, 0.90]
      },
      glowColor: '#38bdf8',
      tempNum: '8',
      tempText: '8°C (46°F) • Cold',
      sunText: 'Low Sunlight (Indoor / Twilight • UV 1.0)',
      vlt: '72%',
      overrideActive: false,
      modeText: 'THERMAL MODE ACTIVE',
      insightTitle: 'Active Molecular State: Cryo-Kinetic Ice Blue Phase',
      insightDesc: 'At temperatures below 12°C with low UV sunlight, the thermochromic organic molecules contract into a crystalline helical configuration, preferentially reflecting light in the 480nm spectrum to create a crisp, high-contrast Ice Blue tint.',
      stageClass: 'stage-stage-ice'
    },
    'cold-moderate': {
      tintName: 'Deep Ice Azure',
      dotColor: '#0ea5e9',
      stops: {
        left:  ['#38bdf8', '#0284c7', '#0369a1'],
        right: ['#38bdf8', '#0284c7', '#0369a1'],
        opacity: [0.90, 0.85, 0.94]
      },
      glowColor: '#0ea5e9',
      tempNum: '8',
      tempText: '8°C (46°F) • Cold',
      sunText: 'Moderate Sunlight (Daylight • UV 4.2)',
      vlt: '52%',
      overrideActive: false,
      modeText: 'THERMAL + PARTIAL SOLAR ATTENUATION',
      insightTitle: 'Active Molecular State: Glacial Daylight Density',
      insightDesc: 'In cold climates with moderate ambient daylight, the photochromic silver-halide particles begin mild cross-linking, deepening the Ice Blue hue into an Azure shield that cuts down snowy glare without compromising peripheral clarity.',
      stageClass: 'stage-stage-ice'
    },

    // 2. MILD STATES (18°C - 24°C)
    'mild-low': {
      tintName: 'Silver Grey',
      dotColor: '#cbd5e1',
      stops: {
        left:  ['#f1f5f9', '#cbd5e1', '#64748b'],
        right: ['#f1f5f9', '#cbd5e1', '#64748b'],
        opacity: [0.70, 0.65, 0.80]
      },
      glowColor: '#cbd5e1',
      tempNum: '21',
      tempText: '21°C (70°F) • Mild',
      sunText: 'Low Sunlight (Indoor / Overcast • UV 1.2)',
      vlt: '78%',
      overrideActive: false,
      modeText: 'THERMAL MODE ACTIVE',
      insightTitle: 'Active Molecular State: Balanced Meso-Phase Neutral Tint',
      insightDesc: 'Between 18°C and 24°C under mild daylight, the molecular matrix achieves an isotropic equilibrium, evenly attenuating visible light across all spectrum bands to deliver 100% natural, color-true optical fidelity.',
      stageClass: 'stage-stage-silver'
    },
    'mild-moderate': {
      tintName: 'Slate Smoke Grey',
      dotColor: '#94a3b8',
      stops: {
        left:  ['#94a3b8', '#64748b', '#334155'],
        right: ['#94a3b8', '#64748b', '#334155'],
        opacity: [0.85, 0.80, 0.92]
      },
      glowColor: '#94a3b8',
      tempNum: '21',
      tempText: '21°C (70°F) • Mild',
      sunText: 'Moderate Sunlight (Part Cloud • UV 4.5)',
      vlt: '50%',
      overrideActive: false,
      modeText: 'THERMAL + PARTIAL SOLAR ATTENUATION',
      insightTitle: 'Active Molecular State: Neutral Charcoal Attenuation',
      insightDesc: 'Under mild ambient warmth with daytime cloud breaks, the photo-reactive nanoparticles darken the neutral silver base into an architectural slate smoke, providing comfortable everyday sun filtering.',
      stageClass: 'stage-stage-silver'
    },

    // 3. WARM STATES (>28°C)
    'warm-low': {
      tintName: 'Warm Bronze',
      dotColor: '#f59e0b',
      stops: {
        left:  ['#fde68a', '#f59e0b', '#b45309'],
        right: ['#fde68a', '#f59e0b', '#b45309'],
        opacity: [0.80, 0.75, 0.88]
      },
      glowColor: '#f59e0b',
      tempNum: '32',
      tempText: '32°C (90°F) • Warm',
      sunText: 'Low Sunlight (Sunset / Golden Hour • UV 2.0)',
      vlt: '70%',
      overrideActive: false,
      modeText: 'THERMAL MODE ACTIVE',
      insightTitle: 'Active Molecular State: Thermo-Expanded Amber Matrix',
      insightDesc: 'When ambient temperatures surpass 28°C, the thermochromic polymers expand, shifting their absorption band to filter high-energy blue-violet light and rendering a rich Bronze tint that relaxes tired ocular muscles.',
      stageClass: 'stage-stage-bronze'
    },
    'warm-moderate': {
      tintName: 'Deep Amber Bronze',
      dotColor: '#d97706',
      stops: {
        left:  ['#f59e0b', '#d97706', '#78350f'],
        right: ['#f59e0b', '#d97706', '#78350f'],
        opacity: [0.88, 0.85, 0.94]
      },
      glowColor: '#d97706',
      tempNum: '32',
      tempText: '32°C (90°F) • Warm',
      sunText: 'Moderate Sunlight (Bright Warmth • UV 4.8)',
      vlt: '48%',
      overrideActive: false,
      modeText: 'THERMAL + PARTIAL SOLAR ATTENUATION',
      insightTitle: 'Active Molecular State: High-Contrast Polarized Amber',
      insightDesc: 'In warm climates with moderate sun, the bronze matrix deepens significantly to suppress coastal water glare and desert heat haze, maximizing horizon contrast for drivers and outdoor adventurers.',
      stageClass: 'stage-stage-bronze'
    },

    // 4. INTENSE SUNLIGHT OVERRIDE (AT ANY TEMPERATURE)
    'solar-override': {
      tintName: 'Dark Black (Solar Override)',
      dotColor: '#0f172a',
      stops: {
        left:  ['#1e293b', '#0f172a', '#020617'],
        right: ['#1e293b', '#0f172a', '#020617'],
        opacity: [0.97, 0.98, 0.99]
      },
      glowColor: '#475569',
      sunText: 'Intense Sunlight (Direct Midday Sun • UV 9.8)',
      vlt: '11%',
      overrideActive: true,
      modeText: 'SOLAR OVERRIDE ENGAGED',
      insightTitle: 'Active Molecular State: Photonic Spiro-Crosslink Blackout',
      insightDesc: 'Under intense UV radiation (UV Index ≥ 6), photo-reactive silver halide and spiro-oxazine nanocrystals absorb high photon energy and instantly polymerize. This overrides the temperature-based pigment into an impenetrable Dark Black solar shield within milliseconds.',
      stageClass: 'stage-stage-black'
    }
  };


  /* ==========================================================================
     2. DOM ELEMENTS CACHE
     ========================================================================== */

  // SVG stops for simulated eyewear
  const stopLeft1  = document.getElementById('lens-left-stop-1');
  const stopLeft2  = document.getElementById('lens-left-stop-2');
  const stopLeft3  = document.getElementById('lens-left-stop-3');
  const stopRight1 = document.getElementById('lens-right-stop-1');
  const stopRight2 = document.getElementById('lens-right-stop-2');
  const stopRight3 = document.getElementById('lens-right-stop-3');

  // SVG Sensor & Glow
  const bridgeSensor = document.getElementById('sim-bridge-sensor');
  const glowBlur     = document.getElementById('sim-glow-blur');

  // Stage & Telemetry HUD elements
  const studioStage    = document.getElementById('studio-stage');
  const modeBadge      = document.getElementById('stage-mode-badge');
  const modeText       = document.getElementById('stage-mode-text');
  const vltReadout     = document.getElementById('vlt-readout');
  const hudTempNum     = document.getElementById('hud-temp-num');
  const hudTempVal     = document.getElementById('hud-temp-val');
  const hudSunVal      = document.getElementById('hud-sun-val');
  const hudTintDot     = document.getElementById('hud-tint-dot');
  const hudTintName    = document.getElementById('hud-tint-name');
  const hudOverrideVal = document.getElementById('hud-override-val');

  // Control Badges
  const tempBadge = document.getElementById('temp-badge');
  const sunBadge  = document.getElementById('sun-badge');

  // Molecular Insight Card
  const insightTitle = document.getElementById('insight-title');
  const insightDesc  = document.getElementById('insight-desc');

  // Control Buttons
  const tempButtons = document.querySelectorAll('[data-control="temp"]');
  const sunButtons  = document.querySelectorAll('[data-control="sun"]');
  const presetButtons = document.querySelectorAll('[data-preset]');

  // Feature Toggles (Rx & Rays)
  const toggleRxBtn   = document.getElementById('toggle-rx-btn');
  const toggleRaysBtn = document.getElementById('toggle-rays-btn');
  const rxGridLeft    = document.getElementById('rx-grid-left');
  const rxGridRight   = document.getElementById('rx-grid-right');
  const photonRays    = document.getElementById('photon-rays');

  // Hero Quick Preview Elements
  const heroPreviewChips = document.querySelectorAll('.preview-chip');
  const heroLensLeft     = document.getElementById('hero-lens-left-grad');
  const heroLensRight    = document.getElementById('hero-lens-right-grad');

  // Mobile Menu & Navigation
  const header        = document.getElementById('header');
  const hamburgerBtn  = document.getElementById('hamburger-btn');
  const mobileDrawer  = document.getElementById('mobile-drawer');
  const drawerLinks   = document.querySelectorAll('.drawer-link');
  const navLinks      = document.querySelectorAll('.nav-link');
  const backToTopBtn  = document.getElementById('back-to-top');

  // Contact Form & Modal Elements
  const contactForm     = document.getElementById('contact-form');
  const submitBtn       = document.getElementById('submit-btn');
  const submitBtnText   = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const submitBtnLoad   = submitBtn ? submitBtn.querySelector('.btn-loading') : null;
  const confirmationModal = document.getElementById('confirmation-modal');
  const modalCloseBtn   = document.getElementById('modal-close-btn');
  const modalUserName   = document.getElementById('modal-user-name');
  const modalUserEmail  = document.getElementById('modal-user-email');
  const modalUserRx     = document.getElementById('modal-user-rx');

  // FAQ Accordion
  const faqButtons = document.querySelectorAll('.faq-question');


  /* ==========================================================================
     3. SIMULATOR UPDATE LOGIC
     ========================================================================== */

  /**
   * Determine the active profile key based on temp & sun state.
   * If sunlight is 'intense', it overrides temperature!
   */
  function getActiveProfile() {
    if (simState.sun === 'intense') {
      const base = colorProfiles['solar-override'];
      // Keep temperature reading accurate to what user selected
      let tempText = '21°C (70°F) • Mild';
      let tempNum = '21';
      if (simState.temp === 'cold') {
        tempText = '8°C (46°F) • Cold';
        tempNum = '8';
      } else if (simState.temp === 'warm') {
        tempText = '32°C (90°F) • Warm';
        tempNum = '32';
      }
      return {
        ...base,
        tempNum,
        tempText
      };
    }

    const key = `${simState.temp}-${simState.sun}`;
    return colorProfiles[key] || colorProfiles['cold-low'];
  }

  /**
   * Render the current simulation state onto the SVG, HUD, and telemetry.
   */
  function renderSimulator() {
    const profile = getActiveProfile();

    // 1. Update SVG Gradient Stops for simulated eyewear
    if (stopLeft1 && stopLeft2 && stopLeft3) {
      stopLeft1.setAttribute('stop-color', profile.stops.left[0]);
      stopLeft1.setAttribute('stop-opacity', profile.stops.opacity[0]);

      stopLeft2.setAttribute('stop-color', profile.stops.left[1]);
      stopLeft2.setAttribute('stop-opacity', profile.stops.opacity[1]);

      stopLeft3.setAttribute('stop-color', profile.stops.left[2]);
      stopLeft3.setAttribute('stop-opacity', profile.stops.opacity[2]);
    }

    if (stopRight1 && stopRight2 && stopRight3) {
      stopRight1.setAttribute('stop-color', profile.stops.right[0]);
      stopRight1.setAttribute('stop-opacity', profile.stops.opacity[0]);

      stopRight2.setAttribute('stop-color', profile.stops.right[1]);
      stopRight2.setAttribute('stop-opacity', profile.stops.opacity[1]);

      stopRight3.setAttribute('stop-color', profile.stops.right[2]);
      stopRight3.setAttribute('stop-opacity', profile.stops.opacity[2]);
    }

    // 2. Update Sensor Pod Glow & Filter
    if (bridgeSensor) {
      bridgeSensor.setAttribute('fill', profile.dotColor);
    }
    if (glowBlur) {
      glowBlur.setAttribute('stdDeviation', profile.overrideActive ? '2' : '6');
    }

    // 3. Update Stage Atmosphere Class
    if (studioStage) {
      studioStage.classList.remove('stage-stage-ice', 'stage-stage-silver', 'stage-stage-bronze', 'stage-stage-black');
      studioStage.classList.add(profile.stageClass);
    }

    // 4. Update HUD Telemetry
    if (hudTempNum) hudTempNum.textContent = profile.tempNum;
    if (hudTempVal) hudTempVal.innerHTML = `<span id="hud-temp-num">${profile.tempNum}</span>&deg;C &bull; ${capitalize(simState.temp)}`;
    if (hudSunVal) hudSunVal.textContent = capitalize(simState.sun) + (simState.sun === 'intense' ? ' (Direct Solar)' : ' Sunlight');
    if (hudTintDot) {
      hudTintDot.style.backgroundColor = profile.dotColor;
      hudTintDot.style.boxShadow = `0 0 10px ${profile.dotColor}`;
    }
    if (hudTintName) hudTintName.textContent = profile.tintName;
    if (vltReadout) vltReadout.textContent = profile.vlt;

    // 5. Update Override Status & Stage Mode Badge
    if (profile.overrideActive) {
      if (modeBadge) modeBadge.classList.add('override-active');
      if (modeText) modeText.textContent = profile.modeText;
      if (hudOverrideVal) {
        hudOverrideVal.textContent = '☀️ Solar Override Active (Blackout)';
        hudOverrideVal.style.color = '#f59e0b';
      }
    } else {
      if (modeBadge) modeBadge.classList.remove('override-active');
      if (modeText) modeText.textContent = profile.modeText;
      if (hudOverrideVal) {
        hudOverrideVal.textContent = 'Thermal Mode Active (Zero Override)';
        hudOverrideVal.style.color = '#38bdf8';
      }
    }

    // 6. Update Control Badges Text
    if (tempBadge) {
      let tempRange = '<12°C';
      if (simState.temp === 'mild') tempRange = '18°C–24°C';
      if (simState.temp === 'warm') tempRange = '>28°C';
      tempBadge.textContent = `Active: ${capitalize(simState.temp)} (${tempRange})`;
    }
    if (sunBadge) {
      sunBadge.textContent = `Active: ${capitalize(simState.sun)} Sunlight`;
    }

    // 7. Update Molecular Insight Card
    if (insightTitle) insightTitle.textContent = profile.insightTitle;
    if (insightDesc) insightDesc.textContent = profile.insightDesc;

    // 8. Update Active States on Control Buttons
    tempButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-value') === simState.temp;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });

    sunButtons.forEach(btn => {
      const isMatch = btn.getAttribute('data-value') === simState.sun;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }


  /* ==========================================================================
     4. SIMULATOR EVENT LISTENERS
     ========================================================================== */

  // Temperature button click
  tempButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      if (val) {
        simState.temp = val;
        renderSimulator();
        clearActivePresets();
      }
    });
  });

  // Sunlight button click
  sunButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-value');
      if (val) {
        simState.sun = val;
        renderSimulator();
        clearActivePresets();
      }
    });
  });

  // Preset Scenario Buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      clearActivePresets();
      btn.classList.add('active');

      switch (preset) {
        case 'arctic':
          simState.temp = 'cold';
          simState.sun = 'low';
          break;
        case 'spring':
          simState.temp = 'mild';
          simState.sun = 'low';
          break;
        case 'sahara':
          simState.temp = 'warm';
          simState.sun = 'low';
          break;
        case 'highnoon':
          simState.temp = 'warm';
          simState.sun = 'intense';
          break;
      }
      renderSimulator();
    });
  });

  function clearActivePresets() {
    presetButtons.forEach(b => b.classList.remove('active'));
  }

  // Prescription Crosshairs Toggle
  if (toggleRxBtn) {
    toggleRxBtn.addEventListener('click', () => {
      simState.showRx = !simState.showRx;
      toggleRxBtn.classList.toggle('active', simState.showRx);
      if (rxGridLeft) rxGridLeft.classList.toggle('hidden', !simState.showRx);
      if (rxGridRight) rxGridRight.classList.toggle('hidden', !simState.showRx);
    });
  }

  // UV Ray Simulation Toggle
  if (toggleRaysBtn) {
    toggleRaysBtn.addEventListener('click', () => {
      simState.showRays = !simState.showRays;
      toggleRaysBtn.classList.toggle('active', simState.showRays);
      if (photonRays) photonRays.classList.toggle('active', simState.showRays);
    });
  }


  /* ==========================================================================
     5. HERO QUICK PREVIEW CHIPS
     ========================================================================== */
  heroPreviewChips.forEach(chip => {
    chip.addEventListener('click', () => {
      heroPreviewChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const tint = chip.getAttribute('data-tint');
      applyHeroTint(tint);
    });
  });

  function applyHeroTint(tint) {
    if (!heroLensLeft || !heroLensRight) return;

    let stops = [];
    switch (tint) {
      case 'ice':
        stops = [
          { offset: '0%', color: '#7dd3fc', opacity: '0.85' },
          { offset: '45%', color: '#38bdf8', opacity: '0.75' },
          { offset: '100%', color: '#0284c7', opacity: '0.90' }
        ];
        break;
      case 'silver':
        stops = [
          { offset: '0%', color: '#f1f5f9', opacity: '0.75' },
          { offset: '45%', color: '#cbd5e1', opacity: '0.65' },
          { offset: '100%', color: '#64748b', opacity: '0.85' }
        ];
        break;
      case 'bronze':
        stops = [
          { offset: '0%', color: '#fde68a', opacity: '0.85' },
          { offset: '45%', color: '#f59e0b', opacity: '0.75' },
          { offset: '100%', color: '#b45309', opacity: '0.90' }
        ];
        break;
      case 'black':
        stops = [
          { offset: '0%', color: '#1e293b', opacity: '0.97' },
          { offset: '45%', color: '#0f172a', opacity: '0.98' },
          { offset: '100%', color: '#020617', opacity: '0.99' }
        ];
        break;
    }

    [heroLensLeft, heroLensRight].forEach(grad => {
      if (grad) {
        grad.innerHTML = `
          <stop offset="${stops[0].offset}" stop-color="${stops[0].color}" stop-opacity="${stops[0].opacity}"/>
          <stop offset="${stops[1].offset}" stop-color="${stops[1].color}" stop-opacity="${stops[1].opacity}"/>
          <stop offset="${stops[2].offset}" stop-color="${stops[2].color}" stop-opacity="${stops[2].opacity}"/>
        `;
      }
    });
  }


  /* ==========================================================================
     6. NAVIGATION, SCROLL & MOBILE DRAWER
     ========================================================================== */

  // Sticky header shadow on scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', scrollPos > 50);
    }

    if (backToTopBtn) {
      backToTopBtn.classList.toggle('show', scrollPos > 350);
    }
  }, { passive: true });

  // Back to Top button click
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Mobile Hamburger Toggle
  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('active');
      toggleMobileMenu(!isOpen);
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });
  }

  function toggleMobileMenu(open) {
    if (hamburgerBtn) {
      hamburgerBtn.classList.toggle('active', open);
      hamburgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (mobileDrawer) {
      mobileDrawer.classList.toggle('open', open);
      mobileDrawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }

  // Active Nav Link Spy using IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -50% 0px'
    });

    sections.forEach(sec => navObserver.observe(sec));
  }


  /* ==========================================================================
     7. FAQ ACCORDION
     ========================================================================== */
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all other FAQ items
      faqButtons.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.style.maxHeight = null;
          }
        }
      });

      // Toggle clicked item
      btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (answer) {
        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      }
    });
  });


  /* ==========================================================================
     8. CONTACT FORM VALIDATION & CONFIRMATION MODAL
     ========================================================================== */
  if (contactForm) {
    const nameInput    = document.getElementById('user-name');
    const emailInput   = document.getElementById('user-email');
    const rxSelect     = document.getElementById('user-rx');
    const messageInput = document.getElementById('user-message');

    const nameError    = document.getElementById('name-error');
    const emailError   = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Real-time clearance of errors on typing
    if (nameInput) {
      nameInput.addEventListener('input', () => validateName(false));
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => validateEmail(false));
    }
    if (messageInput) {
      messageInput.addEventListener('input', () => validateMessage(false));
    }

    function validateName(showEmpty = true) {
      const val = nameInput.value.trim();
      if (!val) {
        if (showEmpty) {
          nameError.textContent = 'Please enter your full name.';
          nameInput.classList.add('invalid');
        }
        return false;
      }
      if (val.length < 2) {
        nameError.textContent = 'Name must be at least 2 characters.';
        nameInput.classList.add('invalid');
        return false;
      }
      nameError.textContent = '';
      nameInput.classList.remove('invalid');
      return true;
    }

    function validateEmail(showEmpty = true) {
      const val = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!val) {
        if (showEmpty) {
          emailError.textContent = 'Please enter your email address.';
          emailInput.classList.add('invalid');
        }
        return false;
      }
      if (!emailPattern.test(val)) {
        emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
        emailInput.classList.add('invalid');
        return false;
      }
      emailError.textContent = '';
      emailInput.classList.remove('invalid');
      return true;
    }

    function validateMessage(showEmpty = true) {
      const val = messageInput.value.trim();
      if (!val) {
        if (showEmpty) {
          messageError.textContent = 'Please write a brief message or question.';
          messageInput.classList.add('invalid');
        }
        return false;
      }
      if (val.length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        messageInput.classList.add('invalid');
        return false;
      }
      messageError.textContent = '';
      messageInput.classList.remove('invalid');
      return true;
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid    = validateName(true);
      const isEmailValid   = validateEmail(true);
      const isMessageValid = validateMessage(true);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        // Focus first invalid input
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isMessageValid) messageInput.focus();
        return;
      }

      // Simulate submission UX (local mock, beginner-friendly)
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.classList.add('hidden');
        if (submitBtnLoad) submitBtnLoad.classList.remove('hidden');
      }

      setTimeout(() => {
        // Populate modal data
        if (modalUserName) modalUserName.textContent = nameInput.value.trim();
        if (modalUserEmail) modalUserEmail.textContent = emailInput.value.trim();
        if (modalUserRx && rxSelect) {
          const selectedOption = rxSelect.options[rxSelect.selectedIndex];
          modalUserRx.textContent = selectedOption ? selectedOption.text : 'General Inquiry';
        }

        // Show modal
        if (confirmationModal) {
          confirmationModal.classList.add('open');
          confirmationModal.setAttribute('aria-hidden', 'false');
        }

        // Reset button state & form
        if (submitBtn) {
          submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.classList.remove('hidden');
          if (submitBtnLoad) submitBtnLoad.classList.add('hidden');
        }
        contactForm.reset();
      }, 700);
    });
  }

  // Close confirmation modal
  if (modalCloseBtn && confirmationModal) {
    modalCloseBtn.addEventListener('click', () => {
      confirmationModal.classList.remove('open');
      confirmationModal.setAttribute('aria-hidden', 'true');
    });

    confirmationModal.addEventListener('click', (e) => {
      if (e.target === confirmationModal) {
        confirmationModal.classList.remove('open');
        confirmationModal.setAttribute('aria-hidden', 'true');
      }
    });
  }


  /* ==========================================================================
     9. INITIALIZATION
     ========================================================================== */
  // Initial render of the Colour Studio simulator
  renderSimulator();

  // Initialize moveable interactive background dots & constellation canvas
  initMoveableDotsCanvas();

  // Initialize 3D interactive spectacle card cursor movement
  initSpectacleCardMovement();

  console.log('ChromaVision Startup Website initialized successfully.');


  /* ==========================================================================
     10. MOVEABLE BACKGROUND DOTS & CONSTELLATION CANVAS
     ========================================================================== */
  function initMoveableDotsCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];
    const particleCount = 75; // Optimal for smooth 60fps & clean futuristic aesthetic
    const connectionDist = 110;
    const mouseRadius = 160;

    // Mouse & Touch coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      active: false
    };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(dpr, dpr);
    }

    // Palette of smart eyewear futuristic dot colors
    const colors = [
      { r: 56,  g: 189, b: 248 }, // Ice Cyan Blue
      { r: 125, g: 211, b: 252 }, // Soft Sky Blue
      { r: 203, g: 213, b: 225 }, // Silver Grey
      { r: 245, g: 158, b: 11  }  // Warm Solar Bronze Accent
    ];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : (Math.random() > 0.5 ? -10 : height + 10);
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = 1.2 + Math.random() * 2.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.baseAlpha = 0.25 + Math.random() * 0.45;
        this.alpha = this.baseAlpha;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      update() {
        this.pulse += this.pulseSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.pulse) * 0.15;

        // Base velocity drift
        this.x += this.vx;
        this.y += this.vy;

        // Interactive cursor repulsion / movement
        if (mouse.active) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const force = (mouseRadius - dist) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            // Push dot away from cursor with spring physics
            this.x += Math.cos(angle) * force * 4.2;
            this.y += Math.sin(angle) * force * 4.2;
            // Bloom dot brightness when near cursor
            this.alpha = Math.min(0.95, this.alpha + force * 0.45);
          }
        }

        // Screen boundary wrap-around
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;

        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.5)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    // Mouse & Touch tracking for background dots
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      mouse.active = false;
    });

    // Click shockwave pulse on dots
    window.addEventListener('click', (e) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      const shockwaveRadius = 220;

      particles.forEach(p => {
        const dx = p.x - clickX;
        const dy = p.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < shockwaveRadius) {
          const force = (shockwaveRadius - dist) / shockwaveRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 24;
          p.y += Math.sin(angle) * force * 24;
        }
      });
    });

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    // Main animation loop
    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw constellation connections between nearby dots
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect with nearby dots
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw faint luminous tether from cursor to nearby dots
        if (mouse.active) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 130) {
            const tetherAlpha = (1 - mdist / 130) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = `rgba(125, 211, 252, ${tetherAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();
  }


  /* ==========================================================================
     11. 3D INTERACTIVE SPECTACLE CARD CURSOR MOVEMENT & PHYSICS
     ========================================================================== */
  function initSpectacleCardMovement() {
    // 1. Hero Spectacle Card
    const heroCard = document.getElementById('hero-spectacle-stage');
    const heroGlassesBox = document.getElementById('hero-glasses-box');
    const heroFlare = document.getElementById('hero-glass-flare');

    if (heroCard) {
      setup3DCard(heroCard, heroGlassesBox, heroFlare, 16, 14);
    }

    // 2. Studio Spectacle Card / Stage
    const studioWrap = document.getElementById('studio-glasses-wrap');
    const studioSvg = document.getElementById('studio-svg');

    if (studioWrap) {
      setup3DCard(studioWrap, studioSvg, null, 14, 12);
    }

    /**
     * Generic 3D Card tilt and cursor tracking setup
     */
    function setup3DCard(card, innerObject, flare, maxRotateX = 16, maxRotateY = 16) {
      let isHovered = false;
      let rafId = null;

      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      let targetTransX = 0;
      let targetTransY = 0;
      let currentTransX = 0;
      let currentTransY = 0;

      function updateCardTransform() {
        // Smooth linear interpolation (lerp) for organic spring feel
        const ease = 0.12;
        currentRotX += (targetRotX - currentRotX) * ease;
        currentRotY += (targetRotY - currentRotY) * ease;
        currentTransX += (targetTransX - currentTransX) * ease;
        currentTransY += (targetTransY - currentTransY) * ease;

        card.style.transform = `perspective(1100px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translate3d(${currentTransX.toFixed(2)}px, ${currentTransY.toFixed(2)}px, 12px)`;

        if (innerObject) {
          innerObject.style.transform = `translate3d(${(currentTransX * 1.5).toFixed(2)}px, ${(currentTransY * 1.5).toFixed(2)}px, 30px) scale(${isHovered ? 1.03 : 1})`;
        }

        if (isHovered || Math.abs(currentRotX) > 0.05 || Math.abs(currentRotY) > 0.05) {
          rafId = requestAnimationFrame(updateCardTransform);
        } else {
          card.style.transform = '';
          if (innerObject) innerObject.style.transform = '';
        }
      }

      function onMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalized (-1 to 1) from card center
        const xPercent = (mouseX / rect.width) * 2 - 1;
        const yPercent = (mouseY / rect.height) * 2 - 1;

        // Target rotation & translation
        targetRotX = -yPercent * maxRotateX;
        targetRotY = xPercent * maxRotateY;
        targetTransX = xPercent * 10;
        targetTransY = yPercent * 8;

        // Update specular flare position
        if (flare) {
          flare.style.left = `${mouseX}px`;
          flare.style.top = `${mouseY}px`;
        }
      }

      card.addEventListener('mouseenter', () => {
        isHovered = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateCardTransform);
      });

      card.addEventListener('mousemove', onMouseMove);

      card.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetTransX = 0;
        targetTransY = 0;
      });

      // Touch events for mobile phones and tablets
      card.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          isHovered = true;
          const touch = e.touches[0];
          onMouseMove(touch);
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(updateCardTransform);
        }
      }, { passive: true });

      card.addEventListener('touchend', () => {
        isHovered = false;
        targetRotX = 0;
        targetRotY = 0;
        targetTransX = 0;
        targetTransY = 0;
      });
    }
  }
});

