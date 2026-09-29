/* ========================================
   VYUHA — AI & ML ASSOCIATION
   GSAP Animations + Interactivity
   ======================================== */

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
        initHeroAnimations();
    }, 1500);
});

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ===== HERO CANVAS — CIRCUIT PARTICLE NETWORK =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulsePhase += this.pulseSpeed;
        this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.pulsePhase));

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${this.currentOpacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function drawConnections() {
    const maxDist = 150;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
                const opacity = (1 - dist / maxDist) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Sticky nav
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ===== GSAP HERO ANIMATION =====
function initHeroAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.hero-logo', {
            scale: 0.3,
            opacity: 0,
            duration: 1.4,
            ease: 'elastic.out(1, 0.5)'
        })
        .from('.hero-ring-1', {
            scale: 0,
            opacity: 0,
            duration: 0.8
        }, '-=0.8')
        .from('.hero-ring-2', {
            scale: 0,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.hero-ring-3', {
            scale: 0,
            opacity: 0,
            duration: 0.8
        }, '-=0.6')
        .from('.hero-title-main', {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power4.out'
        }, '-=0.4')
        .from('.hero-title-sub', {
            y: 30,
            opacity: 0,
            duration: 0.8,
        }, '-=0.5')
        .from('.hero-tagline', {
            y: 20,
            opacity: 0,
            duration: 0.8,
        }, '-=0.4')
        .from('.hero-est', {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
        }, '-=0.3')
        .from('.scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.6,
        }, '-=0.2');

    // ===== HERO PARALLAX ON SCROLL =====
    gsap.to('.hero-content', {
        y: -100,
        opacity: 0,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    gsap.to('#heroCanvas', {
        y: 50,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // ===== SECTION HEADINGS REVEAL =====
    gsap.utils.toArray('.reveal-text').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== STAGGERED REVEAL UP =====
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const revealEls = section.querySelectorAll('.reveal-up');
        if (revealEls.length) {
            gsap.to(revealEls, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });
        }
    });

    // ===== SECTION LABELS =====
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.from(label, {
            x: -20,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: label,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== TIMELINE LINE GROW =====
    const timelineLine = document.querySelector('.timeline-line');
    if (timelineLine) {
        gsap.from(timelineLine, {
            scaleY: 0,
            transformOrigin: 'top',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });
    }

    // ===== TIMELINE DOTS PULSE =====
    gsap.utils.toArray('.timeline-dot').forEach((dot, i) => {
        gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            delay: i * 0.2,
            ease: 'back.out(2)',
            scrollTrigger: {
                trigger: dot,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== CIRCUIT DECORATION =====
    const circuitSvg = document.querySelector('.circuit-svg');
    if (circuitSvg) {
        gsap.from(circuitSvg, {
            scale: 0.5,
            opacity: 0,
            rotation: -90,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: circuitSvg,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    }

    // ===== VISION 3D CAROUSEL SCROLL =====
    const visionOrbit = document.getElementById('visionOrbit');
    if (visionOrbit) {
        // Initial setup for cards to enter beautifully
        gsap.from('.vision-orbit-card', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#vision',
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        // The pinned scroll rotation
        gsap.to(visionOrbit, {
            rotateY: -270,
            ease: 'none',
            scrollTrigger: {
                trigger: '#vision',
                start: 'center center',
                end: '+=200%', // 200% scroll distance for the 270 deg rotation
                scrub: 1,
                pin: true,
                anticipatePin: 1
            }
        });
    }

    // ===== EXPLORE CARDS STAGGER =====
    gsap.utils.toArray('.explore-card').forEach((card, i) => {
        gsap.from(card, {
            y: 50,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== ACTIVITY ITEMS SLIDE IN =====
    gsap.utils.toArray('.activity-item').forEach((item, i) => {
        gsap.from(item, {
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== EVENT CARDS SLIDE =====
    gsap.utils.toArray('.event-card').forEach((card, i) => {
        gsap.from(card, {
            x: -40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== PROJECT PLACEHOLDER FLOAT =====
    const projectPlaceholder = document.querySelector('.project-placeholder');
    if (projectPlaceholder) {
        gsap.to(projectPlaceholder, {
            y: -10,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    // ===== RESOURCE CARDS =====
    gsap.utils.toArray('.resource-card').forEach((card, i) => {
        gsap.from(card, {
            y: 40,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none'
            }
        });
    });

    // ===== JOIN SECTION BIG ENTRANCE =====
    const joinSection = document.querySelector('.section-join');
    if (joinSection) {
        gsap.from('.join-form-wrap', {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: joinSection,
                start: 'top 70%',
                toggleActions: 'play none none none'
            }
        });
    }

    // ===== FOOTER FADE IN =====
    gsap.from('#footer', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '#footer',
            start: 'top 90%',
            toggleActions: 'play none none none'
        }
    });

    // ===== MEMBER CARDS — MAGNETIC HOVER =====
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -3;
            const rotateY = ((x - centerX) / centerX) * 3;
            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== JOIN FORM =====
function handleJoinSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('joinBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>WELCOME TO VYUHA ✦</span>';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--bg)';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
        e.target.reset();
    }, 3000);
}

// ===== ACTIVE NAV LINK HIGHLIGHT =====
const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sectionElements = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    sectionElements.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').replace('#', '');
        // Map section IDs to nav hrefs
        const mapping = {
            'beginning': 'beginning',
            'vision': 'beginning',
            'people': 'people',
            'explore': 'explore',
            'activities': 'explore',
            'events': 'events',
            'projects': 'projects',
            'resources': 'resources',
            'roadahead': 'resources',
            'join': 'join'
        };
        if (mapping[current] === href) {
            link.style.color = 'var(--gold)';
        } else {
            link.style.color = '';
        }
    });
});

// ===== RESIZE LISTENER FOR PARTICLES =====
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});
