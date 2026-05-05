import { useEffect, useRef } from 'react';

type RockType = 'solid' | 'isolated' | 'permeable';

interface SimulatorProps {
  rockType: RockType;
}

export default function Simulator({ rockType }: SimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const width = 400;
    const height = 400;
    
    // Physical objects
    let particles: {x: number, y: number, vx: number, vy: number, life: number}[] = [];
    const gravity = 0.15;
    const friction = 0.98;

    // Fixed Rocks for Permeable mode
    const permeableRocks: {x: number, y: number, r: number}[] = [];
    // Generate staggered grid
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 6; col++) {
        const offset = row % 2 === 0 ? 0 : 35;
        const x = col * 75 + offset;
        const y = 100 + row * 45;
        // Vary the radius slightly for natural look, but keep gaps open
        const r = 20 + Math.random() * 6;
        permeableRocks.push({ x, y, r });
      }
    }

    // Fixed Pores for Isolated mode
    const isolatedPores: {x: number, y: number, r: number, particles: any[]}[] = [];
    for (let i = 0; i < 8; i++) {
        const x = 50 + Math.random() * 300;
        const y = 150 + Math.random() * 200;
        const r = 15 + Math.random() * 10;
        
        const internalParticles = [];
        for(let j=0; j<15; j++) {
            internalParticles.push({
                x: x + (Math.random() - 0.5) * r * 1.5,
                y: y + (Math.random() - 0.5) * r * 1.5,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1
            });
        }
        isolatedPores.push({ x, y, r, particles: internalParticles });
    }

    const drawRockPattern = (ctx: CanvasRenderingContext2D, yStart: number) => {
        ctx.fillStyle = '#8B5A2B'; // Dirt brown
        ctx.fillRect(0, yStart, width, height - yStart);
        
        // Draw vague puzzle lines
        ctx.strokeStyle = '#5c3917';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for(let y_l = yStart; y_l < height; y_l += 40) {
            ctx.moveTo(0, y_l);
            for(let x_l = 0; x_l < width; x_l += 40) {
                ctx.lineTo(x_l + (Math.random()*10 - 5), y_l + (Math.random()*10 - 5));
            }
            ctx.stroke();
        }
        for(let x_l = 0; x_l < width; x_l += 40) {
            ctx.moveTo(x_l, yStart);
            for(let y_l = yStart; y_l < height; y_l += 40) {
                if (Math.random() > 0.3) {
                   ctx.lineTo(x_l + (Math.random()*10 - 5), y_l + (Math.random()*10 - 5));
                } else {
                   ctx.moveTo(x_l + (Math.random()*10 - 5), y_l + (Math.random()*10 - 5));
                }
            }
            ctx.stroke();
        }
    };

    const loop = () => {
      // Clear
      ctx.clearRect(0, 0, width, height);

      // Emitter
      if (Math.random() < 0.6) { // Spawn rate
        particles.push({
          x: width / 2 + (Math.random() * 300 - 150),
          y: -10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random(),
          life: 0
        });
      }

      // Draw environment based on mode
      if (rockType === 'solid') {
          drawRockPattern(ctx, 120);
      } else if (rockType === 'isolated') {
          drawRockPattern(ctx, 120);
          
          // Draw and update isolated pores
          isolatedPores.forEach(pore => {
             ctx.fillStyle = '#1e3a8a'; // dark blue pool
             ctx.beginPath();
             ctx.arc(pore.x, pore.y, pore.r, 0, Math.PI * 2);
             ctx.fill();

             // Update inner particles
             ctx.fillStyle = '#60a5fa'; // bright blue
             pore.particles.forEach(p => {
                 p.x += p.vx;
                 p.y += p.vy;
                 
                 // Contain in circle
                 const dx = p.x - pore.x;
                 const dy = p.y - pore.y;
                 const dist = Math.sqrt(dx*dx + dy*dy);
                 if (dist > pore.r - 2) {
                     const nx = dx / dist;
                     const ny = dy / dist;
                     p.vx = -p.vx + (Math.random() - 0.5) * 0.5;
                     p.vy = -p.vy + (Math.random() - 0.5) * 0.5;
                     p.x = pore.x + nx * (pore.r - 2);
                     p.y = pore.y + ny * (pore.r - 2);
                 }

                 ctx.beginPath();
                 ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
                 ctx.fill();
             });
          });
      } else if (rockType === 'permeable') {
          // Draw individual rocks
          permeableRocks.forEach(rock => {
              ctx.fillStyle = '#8B5A2B';
              ctx.strokeStyle = '#5c3917';
              ctx.lineWidth = 2;
              ctx.beginPath();
              // Make them look slightly irregular by drawing polygon
              ctx.arc(rock.x, rock.y, rock.r, 0, Math.PI*2);
              ctx.fill();
              ctx.stroke();
          });
      }

      // Update external particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += gravity;
        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;

        // Collision logic
        const pR = 2.5;

        if (rockType === 'solid' || rockType === 'isolated') {
            const surfaceY = 120;
            if (p.y > surfaceY - pR) {
                p.y = surfaceY - pR;
                p.vy *= -0.3; // bounce
                // Force simulation to slide left/right
                if (p.vx < 0.5 && p.vx > -0.5) {
                    p.vx += (p.x > width / 2 ? 0.3 : -0.3); 
                }
            }
        } else if (rockType === 'permeable') {
            for (let j = 0; j < permeableRocks.length; j++) {
                const rock = permeableRocks[j];
                const dx = p.x - rock.x;
                const dy = p.y - rock.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < rock.r + pR) {
                    // Collision
                    const nx = dx / dist;
                    const ny = dy / dist;
                    
                    p.x = rock.x + nx * (rock.r + pR);
                    p.y = rock.y + ny * (rock.r + pR);
                    
                    // Sliding bounce
                    const dot = p.vx * nx + p.vy * ny;
                    p.vx -= dot * nx * 1.5;
                    p.vy -= dot * ny * 1.5;

                    // Little random pertubation to avoid getting stuck
                    p.vx += (Math.random() - 0.5) * 0.2;
                }
            }
        }

        // Remove if off screen or too old
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20 || p.life > 600) {
            particles.splice(i, 1);
            continue;
        }

        // Draw Particle
        ctx.fillStyle = '#3b82f6'; // Bright blue
        ctx.beginPath();
        ctx.arc(p.x, p.y, pR, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a slight trail glow
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pR * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rockType]);

  return (
    <div className="relative rounded-2xl overflow-hidden bg-sky-50 shadow-inner">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="block"
        style={{ width: 400, height: 400 }}
      />
      
      {/* Decorative details over the canvas like rain cloud origin */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-blue-200/80 to-transparent flex items-center justify-center pointer-events-none">
          <span className="text-white font-bold text-xs uppercase tracking-[0.2em] opacity-80 shadow-sm mt-2">Chuva / Fonte de Água</span>
      </div>
    </div>
  );
}
