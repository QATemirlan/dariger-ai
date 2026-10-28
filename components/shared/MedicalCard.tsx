export default function MedicalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-2xl border border-border bg-white shadow-md ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(transparent, transparent 27px, rgba(166,124,82,0.06) 27px, rgba(166,124,82,0.06) 28px)",
      }}
    >
      {/* перфорация слева */}
      <div className="absolute left-3 top-0 bottom-0 w-px border-l border-dashed border-accent/20" />
      <div className="pl-7 pr-5 py-5">{children}</div>
    </div>
  );
}
