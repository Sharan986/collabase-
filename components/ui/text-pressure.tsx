"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextPressureProps {
  text: string;
  flex?: boolean;
  alpha?: boolean;
  stroke?: boolean;
  width?: boolean;
  weight?: boolean;
  italic?: boolean;
  textColor?: string;
  strokeColor?: string;
  minFontSize?: number;
  className?: string;
}

export default function TextPressure({
  text,
  flex = true,
  alpha = false,
  stroke = false,
  width = true,
  weight = true,
  italic = false,
  textColor = "#000000",
  strokeColor = "#ff0000",
  minFontSize = 36,
  className,
}: TextPressureProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map scroll progress to font variation axes
  const fontWeight = useTransform(scrollYProgress, [0, 0.5, 1], [300, 900, 300]);
  const fontWidth = useTransform(scrollYProgress, [0, 0.5, 1], [75, 125, 75]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  return (
    <div ref={ref} className={cn("relative h-[300px] flex items-center justify-center", className)}>
      <motion.div
        className="text-center font-sans text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold"
        style={{
          fontWeight: weight ? fontWeight : undefined,
          fontStretch: width ? fontWidth : undefined,
          opacity: alpha ? opacity : 1,
          color: textColor,
          fontStyle: italic ? "italic" : "normal",
        }}
      >
        {text}
      </motion.div>
    </div>
  );
}
