// GSAP Animations for GeekRoom Adgips
document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // Page load animation - add overshoot and spring
    const tl = gsap.timeline();
    tl.to(".navbar", { 
        autoAlpha: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "elastic.out(1, 0.7)" 
    })
    .from(".geekroom-text", { 
        scale: 0.5,
        autoAlpha: 0, 
        duration: 1.2, 
        ease: "elastic.out(1, 0.7)" 
    }, "-=0.5")
    .from(".scroll-indicator", { 
        autoAlpha: 0, 
        y: 30, 
        duration: 0.7,
        ease: "bounce.out"
    }, "-=0.2");

    // Animated background shapes - fade in and randomize
    gsap.set(".shape", { 
        rotation: 0, 
        scale: 0.8, 
        autoAlpha: 0 
    });
    gsap.to(".shape", {
        autoAlpha: 0.15,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.out"
    });

    gsap.to(".shape-1", {
        rotation: 360,
        scale: 1.05,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to(".shape-2", {
        rotation: -360,
        scale: 1.1,
        duration: 22,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    gsap.to(".shape-3", {
        rotation: 360,
        scale: 0.95,
        duration: 13,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Floating animation for shapes - more random
    gsap.to(".shape", {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        duration: "random(2.5, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: {
            each: 0.4,
            from: "random"
        }
    });

    // Section animations - add skew and spring
    gsap.from(".about .section-title", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        skewY: 8,
        autoAlpha: 0,
        duration: 1,
        ease: "elastic.out(1, 0.7)"
    });
    gsap.from(".about .section-subtitle", {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        skewY: 5,
        autoAlpha: 0,
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
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // Stats animation - bounce and spring
    gsap.from(".stat", {
        scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 60,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(2)"
    });

    // Features Section Animation - add skew
    gsap.from(".features .section-title", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        skewY: 8,
        autoAlpha: 0,
        duration: 1,
        ease: "elastic.out(1, 0.7)"
    });
    gsap.from(".features .section-subtitle", {
        scrollTrigger: {
            trigger: ".features",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        skewY: 5,
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power2.out"
    });

    // Feature cards staggered animation - spring
    gsap.from(".feature-card", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        autoAlpha: 0,
        duration: 0.8,
        stagger: {
            each: 0.18,
            from: "center"
        },
        ease: "elastic.out(1, 0.7)"
    });

    // Feature icons rotation on scroll - add scale
    gsap.to(".feature-icon", {
        scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1
        },
        rotation: 360,
        scale: 1.15,
        duration: 2,
        stagger: 0.1
    });

    // CTA Section Animation - spring
    gsap.from(".cta-title", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        skewY: 8,
        autoAlpha: 0,
        duration: 1,
        ease: "elastic.out(1, 0.7)"
    });
    gsap.from(".cta-subtitle", {
        scrollTrigger: {
            trigger: ".cta",
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        skewY: 5,
        autoAlpha: 0,
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
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.18,
        delay: 0.4,
        ease: "elastic.out(1, 0.7)"
    });

    // Footer Animation - fade and slide
    gsap.from(".footer-content", {
        scrollTrigger: {
            trigger: ".footer",
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        y: 30,
        autoAlpha: 0,
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
        autoAlpha: 0,
        duration: 0.6,
        delay: 0.2,
        ease: "power2.out"
    });

    // Button hover animations - add shadow and color
    document.querySelectorAll('.btn').forEach(button => {
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(button, {
            scale: 1.08,
            boxShadow: "0 4px 24px #A0FF8F55",
            backgroundColor: "#222",
            duration: 0.3,
            ease: "power2.out"
        })
        .to(button.querySelector('.btn-arrow'), {
            x: 8,
            duration: 0.3,
            ease: "power2.out"
        }, 0);
        button.addEventListener('mouseenter', () => hoverTl.play());
        button.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Feature card hover animations - add shadow
    document.querySelectorAll('.feature-card').forEach(card => {
        const icon = card.querySelector('.feature-icon');
        const cardHoverTl = gsap.timeline({ paused: true });
        cardHoverTl.to(card, {
            y: -12,
            boxShadow: "0 8px 32px #A0FF8F33",
            duration: 0.3,
            ease: "power2.out"
        })
        .to(icon, {
            scale: 1.15,
            rotation: 8,
            duration: 0.3,
            ease: "back.out(1.7)"
        }, 0);
        card.addEventListener('mouseenter', () => cardHoverTl.play());
        card.addEventListener('mouseleave', () => cardHoverTl.reverse());
    });

    // Stats counter animation with GSAP - spring
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
                ease: "elastic.out(1, 0.7)",
                snap: { textContent: 1 },
                onUpdate: function() {
                    stat.textContent = Math.floor(this.targets()[0].textContent) + suffix;
                }
            });
        });
    }
    animateStats();

    // Parallax scrolling for hero background - more depth
    gsap.to(".hero-background", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        },
        y: "40%",
        scale: 1.05,
        ease: "none"
    });

    // Navigation link hover effects - add underline animation
    document.querySelectorAll('.nav-link').forEach(link => {
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

    // Scroll indicator animation - bounce
    gsap.to(".scroll-arrow", {
        y: 16,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "bounce.inOut"
    });

    // Mobile menu animation - fade and slide
    const hamburger = document.getElementById('nav-hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            gsap.from(navMenu.querySelectorAll('.nav-item'), {
                x: -60,
                autoAlpha: 0,
                duration: 0.5,
                stagger: 0.12,
                ease: "elastic.out(1, 0.7)"
            });
        }
    });

    // Smooth reveal animations for text elements - add skew and clipPath
    gsap.utils.toArray('.hero-title, .section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            },
            clipPath: "inset(0 100% 0 0)",
            skewX: 12,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Magnetic effect for buttons - add scale and rotation
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(button, {
                x: x * 0.12,
                y: y * 0.12,
                scale: 1.05,
                rotation: x * 0.03,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Text animation for hero subtitle - fade and slide
    gsap.from(".hero-subtitle", {
        scrollTrigger: {
            trigger: ".hero-subtitle",
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        autoAlpha: 0,
        y: 40,
        duration: 1,
        ease: "power2.out",
        delay: 0.5
    });

    console.log('GSAP animations improved and initialized! 🚀');
});

// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});
