"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollFloatProps {
  children: ReactNode;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  className?: string;
  speed?: number;
}

export default function ScrollFloat({
  children,
  animationDuration = 1,
  ease = "easeOut",
  scrollStart = "top bottom",
  scrollEnd = "bottom top",
  stagger = 0.03,
  className,
  speed = 0.5,
}: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
