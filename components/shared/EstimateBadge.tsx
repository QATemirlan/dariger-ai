export default function EstimateBadge({ label = "оценка" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warn/50 bg-warn/10 text-[11px] font-medium px-2 py-0.5 align-middle ml-1.5">
      {label}
    </span>
  );
}
