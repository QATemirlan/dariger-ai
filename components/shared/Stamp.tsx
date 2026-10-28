"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "./useReducedMotion";

export default function Stamp({ text = "Черновик · на подпись врачу", small = false }: { text?: string; small?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      initial={reduced ? false : { scale: 1.2, rotate: 0, opacity: 0 }}
      animate={{ scale: 1, rotate: -4, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 16 }}
      className={`inline-block rounded-lg border-2 border-accent text-accent font-semibold tracking-wide ${
        small ? "text-xs px-2.5 py-1" : "text-sm px-3.5 py-1.5"
      } select-none pointer-events-none bg-accent-pale/30`}
      style={{ transformOrigin: "center" }}
    >
      {text}
    </motion.span>
  );
}
