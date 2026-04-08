"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float mouse;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    float waveFactor = uEnableWaves;
    vec3 transformed = position;
    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float mouse;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;
    float move = sin(time + mouse) * 0.01;
    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

declare global {
  interface Math {
    map: (n: number, start: number, stop: number, start2: number, stop2: number) => number;
  }
}
Math.map = function (n: number, start: number, stop: number, start2: number, stop2: number) {
  return ((n - start) / (stop - start)) * (stop2 - start2) + start2;
};

const PX_RATIO = typeof window !== "undefined" ? window.devicePixelRatio : 1;

class AsciiFilter {
  domElement: HTMLDivElement;
  pre: HTMLPreElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  renderer: THREE.WebGLRenderer;
  deg: number;
  invert: boolean;
  fontSize: number;
  fontFamily: string;
  charset: string;
  width: number;
  height: number;
  cols: number;
  rows: number;
  center: { x: number; y: number };
  mouse: { x: number; y: number };
  onMouseMove: (e: MouseEvent | TouchEvent) => void;

  constructor(
    renderer: THREE.WebGLRenderer,
    opts: { fontSize?: number; fontFamily?: string; invert?: boolean } = {}
  ) {
    this.renderer = renderer;
    this.domElement = document.createElement("div");
    this.domElement.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%";
    this.pre = document.createElement("pre");
    this.domElement.appendChild(this.pre);
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.domElement.appendChild(this.canvas);
    this.deg = 0;
    this.invert = opts.invert ?? true;
    this.fontSize = opts.fontSize ?? 12;
    this.fontFamily = opts.fontFamily ?? "'Courier New', monospace";
    this.charset =
      " .'`^\",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
    this.width = 0;
    this.height = 0;
    this.cols = 0;
    this.rows = 0;
    this.center = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.context.imageSmoothingEnabled = false;
    this.onMouseMove = (e: MouseEvent | TouchEvent) => {
      const evt = (e as TouchEvent).touches ? (e as TouchEvent).touches[0] : (e as MouseEvent);
      this.mouse = { x: evt.clientX * PX_RATIO, y: evt.clientY * PX_RATIO };
    };
    document.addEventListener("mousemove", this.onMouseMove);
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText("A").width;
    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = "0";
    this.pre.style.padding = "0";
    this.pre.style.lineHeight = "1em";
    this.pre.style.position = "absolute";
    this.pre.style.left = "0";
    this.pre.style.top = "0";
    this.pre.style.zIndex = "9";
    this.pre.style.backgroundAttachment = "fixed";
    this.pre.style.mixBlendMode = "difference";
    this.center = { x: width / 2, y: height / 2 };
    this.mouse = { x: this.center.x, y: this.center.y };
  }

  render(scene: THREE.Scene, camera: THREE.Camera) {
    this.renderer.render(scene, camera);
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (w && h) this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    this.asciify(this.context, w, h);
    this.hue();
  }

  get dx() {
    return this.mouse.x - this.center.x;
  }
  get dy() {
    return this.mouse.y - this.center.y;
  }

  hue() {
    const deg = (Math.atan2(this.dy, this.dx) * 180) / Math.PI;
    this.deg += (deg - this.deg) * 0.075;
    this.domElement.style.filter = `hue-rotate(${this.deg.toFixed(1)}deg)`;
  }

  asciify(ctx: CanvasRenderingContext2D, w: number, h: number) {
    if (!w || !h) return;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = "";
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x * 4 + y * 4 * w;
        const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];
        if (a === 0) {
          str += " ";
          continue;
        }
        const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += "\n";
    }
    this.pre.innerHTML = str;
  }

  dispose() {
    document.removeEventListener("mousemove", this.onMouseMove);
  }
}

class CanvasTxt {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  txt: string;
  lines: string[];
  fontSize: number;
  fontFamily: string;
  color: string;
  font: string;
  lineHeight: number;

