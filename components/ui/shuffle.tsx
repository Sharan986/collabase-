"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface ShuffleProps {
  text: string;
  shuffleDirection?: "left" | "right";
  duration?: number;
  animationMode?: "all" | "evenodd";
  shuffleTimes?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
  triggerOnce?: boolean;
  triggerOnHover?: boolean;
  respectReducedMotion?: boolean;
  className?: string;
}

export default function Shuffle({
  text,
  shuffleDirection = "right",
  duration = 0.35,
  animationMode = "evenodd",
  shuffleTimes = 1,
  ease = "power3.out",
  stagger = 0.03,
  threshold = 0.1,
  triggerOnce = true,
  triggerOnHover = false,
  respectReducedMotion = true,
  className,
}: ShuffleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const shuffleText = () => {
    if (!containerRef.current) return;
    if (triggerOnce && hasAnimated) return;

    const elements = containerRef.current.querySelectorAll(".char");
    const finalText = text.split("");

    elements.forEach((el, i) => {
      let shuffleCount = 0;
      const maxShuffles = Math.floor(Math.random() * 10) + 5;

      const interval = setInterval(() => {
        if (shuffleCount < maxShuffles) {
          el.textContent = chars[Math.floor(Math.random() * chars.length)];
          shuffleCount++;
        } else {
          el.textContent = finalText[i];
          clearInterval(interval);
        }
      }, 50);
    });

    setHasAnimated(true);
  };

  useEffect(() => {
    if (!containerRef.current || triggerOnHover) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            shuffleText();
          }
        });
      },
      { threshold }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("inline-block", className)}
      onMouseEnter={triggerOnHover ? shuffleText : undefined}
    >
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={cn(
            "char inline-block",
            char === " " ? "whitespace-pre" : ""
          )}
        >
          {char}
        </span>
      ))}
    </div>
  );
}
