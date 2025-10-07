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
            console.log('Desktop device detected - Splash cursor enabled');
            window.DISABLE_SPLASH_CURSOR = false;
            
            // Load splash cursor scripts for desktop
            const splashScript = document.createElement('script');
            splashScript.src = 'js/splash-cursor.js';
            splashScript.onload = function() {
                console.log('Splash cursor script loaded');
                
                // Load initialization script
                const splashInitScript = document.createElement('script');
                splashInitScript.src = 'js/splash-init.js';
                document.head.appendChild(splashInitScript);
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