  constructor(
    txt: string,
    opts: { fontSize?: number; fontFamily?: string; color?: string } = {}
  ) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d")!;
    this.txt = txt;
    this.lines = txt.split("\n").filter(Boolean);
    if (this.lines.length === 0) this.lines = [""];
    this.fontSize = opts.fontSize ?? 200;
    this.fontFamily = opts.fontFamily ?? "Arial";
    this.color = opts.color ?? "#fdf9f3";
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
    this.lineHeight = this.fontSize * 1.15;
  }

  resize() {
    this.context.font = this.font;
    let maxWidth = 0;
    let totalHeight = 0;
    for (const line of this.lines) {
      const m = this.context.measureText(line);
      maxWidth = Math.max(maxWidth, m.width);
      totalHeight += this.lineHeight;
    }
    this.canvas.width = Math.ceil(maxWidth) + 40;
    this.canvas.height = Math.ceil(totalHeight) + 40;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    const cx = this.canvas.width / 2;
    let y = 20 + this.lineHeight / 2;
    for (const line of this.lines) {
      this.context.fillText(line, cx, y);
      y += this.lineHeight;
    }
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  textString: string;
  asciiFontSize: number;
  textFontSize: number;
  textColor: string;
  planeBaseHeight: number;
  container: HTMLElement;
  width: number;
  height: number;
  enableWaves: boolean;
  camera: THREE.PerspectiveCamera;
  scene: THREE.Scene;
  mouse: { x: number; y: number };
  textCanvas!: CanvasTxt;
  texture!: THREE.CanvasTexture;
  geometry!: THREE.PlaneGeometry;
  material!: THREE.ShaderMaterial;
  mesh!: THREE.Mesh;
  renderer!: THREE.WebGLRenderer;
  filter!: AsciiFilter;
  animationFrameId: number = 0;
  onMouseMove: (evt: MouseEvent | TouchEvent) => void;

  constructor(
    opts: {
      text: string;
      asciiFontSize: number;
      textFontSize: number;
      textColor: string;
      planeBaseHeight: number;
      enableWaves: boolean;
    },
    container: HTMLElement,
    width: number,
    height: number
  ) {
    this.textString = opts.text;
    this.asciiFontSize = opts.asciiFontSize;
    this.textFontSize = opts.textFontSize;
    this.textColor = opts.textColor;
    this.planeBaseHeight = opts.planeBaseHeight;
    this.container = container;
    this.width = width;
    this.height = height;
    this.enableWaves = opts.enableWaves;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();
    this.mouse = { x: width / 2, y: height / 2 };
    this.onMouseMove = (evt: MouseEvent | TouchEvent) => {
      const e = (evt as TouchEvent).touches ? (evt as TouchEvent).touches[0] : (evt as MouseEvent);
      const bounds = this.container.getBoundingClientRect();
      this.mouse = {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      };
    };
  }

  async init() {
    try {
      await document.fonts.load('600 64px "VCR OSD Mono"');
      await document.fonts.load('500 12px "VCR OSD Mono"');
    } catch {
      // fallback
    }
    await document.fonts.ready;
    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: '"VCR OSD Mono", monospace',
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();
    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;

    const textAspect = this.textCanvas.canvas.width / this.textCanvas.canvas.height;
    const baseH = this.planeBaseHeight;
    const planeW = baseH * textAspect;
    const planeH = baseH;

    this.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        mouse: { value: 1.0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: '"VCR OSD Mono", monospace',
      fontSize: this.asciiFontSize,
      invert: true,
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
    this.container.addEventListener("mousemove", this.onMouseMove);
    this.container.addEventListener("touchmove", this.onMouseMove);
  }

  setSize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    this.filter.center = { x: w / 2, y: h / 2 };
  }

  load() {
    this.animate();
  }

  animate() {
    const animateFrame = () => {
      this.animationFrameId = requestAnimationFrame(animateFrame);
      this.render();
    };
    animateFrame();
  }

  render() {
    const time = new Date().getTime() * 0.001;
    this.textCanvas.render();
    this.texture.needsUpdate = true;
    (this.mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = Math.sin(time);
    this.updateRotation();
    this.filter.render(this.scene, this.camera);
  }

  updateRotation() {
    const x = Math.map(this.mouse.y, 0, this.height, 0.5, -0.5);
    const y = Math.map(this.mouse.x, 0, this.width, -0.5, 0.5);
    (this.mesh.rotation as unknown as { x: number }).x += (x - (this.mesh.rotation as unknown as { x: number }).x) * 0.05;
    (this.mesh.rotation as unknown as { y: number }).y += (y - (this.mesh.rotation as unknown as { y: number }).y) * 0.05;
  }

  clear() {
    this.scene.traverse((obj) => {
      if (
        (obj as THREE.Mesh).isMesh &&
        typeof (obj as THREE.Mesh).material === "object" &&
        (obj as THREE.Mesh).material !== null
      ) {
        const mat = (obj as THREE.Mesh).material as THREE.Material;
        if (typeof mat.dispose === "function") mat.dispose();
        (obj as THREE.Mesh).geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    cancelAnimationFrame(this.animationFrameId);
    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode) {
        this.container.removeChild(this.filter.domElement);
      }
    }
    this.container.removeEventListener("mousemove", this.onMouseMove);
    this.container.removeEventListener("touchmove", this.onMouseMove);
    this.clear();
    if (this.renderer) this.renderer.dispose();
  }
}

export default function ASCIIText({
  text = "MICHAEL JO",
  asciiFontSize = 14,
  textFontSize = 200,
  textColor = "#fdf9f3",
  planeBaseHeight = 8,
  enableWaves = true,
}: {
  text?: string;
  asciiFontSize?: number;
  textFontSize?: number;
  textColor?: string;
  planeBaseHeight?: number;
  enableWaves?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const asciiRef = useRef<CanvAscii | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;

    const createAndInit = async (container: HTMLElement, w: number, h: number) => {
      const instance = new CanvAscii(
        {
          text,
          asciiFontSize,
          textFontSize,
          textColor,
          planeBaseHeight,
          enableWaves,
        },
        container,
        w,
        h
      );
      await instance.init();
      return instance;
    };

    const setup = async () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const { width, height } = rect;

      if (width === 0 || height === 0) {
        observer = new IntersectionObserver(
          async ([entry]) => {
            if (cancelled) return;
            if (entry.isIntersecting && entry.boundingClientRect.width > 0 && entry.boundingClientRect.height > 0) {
              const { width: w, height: h } = entry.boundingClientRect;
              observer?.disconnect();
              observer = null;
              const c = containerRef.current;
              if (!cancelled && c) {
                asciiRef.current = await createAndInit(c, w, h);
                if (!cancelled && asciiRef.current) asciiRef.current.load();
              }
            }
          },
          { threshold: 0.1 }
        );
        observer.observe(container);
        return;
      }

      asciiRef.current = await createAndInit(container, width, height);
      if (!cancelled && asciiRef.current) {
        asciiRef.current.load();
        ro = new ResizeObserver((entries) => {
          if (!entries[0] || !asciiRef.current) return;
          const { width: w, height: h } = entries[0].contentRect;
          if (w > 0 && h > 0) asciiRef.current.setSize(w, h);
        });
        ro.observe(container);
      }
    };

    setup();

    return () => {
      cancelled = true;
      observer?.disconnect();
      ro?.disconnect();
      if (asciiRef.current) {
        asciiRef.current.dispose();
        asciiRef.current = null;
      }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div
      ref={containerRef}
      className="ascii-text-container"
      style={{ position: "absolute", width: "100%", height: "100%" }}
    >
      <style>{`
        @import url('https://fonts.cdnfonts.com/css/vcr-osd-mono');
        .ascii-text-container canvas { position: absolute; left: 0; top: 0; width: 100%; height: 100%; image-rendering: pixelated; }
        .ascii-text-container pre {
          margin: 0; user-select: none; padding: 0; line-height: 1em; text-align: left;
          position: absolute; left: 0; top: 0;
          color: #00ff41;
          -webkit-text-fill-color: #00ff41;
          z-index: 9;
        }
      `}</style>
    </div>
  );
}
