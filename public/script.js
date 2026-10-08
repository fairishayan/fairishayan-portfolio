/* ═══════════════════════════════════════════════════════════════════
   FAIRISH AYAN — PERSONAL PORTFOLIO INTERACTIONS
   Vanilla JavaScript · High Performance · Accessible · Artwork-Driven
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  // ═══════════════════════════════════════════════════════════════════
  // 1. CUSTOM CURSOR
  // ═══════════════════════════════════════════════════════════════════

  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (!isTouchDevice && !prefersReducedMotion && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Expand cursor over interactive elements
    const interactives = document.querySelectorAll('a, button, [role="tab"], .project-case-study, .skill-bubble');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.7)';
        cursorRing.style.backgroundColor = 'rgba(0, 229, 255, 0.06)';
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'rgba(0, 229, 255, 0.4)';
        cursorRing.style.backgroundColor = 'transparent';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 2. STICKY NAVIGATION & ACTIVE SECTION HIGHLIGHTING
  // ═══════════════════════════════════════════════════════════════════

  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  function updateNavScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
    });
  }

  // Active section indicator via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkItems.forEach(link => {
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
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // Smooth scroll offset handler
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 3. HERO ARTWORK 3D PERSPECTIVE & PARALLAX DEPTH
  // ═══════════════════════════════════════════════════════════════════

  const artworkShowcase = document.getElementById('artworkShowcase');
  if (artworkShowcase && !prefersReducedMotion && !isTouchDevice) {
    const artworkFrame = artworkShowcase.querySelector('.artwork-frame');
    const layerBack = artworkShowcase.querySelector('.layer-back');
    const layerMid = artworkShowcase.querySelector('.layer-mid');
    const floatDiscs = artworkShowcase.querySelectorAll('.float-disc');
    const glare = artworkShowcase.querySelector('.artwork-glare');

    artworkShowcase.addEventListener('mousemove', (e) => {
      const rect = artworkShowcase.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle 3D tilt
      artworkFrame.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
      layerBack.style.transform = `rotate(-2deg) translate(${x * -16}px, ${y * -16}px)`;
      layerMid.style.transform = `rotate(1.5deg) translate(${x * -8}px, ${y * -8}px)`;

      // Parallax on floating decorative discs
      floatDiscs.forEach(disc => {
        const depth = parseFloat(disc.getAttribute('data-depth')) || 0.05;
        const dx = x * rect.width * depth;
        const dy = y * rect.height * depth;
        disc.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      // Glare lighting shift
      if (glare) {
        const glareX = (x + 0.5) * 100;
        const glareY = (y + 0.5) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.4) 0%, transparent 60%)`;
      }
    });

    artworkShowcase.addEventListener('mouseleave', () => {
      artworkFrame.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
      layerBack.style.transform = 'rotate(-2deg) translate(0, 0)';
      layerMid.style.transform = 'rotate(1.5deg) translate(0, 0)';
      floatDiscs.forEach(disc => {
        disc.style.transform = 'translate(0, 0)';
      });
      if (glare) {
        glare.style.background = 'linear-gradient(120deg, rgba(255, 255, 255, 0.3) 0%, transparent 60%)';
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 4. ABOUT SECTION: MY JOURNEY INTERACTIVE PATH
  // ═══════════════════════════════════════════════════════════════════

  const journeySteps = document.querySelectorAll('.journey-step');
  const journeyBadge = document.getElementById('journeyBadge');
  const journeyHeading = document.getElementById('journeyHeading');
  const journeyDesc = document.getElementById('journeyDesc');
  const journeyTakeaway = document.getElementById('journeyTakeaway');

  const journeyData = {
    1: {
      badge: 'Stage 01 · Foundations',
      heading: 'Early Immersion in Software Development',
      desc: 'Began with a software-first curiosity—mastering core languages (Python, Java, JavaScript, PHP) and database systems. Focus was on building clean features, understanding syntax, and learning software lifecycles.',
      takeaway: 'Software is the delivery mechanism; the real challenge lies in mathematical formulation and algorithmic problem modeling.'
    },
    2: {
      badge: 'Stage 02 · Full-Stack Systems',
      heading: 'Architecting End-to-End Applications',
      desc: 'Engineered complete software solutions during BCA studies at Integral University. Built multi-tier web applications using the MERN stack, designing normalized database schemas, asynchronous RESTful APIs, and responsive user flows.',
      takeaway: 'A system is only as effective as the real-world behavioral friction it resolves for its users.'
    },
    3: {
      badge: 'Stage 03 · Problem Discovery',
      heading: 'Uncovering Real-World Structural Frictions',
      desc: 'Shifted focus towards societal challenges: rural single-teacher school crises in India (Smart India Hackathon) and passive student disengagement in digital classrooms. Formulated real-world constraints into formal mathematical models.',
      takeaway: 'Heuristics and standard rule sets fail when faced with high combinatorial complexity; discrete optimization is essential.'
    },
    4: {
      badge: 'Stage 04 · Research Orientation',
      heading: 'Graduate Study in AI & Algorithmic Formulation',
      desc: 'Enrolled in M.Sc. Computer Science (Artificial Intelligence) at Sacred Heart College. Actively conducting research on constraint optimization solvers (Google OR-Tools CP-SAT), behavioral verification protocols, and embodied intelligence.',
      takeaway: 'Dedicated to principled research methodology, rigorous experimentation, and pursuing impactful research internships.'
    }
  };

  journeySteps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = step.getAttribute('data-step');
      const data = journeyData[stepNum];
      if (!data) return;

      journeySteps.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-selected', 'false');
      });
      step.classList.add('active');
      step.setAttribute('aria-selected', 'true');

      // Update panel with smooth transition
      const panel = document.getElementById('journey-panel');
      if (panel) {
        panel.style.opacity = '0.5';
        panel.style.transform = 'translateY(4px)';
        setTimeout(() => {
          journeyBadge.textContent = data.badge;
          journeyHeading.textContent = data.heading;
          journeyDesc.textContent = data.desc;
          journeyTakeaway.querySelector('.takeaway-text').textContent = data.takeaway;
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 5. ABOUT SECTION: CONNECTED RESEARCH INTEREST CONSTELLATION
  // ═══════════════════════════════════════════════════════════════════

  const interestNodes = document.querySelectorAll('.interest-node');
  const interestBadge = document.getElementById('interestBadge');
  const interestIcon = document.getElementById('interestIcon');
  const interestTitle = document.getElementById('interestTitle');
  const interestDesc = document.getElementById('interestDesc');
  const interestConn = document.getElementById('interestConn');

  const interestsData = {
    embodied: {
      badge: 'Current M.Sc. Inquiry',
      icon: '🤖',
      title: 'Embodied General Intelligence',
      desc: 'Investigating how AI models transcend pure text and screen domains to perceive, reason, and act inside physical dynamic environments. Interested in sensory integration, continuous state spaces, and spatial problem-solving.',
      conn: 'Informs foundational coursework in AI and Knowledge Representation at Sacred Heart College, exploring transition from symbolic reasoning to physical robotic agency.'
    },
    hai: {
      badge: 'Core Research Axis',
      icon: '🤝',
      title: 'Human-AI Interaction',
      desc: 'Designing adaptive collaborative interfaces where intelligent systems cooperate symbiotically with human users. Investigating mutual transparency, intent alignment, and cognitive load reduction in complex decision spaces.',
      conn: 'Directly applied in the Behavioral ELMS project through adaptive NLP conversational interventions and verified learning loops.'
    },
    ethics: {
      badge: 'System Responsibility',
      icon: '⚖️',
      title: 'AI Ethics & Governance',
      desc: 'Exploring foundational principles for safe, fair, and accountable AI deployment. Focusing on algorithmic transparency, mitigating demographic bias, and ensuring privacy preservation in sensitive domains.',
      conn: 'Embedded in the rural school scheduling framework to ensure equitable teacher time distribution and non-discriminatory multi-grade allocations.'
    },
    constraint: {
      badge: 'Mathematical Modeling',
      icon: '🧩',
      title: 'Constraint Optimization',
      desc: 'Formulating complex real-world scheduling, allocation, and routing challenges as discrete mathematical constraint satisfaction problems (CSP) and integer programming models.',
      conn: 'Formed the mathematical core of the Smart Classroom and Timetable Scheduler (SIH) using Google OR-Tools CP-SAT solver.'
    },
    nlp: {
      badge: 'Practical Machine Learning',
      icon: '💬',
      title: 'Applied Natural Language Processing',
      desc: 'Developing contextual language models, intent parsers, and semantic similarity engines designed to understand user queries and generate constructive pedagogical dialogues.',
      conn: 'Powering the chatbot resolution module in Behavioral ELMS, validating student explanations against reference concept graphs.'
    },
    agents: {
      badge: 'Autonomous Systems',
      icon: '🌐',
      title: 'Intelligent Agents',
      desc: 'Studying multi-agent architectures that perceive environment states, formulate multi-step plans, resolve scheduling conflicts, and adaptively execute goals under uncertainty.',
      conn: 'Central to current self-directed studies on autonomous coordination algorithms and distributed scheduling solvers.'
    }
  };

  interestNodes.forEach(node => {
    function activateInterest() {
      const key = node.getAttribute('data-interest');
      const data = interestsData[key];
      if (!data) return;

      interestNodes.forEach(n => {
        n.classList.remove('active');
        n.setAttribute('aria-selected', 'false');
      });
      node.classList.add('active');
      node.setAttribute('aria-selected', 'true');

      interestBadge.textContent = data.badge;
      interestIcon.textContent = data.icon;
      interestTitle.textContent = data.title;
      interestDesc.textContent = data.desc;
      interestConn.textContent = data.conn;
    }

    node.addEventListener('click', activateInterest);
    node.addEventListener('mouseenter', activateInterest);
  });

  // ═══════════════════════════════════════════════════════════════════
  // 6. RESEARCH & PROJECTS: ACCESSIBLE CASE STUDY MODALS
  // ═══════════════════════════════════════════════════════════════════

  const expandButtons = document.querySelectorAll('.btn-expand');
  let activeTriggerButton = null;

  expandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dialogId = btn.getAttribute('data-dialog');
      const dialog = document.getElementById(dialogId);
      if (dialog) {
        activeTriggerButton = btn;
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
        document.body.style.overflow = 'hidden';

        // Focus first actionable element inside modal
        const closeBtn = dialog.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
      }
    });
  });

  const modals = document.querySelectorAll('.case-modal');
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    function closeModal() {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
      document.body.style.overflow = '';
      if (activeTriggerButton) {
        activeTriggerButton.focus();
        activeTriggerButton = null;
      }
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 7. SKILLS ECOSYSTEM: FILTERING & COMPLEMENTARY HIGHLIGHTING
  // ═══════════════════════════════════════════════════════════════════

  const filterButtons = document.querySelectorAll('.skill-filter-btn');
  const skillBubbles = document.querySelectorAll('.skill-bubble');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      skillBubbles.forEach(bubble => {
        const cat = bubble.getAttribute('data-cat');
        bubble.classList.remove('dimmed', 'highlighted');

        if (filter === 'all' || cat === filter) {
          bubble.style.display = 'inline-flex';
        } else {
          bubble.style.display = 'none';
        }
      });
    });
  });

  // Hover relationship highlighting
  skillBubbles.forEach(bubble => {
    bubble.addEventListener('mouseenter', () => {
      const related = (bubble.getAttribute('data-related') || '').split(',');
      const currentCat = bubble.getAttribute('data-cat');

      skillBubbles.forEach(other => {
        if (other === bubble) {
          other.classList.add('highlighted');
          other.classList.remove('dimmed');
          return;
        }

        const otherCat = other.getAttribute('data-cat');
        if (related.includes(otherCat) || otherCat === currentCat) {
          other.classList.add('highlighted');
          other.classList.remove('dimmed');
        } else {
          other.classList.add('dimmed');
          other.classList.remove('highlighted');
        }
      });
    });

    bubble.addEventListener('mouseleave', () => {
      skillBubbles.forEach(other => {
        other.classList.remove('dimmed', 'highlighted');
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════
  // 8. CONTACT: COPY EMAIL HELPER
  // ═══════════════════════════════════════════════════════════════════

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'fairishayan@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const copyText = copyEmailBtn.querySelector('.copy-text');
        const origText = copyText.textContent;
        copyText.textContent = 'Copied!';
        copyEmailBtn.style.background = 'var(--cyan-bright)';
        copyEmailBtn.style.color = 'var(--blue-navy)';

        setTimeout(() => {
          copyText.textContent = origText;
          copyEmailBtn.style.background = '';
          copyEmailBtn.style.color = '';
        }, 2000);
      }).catch(() => {
        // Fallback: select text or prompt
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // 9. SCROLL REVEAL (GUARANTEED VISIBILITY WITH PROGRESSIVE ENHANCEMENT)
  // ═══════════════════════════════════════════════════════════════════

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

})();

/* ═══════════════════════════════════════════
   3D Tilt Effect
   ═══════════════════════════════════════════ */
