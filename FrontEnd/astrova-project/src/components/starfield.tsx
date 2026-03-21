import { useEffect, useRef } from 'react';

export function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Create stars
        const stars: Array<{
            x: number;
            y: number;
            radius: number;
            opacity: number;
            speed: number;
        }> = [];

        const createStars = () => {
            const starCount = Math.floor((canvas.width * canvas.height) / 8000);
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    opacity: Math.random() * 0.5 + 0.3,
                    speed: Math.random() * 0.05,
                });
            }
        };
        createStars();

        // Animation
        let animationId: number;
        const animate = () => {
            ctx.fillStyle = '#04050f';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${star.opacity})`;
                ctx.fill();

                // Twinkle effect
                star.opacity += star.speed;
                if (star.opacity > 0.8 || star.opacity < 0.2) {
                    star.speed = -star.speed;
                }
            });

            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.6 }}
        />
    );
}
