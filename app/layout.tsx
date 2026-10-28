import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dariger AI — ИИ-ассистент врача для Казахстана",
  description:
    "Фоновая запись приёма на казахском и русском. Автоматическое заполнение медкарты по формам РК. Врач проверяет и подписывает.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
