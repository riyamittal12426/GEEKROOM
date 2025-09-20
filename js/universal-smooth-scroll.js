// Universal Smooth Scrolling for Entire Website
document.addEventListener('DOMContentLoaded', function() {
    initUniversalSmoothScrolling();
    initNavbarScrollEffects();
    initScrollToTopButton();
});

// Universal smooth scrolling for all links
function initUniversalSmoothScrolling() {
    // Enable CSS smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle all anchor links (both internal and cross-page)
    const allLinks = document.querySelectorAll('a[href]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip external links
            if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                return;
            }
            
            // Handle internal anchor links (same page)
            if (href.startsWith('#')) {
                e.preventDefault();
                smoothScrollToElement(href);
                return;
            }
            
            // Handle cross-page anchor links (e.g., about.html#team)
            if (href.includes('#')) {
                const [page, anchor] = href.split('#');
                
                // If it's the current page, scroll to anchor
                if (isCurrentPage(page)) {
                    e.preventDefault();
                    smoothScrollToElement('#' + anchor);
                    return;
                }
                
                // For cross-page navigation, store the target anchor
                sessionStorage.setItem('scrollTarget', anchor);
                return; // Let the browser handle page navigation
            }
        });
    });
    
    // Check for stored scroll target on page load
    checkForScrollTarget();
}

// Check if the link points to the current page
function isCurrentPage(page) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const targetPage = page || 'index.html';
    
    return currentPage === targetPage || 
           (currentPage === '' && targetPage === 'index.html') ||
           (currentPage === 'index.html' && targetPage === '');
}

// Smooth scroll to element with navbar offset
function smoothScrollToElement(selector) {
    const targetElement = document.querySelector(selector);
    
    if (targetElement) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
        });
        
        // Update URL hash without jumping
        if (selector.startsWith('#')) {
            history.pushState(null, null, selector);
        }
    }
}

// Check for scroll target from cross-page navigation
function checkForScrollTarget() {
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    
    if (scrollTarget) {
        sessionStorage.removeItem('scrollTarget');
        
        // Wait for page to fully load, then scroll
        setTimeout(() => {
            smoothScrollToElement('#' + scrollTarget);
        }, 100);
    }
}

// Universal navbar scroll effects
function initNavbarScrollEffects() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    function updateNavbar() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

// Universal scroll to top button
function initScrollToTopButton() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.title = 'Scroll to top';
    
    // Add click handler
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(scrollButton);
    
    // Show/hide button based on scroll position
    let ticking = false;
    
    function updateScrollButton() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollButton);
            ticking = true;
        }
    });
}

// Smooth scrolling for form submissions (if any)
function initFormSmoothScrolling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // If there's an error or success message, scroll to it
            setTimeout(() => {
                const message = document.querySelector('.success-message, .error-message, .form-message');
                if (message) {
                    smoothScrollToElement(message);
                }
            }, 100);
        });
    });
}

// Initialize form smooth scrolling
initFormSmoothScrolling();

// Smooth scrolling for hash changes (browser back/forward)
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            smoothScrollToElement(hash);
        }, 10);
    }
});

// Handle initial hash on page load
window.addEventListener('load', function() {
    const hash = window.location.hash;
    if (hash) {
        // Prevent default jump, then smooth scroll
        setTimeout(() => {
            smoothScrollToElement(hash);
        }, 100);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Smooth scroll with Page Up/Page Down
    if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        
        const viewportHeight = window.innerHeight;
        const currentScroll = window.pageYOffset;
        const targetScroll = e.key === 'PageUp' 
            ? Math.max(0, currentScroll - viewportHeight * 0.8)
            : currentScroll + viewportHeight * 0.8;
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }
    
    // Smooth scroll to top with Home key
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Smooth scroll to bottom with End key
    if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    }
});

// Export functions for use in other scripts
window.smoothScrollToElement = smoothScrollToElement;
window.initUniversalSmoothScrolling = initUniversalSmoothScrolling;