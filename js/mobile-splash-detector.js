// Mobile Splash Detector - Universal script to prevent splash cursor on mobile devices
// This script should be loaded before any splash cursor scripts

(function() {
    'use strict';
    
    // Mobile detection function
    function isMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile user agents
        const mobileRegex = /android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
        
        // Check screen size (mobile-first approach)
        const isSmallScreen = window.innerWidth <= 768 || window.innerHeight <= 768;
        
        // Check touch capability
        const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check for specific mobile indicators
        const isMobileUserAgent = mobileRegex.test(userAgent);
        
        // Check orientation API (usually available on mobile)
        const hasOrientationAPI = typeof window.orientation !== 'undefined';
        
        // Additional checks for tablets and other touch devices
        const isTablet = /ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(userAgent);
        
        return isMobileUserAgent || isTablet || (isSmallScreen && hasTouchScreen) || hasOrientationAPI;
    }
    
    // Function to conditionally load splash cursor scripts
    function conditionallyLoadSplashCursor() {
        // Prevent multiple initializations
        if (window.SPLASH_LOADER_INITIALIZED) {
            console.log('Splash cursor loader already initialized - skipping');
            return;
        }
        window.SPLASH_LOADER_INITIALIZED = true;
        
        if (isMobileDevice()) {
            console.log('Mobile/Touch device detected - Splash cursor disabled for optimal scrolling');
            
            // Set global flag to prevent splash cursor initialization
            window.DISABLE_SPLASH_CURSOR = true;
            window.splashActive = false;
            
            // Add mobile-optimized scrolling styles
            const style = document.createElement('style');
            style.textContent = `
                /* Mobile scrolling optimization */
                html, body {
                    -webkit-overflow-scrolling: touch !important;
                    overflow-x: hidden;
                    scroll-behavior: smooth;
                }
                
                /* Prevent interference with mobile scrolling */
                * {
                    touch-action: manipulation;
                }
                
                /* Ensure mobile scrolling works properly */
                body {
                    overscroll-behavior: contain;
                }
                
                /* Remove any potential cursor interference */
                * {
                    cursor: auto !important;
                }
            `;
            document.head.appendChild(style);
            
        } else {
            console.log('Desktop device detected - Loading splash cursor...');
            window.DISABLE_SPLASH_CURSOR = false;
            
            // Load splash cursor scripts for desktop with proper sequencing
            const splashScript = document.createElement('script');
            splashScript.src = 'js/splash-cursor.js';
            splashScript.async = false; // Ensure sequential loading
            
            splashScript.onload = function() {
                console.log('✓ Splash cursor script loaded');
                
                // Wait briefly for script to be fully parsed and class to be available
                setTimeout(() => {
                    // Load initialization script after splash cursor is ready
                    const splashInitScript = document.createElement('script');
                    splashInitScript.src = 'js/splash-init.js';
                    splashInitScript.async = false; // Ensure sequential loading
                    
                    splashInitScript.onload = function() {
                        console.log('✓ Splash init script loaded and executed');
                    };
                    
                    splashInitScript.onerror = function() {
                        console.error('❌ Failed to load splash-init.js');
                    };
                    
                    document.head.appendChild(splashInitScript);
                }, 100); // Small delay to ensure SplashCursor class is defined
            };
            
            splashScript.onerror = function() {
                console.error('❌ Failed to load splash-cursor.js');
            };
            
            document.head.appendChild(splashScript);
        }
    }
    
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', conditionallyLoadSplashCursor);
    } else {
        conditionallyLoadSplashCursor();
    }
    
    // Export the mobile detection function for other scripts
    window.isMobileDevice = isMobileDevice;
    window.conditionallyLoadSplashCursor = conditionallyLoadSplashCursor;
    
})();