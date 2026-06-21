// @ts-nocheck
import { useEffect, useRef } from "react";

/**
 * WebGL flowing-gradient shader that fills its parent container.
 * (Adapted from a full-screen demo: demo chrome removed, sized to the
 * container instead of the window so it can play over the website mockups.)
 */
// Flip to false to "reverse" the texture back to the original plasma look.
const EWEB_TEXTURE = true;

const ShaderAnimation = ({
  className = "",
  timeRef,
}: {
  className?: string;
  timeRef?: { current: number };
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl;
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    } catch {
      return;
    }
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        ${EWEB_TEXTURE ? "fragCoord = floor(fragCoord / 7.0) * 7.0;" : ""}
        vec2 uv = fragCoord / u_resolution.xy;
        vec2 uv0 = uv;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;

        float d = length(uv);
        vec3 col = vec3(0.0);

        for(float i = 0.0; i < 4.0; i++) {
          uv = fract(uv * 1.5) - 0.5;

          d = length(uv) * exp(-length(uv0));
          vec3 color = palette(length(uv0) + i * 0.4 + u_time * 0.01);

          d = sin(d * 4.0 + u_time) / 36.0;
          d = pow(0.005 / d, 1.5);

          vec2 mouseEffect = u_mouse - uv0;
          float mouseDist = length(mouseEffect);
          d *= 1.0 + sin(mouseDist * 10.0 - u_time * 2.0) * 0.1;

          col += color * d;
        }

        float wave = sin(uv0.x * 2.0 + u_time) * 0.01;
        col += vec3(wave);

        vec3 gradient1 = vec3(0.1, 0.2, 0.5);
        vec3 gradient2 = vec3(0.9, 0.1, 0.4);
        vec3 gradientMix = mix(gradient1, gradient2, uv0.y + sin(u_time) * 0.2);
        col = mix(col, gradientMix, 0.3);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, canvas.clientWidth);
      const h = Math.max(1, canvas.clientHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const handleMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - r.left) / r.width;
      mouseRef.current.y = 1.0 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const startTime = Date.now();
    const render = () => {
      const currentTime = timeRef ? timeRef.current : (Date.now() - startTime) * 0.001;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} />;
};

export default ShaderAnimation;
