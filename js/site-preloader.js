// Site-wide Preloader for Instant Navigation
class SitePreloader {
    constructor() {
        this.routes = [
            'index.html',
            'about.html',
            'events.html',
            'team.html',
            'gallery.html',
            'contact.html'
        ];
        
        this.resources = {
            css: [
                'css/styles.css',
                'css/universal-smooth-scroll.css'
            ],
            js: [
                'js/main.js',
                'js/universal-smooth-scroll.js',
                'js/scroll-animations.js',
                'js/enhanced-animations.js',
                'js/animations.js',
                'js/splash-cursor.js',
                'js/splash-init.js'
            ],
            images: [
                'photos/1.jpg',
                'photos/2.jpg',
                'photos/3.jpg',
                'photos/5.jpg',
                'photos/6.jpg',
                'photos/7.jpg',
                'photos/8.jpg',
                'photos/9.jpg',
                'photos/10.jpg',
                'photos/11.jpg',
                'photos/12.jpg',
                'photos/13.jpg',
                'photos/ai-ml.jpg',
                'photos/cv.jpeg',
                'photos/dsa.jpeg',
                'photos/em.jpeg',
                'photos/event.jpeg',
                'photos/marketing.jpeg',
                'photos/media.jpeg',
                'photos/pr.jpg',
                'photos/web.jpg'
            ]
        };
        
        this.cache = new Map();
        this.loadingProgress = 0;
        this.totalResources = 0;
        this.loadedResources = 0;
        this.isPreloading = false;
        
        this.init();
    }

    init() {
        // Start preloading immediately but don't block initial page load
        requestIdleCallback(() => {
            this.startPreloading();
        }, { timeout: 1000 });
        
        // Setup navigation interception
        this.setupNavigationInterception();
        
        // Setup progress monitoring
        this.setupProgressMonitoring();
    }

    async startPreloading() {
        if (this.isPreloading) return;
        
        this.isPreloading = true;
        console.log('🚀 Starting site-wide preloading...');
        
        // Calculate total resources
        this.totalResources = this.routes.length + 
                             this.resources.css.length + 
                             this.resources.js.length + 
                             this.resources.images.length;
        
        // Show loading indicator
        this.showLoadingIndicator();
        
        try {
            // Preload in priority order
            await Promise.all([
                this.preloadRoutes(),
                this.preloadCriticalResources(),
                this.preloadImages()
            ]);
            
            console.log('✅ Site preloading completed!');
            this.hideLoadingIndicator();
            this.enableInstantNavigation();
            
        } catch (error) {
            console.error('❌ Preloading failed:', error);
            this.hideLoadingIndicator();
        }
    }

    async preloadRoutes() {
        const routePromises = this.routes.map(async (route) => {
            try {
                const response = await fetch(route);
                const html = await response.text();
                this.cache.set(route, {
                    type: 'html',
                    content: html,
                    timestamp: Date.now()
                });
                this.updateProgress();
                console.log(`📄 Preloaded route: ${route}`);
            } catch (error) {
                console.warn(`Failed to preload route: ${route}`, error);
                this.updateProgress();
            }
        });
        
        await Promise.all(routePromises);
    }

    async preloadCriticalResources() {
        // Preload CSS files
        const cssPromises = this.resources.css.map(async (cssFile) => {
            try {
                const response = await fetch(cssFile);
                const css = await response.text();
                this.cache.set(cssFile, {
                    type: 'css',
                    content: css,
                    timestamp: Date.now()
                });
                this.updateProgress();
                console.log(`🎨 Preloaded CSS: ${cssFile}`);
            } catch (error) {
                console.warn(`Failed to preload CSS: ${cssFile}`, error);
                this.updateProgress();
            }
        });

        // Preload JS files
        const jsPromises = this.resources.js.map(async (jsFile) => {
            try {
                const response = await fetch(jsFile);
                const js = await response.text();
                this.cache.set(jsFile, {
                    type: 'js',
                    content: js,
                    timestamp: Date.now()
                });
                this.updateProgress();
                console.log(`⚡ Preloaded JS: ${jsFile}`);
            } catch (error) {
                console.warn(`Failed to preload JS: ${jsFile}`, error);
                this.updateProgress();
            }
        });

        await Promise.all([...cssPromises, ...jsPromises]);
    }

