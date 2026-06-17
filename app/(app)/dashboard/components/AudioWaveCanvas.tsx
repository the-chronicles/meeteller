import { useDayMood } from "@/hooks/useDayMood";
import { useEffect, useRef } from "react";

export function AudioWaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mood = useDayMood();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(120,120,120,0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      for (let x = 0; x < canvas.width; x += 5) {
        const y =
          canvas.height / 2 +
          Math.sin(x * 0.02 + t) *
            12 *
            mood.energy;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
      t += 0.04 * mood.speed;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mood]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 text-[#5b09c4]"
    />
  );
}
