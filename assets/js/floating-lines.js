/* ===================================================================
   Floating Lines — o fundo animado da hero
   -------------------------------------------------------------------
   Porte do componente <FloatingLines /> (React Bits) para WebGL puro.
   O shader é o mesmo do original; o que sai é o three.js: aqui só é
   preciso um triângulo de tela cheia e um punhado de uniforms, e a
   página é estática — não vale ~600 KB de biblioteca para desenhar
   um quad.

   Três ondas de linhas (topo, meio, base) sobem e descem em senoides,
   entortam perto do cursor e deslizam de leve em parallax. As cores
   vêm da paleta do site (azul → ciano → violeta), e o canvas entra
   com `mix-blend-mode: screen` para somar luz ao fundo quase preto
   em vez de tapá-lo.

   Uso:
     var lines = FloatingLines.mount(container, { ...opções });
     lines.destroy();

   Devolve `null` — sem quebrar nada — quando não há WebGL: o fundo
   da hero continua sendo o gradiente do CSS.
=================================================================== */
(function (global) {
  'use strict';

  var MAX_GRADIENT_STOPS = 8;

  /* Teto dos laços do shader. GLSL ES 1.00 exige limite constante em
     `for`, então o laço vai até o teto e o `break` corta na contagem
     real de linhas de cada onda. */
  var MAX_LINES = 64;

  var VERTEX_SHADER = [
    'attribute vec2 position;',
    '',
    'void main() {',
    '  gl_Position = vec4(position, 0.0, 1.0);',
    '}',
  ].join('\n');

  var FRAGMENT_SHADER = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    '',
    'const int MAX_LINES = ' + MAX_LINES + ';',
    '',
    'uniform float iTime;',
    'uniform vec3  iResolution;',
    'uniform float animationSpeed;',
    '',
    'uniform bool enableTop;',
    'uniform bool enableMiddle;',
    'uniform bool enableBottom;',
    '',
    'uniform int topLineCount;',
    'uniform int middleLineCount;',
    'uniform int bottomLineCount;',
    '',
    'uniform float topLineDistance;',
    'uniform float middleLineDistance;',
    'uniform float bottomLineDistance;',
    '',
    'uniform vec3 topWavePosition;',
    'uniform vec3 middleWavePosition;',
    'uniform vec3 bottomWavePosition;',
    '',
    'uniform vec2 iMouse;',
    'uniform bool interactive;',
    'uniform float bendRadius;',
    'uniform float bendStrength;',
    'uniform float bendInfluence;',
    '',
    'uniform bool parallax;',
    'uniform vec2 parallaxOffset;',
    '',
    'uniform vec3 lineGradient[' + MAX_GRADIENT_STOPS + '];',
    'uniform int lineGradientCount;',
    'uniform bool lightMode;',
    '',
    'const vec3 BLACK = vec3(0.0);',
    'const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;',
    'const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;',
    '',
    'mat2 rotate(float r) {',
    '  return mat2(cos(r), sin(r), -sin(r), cos(r));',
    '}',
    '',
    '/* Fundo de origem do shader: só entra quando nenhum gradiente de',
    '   linhas é informado. */',
    'vec3 background_color(vec2 uv) {',
    '  vec3 col = vec3(0.0);',
    '',
    '  float y = sin(uv.x - 0.2) * 0.3 - 0.1;',
    '  float m = uv.y - y;',
    '',
    '  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));',
    '  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));',
    '  return col * 0.5;',
    '}',
    '',
    '/* `t` é a posição da linha dentro da onda (0 → 1): é ela que',
    '   percorre a rampa de cores da paleta. */',
    'vec3 getLineColor(float t, vec3 baseColor) {',
    '  if (lineGradientCount <= 0) {',
    '    return baseColor;',
    '  }',
    '',
    '  vec3 gradientColor;',
    '',
    '  if (lineGradientCount == 1) {',
    '    gradientColor = lineGradient[0];',
    '  } else {',
    '    float clampedT = clamp(t, 0.0, 0.9999);',
    '    float scaled = clampedT * float(lineGradientCount - 1);',
    '    int idx = int(floor(scaled));',
    '    float f = fract(scaled);',
    '    /* `min` só existe para float em GLSL ES 1.00. */',
    '    int last = lineGradientCount - 1;',
    '    int idx2 = idx + 1 > last ? last : idx + 1;',
    '',
    '    vec3 c1 = lineGradient[0];',
    '    vec3 c2 = lineGradient[0];',
    '',
    '    /* Índice variável em array de uniform não é indexação válida',
    '       em GLSL ES 1.00: o par de cores sai de uma varredura com',
    '       limite constante. */',
    '    for (int i = 0; i < ' + MAX_GRADIENT_STOPS + '; ++i) {',
    '      if (i >= lineGradientCount) break;',
    '      if (i == idx) c1 = lineGradient[i];',
    '      if (i == idx2) c2 = lineGradient[i];',
    '    }',
    '',
    '    gradientColor = mix(c1, c2, f);',
    '  }',
    '',
    '  return gradientColor * 0.5;',
    '}',
    '',
    '/* Uma linha: a senoide, a entortada em volta do cursor e a queda',
    '   de brilho conforme o pixel se afasta dela. */',
    'float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {',
    '  float time = iTime * animationSpeed;',
    '',
    '  float x_offset   = offset;',
    '  float x_movement = time * 0.1;',
    '  float amp        = sin(offset + time * 0.2) * 0.3;',
    '  float y          = sin(uv.x + x_offset + x_movement) * amp;',
    '',
    '  if (shouldBend) {',
    '    vec2 d = screenUv - mouseUv;',
    '    float influence = exp(-dot(d, d) * bendRadius);',
    '    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;',
    '    y += bendOffset;',
    '  }',
    '',
    '  float m = uv.y - y;',
    '  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;',
    '}',
    '',
    'void main() {',
    '  vec2 baseUv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;',
    '  baseUv.y *= -1.0;',
    '',
    '  if (parallax) {',
    '    baseUv += parallaxOffset;',
    '  }',
    '',
    '  vec3 col = vec3(0.0);',
    '',
    '  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);',
    '',
    '  vec2 mouseUv = vec2(0.0);',
    '  if (interactive) {',
    '    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;',
    '    mouseUv.y *= -1.0;',
    '  }',
    '',
    '  if (enableBottom) {',
    '    for (int i = 0; i < MAX_LINES; ++i) {',
    '      if (i >= bottomLineCount) break;',
    '      float fi = float(i);',
    '      float t = fi / max(float(bottomLineCount - 1), 1.0);',
    '      vec3 lineCol = getLineColor(t, b);',
    '',
    '      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);',
    '      vec2 ruv = baseUv * rotate(angle);',
    '      col += lineCol * wave(',
    '        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),',
    '        1.5 + 0.2 * fi,',
    '        baseUv,',
    '        mouseUv,',
    '        interactive',
    '      ) * 0.2;',
    '    }',
    '  }',
    '',
    '  if (enableMiddle) {',
    '    for (int i = 0; i < MAX_LINES; ++i) {',
    '      if (i >= middleLineCount) break;',
    '      float fi = float(i);',
    '      float t = fi / max(float(middleLineCount - 1), 1.0);',
    '      vec3 lineCol = getLineColor(t, b);',
    '',
    '      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);',
    '      vec2 ruv = baseUv * rotate(angle);',
    '      col += lineCol * wave(',
    '        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),',
    '        2.0 + 0.15 * fi,',
    '        baseUv,',
    '        mouseUv,',
    '        interactive',
    '      );',
    '    }',
    '  }',
    '',
    '  if (enableTop) {',
    '    for (int i = 0; i < MAX_LINES; ++i) {',
    '      if (i >= topLineCount) break;',
    '      float fi = float(i);',
    '      float t = fi / max(float(topLineCount - 1), 1.0);',
    '      vec3 lineCol = getLineColor(t, b);',
    '',
    '      float angle = topWavePosition.z * log(length(baseUv) + 1.0);',
    '      vec2 ruv = baseUv * rotate(angle);',
    '      ruv.x *= -1.0;',
    '      col += lineCol * wave(',
    '        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),',
    '        1.0 + 0.2 * fi,',
    '        baseUv,',
    '        mouseUv,',
    '        interactive',
    '      ) * 0.1;',
    '    }',
    '  }',
    '',
    '  if (lightMode) {',
    '    vec3 energy = max(col, vec3(0.0));',
    '    float peak = max(energy.r, max(energy.g, energy.b));',
    '    float coverage = smoothstep(0.018, 0.5, peak);',
    '    vec3 chroma = clamp(energy / max(peak, 0.0001), 0.0, 1.0);',
    '    chroma = pow(chroma, vec3(1.35));',
    '    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));',
    '    chroma /= max(chromaPeak, 0.0001);',
    '    vec3 ink = mix(chroma, clamp(chroma * 0.82, 0.0, 1.0), smoothstep(0.5, 1.0, coverage));',
    '    gl_FragColor = vec4(mix(vec3(1.0), ink, coverage * 0.94), 1.0);',
    '  } else {',
    '    gl_FragColor = vec4(col, 1.0);',
    '  }',
    '}',
  ].join('\n');

  var WAVES = ['top', 'middle', 'bottom'];

  /* '#0a56fa' → [0.039, 0.337, 0.980] */
  var hexToRgb = function (hex) {
    var value = String(hex).trim().replace(/^#/, '');

    if (value.length === 3) {
      value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }
    if (value.length !== 6 || /[^0-9a-f]/i.test(value)) {
      return [1, 1, 1];
    }

    return [
      parseInt(value.slice(0, 2), 16) / 255,
      parseInt(value.slice(2, 4), 16) / 255,
      parseInt(value.slice(4, 6), 16) / 255,
    ];
  };

  var compile = function (gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  var buildProgram = function (gl) {
    var vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    var fragment = vertex && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!fragment) {
      if (vertex) gl.deleteShader(vertex);
      return null;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    /* Os shaders já estão dentro do programa ligado: as referências
       soltas podem ir embora. */
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    return program;
  };

  var getContext = function (canvas) {
    var attributes = {
      alpha: false,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: false,
    };

    try {
      return (
        canvas.getContext('webgl', attributes) ||
        canvas.getContext('experimental-webgl', attributes)
      );
    } catch (error) {
      return null;
    }
  };

  var lerp = function (from, to, amount) {
    return from + (to - from) * amount;
  };

  var mount = function (container, options) {
    if (!container) return null;

    var opts = options || {};
    var waves = opts.enabledWaves || WAVES;

    var enabled = function (name) {
      return waves.indexOf(name) !== -1;
    };

    /* lineCount/lineDistance aceitam um número (vale para as três
       ondas) ou uma lista na ordem de `enabledWaves`. */
    var countOf = function (name) {
      if (!enabled(name)) return 0;
      if (typeof opts.lineCount === 'number') return opts.lineCount;

      var list = opts.lineCount || [6];
      var value = list[waves.indexOf(name)];
      return Math.min(value === undefined ? 6 : value, MAX_LINES);
    };

    var distanceOf = function (name) {
      if (!enabled(name)) return 0.01;
      if (typeof opts.lineDistance === 'number') return opts.lineDistance * 0.01;

      var list = opts.lineDistance || [5];
      var value = list[waves.indexOf(name)];
      return (value === undefined ? 0.1 : value) * 0.01;
    };

    var positionOf = function (given, x, y, rotate) {
      var p = given || {};
      return [
        p.x === undefined ? x : p.x,
        p.y === undefined ? y : p.y,
        p.rotate === undefined ? rotate : p.rotate,
      ];
    };

    var bottomGiven =
      opts.bottomWavePosition === undefined
        ? { x: 2.0, y: -0.7, rotate: -1 }
        : opts.bottomWavePosition;

    var animationSpeed = opts.animationSpeed === undefined ? 1 : opts.animationSpeed;
    var bendRadius = opts.bendRadius === undefined ? 10.0 : opts.bendRadius;
    var bendStrength = opts.bendStrength === undefined ? -5.0 : opts.bendStrength;
    var damping = opts.mouseDamping === undefined ? 0.05 : opts.mouseDamping;
    var parallaxStrength =
      opts.parallaxStrength === undefined ? 0.2 : opts.parallaxStrength;
    var parallax = opts.parallax !== false;
    var lightMode = opts.lightMode === true;

    /* Parallax de rolagem: a camada não acompanha o conteúdo, o campo
       de linhas é que desliza — devagar — conforme a página desce.
       Quanto ele anda é `scrollStrength`, em unidades de uv; o que
       serve de curso muda com o tipo de camada, ver `scrollShift`. */
    var scrollParallax = opts.scrollParallax === true;
    var scrollStrength =
      opts.scrollStrength === undefined ? 0.15 : opts.scrollStrength;

    /* O uniform `parallax` do shader liga o deslocamento do uv, venha
       ele do cursor ou da rolagem. */
    var anyParallax = parallax || scrollParallax;

    /* As linhas se somam umas às outras: onde várias se cruzam, os três
       canais estouram em 1.0 e a cor vira branco acinzentado — some a
       identidade. `intensity` escurece a paleta antes de subir para a
       GPU, então mesmo o miolo dos feixes continua saturado. */
    var intensity = opts.intensity === undefined ? 1 : opts.intensity;

    /* Com "reduzir movimento" ligado o efeito continua na tela, mas
       congelado: nada de animação nem de reação ao cursor. */
    var reduceMotion =
      global.matchMedia &&
      global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var interactive = opts.interactive !== false && !reduceMotion;

    var fixedLayer =
      global.getComputedStyle(container).position === 'fixed';

    var canvas = document.createElement('canvas');
    canvas.className = 'floating-lines__canvas';
    canvas.setAttribute('aria-hidden', 'true');

    var gl = getContext(canvas);
    if (!gl) return null;

    var program = buildProgram(gl);
    if (!program) {
      var lost = gl.getExtension('WEBGL_lose_context');
      if (lost) lost.loseContext();
      return null;
    }

    gl.useProgram(program);

    /* Um triângulo maior que a tela cobre o viewport inteiro com três
       vértices — não faz falta um quad de dois triângulos. */
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    var attribute = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);

    var uniform = function (name) {
      return gl.getUniformLocation(program, name);
    };

    var iTime = uniform('iTime');
    var iResolution = uniform('iResolution');
    var iMouse = uniform('iMouse');
    var bendInfluence = uniform('bendInfluence');
    var parallaxOffset = uniform('parallaxOffset');

    gl.uniform1f(uniform('animationSpeed'), animationSpeed);

    gl.uniform1i(uniform('enableTop'), enabled('top') ? 1 : 0);
    gl.uniform1i(uniform('enableMiddle'), enabled('middle') ? 1 : 0);
    gl.uniform1i(uniform('enableBottom'), enabled('bottom') ? 1 : 0);

    gl.uniform1i(uniform('topLineCount'), countOf('top'));
    gl.uniform1i(uniform('middleLineCount'), countOf('middle'));
    gl.uniform1i(uniform('bottomLineCount'), countOf('bottom'));

    gl.uniform1f(uniform('topLineDistance'), distanceOf('top'));
    gl.uniform1f(uniform('middleLineDistance'), distanceOf('middle'));
    gl.uniform1f(uniform('bottomLineDistance'), distanceOf('bottom'));

    gl.uniform3fv(
      uniform('topWavePosition'),
      positionOf(opts.topWavePosition, 10.0, 0.5, -0.4),
    );
    gl.uniform3fv(
      uniform('middleWavePosition'),
      positionOf(opts.middleWavePosition, 5.0, 0.0, 0.2),
    );
    gl.uniform3fv(
      uniform('bottomWavePosition'),
      positionOf(bottomGiven, 2.0, -0.7, 0.4),
    );

    gl.uniform1i(uniform('interactive'), interactive ? 1 : 0);
    gl.uniform1f(uniform('bendRadius'), bendRadius);
    gl.uniform1f(uniform('bendStrength'), bendStrength);
    gl.uniform1f(bendInfluence, 0);

    gl.uniform1i(uniform('parallax'), anyParallax ? 1 : 0);
    gl.uniform2f(parallaxOffset, 0, 0);

    gl.uniform1i(uniform('lightMode'), lightMode ? 1 : 0);

    var stops = (opts.linesGradient || []).slice(0, MAX_GRADIENT_STOPS);
    var gradient = new Float32Array(MAX_GRADIENT_STOPS * 3);
    for (var i = 0; i < MAX_GRADIENT_STOPS; i += 1) {
      var rgb = i < stops.length ? hexToRgb(stops[i]) : [1, 1, 1];
      gradient[i * 3] = rgb[0] * intensity;
      gradient[i * 3 + 1] = rgb[1] * intensity;
      gradient[i * 3 + 2] = rgb[2] * intensity;
    }
    gl.uniform3fv(uniform('lineGradient[0]'), gradient);
    gl.uniform1i(uniform('lineGradientCount'), stops.length);

    gl.uniform2f(iMouse, -1000, -1000);
    gl.uniform1f(iTime, 0);

    container.appendChild(canvas);

    /* ------------------------------------------------------------
       Tamanho
    ------------------------------------------------------------ */
    var setSize = function () {
      var ratio = Math.min(global.devicePixelRatio || 1, 2);
      var width = Math.max(1, Math.round((container.clientWidth || 1) * ratio));
      var height = Math.max(1, Math.round((container.clientHeight || 1) * ratio));

      measure();

      if (canvas.width === width && canvas.height === height) return;

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform3f(iResolution, width, height, 1);
    };

    /* ------------------------------------------------------------
       Cursor — o alvo é a hero inteira, não o canvas: ele fica atrás
       do conteúdo e sem eventos de ponteiro.
    ------------------------------------------------------------ */
    var pointerTarget = opts.pointerTarget || container;

    var mouse = [-1000, -1000];
    var mouseTarget = [-1000, -1000];
    var influence = 0;
    var influenceTarget = 0;
    var offset = [0, 0];
    var offsetTarget = [0, 0];

    var onPointerMove = function (event) {
      var rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var x = event.clientX - rect.left;
      var y = event.clientY - rect.top;
      var ratio = canvas.width / rect.width;

      mouseTarget[0] = x * ratio;
      mouseTarget[1] = (rect.height - y) * ratio;
      influenceTarget = 1;

      if (parallax) {
        offsetTarget[0] = ((x - rect.width / 2) / rect.width) * parallaxStrength;
        offsetTarget[1] = (-(y - rect.height / 2) / rect.height) * parallaxStrength;
      }
    };

    var onPointerLeave = function () {
      influenceTarget = 0;
    };

    if (interactive) {
      pointerTarget.addEventListener('pointermove', onPointerMove, {
        passive: true,
      });
      pointerTarget.addEventListener('pointerleave', onPointerLeave, {
        passive: true,
      });
    }

    /* ------------------------------------------------------------
       Laço — só roda com a hero na tela e a aba à frente. Um shader
       desenhando enquanto a pessoa lê o rodapé é bateria no lixo.
    ------------------------------------------------------------ */
    var frame = 0;
    var running = false;
    var onScreen = true;
    var elapsed = 0;
    var last = 0;

    /* Posição do container no documento, medida só no resize. Ler o
       rect a cada quadro forçaria layout 60 vezes por segundo. Numa
       camada `fixed` não existe "posição no documento": meia tela de
       referência faz a conta virar o deslocamento puro da rolagem. */
    var docTop = 0;
    var measure = function () {
      var height = global.innerHeight || 1;
      docTop = fixedLayer
        ? height / 2
        : container.getBoundingClientRect().top + (global.pageYOffset || 0);
    };

    var scrollShift = function () {
      if (!scrollParallax) return 0;

      var height = global.innerHeight || 1;
      var scrolled = global.pageYOffset || 0;

      if (fixedLayer) {
        /* Presa na viewport, a camada não tem fim de curso: numa página
           de sete telas, andar por altura de tela levaria o campo para
           fora de cena e as seções do fim ficariam vazias. Então a
           rolagem inteira vale um passeio fechado — `scrollStrength` é
           o quanto o campo anda, em uv, do topo ao pé da página. */
        var span = Math.max(
          (document.documentElement.scrollHeight || height) - height,
          1,
        );
        return (scrolled / span) * scrollStrength;
      }

      /* Dentro de uma seção o curso é a passagem dela pela tela, que já
         é limitada: zero com o topo da seção no meio da tela, e o campo
         sobe conforme a página desce. Uma altura de tela vale 2
         unidades de uv, daí o fator 2. */
      return ((scrolled + height / 2 - docTop) / height) * 2 * scrollStrength;
    };

    var draw = function () {
      if (interactive) {
        mouse[0] = lerp(mouse[0], mouseTarget[0], damping);
        mouse[1] = lerp(mouse[1], mouseTarget[1], damping);
        gl.uniform2f(iMouse, mouse[0], mouse[1]);

        influence = lerp(influence, influenceTarget, damping);
        gl.uniform1f(bendInfluence, influence);
      }

      if (anyParallax) {
        offset[0] = lerp(offset[0], offsetTarget[0], damping);
        offset[1] = lerp(offset[1], offsetTarget[1], damping);

        /* O deslocamento do cursor é amortecido; o da rolagem não —
           parallax que chega atrasado no scroll vira borracha. */
        gl.uniform2f(parallaxOffset, offset[0], offset[1] + scrollShift());
      }

      gl.uniform1f(iTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    var tick = function (now) {
      if (!running) return;

      /* O relógio só corre enquanto o laço corre: voltando de uma aba
         em segundo plano a onda continua de onde parou, sem salto. */
      elapsed += Math.min((now - last) / 1000, 0.1);
      last = now;

      setSize();
      draw();
      frame = global.requestAnimationFrame(tick);
    };

    var play = function () {
      if (running || reduceMotion || !onScreen || document.hidden) return;
      running = true;
      last = global.performance ? global.performance.now() : Date.now();
      frame = global.requestAnimationFrame(tick);
    };

    var pause = function () {
      running = false;
      if (frame) global.cancelAnimationFrame(frame);
      frame = 0;
    };

    var onVisibility = function () {
      if (document.hidden) pause();
      else play();
    };

    document.addEventListener('visibilitychange', onVisibility);

    /* Quem decide se vale desenhar. Por padrão é o próprio container;
       a camada do site inteiro passa a lista das seções escuras, e o
       laço dorme enquanto só as seções brancas — que tapam a camada —
       estão na tela. */
    var watched =
      opts.observe && opts.observe.length ? opts.observe : [container];
    var onWatched = watched.map(function () {
      return false;
    });

    var observer = null;
    if (global.IntersectionObserver) {
      observer = new global.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var index = watched.indexOf(entry.target);
          if (index !== -1) onWatched[index] = entry.isIntersecting;
        });

        onScreen = onWatched.some(function (visible) {
          return visible;
        });

        if (onScreen) play();
        else pause();
      });

      watched.forEach(function (element) {
        observer.observe(element);
      });
    }

    var resizeObserver = null;
    if (global.ResizeObserver) {
      resizeObserver = new global.ResizeObserver(function () {
        setSize();
        /* Parado (movimento reduzido, ou fora da tela) ninguém redesenha
           depois do resize: o quadro sai daqui. */
        if (!running) draw();
      });
      resizeObserver.observe(container);
    } else {
      global.addEventListener('resize', setSize);
    }

    setSize();
    draw();
    play();

    return {
      destroy: function () {
        pause();

        document.removeEventListener('visibilitychange', onVisibility);
        if (observer) observer.disconnect();
        if (resizeObserver) resizeObserver.disconnect();
        else global.removeEventListener('resize', setSize);

        if (interactive) {
          pointerTarget.removeEventListener('pointermove', onPointerMove);
          pointerTarget.removeEventListener('pointerleave', onPointerLeave);
        }

        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);

        var lose = gl.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();

        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      },
    };
  };

  global.FloatingLines = { mount: mount };
})(window);
