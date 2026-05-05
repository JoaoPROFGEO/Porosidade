import { useEffect, useRef } from 'react';

type AquiferType = 'porosos' | 'fraturados' | 'carsicos';

interface AquiferSimulatorProps {
  aquiferType: AquiferType;
}

type Shape = 
  | { type: 'circle', x: number, y: number, r: number, color?: string }
  | { type: 'rect', x: number, y: number, w: number, h: number, color?: string };

export default function AquiferSimulator({ aquiferType }: AquiferSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = 400;
    const height = 400;
    
    // Physics
    let particles: {x: number, y: number, vx: number, vy: number, life: number}[] = [];
    const pR = 2.5; // particle radius

    let shapes: Shape[] = [];
    
    let spawnRate = 0.5;
    let spawnXRange = { min: 40, max: 360 };
    let gravity = 0.15;
    let friction = 0.98;
    let bounceDampening = 1.2;
    let perturb = 0.1;

    const sandColors = ['#fcd34d', '#f59e0b', '#d97706', '#b45309', '#eab308'];

    if (aquiferType === 'porosos') {
        spawnRate = 2.0;
        gravity = 0.8; 
        friction = 0.99; // decreased friction completely so it slips
        bounceDampening = 1.1; // lower bounce so it doesn't repel upwards
        perturb = 0.6; // much more horizontal jitter to slide off grains instantly
        
        // Generate packed circles for sediment (sand/gravel)
        for (let y = 60; y < height + 20; y += 18) {
            for (let x = -10; x < width + 20; x += 18) {
                const offsetX = (Math.random() - 0.5) * 12;
                const offsetY = (Math.random() - 0.5) * 12;
                const r = 6 + Math.random() * 8; // varying sizes of gravel/sand
                const color = sandColors[Math.floor(Math.random() * sandColors.length)];
                shapes.push({ type: 'circle', x: x + offsetX, y: y + offsetY, r, color });
            }
        }
    } else if (aquiferType === 'fraturados') {
        spawnRate = 0.15; // Less water enters granite overall
        spawnXRange = { min: 20, max: 380 };
        gravity = 0.2;
        friction = 0.88; 
        bounceDampening = 1.3;
        perturb = 0.6;
        
        const graniteColor = '#64748b'; // Slate/Grey
        
        const brickW = 90;
        const brickH = 55;
        const gap = 8;
        for (let r = 0; r < 8; r++) {
            let offset = (r % 2) * (brickW * 0.4); 
            for (let c = -1; c < 6; c++) {
                let x = c * (brickW + gap) + offset - 20;
                let y = 60 + r * (brickH + gap);
                shapes.push({ type: 'rect', x, y, w: brickW, h: brickH, color: graniteColor });
            }
        }
    } else if (aquiferType === 'carsicos') {
        spawnRate = 2.5; 
        spawnXRange = { min: 40, max: 360 };
        gravity = 0.3;
        friction = 0.99; // Flows very easily and quickly in open caves
        bounceDampening = 1.1; // Bouncy on hard rock
        perturb = 0.05;

        const limestoneColor = '#94a3b8'; // Light/mid grey
        
        const blockW = 80;
        const blockH = 55;
        const gap = 28; // Wider gaps (conduits) than fractured
        
        for (let r = 0; r < 8; r++) {
            let offset = (r % 2) * (blockW * 0.4); 
            for (let c = -1; c < 6; c++) {
                let x = c * (blockW + gap) + offset - 20;
                let y = 60 + r * (blockH + gap);
                
                // Add slight randomness to make it look disorganized but still open
                let dw = (Math.random() - 0.5) * 15;
                let dh = (Math.random() - 0.5) * 15;
                let dx = (Math.random() - 0.5) * 10;
                let dy = (Math.random() - 0.5) * 10;

                shapes.push({ type: 'rect', x: x + dx, y: y + dy, w: blockW + dw, h: blockH + dh, color: limestoneColor });
            }
        }
    }

    const drawRectSlightlyJagged = (ctx: CanvasRenderingContext2D, rect: any) => {
        ctx.fillStyle = rect.color || '#888';
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.lineWidth = 1;
        
        // Draw the solid block
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        
        // Draw faint internal lines to make it look like solid rock (texture)
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        for(let i = 0; i < (rect.w * rect.h) / 2000; i++) {
            const lx = rect.x + Math.random() * rect.w;
            const ly = rect.y + Math.random() * rect.h;
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + (Math.random() - 0.5) * 40, ly + (Math.random() - 0.5) * 40);
        }
        ctx.stroke();
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Environment Background fills (void/space between rocks)
      if (aquiferType === 'porosos') {
          ctx.fillStyle = '#fef3c7'; // very light amber highlighting the voids
          ctx.fillRect(0, 50, width, height - 50);
      } else if (aquiferType === 'fraturados') {
          ctx.fillStyle = '#0f172a'; // dark void in fractures
          ctx.fillRect(0, 50, width, height - 50);
      } else if (aquiferType === 'carsicos') {
          ctx.fillStyle = '#1e293b'; // very dark cave interior
          ctx.fillRect(0, 50, width, height - 50);
      }

      // Draw ground line
      ctx.fillStyle = '#4ade80'; // grass
      ctx.fillRect(0, 48, width, 4);

      // Emitter
      let spawnsThisFrame = Math.floor(spawnRate);
      if (Math.random() < (spawnRate - spawnsThisFrame)) spawnsThisFrame++;
      for(let s = 0; s < spawnsThisFrame; s++) {
        particles.push({
          x: spawnXRange.min + Math.random() * (spawnXRange.max - spawnXRange.min),
          y: -10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random(),
          life: 0
        });
      }

      // Draw Shapes
      shapes.forEach(shape => {
          if (shape.type === 'circle') {
              ctx.fillStyle = shape.color || '#888';
              ctx.strokeStyle = 'rgba(0,0,0,0.2)';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
          } else if (shape.type === 'rect') {
              drawRectSlightlyJagged(ctx, shape);
          }
      });

      // Physics update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += gravity;
        p.vx *= friction;
        p.vy *= friction;

        // Terminal velocity to prevent tunneling through rocks
        const maxV = 10;
        if (p.vx > maxV) p.vx = maxV;
        if (p.vx < -maxV) p.vx = -maxV;
        if (p.vy > maxV) p.vy = maxV;
        if (p.vy < -maxV) p.vy = -maxV;

        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        // Collision logic
        for (let j = 0; j < shapes.length; j++) {
            const shape = shapes[j];
            if (shape.type === 'circle') {
                const dx = p.x - shape.x;
                const dy = p.y - shape.y;
                const distSq = dx*dx + dy*dy;
                const minDist = shape.r + pR;
                if (distSq < minDist*minDist && distSq > 0) {
                    const dist = Math.sqrt(distSq);
                    const nx = dx / dist;
                    const ny = dy / dist;
                    
                    p.x = shape.x + nx * minDist;
                    p.y = shape.y + ny * minDist;
                    
                    const dot = p.vx * nx + p.vy * ny;
                    p.vx -= dot * nx * bounceDampening;
                    p.vy -= dot * ny * bounceDampening;

                    // Add lateral noise so water finds path down
                    p.vx += (Math.random() - 0.5) * perturb;
                }
            } else if (shape.type === 'rect') {
                const cx = Math.max(shape.x, Math.min(p.x, shape.x + shape.w));
                const cy = Math.max(shape.y, Math.min(p.y, shape.y + shape.h));
                const dx = p.x - cx;
                const dy = p.y - cy;
                const distSq = dx*dx + dy*dy;
                
                if (distSq < pR*pR) {
                    const dist = Math.sqrt(distSq);
                    if (dist === 0) {
                        p.y = shape.y - pR;
                        p.vy *= -0.5;
                        p.vx += (Math.random() - 0.5) * perturb * 2;
                    } else {
                        const nx = dx / dist;
                        const ny = dy / dist;
                        p.x = cx + nx * pR;
                        p.y = cy + ny * pR;
                        
                        const dot = p.vx * nx + p.vy * ny;
                        p.vx -= dot * nx * bounceDampening;
                        p.vy -= dot * ny * bounceDampening;
                        
                        p.vx += (Math.random() - 0.5) * perturb;
                    }
                }
            }
        }

        // Keep inside bounds horizontally to avoid them flowing off screen
        if (p.x < pR) { p.x = pR; p.vx *= -0.5; }
        if (p.x > width - pR) { p.x = width - pR; p.vx *= -0.5; }

        // Remove if too old or falls off bottom
        if (p.y > height + 20 || p.life > 1500) {
            particles.splice(i, 1);
            continue;
        }

        // Draw Particle
        ctx.fillStyle = aquiferType === 'carsicos' ? '#38bdf8' : '#3b82f6';
        ctx.globalAlpha = Math.max(0, 1 - (p.life / 1500));
        ctx.beginPath();
        ctx.arc(p.x, p.y, pR, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [aquiferType]);

  return (
    <div className="relative rounded-2xl bg-sky-50 shadow-inner border border-slate-200 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="block"
        style={{ width: 400, height: 400 }}
      />
      
      {/* Top Banner */}
      <div className="absolute top-0 left-0 w-full h-12 flex items-start justify-center pointer-events-none p-3 bg-gradient-to-b from-sky-100/80 to-transparent">
          <span className="text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] bg-white/90 px-3 py-1 rounded-full shadow-sm">
             Chuva / Superfície terrestre
          </span>
      </div>
    </div>
  );
}
