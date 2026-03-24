import { cn } from './utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 80,
  md: 120,
  lg: 160,
};

export function Loading({ className, size = 'lg' }: LoadingProps) {
  const dimension = sizes[size];

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className={cn('relative', className)}
        style={{ width: dimension, height: dimension }}
      >
        <svg
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="animate-spin-slow"
          style={{ animationDuration: '3s' }}
        >
          <defs>
            <linearGradient
              id="earthGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
            <linearGradient
              id="atmosphereGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
            </linearGradient>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={dimension * 0.25}
            fill="url(#glowGradient)"
          />

          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={dimension * 0.2}
            fill="url(#earthGradient)"
            className="animate-pulse"
          />

          <ellipse
            cx={dimension / 2}
            cy={dimension / 2}
            rx={dimension * 0.32}
            ry={dimension * 0.1}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1"
            strokeOpacity="0.3"
            className="opacity-50"
          />

          <g
            style={{
              transformOrigin: `${dimension / 2}px ${dimension / 2}px`,
              animation: 'orbit 2s linear infinite',
            }}
          >
            <g transform={`translate(${dimension * 0.32}, ${dimension / 2})`}>
              <rect
                x={-dimension * 0.04}
                y={-dimension * 0.025}
                width={dimension * 0.08}
                height={dimension * 0.05}
                rx="2"
                fill="#e2e8f0"
              />
              <rect
                x={-dimension * 0.08}
                y={-dimension * 0.02}
                width={dimension * 0.04}
                height={dimension * 0.04}
                fill="#3b82f6"
                opacity="0.8"
              />
              <rect
                x={dimension * 0.04}
                y={-dimension * 0.02}
                width={dimension * 0.04}
                height={dimension * 0.04}
                fill="#3b82f6"
                opacity="0.8"
              />
              <line
                x1={-dimension * 0.04}
                y1="0"
                x2={-dimension * 0.08}
                y2="0"
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <line
                x1={dimension * 0.04}
                y1="0"
                x2={dimension * 0.08}
                y2="0"
                stroke="#94a3b8"
                strokeWidth="1"
              />
            </g>
          </g>

          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const radius = dimension * 0.35;
            const x = dimension / 2 + radius * Math.cos(angle);
            const y = dimension / 2 + radius * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1"
                fill="#fff"
                opacity="0.6"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            );
          })}
        </svg>

        <style>{`
          @keyframes orbit {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
