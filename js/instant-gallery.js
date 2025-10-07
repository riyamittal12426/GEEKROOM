// Instant Gallery Implementation for Preloaded Images
class InstantGallery {
    constructor(container, items, preloader) {
        this.container = container;
        this.items = items;
        this.preloader = preloader;
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        // Use preloaded images for instant display
        this.renderInstantly();
        this.setupLightbox();
        this.isInitialized = true;
    }

    renderInstantly() {
        if (!this.container) return;
        
        // Clear container
        this.container.innerHTML = '';
        
        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        this.items.forEach((item, index) => {
            const element = this.createItemElement(item, index);
            fragment.appendChild(element);
        });
        
        // Add all items at once
        this.container.appendChild(fragment);
        
        // Animate items in with staggered effect
        this.animateItemsIn();
    }

    createItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'gallery-item';
        element.dataset.id = item.id;
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Check if image is preloaded
        const cachedImage = this.preloader?.cache.get(item.image);
        const imgSrc = cachedImage?.element?.src || item.image;
        
        element.innerHTML = `
            <div class="image-container">
                <img class="gallery-image" 
                     src="${imgSrc}" 
                     alt="${item.title}"
                     style="opacity: ${cachedImage ? '1' : '0'}; transition: opacity 0.3s ease;">
            </div>
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            </div>
        `;
        
        // If image isn't preloaded, load it now
        if (!cachedImage) {
            const img = element.querySelector('.gallery-image');
            img.onload = () => {
                img.style.opacity = '1';
            };
        }
        
        return element;
    }

    animateItemsIn() {
        const items = this.container.querySelectorAll('.gallery-item');
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxImage = document.getElementById('lightbox-image');

        if (!lightbox || !lightboxClose || !lightboxImage) return;

        // Remove existing listeners
        this.container.removeEventListener('click', this.handleGalleryClick);
        
        // Add new listener
        this.handleGalleryClick = (e) => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const img = item.querySelector('.gallery-image');
                if (img && img.src) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        };
        
        this.container.addEventListener('click', this.handleGalleryClick);

        // Close lightbox handlers
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        lightboxClose.onclick = closeLightbox;
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };

        // Keyboard handler
        document.onkeydown = (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        };
    }

    // Method to add more items dynamically
    addItems(newItems) {
        const fragment = document.createDocumentFragment();
        
        newItems.forEach((item, index) => {
            const element = this.createItemElement(item, this.items.length + index);
            fragment.appendChild(element);
        });
        
        this.container.appendChild(fragment);
        this.items.push(...newItems);
        
        // Animate new items
        const newElements = this.container.querySelectorAll('.gallery-item:not(.animated)');
        newElements.forEach((element, index) => {
            element.classList.add('animated');
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Method to filter items
    filter(filterFn) {
        const items = this.container.querySelectorAll('.gallery-item');
        
        items.forEach((item, index) => {
            const itemData = this.items[index];
            const shouldShow = filterFn(itemData);
            
            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Method to search items
    search(query) {
        const lowercaseQuery = query.toLowerCase();
        
        this.filter(item => 
            item.title.toLowerCase().includes(lowercaseQuery) ||
            item.description.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Cleanup method
    destroy() {
        if (this.container && this.handleGalleryClick) {
            this.container.removeEventListener('click', this.handleGalleryClick);
        }
        this.isInitialized = false;
    }
}

// Gallery data
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
    { id: 13, title: 'Gallery Image 13', description: 'Beautiful moment captured', image: 'photos/13.jpg' }
];

// Initialize gallery when DOM is ready
function initializeInstantGallery() {
    const container = document.getElementById('gallery-grid');
    if (container) {
        const preloader = window.sitePreloader;
        window.instantGallery = new InstantGallery(container, galleryData, preloader);
        console.log('✅ Instant gallery initialized');
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInstantGallery);
} else {
    initializeInstantGallery();
}