    async preloadImages() {
        // Load images in batches to avoid overwhelming the browser
        const batchSize = 5;
        const batches = [];
        
        for (let i = 0; i < this.resources.images.length; i += batchSize) {
            batches.push(this.resources.images.slice(i, i + batchSize));
        }

        for (const batch of batches) {
            const batchPromises = batch.map(async (imagePath) => {
                try {
                    const img = new Image();
                    await new Promise((resolve, reject) => {
                        img.onload = resolve;
                        img.onerror = reject;
                        img.src = imagePath;
                    });
                    
                    this.cache.set(imagePath, {
                        type: 'image',
                        element: img,
                        timestamp: Date.now()
                    });
                    this.updateProgress();
                    console.log(`🖼️ Preloaded image: ${imagePath}`);
                } catch (error) {
                    console.warn(`Failed to preload image: ${imagePath}`, error);
                    this.updateProgress();
                }
            });
            
            await Promise.all(batchPromises);
            
            // Small delay between batches to prevent blocking
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    setupNavigationInterception() {
        // Intercept all navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('http') || href.startsWith('//')) return;
            if (href.startsWith('#')) return;
            
            // Check if we have this route cached
            if (this.cache.has(href)) {
                e.preventDefault();
                this.navigateInstantly(href);
            }
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            const currentPath = window.location.pathname.split('/').pop() || 'index.html';
            if (this.cache.has(currentPath)) {
                this.navigateInstantly(currentPath, false);
            }
        });
    }

    navigateInstantly(route, pushState = true) {
        const cachedRoute = this.cache.get(route);
        if (!cachedRoute) {
            // Fallback to normal navigation
            window.location.href = route;
            return;
        }

        console.log(`⚡ Instant navigation to: ${route}`);
        
        // Show transition effect
        this.showPageTransition();
        
        // Update browser history
        if (pushState) {
            history.pushState({ route }, '', route);
        }
        
        // Replace page content
        setTimeout(() => {
            document.documentElement.innerHTML = cachedRoute.content;
            
            // Re-initialize page-specific functionality
            this.reinitializePage(route);
            
            this.hidePageTransition();
        }, 150); // Small delay for smooth transition
    }

    reinitializePage(route) {
        // Re-run common initialization
        if (window.initializeCommonFeatures) {
            window.initializeCommonFeatures();
        }
        
        // Page-specific initialization
        switch (route) {
            case 'gallery.html':
                this.initializeGallery();
                break;
            case 'contact.html':
                this.initializeContact();
                break;
            case 'events.html':
                this.initializeEvents();
                break;
            case 'team.html':
                this.initializeTeam();
                break;
            case 'about.html':
                this.initializeAbout();
                break;
            default:
                this.initializeHome();
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update active navigation
        this.updateActiveNavigation(route);
    }

    initializeGallery() {
        // Initialize gallery with preloaded images
        const galleryData = [
            { id: 1, title: 'Gallery Image 1', description: 'Beautiful moment captured', image: 'photos/1.jpg' },
            { id: 2, title: 'Gallery Image 2', description: 'Beautiful moment captured', image: 'photos/2.jpg' },
            { id: 3, title: 'Gallery Image 3', description: 'Beautiful moment captured', image: 'photos/3.jpg' },
            { id: 5, title: 'Gallery Image 5', description: 'Beautiful moment captured', image: 'photos/5.jpg' },
            { id: 6, title: 'Gallery Image 6', description: 'Beautiful moment captured', image: 'photos/6.jpg' },
            { id: 7, title: 'Gallery Image 7', description: 'Beautiful moment captured', image: 'photos/7.jpg' },
            { id: 8, title: 'Gallery Image 8', description: 'Beautiful moment captured', image: 'photos/8.jpg' },
            { id: 9, title: 'Gallery Image 9', description: 'Beautiful moment captured', image: 'photos/9.jpg' },
            { id: 10, title: 'Gallery Image 10', description: 'Beautiful moment captured', image: 'photos/10.jpg' },
            { id: 11, title: 'Gallery Image 11', description: 'Beautiful moment captured', image: 'photos/11.jpg' },
            { id: 12, title: 'Gallery Image 12', description: 'Beautiful moment captured', image: 'photos/12.jpg' },
            { id: 13, title: 'Gallery Image 13', description: 'Beautiful moment captured', image: 'photos/13.jpg' }
        ];

        const container = document.getElementById('gallery-grid');
        if (container) {
            // Clear existing content
            container.innerHTML = '';
            
            // Create gallery items instantly using cached images
            galleryData.forEach((item, index) => {
                const element = document.createElement('div');
                element.className = 'gallery-item';
                element.dataset.id = item.id;
                
                // Use cached image if available
                const cachedImage = this.cache.get(item.image);
                const imgSrc = cachedImage ? cachedImage.element.src : item.image;
                
                element.innerHTML = `
                    <img class="gallery-image" src="${imgSrc}" alt="${item.title}" style="opacity: 0;">
                    <div class="gallery-overlay">
                        <div class="gallery-info">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                    </div>
                `;
                
                container.appendChild(element);
                
                // Animate in
                setTimeout(() => {
                    const img = element.querySelector('.gallery-image');
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.style.opacity = '1';
                }, index * 50);
            });
            
            // Setup lightbox
            this.setupGalleryLightbox();
        }
    }

    setupGalleryLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxImage = document.getElementById('lightbox-image');
        const container = document.getElementById('gallery-grid');

        if (!lightbox || !container) return;

        container.addEventListener('click', (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const img = item.querySelector('.gallery-image');
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        lightboxClose?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    initializeContact() {
        // Initialize contact form and interactions
        console.log('Initializing contact page');
    }

    initializeEvents() {
        // Initialize events page
        console.log('Initializing events page');
    }

    initializeTeam() {
        // Initialize team page
        console.log('Initializing team page');
    }

    initializeAbout() {
        // Initialize about page
        console.log('Initializing about page');
    }

    initializeHome() {
        // Initialize home page
        console.log('Initializing home page');
    }

    updateActiveNavigation(route) {
        // Update active navigation state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === route) {
                link.classList.add('active');
            }
        });
    }

