/* =============================================
   WHITE HOUSE RESTAURANT - SCRIPT.JS
   3D Animations, Scroll Effects, Interactions
   ============================================= */

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-fade').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  }, 2000);
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth trail
function animateCursor() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
document.querySelectorAll('a, button, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    cursor.style.background = 'rgba(192,57,43,0.5)';
    cursorTrail.style.borderColor = 'rgba(192,57,43,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursor.style.background = '#c0392b';
    cursorTrail.style.borderColor = 'rgba(192,57,43,0.5)';
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

// ===== PARTICLE SYSTEM =====
const particlesContainer = document.getElementById('particles');
const PARTICLE_COUNT = 40;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 3 + 1;
  const left = Math.random() * 100;
  const duration = Math.random() * 8 + 6;
  const delay = Math.random() * 8;
  p.style.cssText = `
    left: ${left}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${Math.random() * 0.6 + 0.2};
  `;
  particlesContainer.appendChild(p);
}
for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ===== SCROLL REVEAL (INTERSECTION OBSERVER) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger cards in a grid
      if (entry.target.classList.contains('reveal-card')) {
        const siblings = entry.target.parentElement.querySelectorAll('.reveal-card');
        let idx = 0;
        siblings.forEach((sib, i) => { if (sib === entry.target) idx = i; });
        setTimeout(() => entry.target.classList.add('visible'), idx * 120);
      } else {
        entry.target.classList.add('visible');
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-card').forEach(el => {
  // Don't observe hero elements (handled separately)
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ===== 3D CARD TILT (Mouse Parallax on Service Cards) =====
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotX = -dy * 10;
    const rotY = dx * 10;
    card.style.transform = `translateY(-12px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== CONTACT MODAL =====
const modal = document.getElementById('contactModal');

const serviceData = {
  dining: {
    icon: '🍽️',
    title: 'Luxury Dining',
    desc: 'Book a table for our gourmet Nanglo sets, family dinners & special events!'
  },
  swimming: {
    icon: '🏊',
    title: 'Swimming Pool',
    desc: 'Reserve your poolside session — ideal for group outings & relaxation!'
  },
  dance: {
    icon: '🎶',
    title: 'Dance & Events',
    desc: 'Plan your private party, DJ night or live event at our banquet hall!'
  }
};

function showContact(type) {
  const data = serviceData[type] || serviceData.dining;
  document.getElementById('modalIcon').textContent = data.icon;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Ripple effect
  modal.querySelector('.modal-box').style.animation = 'none';
  void modal.querySelector('.modal-box').offsetWidth;
}

function closeContact() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContact();
});

// ===== SMOOTH PARALLAX ON HERO =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  const floatingCards = document.querySelectorAll('.floating-card');

  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
    heroContent.style.opacity = 1 - scrollY / 600;
  }

  // Parallax floating cards at different rates
  floatingCards.forEach((card, i) => {
    const rate = 0.1 + i * 0.08;
    card.style.transform = `translateY(${scrollY * rate}px)`;
  });
});

// ===== 3D SCROLL SECTION REVEAL WITH DEPTH =====
// Add depth transform to section headers as they scroll into view
function update3DDepth() {
  const sections = document.querySelectorAll('.services, .reviews, .contact-section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = 1 - (rect.top / vh);
    const clamped = Math.max(0, Math.min(1, progress));
    
    // Subtle 3D perspective shift as sections come in
    const rotX = (1 - clamped) * 6;
    const scale = 0.95 + clamped * 0.05;
    section.style.transform = `perspective(1200px) rotateX(${rotX}deg) scale(${scale})`;
    section.style.opacity = Math.min(1, 0.3 + clamped * 0.7);
  });
}

window.addEventListener('scroll', update3DDepth, { passive: true });
update3DDepth();

// ===== VENUE CARD 3D MOUSE TRACKING =====
const venueCard = document.querySelector('.venue-card-3d');
if (venueCard) {
  const parent = venueCard.parentElement;
  parent.addEventListener('mousemove', (e) => {
    const rect = parent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    venueCard.style.transform = `rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg)`;
  });
  parent.addEventListener('mouseleave', () => {
    venueCard.style.transform = 'rotateY(-8deg) rotateX(4deg)';
  });
}

// ===== HERO TITLE SPLIT ANIMATION =====
document.querySelectorAll('.title-line').forEach(line => {
  const text = line.textContent;
  line.innerHTML = text.split('').map(ch =>
    `<span style="display:inline-block;transition:transform 0.4s ease,color 0.3s ease">${ch === ' ' ? '&nbsp;' : ch}</span>`
  ).join('');
  
  line.querySelectorAll('span').forEach((ch, i) => {
    ch.addEventListener('mouseenter', () => {
      ch.style.transform = 'translateY(-8px) rotateY(20deg)';
      ch.style.color = '#e74c3c';
    });
    ch.addEventListener('mouseleave', () => {
      ch.style.transform = '';
      ch.style.color = '';
    });
  });
});

// ===== RIPPLE EFFECT ON BUTTONS =====
document.querySelectorAll('.btn-primary, .btn-outline, .card-btn, .modal-call-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      left:${e.clientX-rect.left-size/2}px;
      top:${e.clientY-rect.top-size/2}px;
      background:rgba(255,255,255,0.15);
      border-radius:50%;
      transform:scale(0);
      animation:rippleAnim 0.6s ease-out;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(3); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ===== NAV LINK ACTIVE STATE =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = '#e74c3c';
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

// ===== GLITCH EFFECT ON LOGO =====
const navLogo = document.querySelector('.nav-logo');
if (navLogo) {
  navLogo.addEventListener('mouseenter', () => {
    navLogo.style.animation = 'glitch 0.4s ease';
    setTimeout(() => navLogo.style.animation = '', 400);
  });
}

const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0% { transform: none; }
    20% { transform: skew(-2deg); color: #e74c3c; }
    40% { transform: skew(2deg) translateX(3px); }
    60% { transform: skew(-1deg); color: #fff; }
    80% { transform: translateX(-2px); }
    100% { transform: none; }
  }
`;
document.head.appendChild(glitchStyle);

console.log('%c🏨 WHITE HOUSE RESTAURANT', 'color:#e74c3c;font-size:2rem;font-weight:bold;font-family:serif');
console.log('%c📍 Khairahani, Chitwan | 📞 985-5087040', 'color:#fff;font-size:1rem');
