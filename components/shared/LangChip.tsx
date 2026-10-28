import type { Lang } from "@/lib/demo-data";

const styles: Record<Lang, string> = {
  kk: "bg-accent-pale text-accent border border-accent/20",
  ru: "bg-paper text-ink border border-border",
  mix: "bg-accent text-white",
  lat: "bg-dark text-white",
};

export default function LangChip({ lang }: { lang: Lang }) {
  return (
    <span className={`inline-block rounded-md px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${styles[lang]}`}>
      {lang === "mix" ? "kk+ru" : lang === "lat" ? "lat" : lang}
    </span>
  );
}
