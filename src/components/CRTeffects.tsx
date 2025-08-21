import type { ReactNode } from "react";

interface CRT {
  children: ReactNode;
  className?: string;
}

export default function CRTWrapper({ children, className = "" }: CRT) {
  return (
    <div
      className={`relative min-h-screen overflow-hidden bg-transparent ${className}`}
    >
      {/* Main Content */}
      <div className="relative z-10">{children}</div>

      {/* CRT Effects Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Scan Lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 255, 0, 0.03) 2px,
              rgba(0, 255, 0, 0.03) 4px
            )`,
          }}
        />

        <div
          className="absolute inset-0 bg-base-100/2 mix-blend-screen"
          style={{ transform: "translateX(-0.5px)" }}
        />
        <div
          className="absolute inset-0 bg-base-100/2  mix-blend-screen"
          style={{ transform: "translateX(0.5px)" }}
        />

        {/* Random Static Lines */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
              style={{
                height: "1px",
                top: `${i * 8 + Math.sin(i) * 3}%`,
                opacity: 0.1 + Math.random() * 0.3,
                animation: `flicker-${i % 3} ${
                  3 + Math.random() * 2
                }s infinite`,
              }}
            />
          ))}
        </div>

        {/* Glitch Bars */}
        <div
          className="absolute w-full h-2 bg-gradient-to-r from-magenta-500/15 to-cyan-400/15 mix-blend-screen"
          style={{
            top: "25%",
            animation: "glitch-move 4s infinite",
            animationTimingFunction: "steps(8, end)",
          }}
        />
        <div
          className="absolute w-full h-3 bg-gradient-to-r from-teal-700/20 to-teal-500/20 mix-blend-screen"
          style={{
            top: "70%",
            animation: "glitch-move-alt 6s infinite reverse",
            animationTimingFunction: "steps(12, end)",
          }}
        />

        {/* Screen Curvature Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, 
              transparent 40%, 
              rgba(0, 0, 0, 0.1) 80%,
              rgba(0, 0, 0, 0.4) 100%)`,
          }}
        />

        {/* Phosphor Glow */}
        <div className="absolute inset-0 bg-green-500/3 mix-blend-screen" />

        {/* Subtle Screen Reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-20" />
      </div>

      {/* Custom Keyframes */}
      <style>{`
        @keyframes glitch-move {
          0%,
          100% {
            transform: translateY(0) scaleX(1);
          }
          20% {
            transform: translateY(-10px) scaleX(0.98);
          }
          40% {
            transform: translateY(10px) scaleX(1.02);
          }
          60% {
            transform: translateY(-5px) scaleX(0.99);
          }
          80% {
            transform: translateY(5px) scaleX(1.01);
          }
        }

        @keyframes glitch-move-alt {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(5px) translateX(-2px);
          }
          50% {
            transform: translateY(-8px) translateX(1px);
          }
          75% {
            transform: translateY(3px) translateX(-1px);
          }
        }

        @keyframes flicker-0 {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes flicker-1 {
          0%,
          100% {
            opacity: 0.2;
          }
          30% {
            opacity: 0.6;
          }
          70% {
            opacity: 0.05;
          }
        }

        @keyframes flicker-2 {
          0%,
          100% {
            opacity: 0.15;
          }
          25% {
            opacity: 0.05;
          }
          75% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
