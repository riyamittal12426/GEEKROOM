// Universal Splash Cursor Initialization
// This script ensures splash cursor works on all pages

(function() {
    'use strict';
    
    console.log('Universal Splash Cursor Init - Loading...');
    
    // Configuration for splash cursor
    const SPLASH_CONFIG = {
        SPLAT_RADIUS: 0.12,
        SPLAT_FORCE: 3500,
        DENSITY_DISSIPATION: 2.8,
        VELOCITY_DISSIPATION: 1.8,
        COLOR_UPDATE_SPEED: 6,
        CURL: 3.5,
        SHADING: true
    };
    
    // Function to initialize splash cursor
    function initSplashCursor() {
        if (window.SplashCursor) {
            try {
                // Check if instance already exists and destroy it
                if (window.splashCursorInstance) {
                    console.log('Existing splash cursor instance found, destroying...');
                    if (typeof window.splashCursorInstance.destroy === 'function') {
                        window.splashCursorInstance.destroy();
                    }
                    window.splashCursorInstance = null;
                }
                
                // Create new instance
                window.splashCursorInstance = new SplashCursor(SPLASH_CONFIG);
                console.log('Splash Cursor initialized successfully! 🎨');
                
                // Store reference globally for debugging
                window.splashActive = true;
                return true;
            } catch (error) {
                console.error('Failed to initialize Splash Cursor:', error);
                console.log('WebGL might not be supported. Fallback should be active.');
                window.splashActive = false;
                return false;
            }
        } else {
            console.warn('SplashCursor class not found. Make sure splash-cursor.js is loaded.');
            window.splashActive = false;
            return false;
        }
    }
    
    // Function to check if splash cursor script is loaded
    function checkSplashCursorScript() {
        const scripts = document.querySelectorAll('script[src*="splash-cursor.js"]');
        return scripts.length > 0;
    }
    
    // Function to dynamically load splash cursor script if not present
    function loadSplashCursorScript() {
        return new Promise((resolve, reject) => {
            if (checkSplashCursorScript() || window.SplashCursor) {
                resolve();
                return;
            }
            
            console.log('Loading splash-cursor.js dynamically...');
            const script = document.createElement('script');
            script.src = 'js/splash-cursor.js';
            script.onload = () => {
                console.log('splash-cursor.js loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load splash-cursor.js');
                reject(new Error('Failed to load splash-cursor.js'));
            };
            document.head.appendChild(script);
        });
    }
    
    // Main initialization function
    async function universalSplashInit() {
        try {
            // Load the script if not already loaded
            await loadSplashCursorScript();
            
            // Wait a bit for the script to fully initialize
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Initialize the splash cursor
            const success = initSplashCursor();
            
            if (!success) {
                // Retry after a delay
                setTimeout(() => {
                    console.log('Retrying splash cursor initialization...');
                    initSplashCursor();
                }, 1000);
            }
            
        } catch (error) {
            console.error('Universal splash cursor initialization failed:', error);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', universalSplashInit);
    } else {
        // DOM is already ready
        universalSplashInit();
    }
    
    // Also initialize when window loads (fallback)
    window.addEventListener('load', () => {
        if (!window.splashCursorInstance) {
            console.log('Window loaded, attempting splash cursor initialization...');
            universalSplashInit();
        }
    });
    
    // Export init function for manual calls
    window.initUniversalSplashCursor = universalSplashInit;
    
    console.log('Universal Splash Cursor Init - Ready');
})();
