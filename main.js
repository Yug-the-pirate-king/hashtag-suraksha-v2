// ═══════════════════════════════════════════════════
//  HASHTAG SURAKSHA — MAIN JAVASCRIPT
//  Features: Theme Chooser · Cursor Glow · Magnetic Buttons
//  3D Card Tilt · Horizontal Scroll · Typewriter · Counters
//  Chat Demo · Activity Feed · Scroll Reveal
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── THEME SYSTEM ──────────────────────────────────────────────
  const htmlEl       = document.documentElement;
  const chooser      = document.getElementById('themeChooser');
  const themeToggle  = document.getElementById('themeToggle');
  const THEME_KEY    = 'hs-theme';

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function dismissChooser(theme) {
    applyTheme(theme);
    if (!chooser) return;
    chooser.classList.add('fade-out');
    setTimeout(() => chooser.classList.add('hidden'), 500);
  }

  // On load: check saved preference
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    applyTheme(savedTheme);
    if (chooser) chooser.classList.add('hidden');
  } else {
    // Show chooser — apply dark by default behind it
    applyTheme('dark');
    if (chooser) {
      chooser.querySelectorAll('.theme-option').forEach(btn => {
        btn.addEventListener('click', () => dismissChooser(btn.dataset.theme));
      });
    }
  }

  // Toggle button in nav
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ─── CURSOR GLOW ───────────────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    let mouseX = -500, mouseY = -500;
    let glowX  = -500, glowY  = -500;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });

    function animateGlow() {
      // Smooth lerp follow
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(${glowX - 200}px, ${glowY - 200}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ─── NAVBAR SCROLL ─────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ─── HAMBURGER MENU ────────────────────────────────────────────
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // ─── MAGNETIC BUTTONS ──────────────────────────────────────────
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.25;
      const dy     = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      setTimeout(() => btn.style.transition = '', 400);
    });
  });

  // ─── 3D CARD TILT ──────────────────────────────────────────────
  document.querySelectorAll('.eco-card, .cert-card, .testimonial-card, .audience-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const rotX  = ((e.clientY - cy) / rect.height) * -10;
      const rotY  = ((e.clientX - cx) / rect.width)  *  10;
      card.style.transform   = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px)`;
      card.style.transition  = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1)';
    });
  });

  // ─── HORIZONTAL SCROLL (ECOSYSTEM) ─────────────────────────────
  const ecoTrack = document.getElementById('ecoTrack');
  if (ecoTrack) {
    let isDown = false, startX, scrollLeft;

    ecoTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      ecoTrack.classList.add('grabbing');
      startX     = e.pageX - ecoTrack.offsetLeft;
      scrollLeft = ecoTrack.scrollLeft;
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      ecoTrack.classList.remove('grabbing');
    });

    ecoTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - ecoTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      ecoTrack.scrollLeft = scrollLeft - walk;
    });

    // Scroll progress bar
    const progressBar = document.querySelector('.eco-scroll-progress-bar');
    if (progressBar) {
      ecoTrack.addEventListener('scroll', () => {
        const max     = ecoTrack.scrollWidth - ecoTrack.clientWidth;
        const pct     = (ecoTrack.scrollLeft / max) * 100;
        progressBar.style.width = pct + '%';
      });
    }
  }

  // ─── TYPEWRITER (HERO SUB) ──────────────────────────────────────
  const heroSub = document.getElementById('heroSub');
  if (heroSub) {
    const originalText = heroSub.textContent;
    heroSub.textContent = '';
    heroSub.style.visibility = 'visible';
    let charIndex = 0;
    const TYPE_SPEED = 28; // ms per char

    function typeNextChar() {
      if (charIndex < originalText.length) {
        heroSub.textContent += originalText[charIndex];
        charIndex++;
        setTimeout(typeNextChar, TYPE_SPEED);
      }
    }

    // Delay so hero loads first
    setTimeout(typeNextChar, 800);
  }

  // ─── COUNTER ANIMATION ─────────────────────────────────────────
  function animateCounter(el, target, duration = 2200) {
    const startTime = performance.now();
    const isLarge   = target >= 10000;

    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      if (isLarge) {
        el.textContent = current >= 1000
          ? Math.round(current / 1000) + 'K'
          : current.toString();
        if (progress >= 1) el.textContent = Math.round(target / 1000) + 'K';
      } else {
        el.textContent = current;
      }

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    let counted = false;
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-num').forEach(el => {
          animateCounter(el, parseInt(el.dataset.target), 2200);
        });
      }
    }, { threshold: 0.3 }).observe(statsSection);
  }

  // ─── AI CHAT SIMULATION ────────────────────────────────────────
  const chatMessages = document.getElementById('chatMessages');
  const chatInput    = document.getElementById('chatInput');

  if (chatMessages) {
    const conversation = [
      { type: 'user', text: 'What is phishing?' },
      { type: 'ai',   text: 'Phishing is when someone poses as a trusted source — a bank, school, or government body — to trick you into sharing passwords or personal details. Always verify the sender\'s email before clicking any link.' },
      { type: 'user', text: 'How do I spot a deepfake?' },
      { type: 'ai',   text: 'Look for unnatural blinking, mismatched lip movements, or blurry edges around the face. If a video feels wrong — trust that instinct. You can verify suspicious videos using tools like InVID or Google\'s reverse image search.' },
      { type: 'user', text: 'Is public WiFi safe?' },
      { type: 'ai',   text: 'Public WiFi is risky. Attackers on the same network can intercept your data. Avoid banking or sharing passwords on public networks. A VPN encrypts your traffic and keeps you protected.' },
    ];

    let step = 0;

    function addTypingIndicator() {
      const el = document.createElement('div');
      el.className = 'typing-indicator';
      el.id = 'typingIndicator';
      el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
      const el = document.getElementById('typingIndicator');
      if (el) el.remove();
    }

    function addMessage(type, text) {
      const el = document.createElement('div');
      el.className = `chat-msg ${type}`;
      el.innerHTML = `<p>${text}</p>`;
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      requestAnimationFrame(() => {
        el.style.transition = 'all 0.35s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
      });
    }

    function runStep() {
      if (step >= conversation.length) {
        setTimeout(() => {
          chatMessages.innerHTML = '<div class="chat-msg ai"><p>Namaste! I\'m your Suraksha AI. Ask me anything about staying safe online.</p></div>';
          if (chatInput) chatInput.value = '';
          step = 0;
          setTimeout(runStep, 2000);
        }, 5000);
        return;
      }

      const current = conversation[step];

      if (current.type === 'user') {
        let i = 0;
        if (chatInput) chatInput.value = '';
        const interval = setInterval(() => {
          if (chatInput) chatInput.value += current.text[i];
          i++;
          if (i >= current.text.length) {
            clearInterval(interval);
            setTimeout(() => {
              addMessage('user', current.text);
              if (chatInput) chatInput.value = '';
              step++;
              setTimeout(runStep, 600);
            }, 400);
          }
        }, 48);
      } else {
        addTypingIndicator();
        const delay = 900 + current.text.length * 8;
        setTimeout(() => {
          removeTypingIndicator();
          addMessage('ai', current.text);
          step++;
          setTimeout(runStep, 2800);
        }, delay);
      }
    }

    const platformTeaser = document.querySelector('.platform-teaser');
    if (platformTeaser) {
      let started = false;
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          setTimeout(runStep, 1500);
        }
      }, { threshold: 0.4 }).observe(platformTeaser);
    }
  }

  // ─── ACTIVITY FEED ANIMATION ────────────────────────────────────
  const activityFeed = document.getElementById('activityFeed');
  if (activityFeed) {
    const activities = [
      '<strong>Meera Iyer</strong> from Bangalore earned her Surakshak badge',
      '<strong>Rahul Verma</strong> from Lucknow ran a workshop for 150 students',
      '<strong>Sneha Pillai</strong> from Trivandrum won the state Olympiad',
      '<strong>Aditya Kumar</strong> from Patna became a Surakshak Captain',
      '<strong>Divya Sharma</strong> from Jaipur mentored 20 new Surakshaks',
      '<strong>Rohan Mehta</strong> from Surat completed the full learning programme',
      '<strong>Pooja Nair</strong> from Kochi spoke at the national conclave',
      '<strong>Vijay Rao</strong> from Chennai created a viral awareness reel',
    ];

    const times = ['just now', '1 min ago', '3 min ago', '7 min ago', '11 min ago', '19 min ago', '24 min ago', '38 min ago'];

    let feedStarted = false;
    const feedSection = activityFeed.closest('section');

    if (feedSection) {
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !feedStarted) {
          feedStarted = true;
          setInterval(() => {
            const items    = activityFeed.querySelectorAll('.feed-item');
            const newItem  = document.createElement('div');
            newItem.className = 'feed-item';
            newItem.innerHTML = `
              <span class="feed-dot"></span>
              <span>${activities[Math.floor(Math.random() * activities.length)]}</span>
              <span class="feed-time">just now</span>
            `;
            newItem.style.opacity = '0';

            // Age existing times
            items.forEach((item, i) => {
              const timeEl = item.querySelector('.feed-time');
              if (timeEl && times[i + 1]) timeEl.textContent = times[i + 1];
            });

            activityFeed.insertBefore(newItem, activityFeed.firstChild);
            requestAnimationFrame(() => {
              newItem.style.transition = 'opacity 0.5s ease';
              newItem.style.opacity    = '1';
            });

            // Limit to 6 items
            const all = activityFeed.querySelectorAll('.feed-item');
            if (all.length > 6) all[all.length - 1].remove();
          }, 4000);
        }
      }, { threshold: 0.3 }).observe(feedSection);
    }
  }

  // ─── COUNTDOWN TIMER (Olympiad page) ────────────────────────────
  const countdownEl = document.getElementById('olympiadCountdown');
  if (countdownEl) {
    const targetDate = new Date('2025-08-15T00:00:00');
    function updateCountdown() {
      const now  = new Date();
      const diff = targetDate - now;
      if (diff <= 0) { countdownEl.innerHTML = '<span style="color:var(--accent-saffron);font-family:Space Grotesk,sans-serif;font-size:24px">Registration Closed</span>'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = n => String(n).padStart(2, '0');
      countdownEl.innerHTML = `
        <div class="countdown-unit"><div class="countdown-num">${pad(d)}</div><div class="countdown-unit-label">Days</div></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><div class="countdown-num">${pad(h)}</div><div class="countdown-unit-label">Hours</div></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><div class="countdown-num">${pad(m)}</div><div class="countdown-unit-label">Mins</div></div>
        <div class="countdown-sep">:</div>
        <div class="countdown-unit"><div class="countdown-num">${pad(s)}</div><div class="countdown-unit-label">Secs</div></div>
      `;
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ─── TOPIC TABS (Platform page) ─────────────────────────────────
  document.querySelectorAll('.topic-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const group = tab.closest('[data-tab-group]') || document;
      group.querySelectorAll('.topic-tab').forEach(t => t.classList.remove('active'));
      group.querySelectorAll('.topic-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });
  // Init first tab
  const firstTopicTab = document.querySelector('.topic-tab');
  if (firstTopicTab && !document.querySelector('.topic-tab.active')) firstTopicTab.click();

  // ─── FILTER TABS (Resources page) ───────────────────────────────
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.resource-group').forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.filter);
      if (target) target.classList.add('active');
      else {
        // 'all' tab — show everything
        document.querySelectorAll('.resource-group').forEach(g => g.classList.add('active'));
      }
    });
  });
  const firstFilterTab = document.querySelector('.filter-tab');
  if (firstFilterTab) firstFilterTab.click();

  // ─── TIER SELECTOR (Partner page) ───────────────────────────────
  document.querySelectorAll('.tier-selector-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tier-selector-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tier-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tier);
      if (target) target.classList.add('active');
    });
  });
  const firstTierTab = document.querySelector('.tier-selector-tab');
  if (firstTierTab && !document.querySelector('.tier-selector-tab.active')) firstTierTab.click();

  // ─── TIMELINE ANIMATION (Schools page) ──────────────────────────
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    timelineItems.forEach(item => tlObserver.observe(item));
  }

  // ─── SCROLL REVEAL ──────────────────────────────────────────────
  const revealTargets = document.querySelectorAll(
    '.cert-card, .testimonial-card, .step, .partner-item, .threat-item, .reveal-card, .timeline-card, .tier-card, .track-card, .resource-card, .role-card, .prize-tier, .partner-type-card, .topic-item'
  );

  if (revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => {
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            el.classList.add('revealed');
          }, (i % 4) * 80);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach(el => {
      if (!el.classList.contains('reveal-card')) {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      }
      revealObserver.observe(el);
    });
  }

});
