"use client";

import { useInView as useFramerInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";
import { RefObject } from "react";

export const useInView = (
  ref: RefObject<Element>,
  options?: {
    once?: boolean;
    margin?: UseInViewOptions["margin"];
    amount?: "some" | "all" | number;
  }
) => {
  return useFramerInView(ref, {
    once: options?.once ?? true,
    margin: options?.margin ?? "0px 0px -200px 0px",
    amount: options?.amount ?? 0.3,
  });
};
