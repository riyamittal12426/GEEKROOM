// SplashCursor - Fluid Animation Effect
console.log('Loading SplashCursor script...');

class SplashCursor {
  constructor(options = {}) {
    this.config = {
      SIM_RESOLUTION: options.SIM_RESOLUTION || 128,
      DYE_RESOLUTION: options.DYE_RESOLUTION || 1440,
      CAPTURE_RESOLUTION: options.CAPTURE_RESOLUTION || 512,
      DENSITY_DISSIPATION: options.DENSITY_DISSIPATION || 3.5,
      VELOCITY_DISSIPATION: options.VELOCITY_DISSIPATION || 2,
      PRESSURE: options.PRESSURE || 0.1,
      PRESSURE_ITERATIONS: options.PRESSURE_ITERATIONS || 20,
      CURL: options.CURL || 3,
      SPLAT_RADIUS: options.SPLAT_RADIUS || 0.2,
      SPLAT_FORCE: options.SPLAT_FORCE || 6000,
      SHADING: options.SHADING !== undefined ? options.SHADING : true,
      COLOR_UPDATE_SPEED: options.COLOR_UPDATE_SPEED || 10,
      PAUSED: false,
      BACK_COLOR: options.BACK_COLOR || { r: 0.5, g: 0, b: 0 },
      TRANSPARENT: options.TRANSPARENT !== undefined ? options.TRANSPARENT : true
    };

    this.canvas = null;
    this.gl = null;
    this.ext = null;
    this.pointers = [this.createPointer()];
    this.programs = {};
    this.framebuffers = {};
    this.lastUpdateTime = Date.now();
    this.colorUpdateTimer = 0.0;

    this.init();
  }

  createPointer() {
    return {
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: [0, 0, 0]
    };
  }

  init() {
    console.log('Initializing SplashCursor...');
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'fluid-cursor';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      pointer-events: none;
      width: 100vw;
      height: 100vh;
      display: block;
    `;
    document.body.appendChild(this.canvas);
    console.log('Canvas created and added to DOM');

    // Initialize WebGL context
    const webglContext = this.getWebGLContext(this.canvas);
    if (!webglContext) {
      console.warn('WebGL not supported, falling back to simple cursor effect');
      this.fallbackEffect();
      return;
    }

    this.gl = webglContext.gl;
    this.ext = webglContext.ext;
    console.log('WebGL context initialized');

    if (!this.ext.supportLinearFiltering) {
      this.config.DYE_RESOLUTION = 256;
      this.config.SHADING = false;
      console.log('Linear filtering not supported, reducing quality');
    }

    try {
      this.initShaders();
      console.log('Shaders initialized');
      
      this.initPrograms();
      console.log('Programs initialized');
      
      this.updateKeywords();
      console.log('Keywords updated');
      
      this.initFramebuffers();
      console.log('Framebuffers initialized');
      
      this.setupEventListeners();
      console.log('Event listeners setup');
      
      this.updateFrame();
      console.log('Animation loop started');
    } catch (error) {
      console.error('Error during WebGL initialization:', error);
      this.fallbackEffect();
    }
  }

  getWebGLContext(canvas) {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false
    };

    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;
    if (!isWebGL2) {
      gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    }

    if (!gl) {
      console.error('WebGL is not supported in this browser');
      return null;
    }

    console.log('WebGL context created:', isWebGL2 ? 'WebGL2' : 'WebGL1');

    let halfFloat;
    let supportLinearFiltering;
    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat && halfFloat.HALF_FLOAT_OES;
    let formatRGBA, formatRG, formatR;

    if (isWebGL2) {
      formatRGBA = this.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = this.getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = this.getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering
      }
    };
  }

  getSupportedFormat(gl, internalFormat, format, type) {
    if (!this.supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return this.getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return this.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  supportRenderTextureFormat(gl, internalFormat, format, type) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  initShaders() {
    const gl = this.gl;

    this.shaders = {
      baseVertexShader: this.compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `),

      copyShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
      `),

      clearShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
      `),

      splatShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point.xy;
            p.x *= aspectRatio;
            vec3 splat = exp(-dot(p, p) / radius) * color;
            vec3 base = texture2D(uTarget, vUv).xyz;
            gl_FragColor = vec4(base + splat, 1.0);
        }
      `),

      advectionShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform vec2 dyeTexelSize;
        uniform float dt;
        uniform float dissipation;

        vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
            vec2 st = uv / tsize - 0.5;
            vec2 iuv = floor(st);
            vec2 fuv = fract(st);

            vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
            vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
            vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
            vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

            return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
        }

        void main () {
            ${this.ext.supportLinearFiltering ? '' : '#define MANUAL_FILTERING'}
            #ifdef MANUAL_FILTERING
                vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                vec4 result = bilerp(uSource, coord, dyeTexelSize);
            #else
                vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                vec4 result = texture2D(uSource, coord);
            #endif
            float decay = 1.0 + dissipation * dt;
            gl_FragColor = result / decay;
        }
      `),

      divergenceShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).x;
            float R = texture2D(uVelocity, vR).x;
            float T = texture2D(uVelocity, vT).y;
            float B = texture2D(uVelocity, vB).y;

            vec2 C = texture2D(uVelocity, vUv).xy;
            if (vL.x < 0.0) { L = -C.x; }
            if (vR.x > 1.0) { R = -C.x; }
            if (vT.y > 1.0) { T = -C.y; }
            if (vB.y < 0.0) { B = -C.y; }

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
      `),

      curlShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vL).y;
            float R = texture2D(uVelocity, vR).y;
            float T = texture2D(uVelocity, vT).x;
            float B = texture2D(uVelocity, vB).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
      `),

      vorticityShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vL).x;
            float R = texture2D(uCurl, vR).x;
            float T = texture2D(uCurl, vT).x;
            float B = texture2D(uCurl, vB).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            velocity = min(max(velocity, -1000.0), 1000.0);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),

      pressureShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            float C = texture2D(uPressure, vUv).x;
            float divergence = texture2D(uDivergence, vUv).x;
            float pressure = (L + R + B + T - divergence) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
      `),

      gradientSubtractShader: this.compileShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        varying highp vec2 vL;
        varying highp vec2 vR;
        varying highp vec2 vT;
        varying highp vec2 vB;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vL).x;
            float R = texture2D(uPressure, vR).x;
            float T = texture2D(uPressure, vT).x;
            float B = texture2D(uPressure, vB).x;
            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
      `),

      displayShaderSource: `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform sampler2D uTexture;
        uniform vec2 texelSize;

        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            ${this.config.SHADING ? `
                vec3 lc = texture2D(uTexture, vL).rgb;
                vec3 rc = texture2D(uTexture, vR).rgb;
                vec3 tc = texture2D(uTexture, vT).rgb;
                vec3 bc = texture2D(uTexture, vB).rgb;

                float dx = length(rc) - length(lc);
                float dy = length(tc) - length(bc);

                vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                vec3 l = vec3(0.0, 0.0, 1.0);

                float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                c *= diffuse;
            ` : ''}

            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
      `
    };
  }

  compileShader(type, source, keywords) {
    source = this.addKeywords(source, keywords);
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  addKeywords(source, keywords) {
    if (!keywords) return source;
    let keywordsString = '';
    keywords.forEach(keyword => {
      keywordsString += '#define ' + keyword + '\n';
    });
    return keywordsString + source;
  }

  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(program));
    }
    return program;
  }

  getUniforms(program) {
    const uniforms = {};
    const uniformCount = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = this.gl.getActiveUniform(program, i).name;
      uniforms[uniformName] = this.gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }

  initPrograms() {
    const gl = this.gl;
    const shaders = this.shaders;

    this.programs = {
      copy: {
        program: this.createProgram(shaders.baseVertexShader, shaders.copyShader),
        uniforms: null
      },
      clear: {
        program: this.createProgram(shaders.baseVertexShader, shaders.clearShader),
        uniforms: null
      },
      splat: {
        program: this.createProgram(shaders.baseVertexShader, shaders.splatShader),
        uniforms: null
      },
      advection: {
        program: this.createProgram(shaders.baseVertexShader, shaders.advectionShader),
        uniforms: null
      },
      divergence: {
        program: this.createProgram(shaders.baseVertexShader, shaders.divergenceShader),
        uniforms: null
      },
      curl: {
        program: this.createProgram(shaders.baseVertexShader, shaders.curlShader),
        uniforms: null
      },
      vorticity: {
        program: this.createProgram(shaders.baseVertexShader, shaders.vorticityShader),
        uniforms: null
      },
      pressure: {
        program: this.createProgram(shaders.baseVertexShader, shaders.pressureShader),
        uniforms: null
      },
      gradientSubtract: {
        program: this.createProgram(shaders.baseVertexShader, shaders.gradientSubtractShader),
        uniforms: null
      },
      display: {
        program: this.createProgram(shaders.baseVertexShader, this.compileShader(gl.FRAGMENT_SHADER, shaders.displayShaderSource)),
        uniforms: null
      }
    };

    // Get uniforms for all programs
    Object.keys(this.programs).forEach(key => {
      this.programs[key].uniforms = this.getUniforms(this.programs[key].program);
    });

    this.setupBlit();
  }

  setupBlit() {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    this.blit = (target, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  }

  updateKeywords() {
    // Update display material with current config
    const displayKeywords = [];
    if (this.config.SHADING) displayKeywords.push('SHADING');
    // Recreate display program if needed
  }

  initFramebuffers() {
    const simRes = this.getResolution(this.config.SIM_RESOLUTION);
    const dyeRes = this.getResolution(this.config.DYE_RESOLUTION);
    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;
    
    this.gl.disable(this.gl.BLEND);

    this.framebuffers = {
      dye: this.createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering),
      velocity: this.createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering),
      divergence: this.createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST),
      curl: this.createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST),
      pressure: this.createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST)
    };
  }

  createFBO(w, h, internalFormat, format, type, param) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX: 1.0 / w,
      texelSizeY: 1.0 / h,
      attach(id) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      }
    };
  }

  createDoubleFBO(w, h, internalFormat, format, type, param) {
    let fbo1 = this.createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = this.createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      }
    };
  }

  setupEventListeners() {
    // Mouse events
    window.addEventListener('mousedown', (e) => {
      const pointer = this.pointers[0];
      const posX = this.scaleByPixelRatio(e.clientX);
      const posY = this.scaleByPixelRatio(e.clientY);
      this.updatePointerDownData(pointer, -1, posX, posY);
      this.clickSplat(pointer);
    });

    window.addEventListener('mousemove', (e) => {
      const pointer = this.pointers[0];
      const posX = this.scaleByPixelRatio(e.clientX);
      const posY = this.scaleByPixelRatio(e.clientY);
      const color = pointer.color;
      this.updatePointerMoveData(pointer, posX, posY, color);
    });

    // Touch events
    window.addEventListener('touchstart', (e) => {
      const touches = e.targetTouches;
      const pointer = this.pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const posX = this.scaleByPixelRatio(touches[i].clientX);
        const posY = this.scaleByPixelRatio(touches[i].clientY);
        this.updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
    });

    window.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touches = e.targetTouches;
      const pointer = this.pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const posX = this.scaleByPixelRatio(touches[i].clientX);
        const posY = this.scaleByPixelRatio(touches[i].clientY);
        this.updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      const pointer = this.pointers[0];
      this.updatePointerUpData(pointer);
    });
  }

  updateFrame = () => {
    const dt = this.calcDeltaTime();
    if (this.resizeCanvas()) this.initFramebuffers();
    this.updateColors(dt);
    this.applyInputs();
    this.step(dt);
    this.render(null);
    requestAnimationFrame(this.updateFrame);
  }

  calcDeltaTime() {
    const now = Date.now();
    let dt = (now - this.lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    this.lastUpdateTime = now;
    return dt;
  }

  resizeCanvas() {
    const width = this.scaleByPixelRatio(window.innerWidth);
    const height = this.scaleByPixelRatio(window.innerHeight);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = window.innerWidth + 'px';
      this.canvas.style.height = window.innerHeight + 'px';
      console.log(`Canvas resized to ${width}x${height}`);
      return true;
    }
    return false;
  }

  updateColors(dt) {
    this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
    if (this.colorUpdateTimer >= 1) {
      this.colorUpdateTimer = this.wrap(this.colorUpdateTimer, 0, 1);
      this.pointers.forEach(p => {
        p.color = this.generateColor();
      });
    }
  }

  applyInputs() {
    this.pointers.forEach(p => {
      if (p.moved) {
        p.moved = false;
        this.splatPointer(p);
      }
    });
  }

  step(dt) {
    const gl = this.gl;
    const programs = this.programs;
    const framebuffers = this.framebuffers;

    gl.disable(gl.BLEND);

    // Curl
    gl.useProgram(programs.curl.program);
    gl.uniform2f(programs.curl.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    gl.uniform1i(programs.curl.uniforms.uVelocity, framebuffers.velocity.read.attach(0));
    this.blit(framebuffers.curl);

    // Vorticity
    gl.useProgram(programs.vorticity.program);
    gl.uniform2f(programs.vorticity.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    gl.uniform1i(programs.vorticity.uniforms.uVelocity, framebuffers.velocity.read.attach(0));
    gl.uniform1i(programs.vorticity.uniforms.uCurl, framebuffers.curl.attach(1));
    gl.uniform1f(programs.vorticity.uniforms.curl, this.config.CURL);
    gl.uniform1f(programs.vorticity.uniforms.dt, dt);
    this.blit(framebuffers.velocity.write);
    framebuffers.velocity.swap();

    // Divergence
    gl.useProgram(programs.divergence.program);
    gl.uniform2f(programs.divergence.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    gl.uniform1i(programs.divergence.uniforms.uVelocity, framebuffers.velocity.read.attach(0));
    this.blit(framebuffers.divergence);

    // Clear pressure
    gl.useProgram(programs.clear.program);
    gl.uniform1i(programs.clear.uniforms.uTexture, framebuffers.pressure.read.attach(0));
    gl.uniform1f(programs.clear.uniforms.value, this.config.PRESSURE);
    this.blit(framebuffers.pressure.write);
    framebuffers.pressure.swap();

    // Pressure
    gl.useProgram(programs.pressure.program);
    gl.uniform2f(programs.pressure.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    gl.uniform1i(programs.pressure.uniforms.uDivergence, framebuffers.divergence.attach(0));
    for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(programs.pressure.uniforms.uPressure, framebuffers.pressure.read.attach(1));
      this.blit(framebuffers.pressure.write);
      framebuffers.pressure.swap();
    }

    // Gradient subtract
    gl.useProgram(programs.gradientSubtract.program);
    gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, framebuffers.pressure.read.attach(0));
    gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, framebuffers.velocity.read.attach(1));
    this.blit(framebuffers.velocity.write);
    framebuffers.velocity.swap();

    // Advection velocity
    gl.useProgram(programs.advection.program);
    gl.uniform2f(programs.advection.uniforms.texelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    if (!this.ext.supportLinearFiltering) {
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, framebuffers.velocity.texelSizeX, framebuffers.velocity.texelSizeY);
    }
    const velocityId = framebuffers.velocity.read.attach(0);
    gl.uniform1i(programs.advection.uniforms.uVelocity, velocityId);
    gl.uniform1i(programs.advection.uniforms.uSource, velocityId);
    gl.uniform1f(programs.advection.uniforms.dt, dt);
    gl.uniform1f(programs.advection.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
    this.blit(framebuffers.velocity.write);
    framebuffers.velocity.swap();

    // Advection dye
    if (!this.ext.supportLinearFiltering) {
      gl.uniform2f(programs.advection.uniforms.dyeTexelSize, framebuffers.dye.texelSizeX, framebuffers.dye.texelSizeY);
    }
    gl.uniform1i(programs.advection.uniforms.uVelocity, framebuffers.velocity.read.attach(0));
    gl.uniform1i(programs.advection.uniforms.uSource, framebuffers.dye.read.attach(1));
    gl.uniform1f(programs.advection.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
    this.blit(framebuffers.dye.write);
    framebuffers.dye.swap();
  }

  render(target) {
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
    this.drawDisplay(target);
  }

  drawDisplay(target) {
    const gl = this.gl;
    const width = target == null ? gl.drawingBufferWidth : target.width;
    const height = target == null ? gl.drawingBufferHeight : target.height;
    
    gl.useProgram(this.programs.display.program);
    if (this.config.SHADING) {
      gl.uniform2f(this.programs.display.uniforms.texelSize, 1.0 / width, 1.0 / height);
    }
    gl.uniform1i(this.programs.display.uniforms.uTexture, this.framebuffers.dye.read.attach(0));
    this.blit(target);
  }

  splatPointer(pointer) {
    const dx = pointer.deltaX * this.config.SPLAT_FORCE;
    const dy = pointer.deltaY * this.config.SPLAT_FORCE;
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  clickSplat(pointer) {
    const color = this.generateColor();
    color.r *= 10.0;
    color.g *= 10.0;
    color.b *= 10.0;
    const dx = 10 * (Math.random() - 0.5);
    const dy = 30 * (Math.random() - 0.5);
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
  }

  splat(x, y, dx, dy, color) {
    const gl = this.gl;
    const programs = this.programs;
    const framebuffers = this.framebuffers;

    gl.useProgram(programs.splat.program);
    gl.uniform1i(programs.splat.uniforms.uTarget, framebuffers.velocity.read.attach(0));
    gl.uniform1f(programs.splat.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    gl.uniform2f(programs.splat.uniforms.point, x, y);
    gl.uniform3f(programs.splat.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(programs.splat.uniforms.radius, this.correctRadius(this.config.SPLAT_RADIUS / 100.0));
    this.blit(framebuffers.velocity.write);
    framebuffers.velocity.swap();

    gl.uniform1i(programs.splat.uniforms.uTarget, framebuffers.dye.read.attach(0));
    gl.uniform3f(programs.splat.uniforms.color, color.r, color.g, color.b);
    this.blit(framebuffers.dye.write);
    framebuffers.dye.swap();
  }

  correctRadius(radius) {
    const aspectRatio = this.canvas.width / this.canvas.height;
    if (aspectRatio > 1) radius *= aspectRatio;
    return radius;
  }

  updatePointerDownData(pointer, id, posX, posY) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / this.canvas.width;
    pointer.texcoordY = 1.0 - posY / this.canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = this.generateColor();
  }

  updatePointerMoveData(pointer, posX, posY, color) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / this.canvas.width;
    pointer.texcoordY = 1.0 - posY / this.canvas.height;
    pointer.deltaX = this.correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = this.correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    pointer.color = color;
  }

  updatePointerUpData(pointer) {
    pointer.down = false;
  }

  correctDeltaX(delta) {
    const aspectRatio = this.canvas.width / this.canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  correctDeltaY(delta) {
    const aspectRatio = this.canvas.width / this.canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }

  generateColor() {
    const c = this.HSVtoRGB(Math.random(), 1.0, 1.0);
    c.r *= 0.15;
    c.g *= 0.15;
    c.b *= 0.15;
    return c;
  }

  HSVtoRGB(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
      default: r = g = b = 0;
    }
    return { r, g, b };
  }

  wrap(value, min, max) {
    const range = max - min;
    if (range === 0) return min;
    return ((value - min) % range) + min;
  }

  getResolution(resolution) {
    let aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    if (this.gl.drawingBufferWidth > this.gl.drawingBufferHeight) {
      return { width: max, height: min };
    } else {
      return { width: min, height: max };
    }
  }

  scaleByPixelRatio(input) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  fallbackEffect() {
    // Simple fallback for browsers without WebGL support
    console.log('Initializing fallback cursor effect');
    
    const style = document.createElement('style');
    style.textContent = `
      body {
        cursor: none !important;
      }
      body * {
        cursor: none !important;
      }
      
      .splash-cursor-fallback {
        position: fixed;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, rgba(160, 255, 143, 0.8) 0%, rgba(106, 176, 76, 0.6) 30%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: screen;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease, scale 0.2s ease;
        box-shadow: 0 0 20px rgba(160, 255, 143, 0.5);
      }
      
      .splash-cursor-fallback.active {
        transform: translate(-50%, -50%) scale(1.5);
        background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(160, 255, 143, 0.8) 40%, transparent 70%);
      }
      
      @keyframes splash-ripple {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(3);
          opacity: 0;
        }
      }
      
      .splash-cursor-ripple {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid rgba(160, 255, 143, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        animation: splash-ripple 0.6s ease-out forwards;
      }
    `;
    document.head.appendChild(style);

    // Create cursor element
    const cursor = document.createElement('div');
    cursor.className = 'splash-cursor-fallback';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Add click effect
    document.addEventListener('mousedown', (e) => {
      cursor.classList.add('active');
      
      // Create ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'splash-cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('active');
    });

    // Touch events for mobile
    document.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
      cursor.classList.add('active');
      
      const ripple = document.createElement('div');
      ripple.className = 'splash-cursor-ripple';
      ripple.style.left = touch.clientX + 'px';
      ripple.style.top = touch.clientY + 'px';
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });

    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      cursor.style.left = touch.clientX + 'px';
      cursor.style.top = touch.clientY + 'px';
    });

    document.addEventListener('touchend', () => {
      cursor.classList.remove('active');
    });

    console.log('Fallback cursor effect initialized');
  }

  destroy() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Export for global use
window.SplashCursor = SplashCursor;
console.log('SplashCursor class exported to window object');
