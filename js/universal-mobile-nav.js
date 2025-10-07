/**
 * Universal Mobile Navigation Handler
 * Provides hamburger menu functionality for all pages
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        hamburgerSelector: '#nav-hamburger',
        navMenuSelector: '#nav-menu',
        navLinkSelector: '.nav-link',
        activeClass: 'active',
        debugMode: true
    };
    
    // Debug logger
    function log(message) {
        if (CONFIG.debugMode) {
            console.log(`🍔 Mobile Nav: ${message}`);
        }
    }
    
    // Initialize mobile navigation
    function initMobileNavigation() {
        log('Initializing universal mobile navigation...');
        
        // Get elements
        const hamburger = document.querySelector(CONFIG.hamburgerSelector);
        const navMenu = document.querySelector(CONFIG.navMenuSelector);
        
        if (!hamburger || !navMenu) {
            log('❌ Hamburger or NavMenu not found - skipping mobile nav init');
            return false;
        }
        
        log('✅ Hamburger and NavMenu elements found');
        
        // Ensure hamburger has proper styling for visibility
        enhanceHamburgerVisibility(hamburger);
        
        // Add click event to hamburger
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            log('Hamburger clicked');
            
            // Toggle classes
            hamburger.classList.toggle(CONFIG.activeClass);
            navMenu.classList.toggle(CONFIG.activeClass);
            
            log(`Menu is now ${navMenu.classList.contains(CONFIG.activeClass) ? 'open' : 'closed'}`);
        });
        
        // Add touch events for better mobile support
        hamburger.addEventListener('touchstart', function(e) {
            log('Touch start on hamburger');
        }, { passive: true });
        
        hamburger.addEventListener('touchend', function(e) {
            e.preventDefault();
            log('Touch end on hamburger');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll(CONFIG.navLinkSelector);
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                log('Nav link clicked - closing menu');
                hamburger.classList.remove(CONFIG.activeClass);
                navMenu.classList.remove(CONFIG.activeClass);
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove(CONFIG.activeClass);
                navMenu.classList.remove(CONFIG.activeClass);
            }
        });
        
        // Enhanced touch handling
        hamburger.style.touchAction = 'manipulation';
        hamburger.style.userSelect = 'none';
        
        log('✅ Mobile navigation initialized successfully');
        return true;
    }
    
    // Enhance hamburger visibility
    function enhanceHamburgerVisibility(hamburger) {
        // Add enhanced styles if not already present
        const currentDisplay = window.getComputedStyle(hamburger).display;
        
        if (window.innerWidth <= 992 && currentDisplay === 'none') {
            log('⚠️  Hamburger is hidden on mobile - applying emergency visibility fix');
            
            // Apply emergency styles
            hamburger.style.display = 'flex';
            hamburger.style.flexDirection = 'column';
            hamburger.style.padding = '12px';
            hamburger.style.background = 'rgba(160, 255, 143, 0.2)';
            hamburger.style.border = '2px solid #A0FF8F';
            hamburger.style.borderRadius = '6px';
            hamburger.style.minWidth = '44px';
            hamburger.style.minHeight = '44px';
            hamburger.style.justifyContent = 'center';
            hamburger.style.alignItems = 'center';
            hamburger.style.cursor = 'pointer';
            hamburger.style.zIndex = '1000';
            
            // Style the bars
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach(bar => {
                bar.style.display = 'block';
                bar.style.width = '28px';
                bar.style.height = '4px';
                bar.style.background = '#A0FF8F';
                bar.style.margin = '3px 0';
                bar.style.transition = '0.3s';
                bar.style.borderRadius = '3px';
                bar.style.boxShadow = '0 0 5px rgba(160, 255, 143, 0.3)';
            });
        }
    }
    
    // Add CSS for mobile navigation if not present
    function addMobileNavigationCSS() {
        // Check if mobile nav CSS already exists
        if (document.getElementById('universal-mobile-nav-css')) {
            return;
        }
        
        const css = `
            /* Universal Mobile Navigation CSS */
            @media (max-width: 992px) {
                .nav-hamburger {
                    display: flex !important;
                    flex-direction: column;
                    cursor: pointer;
                    padding: 12px;
                    background: rgba(160, 255, 143, 0.2) !important;
                    border: 2px solid #A0FF8F !important;
                    border-radius: 6px;
                    min-width: 44px;
                    min-height: 44px;
                    justify-content: center;
                    align-items: center;
                    touch-action: manipulation;
                    user-select: none;
                    position: relative;
                    z-index: 1000;
                }
                
                .nav-hamburger:hover {
                    background: rgba(160, 255, 143, 0.3) !important;
                    transform: scale(1.05);
                }
                
                .nav-hamburger:active {
                    background: rgba(160, 255, 143, 0.4) !important;
                    transform: scale(0.95);
                }
                
                .nav-hamburger .bar {
                    display: block !important;
                    width: 28px;
                    height: 4px;
                    background: #A0FF8F !important;
                    margin: 3px 0;
                    transition: 0.3s;
                    border-radius: 3px;
                    box-shadow: 0 0 5px rgba(160, 255, 143, 0.3);
                    opacity: 1 !important;
                    visibility: visible !important;
                }
                
                .nav-menu {
                    position: fixed;
                    left: -100%;
                    top: 70px;
                    flex-direction: column;
                    background-color: rgba(0, 0, 0, 0.95);
                    width: 100%;
                    text-align: center;
                    transition: 0.3s;
                    backdrop-filter: blur(20px);
                    padding: 2rem 0;
                    z-index: 999;
                }
                
                .nav-menu.active {
                    left: 0;
                }
                
                .nav-menu li {
                    margin: 1rem 0;
                }
                
                .nav-hamburger.active .bar:nth-child(2) {
                    opacity: 0;
                }
                
                .nav-hamburger.active .bar:nth-child(1) {
                    transform: translateY(8px) rotate(45deg);
                }
                
                .nav-hamburger.active .bar:nth-child(3) {
                    transform: translateY(-8px) rotate(-45deg);
                }
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'universal-mobile-nav-css';
        style.textContent = css;
        document.head.appendChild(style);
        
        log('✅ Universal mobile navigation CSS added');
    }
    
    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addMobileNavigationCSS();
                initMobileNavigation();
            });
        } else {
            addMobileNavigationCSS();
            initMobileNavigation();
        }
    }
    
    // Auto-initialize
    init();
    
    // Expose to global scope for debugging
    window.UniversalMobileNav = {
        init: initMobileNavigation,
        addCSS: addMobileNavigationCSS,
        config: CONFIG
    };
    
    log('Universal Mobile Navigation script loaded');
})();