"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const nav = [
  { label: "Как работает", href: "#how" },
  { label: "Продукты", href: "#products" },
  { label: "Безопасность", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-paper/80 backdrop-blur-lg border-b border-border"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Dariger<span className="text-accent"> AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className="text-sm text-muted hover:text-ink transition-colors font-medium"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <Link
          href="/demo"
          className="rounded-full bg-accent text-white px-5 py-2 text-sm font-semibold hover:bg-accent-deep transition-colors shadow-sm"
        >
          Демо
        </Link>
      </div>
    </motion.header>
  );
}
