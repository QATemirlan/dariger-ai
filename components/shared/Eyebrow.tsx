export default function Eyebrow({
  children,
  light,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-[12px] font-bold uppercase tracking-[0.2em] mb-3 ${
        light ? "text-accent-light" : "text-accent"
      } ${className}`}
    >
      {children}
    </p>
  );
}
