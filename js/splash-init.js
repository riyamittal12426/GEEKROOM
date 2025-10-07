// Universal Splash Cursor Initialization
// This script is called by mobile-splash-detector.js after splash-cursor.js is loaded
// DO NOT call this script directly - let mobile-splash-detector.js handle the loading chain

(function() {
    'use strict';
    
    console.log('Universal Splash Cursor Init - Starting...');
    
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
        // Check if splash cursor is disabled globally (by mobile detector)
        if (window.DISABLE_SPLASH_CURSOR) {
            console.log('Splash cursor disabled globally - skipping initialization');
            window.splashActive = false;
            return false;
        }
        
        // Wait for SplashCursor class to be available
        if (!window.SplashCursor) {
            console.warn('SplashCursor class not found yet, waiting...');
            return false;
        }
        
        // Check if instance already exists
        if (window.splashCursorInstance) {
            console.log('Splash cursor already initialized');
            return true;
        }
        
        try {
            // Create new instance
            window.splashCursorInstance = new SplashCursor(SPLASH_CONFIG);
            console.log('✨ Splash Cursor initialized successfully!');
            
            // Store reference globally for debugging
            window.splashActive = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize Splash Cursor:', error);
            console.log('WebGL might not be supported. Fallback should be active.');
            window.splashActive = false;
            return false;
        }
    }
    
    // Main initialization with retry mechanism
    function attemptInit(retries = 3, delay = 200) {
        const success = initSplashCursor();
        
        if (!success && retries > 0) {
            console.log(`Retrying splash cursor initialization... (${retries} attempts left)`);
            setTimeout(() => attemptInit(retries - 1, delay * 1.5), delay);
        }
    }
    
    // Health check - monitor if splash cursor stops working
    function setupHealthCheck() {
        setInterval(() => {
            if (window.DISABLE_SPLASH_CURSOR) return;
            
            const instance = window.splashCursorInstance;
            if (instance) {
                // Check if cursor is supposed to be active but isn't animating
                if (instance.isActive === false && window.splashActive === true) {
                    console.warn('⚠️ Splash cursor stopped working! Attempting recovery...');
                    
                    // Try to recover
                    if (typeof instance.startAnimationLoop === 'function') {
                        instance.isActive = true;
                        instance.startAnimationLoop();
                        console.log('✓ Animation loop restarted');
                    } else {
                        // Full reinitialization
                        console.log('Reinitializing splash cursor...');
                        attemptInit();
                    }
                }
            } else if (window.splashActive === true) {
                // Instance was destroyed, recreate
                console.warn('⚠️ Splash cursor instance lost! Recreating...');
                attemptInit();
            }
        }, 5000); // Check every 5 seconds
    }
    
    // Start initialization attempt
    attemptInit();
    
    // Start health monitoring after initialization
    setTimeout(setupHealthCheck, 3000);
    
    // Export init function for manual calls
    window.initUniversalSplashCursor = attemptInit;
    
    console.log('✓ Splash cursor initialization complete with health monitoring');
})();
