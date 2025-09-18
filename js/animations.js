// GSAP Animations for GeekRoom Adgips
document.addEventListener('DOMContentLoaded', function() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial setup - don't hide body
    // gsap.set("body", { opacity: 0 });
    
    // Page load animation
    const tl = gsap.timeline();
    
    tl.to(".navbar", { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "back.out(1.7)" 
    })
    .from(".geekroom-text", { 
        scale: 0.5,
        opacity: 0, 
        duration: 1.2, 
        ease: "back.out(1.7)" 
    }, "-=0.5")
    .from(".scroll-indicator", { 
        opacity: 0, 
        y: 20, 
        duration: 0.5 
    }, "-=0.2");
    
    // Animated background shapes
    gsap.set(".shape", { 
        rotation: 0, 
        scale: 0.8, 
        opacity: 0.1 
    });
    
    gsap.to(".shape-1", {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none"
    });
    
    gsap.to(".shape-2", {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none"
    });
    
    gsap.to(".shape-3", {
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: "none"
    });
    
    // Floating animation for shapes
    gsap.to(".shape", {
        y: "random(-20, 20)",
        x: "random(-10, 10)",
        duration: "random(2, 4)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            each: 0.5,
            from: "random"
        }
    });
    
    // Section animations with ScrollTrigger
    
    // About Section Animation
    gsap.from(".about .section-title", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from(".about .section-subtitle", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });
    
    gsap.from(".about-text p", {
        scrollTrigger: {
            trigger: ".about-text",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
    
    // Stats animation
    gsap.from(".stat", {
        scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });
    
    // Features Section Animation
    gsap.from(".features .section-title", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from(".features .section-subtitle", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });
    
    // Feature cards staggered animation
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: {
            each: 0.2,
            from: "start"
        },
        ease: "back.out(1.7)"
    });
    
    // Feature icons rotation on scroll
    gsap.to(".feature-icon", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1
        },
        rotation: 360,
        duration: 2,
        stagger: 0.1
    });
    
    // CTA Section Animation
    gsap.from(".cta-title", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
    
    gsap.from(".cta-subtitle", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });
    
    gsap.from(".cta-buttons .btn", {
        scrollTrigger: {
            trigger: ".cta-buttons",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.4,
        ease: "back.out(1.7)"
    });
    
    // Footer Animation
    gsap.from(".footer-content", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });
    
    gsap.from(".footer-bottom", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
    });
    
    // Button hover animations
    document.querySelectorAll('.btn').forEach(button => {
        // Create hover timeline
        const hoverTl = gsap.timeline({ paused: true });
        
        hoverTl.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(button.querySelector('.btn-arrow'), {
            x: 5,
            duration: 0.3,
            ease: "power2.out"
        }, 0);
        
        button.addEventListener('mouseenter', () => hoverTl.play());
        button.addEventListener('mouseleave', () => hoverTl.reverse());
    });
    
    // Feature card hover animations
    document.querySelectorAll('.feature-card').forEach(card => {
        const icon = card.querySelector('.feature-icon');
        
        const cardHoverTl = gsap.timeline({ paused: true });
        
        cardHoverTl.to(card, {
            y: -10,
            duration: 0.3,
            ease: "power2.out"
        })
        .to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)"
        }, 0);
        
        card.addEventListener('mouseenter', () => cardHoverTl.play());
        card.addEventListener('mouseleave', () => cardHoverTl.reverse());
    });
    
    // Stats counter animation with GSAP
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/\D/g, ''));
            const suffix = stat.textContent.replace(/\d/g, '');
            
            gsap.from(stat, {
                scrollTrigger: {
                    trigger: stat,
                    start: "top 90%",
                    end: "bottom 20%",
                    toggleActions: "play none none none"
                },
                textContent: 0,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    stat.textContent = Math.floor(this.targets()[0].textContent) + suffix;
                }
            });
        });
    }
    
    animateStats();
    
    // Parallax scrolling for hero background
    gsap.to(".hero-background", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: "30%",
        ease: "none"
    });
    
    // Navigation link hover effects
    document.querySelectorAll('.nav-link').forEach(link => {
        const underline = link.querySelector('::after');
        
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                color: '#A0FF8F',
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                color: '#E5E5E5',
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Scroll indicator animation
    gsap.to(".scroll-arrow", {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
    });
    
    // Mobile menu animation
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            // Menu opening animation
            gsap.from(navMenu.querySelectorAll('.nav-item'), {
                x: -50,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    });
    
    // Smooth reveal animations for text elements
    gsap.utils.toArray('.hero-title, .section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            clipPath: "inset(0 100% 0 0)",
            duration: 1.2,
            ease: "power3.out"
        });
    });
    
    // Magnetic effect for buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Text animation for hero subtitle
    gsap.from(".hero-subtitle", {
        scrollTrigger: {
            trigger: ".hero-subtitle",
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out",
        delay: 0.5
    });
    
    console.log('GSAP animations initialized! ✨');
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
