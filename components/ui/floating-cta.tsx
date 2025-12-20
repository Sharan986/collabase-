"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FloatingCTA() {
  const { scrollYProgress } = useScroll();
  
  // Show button after 30% scroll
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);

  return (
    <motion.div
      style={{ opacity, scale }}
      className="fixed top-8 right-8 z-50"
    >
      <button className={cn(
        "bg-black text-white px-6 py-3 rounded-full",
        "font-display text-sm font-bold",
        "hover:bg-black/80 transition-all hover:scale-105",
        "shadow-lg backdrop-blur-sm"
      )}>
        Get Started →
      </button>
    </motion.div>
  );
}
