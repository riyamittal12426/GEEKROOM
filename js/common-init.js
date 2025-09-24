// Common initialization for all pages
window.initializeCommonFeatures = function() {
    // Mobile Navigation Toggle
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');
    
    if (hamburger && navMenu) {
        // Remove existing listeners to prevent duplicates
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.getElementById('nav-hamburger');
        
        newHamburger.addEventListener('click', function() {
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Navbar scroll effect
    let ticking = false;
    
    function updateNavbar() {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    // Remove existing scroll listeners
    window.removeEventListener('scroll', requestTick);
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Initialize animations for elements
    initializeAnimations();
    
    // Initialize splash cursor if available
    if (window.initSplashCursor) {
        window.initSplashCursor();
    }
    
    // Initialize smooth scroll if available
    if (window.initSmoothScroll) {
        window.initSmoothScroll();
    }
    
    console.log('✅ Common features initialized');
};

function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes to elements
    addAnimationClasses();
}

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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', window.initializeCommonFeatures);