// Simple SplitText Implementation for GSAP
console.log('Loading Simple SplitText...');

class SimpleSplitText {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      type: options.type || 'chars',
      smartWrap: options.smartWrap !== undefined ? options.smartWrap : true,
      autoSplit: options.autoSplit !== undefined ? options.autoSplit : false,
      linesClass: options.linesClass || 'split-line',
      wordsClass: options.wordsClass || 'split-word',
      charsClass: options.charsClass || 'split-char',
      reduceWhiteSpace: options.reduceWhiteSpace !== undefined ? options.reduceWhiteSpace : false
    };

    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML = '';

    if (this.element) {
      this.split();
    }
  }

  split() {
    if (!this.element) return;

    this.originalHTML = this.element.innerHTML;
    const text = this.element.textContent || this.element.innerText;
    
    if (!text.trim()) return;

    let html = '';
    
    if (this.options.type.includes('lines')) {
      html = this.splitByLines(text);
    } else if (this.options.type.includes('words')) {
      html = this.splitByWords(text);
    } else if (this.options.type.includes('chars')) {
      html = this.splitByChars(text);
    }

    this.element.innerHTML = html;
    this.collectElements();
  }

  splitByChars(text) {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return ' ';
      }
      return `<span class="${this.options.charsClass}" style="display: inline-block;">${char}</span>`;
    }).join('');
  }

  splitByWords(text) {
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) {
        return word;
      }
      return `<span class="${this.options.wordsClass}" style="display: inline-block;">${word}</span>`;
    }).join('');
  }

  splitByLines(text) {
    // Simple line splitting - in a real implementation this would be more sophisticated
    const words = text.split(' ');
    const wordsPerLine = Math.ceil(words.length / 3); // Rough estimation
    const lines = [];
    
    for (let i = 0; i < words.length; i += wordsPerLine) {
      lines.push(words.slice(i, i + wordsPerLine).join(' '));
    }
    
    return lines.map((line, index) => {
      return `<div class="${this.options.linesClass}" style="overflow: hidden;"><span style="display: inline-block;">${line}</span></div>`;
    }).join('');
  }

  collectElements() {
    if (this.options.type.includes('chars')) {
      this.chars = Array.from(this.element.querySelectorAll(`.${this.options.charsClass}`));
    }
    if (this.options.type.includes('words')) {
      this.words = Array.from(this.element.querySelectorAll(`.${this.options.wordsClass}`));
    }
    if (this.options.type.includes('lines')) {
      this.lines = Array.from(this.element.querySelectorAll(`.${this.options.linesClass}`));
    }
  }

  revert() {
    if (this.element && this.originalHTML) {
      this.element.innerHTML = this.originalHTML;
    }
    this.chars = [];
    this.words = [];
    this.lines = [];
  }
}

// Make it available globally
window.SplitText = SimpleSplitText;
console.log('Simple SplitText implementation loaded');
