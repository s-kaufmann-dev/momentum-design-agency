import gsap from 'gsap';
import Lenis from 'lenis';

export interface Viewport {
  width: number;
  height: number;
  pixelRatio: number;
}

export interface Mouse {
  x: number;
  y: number;
  lx: number; // Lerped X
  ly: number; // Lerped Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
}

export interface Scroll {
  current: number;
  target: number;
  velocity: number;
  progress: number;
}

class Engine {
  public viewport: Viewport = { width: 0, height: 0, pixelRatio: 1 };
  public mouse: Mouse = { x: 0, y: 0, lx: 0, ly: 0, vx: 0, vy: 0 };
  public scroll: Scroll = { current: 0, target: 0, velocity: 0, progress: 0 };
  public lenis: Lenis | null = null;
  public isAudioEnabled = false;

  private listeners: Array<(time: number, delta: number) => void> = [];

  constructor() {
    if (typeof window === 'undefined') return;

    this.initViewport();
    this.initMouse();
    this.initLenis();
    this.initTick();

    window.addEventListener('resize', this.onResize.bind(this));
  }

  private initViewport() {
    this.viewport.width = window.innerWidth;
    this.viewport.height = window.innerHeight;
    this.viewport.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  }

  private onResize() {
    this.viewport.width = window.innerWidth;
    this.viewport.height = window.innerHeight;
    this.viewport.pixelRatio = Math.min(window.devicePixelRatio, 1.5);
  }

  private initMouse() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  private initLenis() {
    this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    this.lenis.on('scroll', (e: any) => {
      this.scroll.current = e.scroll;
      this.scroll.velocity = e.velocity;
      this.scroll.progress = e.progress;
    });
  }

  private initTick() {
    gsap.ticker.add((time, delta) => {
      this.update(time, delta);
    });
  }

  private update(time: number, delta: number) {
    // Lerp Mouse
    const lerpAmount = 0.1;
    const prevLx = this.mouse.lx;
    const prevLy = this.mouse.ly;

    this.mouse.lx += (this.mouse.x - this.mouse.lx) * lerpAmount;
    this.mouse.ly += (this.mouse.y - this.mouse.ly) * lerpAmount;

    // Calculate Velocity
    this.mouse.vx = this.mouse.lx - prevLx;
    this.mouse.vy = this.mouse.ly - prevLy;

    // Lenis is now updated by GSAP ticker in index.astro for perfect sync

    // Call subscribers
    for (const listener of this.listeners) {
      listener(time, delta);
    }
  }

  public subscribe(cb: (time: number, delta: number) => void) {
    this.listeners.push(cb);
  }

  public unsubscribe(cb: (time: number, delta: number) => void) {
    this.listeners = this.listeners.filter((l) => l !== cb);
  }

  public enableAudio() {
    this.isAudioEnabled = true;
  }
}

export const engine = new Engine();
