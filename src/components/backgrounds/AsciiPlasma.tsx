// @ts-nocheck
import { useEffect, useRef } from "react";

/**
 * The plasma "good reveal" rendered as colorful ASCII — entirely on the GPU
 * (font atlas texture, no readPixels) so it stays smooth. Each cell samples the
 * plasma for brightness+color and stamps a glyph (denser = brighter), echoing
 * the "Eweb" wordmark. Scroll-scrubbed via `timeRef`.
 */
// A brightness ramp that mixes symbols, numbers and letters (sparse → dense).
const GLYPHS = " .:-=+*ic1573sznxECSUZ0OQ8B#%@$&WM";

const vertexSrc = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSrc = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_cells;       // columns, rows
uniform sampler2D u_atlas;  // glyph ramp, laid out horizontally
uniform float u_glyphs;     // glyph count

vec3 palette(float t) {
  vec3 a = vec3(0.5);
  vec3 b = vec3(0.5);
  vec3 c = vec3(1.0);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return a + b * cos(6.28318 * (c * t + d));
}

vec3 plasma(vec2 uv0, float time) {
  vec2 uv = uv0 * 2.0 - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;
  float d = length(uv);
  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;
    d = length(uv) * exp(-length(uv0));
    vec3 color = palette(length(uv0) + i * 0.4 + time * 0.01);
    d = sin(d * 4.0 + time) / 36.0;
    d = pow(0.005 / d, 1.5);
    col += color * d;
  }
  vec3 g1 = vec3(0.1, 0.2, 0.5);
  vec3 g2 = vec3(0.9, 0.1, 0.4);
  col = mix(col, mix(g1, g2, uv0.y + sin(time) * 0.2), 0.3);
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 cell = floor(uv * u_cells);
  vec2 cellCenter = (cell + 0.5) / u_cells;

  vec3 col = plasma(cellCenter, u_time);
  float lum = clamp(dot(col, vec3(0.3, 0.59, 0.11)) * 1.7, 0.0, 1.0);

  float gi = floor(lum * (u_glyphs - 0.5));
  vec2 local = fract(uv * u_cells);
  vec2 atlasUV = vec2((gi + local.x) / u_glyphs, local.y);
  float mask = texture2D(u_atlas, atlasUV).a;

  gl_FragColor = vec4(col * 1.7 * mask, 1.0);
}
`;

export default function AsciiPlasma({
  className = "",
  timeRef,
}: {
  className?: string;
  timeRef?: { current: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("AsciiPlasma shader:", gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, vertexSrc));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, fragmentSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(prog, "u_resolution");
    const timeLoc = gl.getUniformLocation(prog, "u_time");
    const cellsLoc = gl.getUniformLocation(prog, "u_cells");
    const glyphsLoc = gl.getUniformLocation(prog, "u_glyphs");
    const atlasLoc = gl.getUniformLocation(prog, "u_atlas");

    // Build the glyph atlas (one row of cells, white glyphs on transparent).
    const CW = 12;
    const CH = 18;
    const atlas = document.createElement("canvas");
    atlas.width = CW * GLYPHS.length;
    atlas.height = CH;
    const a = atlas.getContext("2d");
    a.clearRect(0, 0, atlas.width, atlas.height);
    a.fillStyle = "#fff";
    a.font = `bold ${CH - 4}px "Courier New", monospace`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    for (let i = 0; i < GLYPHS.length; i++) {
      a.fillText(GLYPHS[i], i * CW + CW / 2, CH / 2 + 1);
    }
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform1i(atlasLoc, 0);
    gl.uniform1f(glyphsLoc, GLYPHS.length);

    let cols = 1;
    let rows = 1;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      cols = Math.max(1, Math.round(w / 9));
      rows = Math.max(1, Math.round(h / 14));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const startTime = Date.now();
    const render = () => {
      const t = timeRef ? timeRef.current : (Date.now() - startTime) * 0.001;
      gl.useProgram(prog);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform2f(cellsLoc, cols, rows);
      gl.uniform1f(timeLoc, t);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
}
