// Smooth Scrolling Configuration
window.SmoothScrollConfig = {
    // Global settings
    enabled: true,
    
    // Scroll behavior settings
    behavior: 'smooth',
    
    // Navbar offset (automatically calculated if not specified)
    navbarOffset: null,
    
    // Animation duration for programmatic scrolling (in ms)
    duration: 800,
    
    // Easing function for smooth scrolling
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    
    // Scroll to top button settings
    scrollToTop: {
        enabled: true,
        showAfter: 300, // pixels scrolled before showing button
        position: {
            bottom: '30px',
            right: '30px'
        }
    },
    
    // Cross-page navigation settings
    crossPageScrolling: {
        enabled: true,
        storageKey: 'scrollTarget'
    },
    
    // Keyboard navigation settings
    keyboardNavigation: {
        enabled: true,
        pageUpDown: true,
        homeEnd: true
    },
    
    // Performance settings
    performance: {
        useRequestAnimationFrame: true,
        throttleScrollEvents: true
    },
    
    // Accessibility settings
    accessibility: {
        respectReducedMotion: true,
        focusManagement: true
    },
    
    // Debug mode
    debug: false
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.SmoothScrollConfig;
}