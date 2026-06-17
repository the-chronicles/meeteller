"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function AppLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading Meeteller"
      className="loader-screen"
    >
      <div aria-hidden="true" className="loader-grain" />
      <div aria-hidden="true" className="loader-orbit loader-orbit-outer" />
      <div aria-hidden="true" className="loader-orbit loader-orbit-inner" />
      <div aria-hidden="true" className="loader-aura" />

      <div className="loader-content">
        <div aria-hidden="true" className="logo-stage">
          <div className="logo-glow" />

          <Image
            src="/logo-white.png"
            alt=""
            width={290}
            height={41}
            className="logo-ghost"
            priority
          />

          <div className="logo-reveal">
            <Image
              src="/logo-white.png"
              alt=""
              width={290}
              height={41}
              className="logo-lit"
              priority
            />
          </div>

          <div className="light-trail" />
        </div>

        <p className="loading-text">Loading...</p>
        <span className="sr-only">Preparing your workspace, please wait.</span>
      </div>

      <style jsx>{`
        .loader-screen {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 52%,
              rgba(16, 29, 56, 0.62) 0%,
              rgba(2, 7, 17, 0.5) 29%,
              transparent 58%
            ),
            #020308;
          color: white;
        }

        .loader-grain {
          position: absolute;
          inset: 0;
          opacity: 0.26;
          background-image: radial-gradient(
            rgba(126, 148, 189, 0.26) 0.65px,
            transparent 0.65px
          );
          background-size: 5px 5px;
          mask-image: radial-gradient(
            circle at center,
            black 0%,
            rgba(0, 0, 0, 0.75) 36%,
            transparent 72%
          );
        }

        .loader-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(60, 90, 156, 0.09);
          box-shadow: inset 0 0 46px rgba(30, 55, 120, 0.055);
          animation: breathe 4.4s ease-in-out infinite;
        }

        .loader-orbit-outer {
          width: min(72vw, 570px);
          aspect-ratio: 1;
        }

        .loader-orbit-inner {
          width: min(58vw, 455px);
          aspect-ratio: 1;
          border-color: rgba(47, 90, 150, 0.1);
          animation-delay: -2.2s;
        }

        .loader-aura {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(64vw, 500px);
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(25, 74, 147, 0.15),
            rgba(42, 20, 105, 0.08) 34%,
            transparent 68%
          );
          filter: blur(18px);
          animation: aura 3.4s ease-in-out infinite;
        }

        .loader-content {
          position: relative;
          z-index: 1;
          display: flex;
          transform: translateY(-1rem);
          flex-direction: column;
          align-items: center;
        }

        .logo-stage {
          position: relative;
          display: flex;
          width: clamp(14.5rem, 39vw, 18.125rem);
          height: clamp(2.05rem, 5.5vw, 2.5625rem);
          align-items: center;
          justify-content: center;
        }

        .logo-ghost,
        .logo-lit {
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .logo-ghost {
          opacity: 0.12;
          filter: saturate(0) brightness(0.72);
        }

        .logo-reveal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          overflow: hidden;
          clip-path: inset(0 100% 0 0);
          animation: illuminate 3.2s cubic-bezier(0.45, 0, 0.16, 1) infinite;
        }

        .logo-lit {
          filter: drop-shadow(0 0 5px rgba(231, 247, 255, 0.9))
            drop-shadow(0 0 14px rgba(99, 178, 255, 0.94))
            drop-shadow(0 0 29px rgba(95, 54, 236, 0.82));
        }

        .logo-glow {
          position: absolute;
          inset: -3rem -3.75rem;
          background: radial-gradient(
            ellipse,
            rgba(75, 117, 255, 0.24),
            rgba(83, 40, 201, 0.12) 29%,
            transparent 68%
          );
          filter: blur(14px);
          opacity: 0;
          animation: glow 3.2s ease-in-out infinite;
        }

        .light-trail {
          position: absolute;
          top: 50%;
          left: -1.2rem;
          width: 3rem;
          height: 4.25rem;
          transform: translateY(-50%);
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.96) 0%,
            rgba(98, 191, 255, 0.7) 13%,
            rgba(94, 51, 232, 0.32) 34%,
            transparent 70%
          );
          filter: blur(5px);
          opacity: 0;
          animation: sweep 3.2s cubic-bezier(0.45, 0, 0.16, 1) infinite;
        }

        .loading-text {
          margin-top: 2.8rem;
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: 0.025em;
          color: rgba(185, 204, 236, 0.56);
          text-shadow: 0 0 15px rgba(75, 133, 220, 0.28);
          animation: textPulse 3.2s ease-in-out infinite;
        }

        @keyframes illuminate {
          0% {
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          52%,
          75% {
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
          96%,
          100% {
            clip-path: inset(0 0 0 0);
            opacity: 0;
          }
        }

        @keyframes sweep {
          0% {
            transform: translate(-1rem, -50%) scale(0.8);
            opacity: 0;
          }
          8% {
            opacity: 0.92;
          }
          52% {
            transform: translate(
                calc(clamp(14.5rem, 39vw, 18.125rem) - 1rem),
                -50%
              )
              scale(1);
            opacity: 1;
          }
          58%,
          100% {
            transform: translate(
                calc(clamp(14.5rem, 39vw, 18.125rem) - 1rem),
                -50%
              )
              scale(1);
            opacity: 0;
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.04;
            transform: scale(0.92);
          }
          38%,
          68% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        @keyframes aura {
          0%,
          100% {
            opacity: 0.46;
            transform: translate(-50%, -50%) scale(0.96);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.04);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(0.97);
          }
          50% {
            opacity: 0.72;
            transform: translate(-50%, -50%) scale(1.02);
          }
        }

        @keyframes textPulse {
          0%,
          100% {
            opacity: 0.52;
          }
          46% {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .loader-orbit,
          .loader-aura,
          .logo-reveal,
          .logo-glow,
          .light-trail,
          .loading-text {
            animation: none;
          }

          .logo-reveal {
            clip-path: none;
            opacity: 1;
          }

          .logo-glow {
            opacity: 0.65;
          }

          .light-trail {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
