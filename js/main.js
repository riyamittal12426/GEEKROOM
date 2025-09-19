// Main JavaScript for GeekRoom Adgips
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Remove scroll-triggered show/hide for hero content
    // Instead, show elements on page load
    const geekroomDescription = document.querySelector('.geekroom-description');
    const adgipsText = document.querySelector('.adgips-text');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');

    if (geekroomDescription) geekroomDescription.classList.add('show');
    if (adgipsText) adgipsText.classList.add('show');
    if (heroSubtitle) heroSubtitle.classList.add('show');
    if (heroButtons) heroButtons.classList.add('show');

    // For fade-in/slide-in elements, only add 'visible' class once
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes to elements
    function addAnimationClasses() {
        // Section headers
        document.querySelectorAll('.section-header').forEach(header => {
            header.classList.add('fade-in');
        });
        
        // Feature cards
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.classList.add('fade-in');
            card.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // Stats
        document.querySelectorAll('.stat').forEach((stat, index) => {
            stat.classList.add('fade-in');
            stat.style.transitionDelay = `${index * 0.1}s`;
        });
        
        // About text
        const aboutText = document.querySelector('.about-text');
        if (aboutText) {
            aboutText.classList.add('fade-in');
        }
        
        // CTA content
        const ctaContent = document.querySelector('.cta-content');
        if (ctaContent) {
            ctaContent.classList.add('fade-in');
        }
    }
    
    // Initialize animations
    addAnimationClasses();
    
    // Button Hover Effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Hero CTA Button Click Event
    const heroCTA = document.getElementById('hero-cta');
    const joinCTA = document.getElementById('join-cta');
    
    function handleCTAClick(e) {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.height, rect.width);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Simulate navigation or show modal
        setTimeout(() => {
            alert('Welcome to GeekRoom Adgips! Feature coming soon...');
        }, 300);
    }
    
    if (heroCTA) heroCTA.addEventListener('click', handleCTAClick);
    if (joinCTA) joinCTA.addEventListener('click', handleCTAClick);
    
    // Typing Effect for Hero Title (optional)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
    
    // Counter Animation for Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 30);
        });
    }
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Parallax Effect for Hero Background Shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
    
    // Add loading class to body when page loads
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Keyboard Navigation Support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Feature Card Click Events
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle click animation
            this.style.transform = 'translateY(-10px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1)';
            }, 150);
        });
    });
    
    // Dynamic Background Animation
    function createFloatingElements() {
        const hero = document.querySelector('.hero');
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: var(--secondary-color);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            hero.appendChild(particle);
        }
    }
    
    // Initialize floating elements
    createFloatingElements();
    
    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Team Section Animation
    const teamSection = document.querySelector('.our-team-section');
    if (teamSection) {
        const teamObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset and restart letter animations
                    const letters = entry.target.querySelectorAll('.team-title .letter');
                    letters.forEach(letter => {
                        letter.style.animation = 'none';
                        letter.offsetHeight; // Trigger reflow
                        letter.style.animation = null;
                    });
                    
                    // Add entrance animation for buttons
                    const buttons = entry.target.querySelectorAll('.team-actions .btn');
                    buttons.forEach((btn, index) => {
                        btn.style.opacity = '0';
                        btn.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            btn.style.transition = 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)';
                            btn.style.opacity = '1';
                            btn.style.transform = 'translateY(0)';
                        }, 1000 + (index * 200));
                    });
                }
            });
        }, { threshold: 0.3 });

        teamObserver.observe(teamSection);
    }
    
    console.log('GeekRoom Adgips - Initialized successfully! 🚀');
});

// CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .floating-particle {
        pointer-events: none;
    }
`;
document.head.appendChild(style);
