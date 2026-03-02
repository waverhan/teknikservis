import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ServiceFlow | Teknik Servis Yönetimi",
  description: "Küçük teknik servis işletmeleri için profesyonel takip ve makbuz sistemi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.className} antialiased selection:bg-blue-100`}>
        {children}
      </body>
    </html>
  );
}
