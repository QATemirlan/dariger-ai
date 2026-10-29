import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70 px-6 py-12 border-t border-white/10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white">
              <span className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-display font-bold">
                Д
              </span>
              <span className="font-semibold text-lg">Dariger AI</span>
            </Link>
            <p className="text-xs mt-3 max-w-sm leading-relaxed text-white/50">
              ИИ-ассистент врача для Республики Казахстан. Автоматизация медицинской документации на казахском и русском языках.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#products" className="hover:text-white transition-colors">Продукты</a>
            <a href="#security" className="hover:text-white transition-colors">Безопасность</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/demo" className="text-accent hover:text-accent-light font-semibold transition-colors">Демо</Link>
          </div>
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between gap-4 text-[11px] text-white/40">
          <p>© 2026 Dariger AI · Республика Казахстан</p>
          <p>Разработано с учётом приказа МЗ РК №79 и стандартов формы №052/у.</p>
        </div>
      </div>
    </footer>
  );
}
