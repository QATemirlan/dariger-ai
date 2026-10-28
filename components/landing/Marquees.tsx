"use client";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/shared/useReducedMotion";

const chips = [
  ["басым ауырады", "kk"], ["давление 140/90", "ru"], ["Hypertensio arterialis", "lat"], ["I10", "icd"], ["жөтел 3 күн", "kk"], ["аллергии нет", "ru"], ["анамнез", "kk"], ["Status praesens", "lat"], ["МКБ-10", "icd"], ["қысым жоғары", "kk"], ["пульс 78", "ru"],
];
const chipStyle: Record<string, string> = { kk: "bg-accent-light text-accent", ru: "bg-marker/60 text-ink", lat: "bg-ink text-paper", icd: "bg-success/15 text-success" };

export default function Marquees() {
  const reduced = useReducedMotion();
  return (
    <section className="py-16 overflow-hidden border-y border-border space-y-4" aria-label="Примеры распознаваемых фраз">
      {[1, -1].map((dir, row) => (
        <div key={row} className="overflow-hidden" aria-hidden="true">
          <motion.div
            className="flex gap-3 w-max"
            animate={reduced ? undefined : { x: dir === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={reduced ? undefined : { duration: 48, repeat: Infinity, ease: "linear" }}
            whileHover={{ animationPlayState: "paused" }}
          >
            {[...chips, ...chips].map(([text, type], i) => (
              <span key={`${row}-${i}`} className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${chipStyle[type]}`}>{text}</span>
            ))}
          </motion.div>
        </div>
      ))}
    </section>
  );
}
