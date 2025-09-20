// SplitText Animation - Vanilla JS Implementation
console.log('Loading SplitText Animation script...');

class SplitTextAnimation {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    
    if (!this.element) {
      console.error('SplitTextAnimation: Element not found');
      return;
    }

    // Default configuration
    this.config = {
      delay: options.delay || 100,
      duration: options.duration || 0.6,
      ease: options.ease || 'power3.out',
      splitType: options.splitType || 'chars',
      from: options.from || { opacity: 0, y: 40 },
      to: options.to || { opacity: 1, y: 0 },
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '-100px',
      onComplete: options.onComplete || null,
      once: options.once !== undefined ? options.once : true,
      smartWrap: options.smartWrap !== undefined ? options.smartWrap : true,
      autoSplit: options.autoSplit !== undefined ? options.autoSplit : false
    };

    this.splitInstance = null;
    this.tween = null;
    this.fontsLoaded = false;

    this.init();
  }

  async init() {
    console.log('Initializing SplitText Animation...');
    
    // Wait for fonts to load
    await this.waitForFonts();
    
    // Wait for GSAP to be available
    if (!window.gsap || !window.SplitText) {
      console.warn('GSAP or SplitText not available, waiting...');
      await this.waitForGSAP();
    }

    this.setupAnimation();
  }

  waitForFonts() {
    return new Promise((resolve) => {
      if (document.fonts.status === 'loaded') {
        this.fontsLoaded = true;
        resolve();
      } else {
        document.fonts.ready.then(() => {
          this.fontsLoaded = true;
          resolve();
        });
      }
    });
  }

  waitForGSAP() {
    return new Promise((resolve) => {
      const checkGSAP = () => {
        if (window.gsap && window.SplitText) {
          resolve();
        } else {
          setTimeout(checkGSAP, 100);
        }
      };
      checkGSAP();
    });
  }

  setupAnimation() {
    if (!this.element || !this.fontsLoaded) return;

    console.log('Setting up SplitText animation for:', this.element);

    // Clean up existing instance
    this.cleanup();

    // Calculate scroll trigger start position
    const startPct = (1 - this.config.threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(this.config.rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign = marginValue === 0 ? '' : 
                 marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : 
                 `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    try {
      // Create SplitText instance
      this.splitInstance = new SplitText(this.element, {
        type: this.config.splitType,
        smartWrap: this.config.smartWrap,
        autoSplit: this.config.autoSplit,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false
      });

      // Determine targets based on split type
      let targets = this.getTargets();
      
      if (!targets || targets.length === 0) {
        console.warn('No targets found for animation');
        return;
      }

      console.log(`Animating ${targets.length} ${this.config.splitType}:`, targets);

      // Create animation
      this.tween = gsap.fromTo(
        targets,
        { ...this.config.from },
        {
          ...this.config.to,
          duration: this.config.duration,
          ease: this.config.ease,
          stagger: this.config.delay / 1000,
          scrollTrigger: {
            trigger: this.element,
            start: start,
            once: this.config.once,
            fastScrollEnd: true,
            anticipatePin: 0.4,
            onEnter: () => {
              console.log('SplitText animation triggered');
            }
          },
          onComplete: () => {
            console.log('SplitText animation completed');
            if (this.config.onComplete) {
              this.config.onComplete();
            }
          },
          willChange: 'transform, opacity',
          force3D: true
        }
      );

      // Store reference for cleanup
      this.element._splitTextInstance = this;

      console.log('SplitText animation setup complete');
    } catch (error) {
      console.error('Error setting up SplitText animation:', error);
    }
  }

  getTargets() {
    if (!this.splitInstance) return null;

    let targets;
    
    // Priority order based on splitType
    if (this.config.splitType.includes('chars') && this.splitInstance.chars && this.splitInstance.chars.length) {
      targets = this.splitInstance.chars;
    } else if (this.config.splitType.includes('words') && this.splitInstance.words && this.splitInstance.words.length) {
      targets = this.splitInstance.words;
    } else if (this.config.splitType.includes('lines') && this.splitInstance.lines && this.splitInstance.lines.length) {
      targets = this.splitInstance.lines;
    } else {
      // Fallback to any available split
      targets = this.splitInstance.chars || this.splitInstance.words || this.splitInstance.lines;
    }

    return targets;
  }

  cleanup() {
    // Kill existing scroll triggers
    if (this.element) {
      gsap.getTweensOf(this.element).forEach(tween => tween.kill());
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === this.element) st.kill();
      });
    }

    // Revert SplitText
    if (this.splitInstance) {
      try {
        this.splitInstance.revert();
      } catch (error) {
        console.warn('Error reverting SplitText:', error);
      }
      this.splitInstance = null;
    }

    // Kill tween
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }

    if (this.element) {
      this.element._splitTextInstance = null;
    }
  }

  // Public method to update configuration
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    this.setupAnimation();
  }

  // Public method to restart animation
  restart() {
    this.setupAnimation();
  }

  // Public method to destroy instance
  destroy() {
    this.cleanup();
  }
}

// Utility function to create SplitText animations easily
function createSplitTextAnimation(selector, options = {}) {
  const elements = typeof selector === 'string' ? 
    document.querySelectorAll(selector) : 
    [selector];
  
  const instances = [];
  
  elements.forEach(element => {
    if (element) {
      const instance = new SplitTextAnimation(element, options);
      instances.push(instance);
    }
  });
  
  return instances.length === 1 ? instances[0] : instances;
}

// Export for global use
window.SplitTextAnimation = SplitTextAnimation;
window.createSplitTextAnimation = createSplitTextAnimation;
console.log('SplitTextAnimation class exported to window object');