    showPageTransition() {
        // Create smooth transition overlay
        const overlay = document.createElement('div');
        overlay.id = 'page-transition';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.15s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }

    hidePageTransition() {
        const overlay = document.getElementById('page-transition');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 150);
        }
    }

    updateProgress() {
        this.loadedResources++;
        this.loadingProgress = (this.loadedResources / this.totalResources) * 100;
        
        const indicator = document.getElementById('preload-indicator');
        if (indicator) {
            const progressBar = indicator.querySelector('.progress-bar');
            const progressText = indicator.querySelector('.progress-text');
            
            if (progressBar) {
                progressBar.style.width = `${this.loadingProgress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `Loading... ${Math.round(this.loadingProgress)}%`;
            }
        }
    }

    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'preload-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: var(--secondary-color, #A0FF8F);
            padding: 15px 20px;
            border-radius: 10px;
            border: 1px solid rgba(160, 255, 143, 0.2);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            backdrop-filter: blur(10px);
            min-width: 200px;
        `;
        
        indicator.innerHTML = `
            <div class="progress-text">Loading... 0%</div>
            <div style="width: 100%; height: 3px; background: rgba(160, 255, 143, 0.2); border-radius: 2px; margin-top: 8px; overflow: hidden;">
                <div class="progress-bar" style="height: 100%; background: var(--secondary-color, #A0FF8F); width: 0%; transition: width 0.3s ease; border-radius: 2px;"></div>
            </div>
        `;
        
        document.body.appendChild(indicator);
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('preload-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(20px)';
            setTimeout(() => indicator.remove(), 300);
        }
    }

    enableInstantNavigation() {
        // Add visual indicator that instant navigation is ready
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.position = 'relative';
            link.style.overflow = 'hidden';
            
            const shimmer = document.createElement('div');
            shimmer.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(160, 255, 143, 0.2), transparent);
                animation: shimmer 2s ease-in-out;
                pointer-events: none;
            `;
            
            link.appendChild(shimmer);
            
            setTimeout(() => shimmer.remove(), 2000);
        });
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    // Public method to check preload status
    getPreloadStatus() {
        return {
            isPreloading: this.isPreloading,
            progress: this.loadingProgress,
            totalResources: this.totalResources,
            loadedResources: this.loadedResources,
            cachedRoutes: Array.from(this.cache.keys()).filter(key => key.endsWith('.html')),
            cachedImages: Array.from(this.cache.keys()).filter(key => key.includes('photos/'))
        };
    }
}

// Initialize site preloader
window.sitePreloader = new SitePreloader();

// Expose status check function
window.checkPreloadStatus = () => {
    return window.sitePreloader.getPreloadStatus();
};