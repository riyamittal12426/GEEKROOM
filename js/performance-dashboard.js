// Performance Dashboard for Site Optimization
class PerformanceDashboard {
    constructor() {
        this.metrics = {
            navigationTimes: [],
            pageLoadTimes: [],
            imageLoadTimes: [],
            interactionDelays: [],
            preloadStatus: null
        };
        
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.setupPerformanceObservers();
        this.monitorNavigationPerformance();
        this.createDashboard();
        this.startReporting();
    }

    setupPerformanceObservers() {
        // Monitor Interaction to Next Paint (INP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const delay = entry.processingStart - entry.startTime;
                    this.metrics.interactionDelays.push({
                        delay,
                        type: entry.name,
                        timestamp: Date.now()
                    });
                    
                    this.updateDashboard();
                }
            });
            
            observer.observe({ entryTypes: ['event'] });
        }

        // Monitor Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.metrics.lcp = lastEntry.startTime;
                this.updateDashboard();
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        }

        // Monitor First Input Delay (FID)
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.metrics.fid = entry.processingStart - entry.startTime;
                    this.updateDashboard();
                }
            });
            
            observer.observe({ entryTypes: ['first-input'] });
        }
    }

    monitorNavigationPerformance() {
        // Monitor page navigation times
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        history.pushState = (...args) => {
            const startTime = performance.now();
            originalPushState.apply(history, args);
            
            setTimeout(() => {
                const endTime = performance.now();
                this.metrics.navigationTimes.push({
                    duration: endTime - startTime,
                    url: args[2],
                    timestamp: Date.now()
                });
                this.updateDashboard();
            }, 100);
        };

        // Monitor image load times
        const imageObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'IMG') {
                        const startTime = performance.now();
                        
                        node.addEventListener('load', () => {
                            const loadTime = performance.now() - startTime;
                            this.metrics.imageLoadTimes.push({
                                duration: loadTime,
                                src: node.src,
                                timestamp: Date.now()
                            });
                            this.updateDashboard();
                        });
                    }
                });
            });
        });
        
        imageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createDashboard() {
        // Create floating performance dashboard
        const dashboard = document.createElement('div');
        dashboard.id = 'performance-dashboard';
        dashboard.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 300px;
            background: rgba(0, 0, 0, 0.95);
            color: #A0FF8F;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(160, 255, 143, 0.2);
            font-family: 'Inter', monospace;
            font-size: 12px;
            z-index: 10001;
            backdrop-filter: blur(10px);
            transform: translateX(-320px);
            transition: transform 0.3s ease;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        dashboard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <h3 style="margin: 0; color: #A0FF8F;">Performance Monitor</h3>
                <button id="dashboard-toggle" style="background: none; border: 1px solid #A0FF8F; color: #A0FF8F; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Show</button>
            </div>
            <div id="dashboard-content">
                <div class="metric-group">
                    <h4>Core Web Vitals</h4>
                    <div id="inp-metric">INP: <span>-</span></div>
                    <div id="lcp-metric">LCP: <span>-</span></div>
                    <div id="fid-metric">FID: <span>-</span></div>
                </div>
                
                <div class="metric-group">
                    <h4>Navigation Performance</h4>
                    <div id="nav-metric">Avg Navigation: <span>-</span></div>
                    <div id="preload-metric">Preload Status: <span>-</span></div>
                </div>
                
                <div class="metric-group">
                    <h4>Image Performance</h4>
                    <div id="img-metric">Avg Image Load: <span>-</span></div>
                    <div id="cached-metric">Cached Images: <span>-</span></div>
                </div>
                
                <div class="metric-group">
                    <h4>Performance Score</h4>
                    <div id="score-metric" style="font-size: 16px; font-weight: bold;">Score: <span>-</span></div>
                </div>
            </div>
        `;
        
        // Add CSS for metric groups
        const style = document.createElement('style');
        style.textContent = `
            #performance-dashboard .metric-group {
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(160, 255, 143, 0.1);
            }
            
            #performance-dashboard .metric-group:last-child {
                border-bottom: none;
            }
            
            #performance-dashboard h4 {
                margin: 0 0 6px 0;
                color: #7FE65A;
                font-size: 11px;
                text-transform: uppercase;
            }
            
            #performance-dashboard .metric-group > div {
                margin-bottom: 3px;
                display: flex;
                justify-content: space-between;
            }
            
            #performance-dashboard .metric-group span {
                color: #FFFFFF;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dashboard);
        
        // Setup toggle functionality
        const toggle = document.getElementById('dashboard-toggle');
        let isVisible = false;
        
        toggle.addEventListener('click', () => {
            isVisible = !isVisible;
            dashboard.style.transform = isVisible ? 'translateX(0)' : 'translateX(-320px)';
            toggle.textContent = isVisible ? 'Hide' : 'Show';
        });
        
        // Auto-show after 3 seconds
        setTimeout(() => {
            if (!isVisible) {
                toggle.click();
            }
        }, 3000);
    }

    updateDashboard() {
        // Update INP
        const avgINP = this.getAverageINP();
        const inpElement = document.querySelector('#inp-metric span');
        if (inpElement) {
            inpElement.textContent = avgINP ? `${avgINP.toFixed(0)}ms` : '-';
            inpElement.style.color = avgINP < 200 ? '#7FE65A' : avgINP < 500 ? '#FFD700' : '#FF6B6B';
        }
        
        // Update LCP
        const lcpElement = document.querySelector('#lcp-metric span');
        if (lcpElement && this.metrics.lcp) {
            lcpElement.textContent = `${this.metrics.lcp.toFixed(0)}ms`;
            lcpElement.style.color = this.metrics.lcp < 2500 ? '#7FE65A' : this.metrics.lcp < 4000 ? '#FFD700' : '#FF6B6B';
        }
        
        // Update FID
        const fidElement = document.querySelector('#fid-metric span');
        if (fidElement && this.metrics.fid) {
            fidElement.textContent = `${this.metrics.fid.toFixed(0)}ms`;
            fidElement.style.color = this.metrics.fid < 100 ? '#7FE65A' : this.metrics.fid < 300 ? '#FFD700' : '#FF6B6B';
        }
        
        // Update Navigation Performance
        const avgNav = this.getAverageNavigationTime();
        const navElement = document.querySelector('#nav-metric span');
        if (navElement) {
            navElement.textContent = avgNav ? `${avgNav.toFixed(0)}ms` : '-';
            navElement.style.color = avgNav < 100 ? '#7FE65A' : avgNav < 300 ? '#FFD700' : '#FF6B6B';
        }
        
        // Update Preload Status
        const preloadElement = document.querySelector('#preload-metric span');
        if (preloadElement && window.sitePreloader) {
            const status = window.sitePreloader.getPreloadStatus();
            preloadElement.textContent = `${status.progress.toFixed(0)}%`;
            preloadElement.style.color = status.progress === 100 ? '#7FE65A' : '#FFD700';
        }
        
        // Update Image Performance
        const avgImg = this.getAverageImageLoadTime();
        const imgElement = document.querySelector('#img-metric span');
        if (imgElement) {
            imgElement.textContent = avgImg ? `${avgImg.toFixed(0)}ms` : '-';
            imgElement.style.color = avgImg < 500 ? '#7FE65A' : avgImg < 1000 ? '#FFD700' : '#FF6B6B';
        }
        
        // Update Cached Images
        const cachedElement = document.querySelector('#cached-metric span');
        if (cachedElement && window.sitePreloader) {
            const status = window.sitePreloader.getPreloadStatus();
            cachedElement.textContent = status.cachedImages.length;
            cachedElement.style.color = '#7FE65A';
        }
        
        // Update Performance Score
        const score = this.calculatePerformanceScore();
        const scoreElement = document.querySelector('#score-metric span');
        if (scoreElement) {
            scoreElement.textContent = `${score}/100`;
            scoreElement.style.color = score >= 90 ? '#7FE65A' : score >= 70 ? '#FFD700' : '#FF6B6B';
        }
    }

    getAverageINP() {
        if (this.metrics.interactionDelays.length === 0) return null;
        
        const sum = this.metrics.interactionDelays.reduce((acc, item) => acc + item.delay, 0);
        return sum / this.metrics.interactionDelays.length;
    }

    getAverageNavigationTime() {
        if (this.metrics.navigationTimes.length === 0) return null;
        
        const sum = this.metrics.navigationTimes.reduce((acc, item) => acc + item.duration, 0);
        return sum / this.metrics.navigationTimes.length;
    }

    getAverageImageLoadTime() {
        if (this.metrics.imageLoadTimes.length === 0) return null;
        
        const sum = this.metrics.imageLoadTimes.reduce((acc, item) => acc + item.duration, 0);
        return sum / this.metrics.imageLoadTimes.length;
    }

    calculatePerformanceScore() {
        let score = 100;
        
        // Deduct points for poor metrics
        const avgINP = this.getAverageINP();
        if (avgINP > 200) score -= 25;
        else if (avgINP > 100) score -= 10;
        
        if (this.metrics.lcp > 2500) score -= 20;
        else if (this.metrics.lcp > 1500) score -= 10;
        
        if (this.metrics.fid > 100) score -= 15;
        else if (this.metrics.fid > 50) score -= 5;
        
        const avgNav = this.getAverageNavigationTime();
        if (avgNav > 300) score -= 15;
        else if (avgNav > 100) score -= 5;
        
        const avgImg = this.getAverageImageLoadTime();
        if (avgImg > 1000) score -= 10;
        else if (avgImg > 500) score -= 5;
        
        return Math.max(0, Math.round(score));
    }

    startReporting() {
        // Report metrics every 10 seconds
        setInterval(() => {
            this.generateReport();
        }, 10000);
        
        // Report on page unload
        window.addEventListener('beforeunload', () => {
            this.generateReport();
        });
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            metrics: {
                avgINP: this.getAverageINP(),
                lcp: this.metrics.lcp,
                fid: this.metrics.fid,
                avgNavigationTime: this.getAverageNavigationTime(),
                avgImageLoadTime: this.getAverageImageLoadTime(),
                performanceScore: this.calculatePerformanceScore(),
                totalInteractions: this.metrics.interactionDelays.length,
                totalNavigations: this.metrics.navigationTimes.length,
                totalImagesLoaded: this.metrics.imageLoadTimes.length
            },
            preloadStatus: window.sitePreloader?.getPreloadStatus()
        };
        
        console.log('📊 Performance Report:', report);
        
        // Store in localStorage for analysis
        try {
            const reports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
            reports.push(report);
            
            // Keep only last 20 reports
            if (reports.length > 20) {
                reports.splice(0, reports.length - 20);
            }
            
            localStorage.setItem('performanceReports', JSON.stringify(reports));
        } catch (e) {
            console.warn('Could not store performance report:', e);
        }
        
        return report;
    }

    // Public method to get current metrics
    getMetrics() {
        return {
            ...this.metrics,
            avgINP: this.getAverageINP(),
            avgNavigationTime: this.getAverageNavigationTime(),
            avgImageLoadTime: this.getAverageImageLoadTime(),
            performanceScore: this.calculatePerformanceScore()
        };
    }
}

// Initialize performance dashboard
window.performanceDashboard = new PerformanceDashboard();

// Expose methods for debugging
window.getPerformanceMetrics = () => window.performanceDashboard.getMetrics();
window.generatePerformanceReport = () => window.performanceDashboard.generateReport();