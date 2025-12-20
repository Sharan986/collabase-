"use client";

import { useScroll, useTransform } from "framer-motion";
import { RefObject } from "react";

export const useScrollProgress = (ref?: RefObject<HTMLElement>) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return scrollYProgress;
};

export const useScrollOpacity = (ref?: RefObject<HTMLElement>) => {
  const scrollProgress = useScrollProgress(ref);
  const opacity = useTransform(scrollProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  return opacity;
};

export const useScrollBlur = (ref?: RefObject<HTMLElement>) => {
  const scrollProgress = useScrollProgress(ref);
  const blur = useTransform(scrollProgress, [0, 0.2, 0.8, 1], [20, 0, 0, 20]);
  return blur;
};

export const useScrollY = (ref?: RefObject<HTMLElement>, distance: number = 100) => {
  const scrollProgress = useScrollProgress(ref);
  const y = useTransform(scrollProgress, [0, 1], [distance, -distance]);
  return y;
};
