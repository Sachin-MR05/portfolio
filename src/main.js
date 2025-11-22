import './styles/variables.css';
import './styles/global.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/skills.css';
import './styles/sections.css';

// Simple interaction for mobile menu or smooth scroll if needed
console.log('Portfolio loaded');

// Enhanced Header Scroll Animation
const header = document.getElementById('main-header');
let lastScrollY = window.scrollY;
let ticking = false;

const updateHeader = () => {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (scrollY > lastScrollY && scrollY > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = scrollY;
    ticking = false;
};

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('.header a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Logo animation on page load
const logoLink = document.querySelector('.logo-link');
if (logoLink) {
    setTimeout(() => {
        logoLink.style.opacity = '0';
        logoLink.style.transform = 'scale(0.8)';
        
        requestAnimationFrame(() => {
            logoLink.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            logoLink.style.opacity = '1';
            logoLink.style.transform = 'scale(1)';
        });
    }, 100);
}

// Enhanced Skill Cards Interaction
const skillCards = document.querySelectorAll('.skill-card');

// Add magnetic effect on hover
skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `translateY(-12px) scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Scroll-triggered animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

skillCards.forEach(card => {
    observer.observe(card);
});

// Animated Counter for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 4 ? '+' : target === 15 ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 4 ? '+' : target === 15 ? '+' : '');
        }
    }, 16);
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const targetValue = entry.target.dataset.count;
            
            if (statNumber && targetValue && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                
                if (targetValue.includes('+')) {
                    animateCounter(statNumber, parseInt(targetValue));
                } else {
                    statNumber.textContent = targetValue;
                }
            }
        }
    });
}, { threshold: 0.5 });

const statItems = document.querySelectorAll('.stat-item');
statItems.forEach(item => {
    statsObserver.observe(item);
});

// Projects Carousel Functionality
class ProjectCarousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.project-card');
        this.prevBtn = document.querySelector('.carousel-btn.prev');
        this.nextBtn = document.querySelector('.carousel-btn.next');
        this.dotsContainer = document.querySelector('.carousel-dots');
        
        if (!this.track || !this.cards.length) return;
        
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
        
        this.init();
    }
    
    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }
    
    init() {
        this.createDots();
        this.updateCarousel();
        this.attachEvents();
        
        // Auto-play
        this.startAutoPlay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        const dotsCount = this.cards.length - this.cardsPerView + 1;
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }
    
    updateCarousel(animate = true) {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 40;
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        if (!animate) {
            this.track.style.transition = 'none';
        }
        this.track.style.transform = `translateX(${offset}px)`;
        
        if (!animate) {
            setTimeout(() => {
                this.track.style.transition = '';
            }, 50);
        }
        
        // Update dots
        const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update button states
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            this.prevBtn.disabled = this.currentIndex === 0;
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
            this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        }
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateCarousel();
        } else {
            this.currentIndex = 0;
            this.updateCarousel();
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
        }
    }
    
    attachEvents() {
        this.prevBtn?.addEventListener('click', () => {
            this.prev();
            this.resetAutoPlay();
        });
        
        this.nextBtn?.addEventListener('click', () => {
            this.next();
            this.resetAutoPlay();
        });
        
        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.resetAutoPlay();
        });
        
        // Mouse drag support
        let mouseStartX = 0;
        let mouseCurrentX = 0;
        let isMouseDragging = false;
        let dragStartPos = 0;
        
        this.track.addEventListener('mousedown', (e) => {
            isMouseDragging = true;
            mouseStartX = e.clientX;
            dragStartPos = this.track.offsetLeft;
            this.track.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        this.track.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            mouseCurrentX = e.clientX;
            const diff = mouseCurrentX - mouseStartX;
            this.track.style.transition = 'none';
        });
        
        this.track.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            this.track.style.cursor = 'grab';
            this.track.style.transition = '';
            
            const diff = mouseStartX - mouseCurrentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            this.resetAutoPlay();
        });
        
        this.track.addEventListener('mouseleave', () => {
            if (isMouseDragging) {
                isMouseDragging = false;
                this.track.style.cursor = 'grab';
                this.track.style.transition = '';
                this.updateCarousel();
            }
        });
        
        // Set initial cursor
        this.track.style.cursor = 'grab';
        
        // Resize handler
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
                    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                    
                    // Recreate dots
                    if (this.dotsContainer) {
                        this.dotsContainer.innerHTML = '';
                        this.createDots();
                    }
                }
                this.updateCarousel(false);
            }, 250);
        });
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}

// Initialize carousel when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProjectCarousel();
        initOrbitalNexus();
    });
} else {
    new ProjectCarousel();
    initOrbitalNexus();
}

// ===== ORBITAL NEXUS - Interactive Skill Visualization =====
function initOrbitalNexus() {
    const orbitalNexus = document.querySelector('.orbital-nexus');
    if (!orbitalNexus) return;
    
    positionSkillCapsules();
    init3DTilt();
    initMagneticCursor();
    initMagneticPull();
    initRingPause();
    initParticleTrail();
}

// Position skill capsules on circular orbit
function positionSkillCapsules() {
    const capsules = document.querySelectorAll('.skill-capsule');
    const radius = 200; // Orbital radius (equal distance from center)
    const totalCapsules = capsules.length;
    const angleStep = 360 / totalCapsules; // Equal spacing between capsules
    
    capsules.forEach((capsule, index) => {
        const skillName = capsule.dataset.skill;
        
        // Custom positions for specific skills
        if (skillName === 'Model Training') {
            capsule.style.left = 'calc(20% + 1.22465e-14px)';
            capsule.style.top = 'calc(50% + 200px)';
            capsule.style.transform = 'translate(-50%, -50%)';
        } else if (skillName === 'Data Analysis') {
            capsule.style.left = 'calc(30% - 156.366px)';
            capsule.style.top = 'calc(50% + 124.698px)';
            capsule.style.transform = 'translate(-50%, -50%)';
        } else if (skillName === 'MERN Stack') {
            capsule.style.left = 'calc(25% - 194.986px)';
            capsule.style.top = 'calc(50% - 44.5042px)';
            capsule.style.transform = 'translate(-50%, -50%)';
        } else if (skillName === 'Open-Source') {
            capsule.style.left = 'calc(10% - 86.7767px)';
            capsule.style.top = 'calc(45% - 180.194px)';
            capsule.style.transform = 'translate(-50%, -50%)';
        } else {
            // Calculate equal angles starting from 90° (top) and going clockwise
            const angle = 90 + (index * angleStep);
            const radian = (angle * Math.PI) / 180;
            
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;
            
            capsule.style.left = `calc(50% + ${x}px)`;
            capsule.style.top = `calc(50% + ${y}px)`;
            capsule.style.transform = 'translate(-50%, -50%)';
        }
    });
}

// 3D tilt effect based on mouse position
function init3DTilt() {
    const tiltContainer = document.querySelector('.tilt-container');
    const orbitalNexus = document.querySelector('.orbital-nexus');
    if (!tiltContainer || !orbitalNexus) return;
    
    orbitalNexus.addEventListener('mousemove', (e) => {
        const rect = orbitalNexus.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const rotateX = ((mouseY - centerY) / centerY) * 10;
        const rotateY = ((mouseX - centerX) / centerX) * 10;
        
        tiltContainer.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    orbitalNexus.addEventListener('mouseleave', () => {
        tiltContainer.style.transform = 'translate(-50%, -50%) perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Custom magnetic cursor
function initMagneticCursor() {
    const cursor = document.querySelector('.magnetic-cursor');
    const orbitalNexus = document.querySelector('.orbital-nexus');
    if (!cursor || !orbitalNexus) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    orbitalNexus.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    orbitalNexus.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });
    
    orbitalNexus.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor follow
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Expand cursor on hover over capsules
    const capsules = document.querySelectorAll('.skill-capsule');
    capsules.forEach(capsule => {
        capsule.addEventListener('mouseenter', () => {
            cursor.classList.add('expanded');
        });
        capsule.addEventListener('mouseleave', () => {
            cursor.classList.remove('expanded');
        });
    });
}

// Magnetic pull effect on capsules
function initMagneticPull() {
    const capsules = document.querySelectorAll('.skill-capsule');
    const orbitalNexus = document.querySelector('.orbital-nexus');
    if (!capsules.length || !orbitalNexus) return;
    
    orbitalNexus.addEventListener('mousemove', (e) => {
        const rect = orbitalNexus.getBoundingClientRect();
        
        capsules.forEach(capsule => {
            const capsuleRect = capsule.getBoundingClientRect();
            const capsuleCenterX = capsuleRect.left + capsuleRect.width / 2;
            const capsuleCenterY = capsuleRect.top + capsuleRect.height / 2;
            
            const distance = Math.hypot(
                e.clientX - capsuleCenterX,
                e.clientY - capsuleCenterY
            );
            
            const maxDistance = 150;
            const pullStrength = Math.max(0, (maxDistance - distance) / maxDistance);
            
            if (distance < maxDistance) {
                const angle = Math.atan2(
                    e.clientY - capsuleCenterY,
                    e.clientX - capsuleCenterX
                );
                
                const pullX = Math.cos(angle) * pullStrength * 20;
                const pullY = Math.sin(angle) * pullStrength * 20;
                
                const currentAngle = parseFloat(capsule.dataset.angle) || 0;
                const radian = (currentAngle * Math.PI) / 180;
                const radius = 200;
                const baseX = Math.cos(radian) * radius;
                const baseY = Math.sin(radian) * radius;
                
                capsule.style.transform = `translate(calc(-50% + ${pullX}px), calc(-50% + ${pullY}px))`;
            } else {
                capsule.style.transform = 'translate(-50%, -50%)';
            }
        });
    });
    
    orbitalNexus.addEventListener('mouseleave', () => {
        capsules.forEach(capsule => {
            capsule.style.transform = 'translate(-50%, -50%)';
        });
    });
}

// Pause orbital ring rotation on hover
function initRingPause() {
    const rings = document.querySelectorAll('.orbital-ring');
    const orbitalNexus = document.querySelector('.orbital-nexus');
    if (!rings.length || !orbitalNexus) return;
    
    orbitalNexus.addEventListener('mouseenter', () => {
        rings.forEach(ring => ring.classList.add('paused'));
    });
    
    orbitalNexus.addEventListener('mouseleave', () => {
        rings.forEach(ring => ring.classList.remove('paused'));
    });
}

// Particle trail effect
function initParticleTrail() {
    const canvas = document.querySelector('.particle-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const particles = [];
    const maxParticles = 50;
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.01;
            this.color = Math.random() > 0.5 ? 'rgba(26, 26, 26,' : 'rgba(102, 102, 102,';
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            this.size *= 0.98;
        }
        
        draw() {
            ctx.fillStyle = this.color + this.life + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color + '0.5)';
        }
    }
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        for (let i = 0; i < 3; i++) {
            if (particles.length < maxParticles) {
                particles.push(new Particle(x, y));
            }
        }
    });
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0 || particles[i].size <= 0.5) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    animate();
    
    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });
}
